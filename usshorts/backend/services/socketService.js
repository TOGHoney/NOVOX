const jwt = require('jsonwebtoken');
const DebateRoom = require('../models/DebateRoom');

const SPEAKING_LIMIT_MS = 3 * 60 * 1000;
const TICK_MS = 5000;

const rooms = new Map(); // roomId -> { speakerUserId, grantStart, tick, queue: [] }
const roomMembers = new Map(); // roomId -> Map(userId -> socket.id)

function ensureRoomState(roomId) {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, { speakerUserId: null, grantStart: null, tick: null, queue: [] });
    }
    return rooms.get(roomId);
}

function removeFromQueue(roomId, userId) {
    const state = rooms.get(roomId);
    if (state) state.queue = state.queue.filter((id) => id !== userId);
}

function broadcastToRoom(io, roomId, event, payload) {
    io.to(roomId).emit(event, payload);
}

async function broadcastParticipants(io, roomId) {
    try {
        const room = await DebateRoom.findById(roomId)
            .populate('participants.user', 'username');
        if (!room) return;
        const participants = room.participants.map((p) => ({
            userId: p.user?._id?.toString() || p.user.toString(),
            username: p.user?.username || 'Unknown',
            speakingMs: p.speakingMs,
            isHost: room.host?.toString() === (p.user?._id?.toString() || p.user.toString())
        }));
        broadcastToRoom(io, roomId, 'participants', { roomId, participants });
    } catch (err) {
        console.error('broadcastParticipants error:', err.message);
    }
}

async function grantFloor(io, roomId, userId) {
    const state = ensureRoomState(roomId);
    const room = await DebateRoom.findById(roomId);
    if (!room || room.status === 'closed') return;

    const participant = room.participants.find((p) => p.user.toString() === userId);
    if (!participant) return;
    if (participant.speakingMs >= SPEAKING_LIMIT_MS) {
        broadcastToRoom(io, roomId, 'floor-denied', { userId, reason: 'budget-exhausted' });
        return;
    }

    state.speakerUserId = userId;
    state.grantStart = Date.now();
    room.floor = { userId, grantedAt: new Date() };
    await room.save();

    broadcastToRoom(io, roomId, 'floor-granted', { userId, grantedAt: Date.now(), limitMs: SPEAKING_LIMIT_MS });

    clearInterval(state.tick);
    state.tick = setInterval(() => {
        tickSpeakingTime(io, roomId, state);
    }, TICK_MS);
}

async function revokeFloor(io, roomId, userId, reason) {
    const state = rooms.get(roomId);
    if (!state) return;
    if (state.speakerUserId && state.speakerUserId !== userId) return;

    clearInterval(state.tick);
    state.tick = null;
    state.speakerUserId = null;
    state.grantStart = null;

    const room = await DebateRoom.findById(roomId);
    if (room) {
        room.floor = { userId: null, grantedAt: null };
        await room.save();
    }

    broadcastToRoom(io, roomId, 'floor-revoked', { userId, reason });

    if (state.queue.length > 0) {
        const next = state.queue.shift();
        grantFloor(io, roomId, next);
    }
}

async function tickSpeakingTime(io, roomId, state) {
    try {
        const room = await DebateRoom.findById(roomId);
        if (!room || room.status === 'closed') {
            clearInterval(state.tick);
            state.tick = null;
            return;
        }
        if (!state.speakerUserId) return;

        const participant = room.participants.find((p) => p.user.toString() === state.speakerUserId);
        if (!participant) {
            revokeFloor(io, roomId, state.speakerUserId, 'left-room');
            return;
        }

        participant.speakingMs += TICK_MS;
        if (participant.speakingMs >= SPEAKING_LIMIT_MS) {
            participant.speakingMs = SPEAKING_LIMIT_MS;
        }
        await room.save();

        broadcastToRoom(io, roomId, 'budget-update', {
            userId: state.speakerUserId,
            speakingMs: participant.speakingMs,
            limitMs: SPEAKING_LIMIT_MS
        });

        if (participant.speakingMs >= SPEAKING_LIMIT_MS) {
            revokeFloor(io, roomId, state.speakerUserId, 'budget-exhausted');
        }
    } catch (err) {
        console.error('tickSpeakingTime error:', err.message);
    }
}

function verifyToken(token) {
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    } catch {
        return null;
    }
}

