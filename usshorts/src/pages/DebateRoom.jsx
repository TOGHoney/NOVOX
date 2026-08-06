import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiMic, FiMicOff, FiUsers, FiClock, FiArrowLeft, FiLogOut } from 'react-icons/fi';
import socket from '../api/socket';
import { joinRoom, leaveRoom } from '../api/debateService';
import { getUserId } from '../api/authService';

const RTC_CONFIG = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const BUDGET_MS = 3 * 60 * 1000;

function formatMs(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function DebateRoom() {
    const { id: roomId } = useParams();
    const navigate = useNavigate();
    const myUserId = getUserId();

    const [room, setRoom] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [floor, setFloor] = useState(null);
    const [queuePosition, setQueuePosition] = useState(null);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [connected, setConnected] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [, setTick] = useState(0);

    const audioElRef = useRef(null);
    const rtcRef = useRef({ peers: new Map(), stream: null });
    const participantsRef = useRef([]);
    const floorRef = useRef(null);
    const leavingRef = useRef(false);

    participantsRef.current = participants;
    floorRef.current = floor;

    useEffect(() => {
        const timer = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const stopAllMedia = () => {
        const rtc = rtcRef.current;
        rtc.peers.forEach((pc) => {
            try {
                pc.onicecandidate = null;
                pc.ontrack = null;
                pc.close();
            } catch {}
        });
        rtc.peers.clear();
        if (rtc.stream) {
            rtc.stream.getTracks().forEach((t) => t.stop());
            rtc.stream = null;
        }
        if (audioElRef.current) audioElRef.current.srcObject = null;
    };

    const createPeer = (targetUserId, initiator) => {
        const rtc = rtcRef.current;
        if (rtc.peers.has(targetUserId)) {
            try { rtc.peers.get(targetUserId).close(); } catch {}
        }
        const pc = new RTCPeerConnection(RTC_CONFIG);
        pc.onicecandidate = (e) => {
            if (e.candidate) {
                socket.emit('webrtc:ice-candidate', { toUserId: targetUserId, candidate: e.candidate.toJSON() });
            }
        };
        pc.ontrack = (e) => {
            if (e.streams[0] && audioElRef.current) {
                audioElRef.current.srcObject = e.streams[0];
            }
        };
        if (initiator && rtc.stream) {
            rtc.stream.getAudioTracks().forEach((track) => pc.addTrack(track, rtc.stream));
        }
        rtc.peers.set(targetUserId, pc);
        return pc;
    };

    const sendOffer = async (targetUserId) => {
        const pc = createPeer(targetUserId, true);
        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('webrtc:offer', { toUserId: targetUserId, sdp: offer });
        } catch (err) {
            console.error('Offer error:', err.message);
        }
    };

    const connectToAllListeners = () => {
        const others = participantsRef.current
            .filter((p) => p.userId !== myUserId)
            .map((p) => p.userId);
        others.forEach((userId) => sendOffer(userId));
    };

    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            try {
                const data = await joinRoom(roomId);
                if (cancelled) return;
                setRoom(data.room);
                setParticipants(data.room.participants || []);
            } catch (err) {
                if (!cancelled) setError(err.response?.data?.error || 'Failed to join room');
            }
        };
        init();

        const onConnect = () => {
            setConnected(true);
            socket.emit('room:join', { roomId });
        };
        const onConnectError = () => {
            if (!cancelled) setError('Could not connect to the room server. Please try again.');
        };
        const onParticipants = ({ participants }) => setParticipants(participants);
        const onFloorGranted = ({ userId, grantedAt, limitMs }) => {
            setQueuePosition(null);
            setFloor({ userId, grantedAt, limitMs });
            if (userId === myUserId) {
                const startSpeaking = async () => {
                    stopAllMedia();
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        rtcRef.current.stream = stream;
                        connectToAllListeners();
                    } catch (err) {
                        console.error('Mic error:', err.message);
                        setNotice('Microphone unavailable. Floor granted but the mic failed to start.');
                    }
                };
                startSpeaking();
            }
        };
        const onFloorRevoked = ({ userId }) => {
            if (userId === myUserId) {
                stopAllMedia();
            } else {
                const pc = rtcRef.current.peers.get(userId);
                if (pc) {
                    try { pc.close(); } catch {}
                    rtcRef.current.peers.delete(userId);
                }
                if (audioElRef.current) audioElRef.current.srcObject = null;
            }
            setFloor(null);
        };
        const onFloorDenied = ({ reason }) => {
            setNotice(reason === 'budget-exhausted' ? 'You have used your full 3 minutes of speaking time.' : 'Floor request denied.');
        };
        const onFloorQueued = ({ position }) => setQueuePosition(position);
        const onBudgetUpdate = ({ userId, speakingMs }) => {
            setParticipants((prev) => prev.map((p) => (p.userId === userId ? { ...p, speakingMs } : p)));
        };
        const onNewListener = ({ userId }) => {
            if (floorRef.current?.userId === myUserId) sendOffer(userId);
        };
        const onWebrtcOffer = async ({ fromUserId, sdp }) => {
            const pc = createPeer(fromUserId, false);
            try {
                await pc.setRemoteDescription(sdp);
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('webrtc:answer', { toUserId: fromUserId, sdp: answer });
            } catch (err) {
                console.error('Answer error:', err.message);
            }
        };
        const onWebrtcAnswer = async ({ fromUserId, sdp }) => {
            const pc = rtcRef.current.peers.get(fromUserId);
            if (pc) {
                try { await pc.setRemoteDescription(sdp); } catch (err) { console.error(err.message); }
            }
        };
        const onIceCandidate = async ({ fromUserId, candidate }) => {
            const pc = rtcRef.current.peers.get(fromUserId);
            if (pc) {
                try { await pc.addIceCandidate(candidate); } catch (err) { console.error(err.message); }
            }
        };
        const onRoomClosed = ({ message }) => {
            stopAllMedia();
            setNotice(message || 'The host closed this room.');
        };
        const onServerError = ({ message }) => setError(message);

        socket.on('connect', onConnect);
        socket.on('connect_error', onConnectError);
        socket.on('participants', onParticipants);
        socket.on('floor-granted', onFloorGranted);
        socket.on('floor-revoked', onFloorRevoked);
        socket.on('floor-denied', onFloorDenied);
        socket.on('floor-queued', onFloorQueued);
        socket.on('budget-update', onBudgetUpdate);
        socket.on('speaker:new-listener', onNewListener);
        socket.on('webrtc:offer', onWebrtcOffer);
        socket.on('webrtc:answer', onWebrtcAnswer);
        socket.on('webrtc:ice-candidate', onIceCandidate);
        socket.on('room:closed', onRoomClosed);
        socket.on('error', onServerError);

        socket.connect();

        return () => {
            cancelled = true;
            socket.off('connect', onConnect);
            socket.off('connect_error', onConnectError);
            socket.off('participants', onParticipants);
            socket.off('floor-granted', onFloorGranted);
            socket.off('floor-revoked', onFloorRevoked);
            socket.off('floor-denied', onFloorDenied);
            socket.off('floor-queued', onFloorQueued);
            socket.off('budget-update', onBudgetUpdate);
            socket.off('speaker:new-listener', onNewListener);
            socket.off('webrtc:offer', onWebrtcOffer);
            socket.off('webrtc:answer', onWebrtcAnswer);
            socket.off('webrtc:ice-candidate', onIceCandidate);
            socket.off('room:closed', onRoomClosed);
            socket.off('error', onServerError);
            if (!leavingRef.current) {
                socket.emit('room:leave');
                socket.disconnect();
            }
            stopAllMedia();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    const handleRequestFloor = () => {
        setNotice('');
        socket.emit('request-floor', { roomId });
    };

    const handleReleaseFloor = () => {
        socket.emit('release-floor', { roomId });
    };

    const handleLeave = async () => {
        if (leavingRef.current) return;
        leavingRef.current = true;
        setLeaving(true);
        socket.emit('room:leave');
        socket.disconnect();
        try {
            await leaveRoom(roomId);
        } catch {}
        navigate('/debates');
    };

    const isSpeaker = floor?.userId === myUserId;
    const speakingUser = participants.find((p) => p.userId === floor?.userId);
    const myBudget = participants.find((p) => p.userId === myUserId)?.speakingMs || 0;
    const remainingMs = BUDGET_MS - myBudget;

    if (error) {
        return (
            <div className="debates-page" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <div className="panel" style={{ padding: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                    <p style={{ color: '#ef4444', marginBottom: '1.5rem' }}>{error}</p>
                    <button onClick={() => navigate('/debates')} className="primary-btn" style={{ padding: '0.7rem 1.4rem', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                        Back to Debates
                    </button>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="debates-page" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading room...</p>
            </div>
        );
    }

    return (
        <div className="debates-page" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/debates')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' }}
            >
                <FiArrowLeft /> Back to rooms
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <div>
                    <span className="pill soft" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>
                        {room.language} · {room.level}
                    </span>
                    <h2 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.6rem' }}>{room.topic}</h2>
                    {room.prompt && <p style={{ color: 'var(--text-muted)' }}>{room.prompt}</p>}
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Hosted by {room.host}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ color: connected ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: connected ? 'var(--primary)' : '#ef4444', display: 'inline-block' }} />
                        {connected ? 'Connected' : 'Connecting...'}
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        <FiUsers /> {participants.length}/{room.maxParticipants}
                    </p>
                </div>
            </div>

            {notice && (
                <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid #3b82f6', color: '#3b82f6', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    {notice}
                </div>
            )}

            <div className="feed-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
                <div>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Participants</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {participants.map((p) => (
                            <div key={p.userId} className="panel" style={{ padding: '0.9rem 1.1rem', background: 'var(--bg-card)', border: `1px solid ${p.userId === floor?.userId ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                    <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {p.username}
                                        {p.isHost && <span className="pill soft" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Host</span>}
                                        {p.userId === floor?.userId && <span className="pill success" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Speaking</span>}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: p.speakingMs >= BUDGET_MS ? '#ef4444' : 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <FiClock /> {formatMs(p.speakingMs)} / 3:00
                                    </span>
                                </div>
                                <div style={{ height: '6px', background: 'var(--bg-app)', borderRadius: '999px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(100, (p.speakingMs / BUDGET_MS) * 100)}%`, background: p.speakingMs >= BUDGET_MS ? '#ef4444' : 'var(--primary)', height: '100%', borderRadius: '999px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="practice-panel">
                    <div className="panel" style={{ padding: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
                        {isSpeaker ? (
                            <>
                                <span className="pill success">You have the floor</span>
                                <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                                    <FiMic size={34} color="#ef4444" />
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Speaking time remaining: <strong style={{ color: 'var(--text)' }}>{formatMs(remainingMs)}</strong></p>
                                <button
                                    onClick={handleReleaseFloor}
                                    className="primary-btn"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    <FiMicOff /> Stop Speaking
                                </button>
                            </>
                        ) : floor ? (
                            <>
                                <span className="pill soft">{speakingUser?.username || 'A participant'} is speaking</span>
                                <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiMic size={34} color="var(--text-muted)" />
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    {speakingUser ? `${speakingUser.username} has ${formatMs(Math.max(0, floor.limitMs - speakingUser.speakingMs))} left.` : ''}
                                </p>
                                <button
                                    onClick={handleRequestFloor}
                                    className="primary-btn secondary-tone"
                                    style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: 'var(--primary-soft)', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Queue to Speak {queuePosition ? `(Position ${queuePosition})` : ''}
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="pill soft">Floor is free</span>
                                <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'var(--bg-app)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease' }} onClick={handleRequestFloor}>
                                    <FiMic size={34} color="var(--text-muted)" />
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    {myBudget >= BUDGET_MS ? 'You have used all your speaking time for this session.' : 'Click the microphone to request the floor and start speaking.'}
                                </p>
                                {myBudget >= BUDGET_MS ? (
                                    <span className="pill" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '0.8rem' }}>Budget exhausted</span>
                                ) : (
                                    <button onClick={handleRequestFloor} className="primary-btn secondary-tone" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: 'var(--primary-soft)', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                                        Request Floor
                                    </button>
                                )}
                            </>
                        )}
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '340px', margin: '0 auto' }}>
                            Only one person can speak at a time. Each participant has a total of 3 minutes of speaking time per session.
                        </p>
                    </div>

                    <div className="panel" style={{ padding: '1.2rem 1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Your speaking time</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatMs(myBudget)} used · {formatMs(remainingMs)} left</p>
                        </div>
                        <button onClick={handleLeave} disabled={leaving} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                            <FiLogOut /> {leaving ? 'Leaving...' : 'Leave Room'}
                        </button>
                    </div>
                </div>
            </div>

            <audio ref={audioElRef} autoPlay />
        </div>
    );
}
