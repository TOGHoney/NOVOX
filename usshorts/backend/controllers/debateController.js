const DebateRoom = require('../models/DebateRoom');

function serializeRoom(room, currentUserId) {
    return {
        _id: room._id,
        topic: room.topic,
        prompt: room.prompt,
        language: room.language,
        level: room.level,
        maxParticipants: room.maxParticipants,
        status: room.status,
        host: room.host?.username || room.host?._id || room.host,
        hostId: room.host?._id ? room.host._id.toString() : null,
        participantCount: room.participants ? room.participants.length : 0,
        isParticipant: currentUserId
            ? room.participants.some((p) => p.user?._id?.toString() === currentUserId || p.user?.toString() === currentUserId)
            : false
    };
}

function serializeRoomDetail(room, currentUserId) {
    const participants = (room.participants || []).map((p) => ({
        userId: (p.user?._id || p.user).toString(),
        username: p.user?.username || 'Unknown',
        joinedAt: p.joinedAt,
        speakingMs: p.speakingMs,
        isHost: (room.host?._id || room.host)?.toString() === (p.user?._id || p.user).toString()
    }));

    return {
        _id: room._id,
        topic: room.topic,
        prompt: room.prompt,
        language: room.language,
        level: room.level,
        maxParticipants: room.maxParticipants,
        status: room.status,
        host: room.host?.username || 'Unknown',
        hostId: (room.host?._id || room.host)?.toString(),
        isHost: (room.host?._id || room.host)?.toString() === currentUserId,
        participants,
        floor: room.floor?.userId
            ? {
                  userId: room.floor.userId.toString(),
                  grantedAt: room.floor.grantedAt
              }
            : null,
        createdAt: room.createdAt
    };
}

exports.getRooms = async (req, res) => {
    try {
        const rooms = await DebateRoom.find({ status: 'open' })
            .populate('host', 'username')
            .sort({ createdAt: -1 });
        res.json(rooms.map((room) => serializeRoom(room, req.user.id)));
    } catch (err) {
        console.error('Get rooms error:', err.message);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};

exports.createRoom = async (req, res) => {
    const { topic, prompt, language, level, maxParticipants } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });

    try {
        const room = await DebateRoom.create({
            host: req.user.id,
            topic,
            prompt: prompt || '',
            language: language || 'English',
            level: level || 'A1',
            maxParticipants: maxParticipants || 6,
            participants: [{ user: req.user.id }]
        });
        await room.populate('host', 'username');
        res.status(201).json(serializeRoom(room, req.user.id));
    } catch (err) {
        console.error('Create room error:', err.message);
        res.status(500).json({ error: 'Failed to create room' });
    }
};

exports.getRoom = async (req, res) => {
    try {
        const room = await DebateRoom.findById(req.params.id)
            .populate('host', 'username')
            .populate('participants.user', 'username');
        if (!room) return res.status(404).json({ error: 'Room not found' });
        if (room.status === 'closed') return res.status(410).json({ error: 'Room has been closed' });
        res.json(serializeRoomDetail(room, req.user.id));
    } catch (err) {
        console.error('Get room error:', err.message);
        res.status(500).json({ error: 'Failed to fetch room' });
    }
};

exports.joinRoom = async (req, res) => {
    try {
        const room = await DebateRoom.findById(req.params.id)
            .populate('host', 'username')
            .populate('participants.user', 'username');
        if (!room) return res.status(404).json({ error: 'Room not found' });
        if (room.status === 'closed') return res.status(410).json({ error: 'Room has been closed' });

        const userId = req.user.id;
        if (room.isParticipant(userId)) {
            return res.json({ message: 'Already joined', room: serializeRoomDetail(room, userId) });
        }
        if (room.isFull()) {
            return res.status(400).json({ error: 'Room is full' });
        }

        room.participants.push({ user: userId });
        await room.save();
        await room.populate('participants.user', 'username');
        res.json({ message: 'Joined room', room: serializeRoomDetail(room, userId) });
    } catch (err) {
        console.error('Join room error:', err.message);
        res.status(500).json({ error: 'Failed to join room' });
    }
};

exports.leaveRoom = async (req, res) => {
    try {
        const room = await DebateRoom.findById(req.params.id);
        if (!room) return res.status(404).json({ error: 'Room not found' });

        const userId = req.user.id;
        room.participants = room.participants.filter((p) => p.user.toString() !== userId);

        const wasHost = room.host.toString() === userId;
        if (wasHost) {
            room.status = 'closed';
            room.floor = { userId: null, grantedAt: null };
        } else if (room.floor?.userId?.toString() === userId) {
            room.floor = { userId: null, grantedAt: null };
        }

        await room.save();
        res.json({ message: wasHost ? 'Room closed' : 'Left room' });
    } catch (err) {
        console.error('Leave room error:', err.message);
        res.status(500).json({ error: 'Failed to leave room' });
    }
};
