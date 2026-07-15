import { useState } from 'react';
import { FiPlayCircle, FiMic, FiUsers, FiMessageSquare, FiAward } from 'react-icons/fi';

export default function Debates() {
    const [joined, setJoined] = useState(false);
    const [speaking, setSpeaking] = useState(false);

    const debateRooms = [
        {
            id: 1,
            topic: 'AI Translation vs. Human Fluency',
            prompt: 'Do translation tools improve language fluency, or do they make learners too dependent?',
            participants: 5,
            language: 'Japanese / English',
            level: 'B1'
        },
        {
            id: 2,
            topic: 'Climate Policy Action',
            prompt: 'Should governments mandate green energy targets for all private corporations by 2030?',
            participants: 3,
            language: 'Spanish / Hindi',
            level: 'A2'
        },
        {
            id: 3,
            topic: 'Startup Ecosystems',
            prompt: 'Is working at a startup better for career growth than working at an established enterprise?',
            participants: 8,
            language: 'French / English',
            level: 'B2'
        }
    ];

    return (
        <div className="debates-page" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-head" style={{ marginBottom: '2rem' }}>
                <div>
                    <p className="eyebrow">Speaking Practice</p>
                    <h2>Live Debate & Discussion Rooms</h2>
                </div>
            </div>

            <div className="feed-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                <div className="rooms-column">
                    <h3 style={{ marginBottom: '1.2rem', fontSize: '1.2rem' }}>Active Rooms</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {debateRooms.map((room) => (
                            <div
                                key={room.id}
                                className="panel"
                                style={{
                                    padding: '1.5rem',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="pill soft" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {room.language} · {room.level}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <FiUsers /> {room.participants} active
                                    </span>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{room.topic}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{room.prompt}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <button
                                        onClick={() => setJoined(true)}
                                        className="primary-btn secondary-tone"
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
                                            fontWeight: 600
                                        }}
                                    >
                                        <FiPlayCircle /> Join Room
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="practice-panel">
                    <h3 style={{ marginBottom: '1.2rem', fontSize: '1.2rem' }}>Practice Room</h3>
                    {joined ? (
                        <div
                            className="panel"
                            style={{
                                padding: '2rem',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: '16px',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1.5rem'
                            }}
                        >
                            <span className="pill success">Connected</span>
                            <div>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>AI Translation vs. Human Fluency</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}> Hindi → Japanese Practice </p>
                            </div>

                            <div
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    background: speaking ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-app)',
                                    border: speaking ? '2px solid #ef4444' : '2px dashed var(--border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={() => setSpeaking(!speaking)}
                            >
                                <FiMic size={36} color={speaking ? '#ef4444' : 'var(--text-muted)'} />
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                {speaking ? 'You are speaking... Click to mute' : 'Click microphone to speak'}
                            </p>

                            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                <button
                                    onClick={() => {
                                        setJoined(false);
                                        setSpeaking(false);
                                    }}
                                    className="primary-btn"
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: '#ef4444',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    Leave Room
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="panel"
                            style={{
                                padding: '3rem 2rem',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: '16px',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem'
                            }}
                        >
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: 'var(--bg-app)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1rem'
                                }}
                            >
                                <FiMessageSquare size={24} color="var(--text-muted)" />
                            </div>
                            <h4>No Active Session</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '300px', margin: '0 auto' }}>
                                Join a debate room on the left to start speaking practice with other learners.
                            </p>
                        </div>
                    )}

                    <div
                        className="panel"
                        style={{
                            padding: '1.5rem',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '16px',
                            marginTop: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}
                    >
                        <FiAward size={24} color="var(--primary)" />
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Speaking XP Boost</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                Earn +20 XP for every 2 minutes you speak in a live debate room.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
