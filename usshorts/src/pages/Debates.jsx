import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlayCircle, FiUsers, FiPlus, FiMessageSquare, FiX } from 'react-icons/fi';
import { fetchRooms, createRoom, joinRoom } from '../api/debateService';

const inputStyle = {
    width: '100%',
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--bg-app)',
    color: 'var(--text)',
    outline: 'none',
    fontSize: '0.95rem'
};

export default function Debates() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({
        topic: '',
        prompt: '',
        language: 'English',
        level: 'A1',
        maxParticipants: 6
    });

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        setLoading(true);
        setError('');
        try {
            setRooms(await fetchRooms());
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const room = await createRoom(form);
            setShowCreate(false);
            setForm({ topic: '', prompt: '', language: 'English', level: 'A1', maxParticipants: 6 });
            navigate(`/debates/${room._id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create room');
        }
    };

    const handleJoin = async (roomId) => {
        try {
            await joinRoom(roomId);
            navigate(`/debates/${roomId}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to join room');
        }
    };

    return (
        <div className="debates-page" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-head" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p className="eyebrow">Speaking Practice</p>
                    <h2>Live Debate & Discussion Rooms</h2>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="primary-btn"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.7rem 1.4rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'var(--primary)',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    <FiPlus /> Host a Room
                </button>
            </div>

            {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            {loading ? (
                <p style={{ color: 'var(--text-muted)' }}>Loading rooms...</p>
            ) : rooms.length === 0 ? (
                <div className="panel" style={{ padding: '3rem 2rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <FiMessageSquare size={32} color="var(--text-muted)" />
                    <h3>No active rooms</h3>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '360px', margin: '0 auto' }}>
                        Be the first to host a debate room and invite other learners to practice speaking.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {rooms.map((room) => (
                        <div key={room._id} className="panel" style={{ padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="pill soft" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>
                                    {room.language} · {room.level}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <FiUsers /> {room.participantCount}/{room.maxParticipants}
                                </span>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{room.topic}</h4>
                                {room.prompt && <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{room.prompt}</p>}
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.75rem' }}>Hosted by {room.host}</p>
                            </div>
                            <button
                                onClick={() => handleJoin(room._id)}
                                className="primary-btn secondary-tone"
                                disabled={room.participantCount >= room.maxParticipants}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'var(--primary-soft)',
                                    color: 'var(--primary)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    opacity: room.participantCount >= room.maxParticipants ? 0.5 : 1
                                }}
                            >
                                <FiPlayCircle /> {room.participantCount >= room.maxParticipants ? 'Room Full' : 'Join Room'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showCreate && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }} onClick={() => setShowCreate(false)}>
                    <div
                        className="panel"
                        onClick={(e) => e.stopPropagation()}
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '480px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem' }}>Host a Debate Room</h3>
                            <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} aria-label="Close">
                                <FiX size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Topic</label>
                                <input name="topic" value={form.topic} onChange={onChange} placeholder="e.g. AI Translation vs. Human Fluency" required style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Debate prompt (optional)</label>
                                <input name="prompt" value={form.prompt} onChange={onChange} placeholder="e.g. Does AI improve fluency?" style={inputStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Language</label>
                                    <select name="language" value={form.language} onChange={onChange} style={inputStyle}>
                                        <option>English</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                        <option>Japanese</option>
                                        <option>Hindi</option>
                                        <option>German</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Level</label>
                                    <select name="level" value={form.level} onChange={onChange} style={inputStyle}>
                                        <option>A1</option>
                                        <option>A2</option>
                                        <option>B1</option>
                                        <option>B2</option>
                                        <option>C1</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Max users</label>
                                    <select name="maxParticipants" value={form.maxParticipants} onChange={onChange} style={inputStyle}>
                                        {[4, 6, 8, 10, 12].map((n) => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="primary-btn" style={{ padding: '0.75rem', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                                Create Room
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