function initSocket(io) {
    io.use((socket, next) => {
        const userId = verifyToken(socket.handshake.auth?.token);
        if (!userId) return next(new Error('Unauthorized'));
        socket.userId = userId;
        next();
    });

    io.on('connection', (socket) => {
        socket.roomId = null;

        socket.on('room:join', async ({ roomId }) => {
            if (socket.roomId) {
                socket.leave(socket.roomId);
                roomMembers.get(socket.roomId)?.delete(socket.userId);
            }

            try {
                const room = await DebateRoom.findById(roomId).populate('participants.user', 'username');
                if (!room || room.status === 'closed') {
                    socket.emit('error', { message: 'Room not found or closed' });
                    return;
                }
                if (!room.isParticipant(socket.userId)) {
                    socket.emit('error', { message: 'Not a participant. Join the room first.' });
                    return;
                }

                socket.roomId = roomId;
                socket.join(roomId);
                if (!roomMembers.has(roomId)) roomMembers.set(roomId, new Map());
                roomMembers.get(roomId).set(socket.userId, socket.id);

                const state = ensureRoomState(roomId);
                await broadcastParticipants(io, roomId);

                if (state.speakerUserId) {
                    socket.emit('floor-granted', {
                        userId: state.speakerUserId,
                        grantedAt: state.grantStart,
                        limitMs: SPEAKING_LIMIT_MS
                    });
                    const speakerSocketId = roomMembers.get(roomId)?.get(state.speakerUserId);
                    if (speakerSocketId && state.speakerUserId !== socket.userId) {
                        io.to(speakerSocketId).emit('speaker:new-listener', { userId: socket.userId });
                    }
                }
            } catch (err) {
                console.error('room:join error:', err.message);
                socket.emit('error', { message: 'Failed to join socket room' });
            }
        });

        socket.on('room:leave', async () => {
            const roomId = socket.roomId;
            socket.roomId = null;
            if (!roomId) return;

            socket.leave(roomId);
            roomMembers.get(roomId)?.delete(socket.userId);
            removeFromQueue(roomId, socket.userId);

            try {
                const room = await DebateRoom.findById(roomId);
                if (room) {
                    if (room.host.toString() === socket.userId) {
                        clearInterval(rooms.get(roomId)?.tick);
                        rooms.delete(roomId);
                        io.to(roomId).emit('room:closed', { message: 'Host closed the room' });
                        return;
                    }
                }
                const state = rooms.get(roomId);
                if (state && state.speakerUserId === socket.userId) {
                    revokeFloor(io, roomId, socket.userId, 'left-room');
                }
                await broadcastParticipants(io, roomId);
            } catch (err) {
                console.error('room:leave error:', err.message);
            }
        });

        socket.on('disconnect', () => {
            const roomId = socket.roomId;
            socket.roomId = null;
            if (!roomId) return;

            roomMembers.get(roomId)?.delete(socket.userId);
            removeFromQueue(roomId, socket.userId);

            const state = rooms.get(roomId);
            if (state && state.speakerUserId === socket.userId) {
                revokeFloor(io, roomId, socket.userId, 'left-room');
            }
            broadcastParticipants(io, roomId).catch(() => {});
        });

        socket.on('request-floor', async ({ roomId }) => {
            if (!socket.roomId || socket.roomId !== roomId) return;
            const state = ensureRoomState(roomId);

            try {
                const room = await DebateRoom.findById(roomId);
                if (!room || !room.isParticipant(socket.userId)) return;
                const participant = room.participants.find((p) => p.user.toString() === socket.userId);
                if (!participant || participant.speakingMs >= SPEAKING_LIMIT_MS) {
                    socket.emit('floor-denied', { userId: socket.userId, reason: 'budget-exhausted' });
                    return;
                }

                if (state.speakerUserId) {
                    if (!state.queue.includes(socket.userId)) {
                        state.queue.push(socket.userId);
                    }
                    socket.emit('floor-queued', { userId: socket.userId, position: state.queue.indexOf(socket.userId) + 1 });
                    return;
                }

                grantFloor(io, roomId, socket.userId);
            } catch (err) {
                console.error('request-floor error:', err.message);
            }
        });

        socket.on('release-floor', async ({ roomId }) => {
            if (!socket.roomId || socket.roomId !== roomId) return;
            const state = rooms.get(roomId);
            if (!state || state.speakerUserId !== socket.userId) return;
            revokeFloor(io, roomId, socket.userId, 'released');
        });

        socket.on('webrtc:offer', ({ toUserId, sdp }) => {
            const roomId = socket.roomId;
            if (!roomId) return;
            const targetSocketId = roomMembers.get(roomId)?.get(toUserId);
            if (!targetSocketId) return;
            io.to(targetSocketId).emit('webrtc:offer', { fromUserId: socket.userId, sdp });
        });

        socket.on('webrtc:answer', ({ toUserId, sdp }) => {
            const roomId = socket.roomId;
            if (!roomId) return;
            const targetSocketId = roomMembers.get(roomId)?.get(toUserId);
            if (!targetSocketId) return;
            io.to(targetSocketId).emit('webrtc:answer', { fromUserId: socket.userId, sdp });
        });

        socket.on('webrtc:ice-candidate', ({ toUserId, candidate }) => {
            const roomId = socket.roomId;
            if (!roomId) return;
            const targetSocketId = roomMembers.get(roomId)?.get(toUserId);
            if (!targetSocketId) return;
            io.to(targetSocketId).emit('webrtc:ice-candidate', { fromUserId: socket.userId, candidate });
        });
    });
}

module.exports = { initSocket };
