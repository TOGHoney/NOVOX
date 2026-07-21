import { useState } from 'react';
import { FiBookOpen, FiClock, FiGlobe, FiCpu } from 'react-icons/fi';

export default function NewsCard({ article, activeId, onSelect }) {
    const [showSummary, setShowSummary] = useState(false);
    const isActive = activeId === article.id;

    return (
        <article className={`news-card ${isActive ? 'selected' : ''}`}>
            <div className="news-meta-row">
                <span className="pill">{article.category}</span>
                <span className="muted">{article.source}</span>
            </div>
            <h3>{article.title}</h3>
            <p>{article.description}</p>

            {article.aiSummary && (
                <div
                    style={{
                        marginTop: '0.75rem',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-card, rgba(255,255,255,0.03))',
                        border: '1px solid var(--border, rgba(255,255,255,0.08))',
                        borderRadius: '10px',
                        cursor: 'pointer',
                    }}
                    onClick={() => setShowSummary(!showSummary)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: showSummary ? '0.5rem' : 0 }}>
                        <FiCpu size={14} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7 }}>
                            AI Summary
                        </span>
                    </div>
                    {showSummary && (
                        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.85 }}>
                            {article.aiSummary}
                        </p>
                    )}
                </div>
            )}

            <div className="news-meta-grid">
                <span><FiGlobe /> {article.source}</span>
                <span><FiClock /> {new Date(article.publishedAt).toLocaleDateString()}</span>
                <span><FiBookOpen /> Read more</span>
            </div>
            <button className="primary-btn" onClick={() => onSelect(article.id)}>
                {isActive ? 'Reading now' : 'Open article'}
            </button>
        </article>
    );
}
