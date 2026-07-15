import { useState } from 'react';
import { FiUser, FiGlobe, FiSettings, FiVolume2, FiBell, FiLock } from 'react-icons/fi';

export default function Profile() {
    const [languagePair, setLanguagePair] = useState('Hindi → Japanese');
    const [dailyGoal, setDailyGoal] = useState('15 mins');
    const [notifications, setNotifications] = useState(true);

    return (
        <div className="profile-page" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div className="section-head" style={{ marginBottom: '2rem' }}>
                <div>
                    <p className="eyebrow">User Settings</p>
                    <h2>Your Profile & Preferences</h2>
                </div>
            </div>

            <div className="panel" style={{ padding: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiUser size={40} color="var(--primary)" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Aarav Sharma</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Consistency Star · Joined July 2026</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total XP</span>
                        <h4 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>8,410 XP</h4>
                    </div>
                    <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Current Streak</span>
                        <h4 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>9 Days</h4>
                    </div>
                </div>
            </div>

            <div className="panel" style={{ padding: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiSettings /> Preferences
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Language Learning Pair</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Select the source and target languages</p>
                        </div>
                        <select
                            value={languagePair}
                            onChange={(e) => setLanguagePair(e.target.value)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg-app)',
                                color: 'var(--text)',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="Hindi → Japanese">Hindi → Japanese</option>
                            <option value="English → Spanish">English → Spanish</option>
                            <option value="English → French">English → French</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Daily Reading Goal</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Set your target reading time per day</p>
                        </div>
                        <select
                            value={dailyGoal}
                            onChange={(e) => setDailyGoal(e.target.value)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg-app)',
                                color: 'var(--text)',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="5 mins">5 mins / day</option>
                            <option value="15 mins">15 mins / day</option>
                            <option value="30 mins">30 mins / day</option>
                            <option value="60 mins">60 mins / day</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Daily Reminders</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Receive notifications to maintain your streak</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications}
                            onChange={(e) => setNotifications(e.target.checked)}
                            style={{
                                width: '20px',
                                height: '20px',
                                cursor: 'pointer',
                                accentColor: 'var(--primary)'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
