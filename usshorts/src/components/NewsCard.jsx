import { useState } from 'react';
import { FiBookOpen, FiClock, FiGlobe, FiCpu, FiRepeat } from 'react-icons/fi';

export default function NewsCard({ article, activeId, onSelect, translation = null }) {
    const [showSummary, setShowSummary] = useState(false);
    const [showOriginal, setShowOriginal] = useState(false);
    const isActive = activeId === article.id;
    const translated = Boolean(translation) && !showOriginal;

    return (
        <article className={`news-card ${isActive ? 'selected' : ''}`}>
            <div className="news-meta-row">
                <span className="pill">{article.category}</span>
                <span className="muted">{article.source}</span>
            </div>
            <h3>{translated ? translation.title : article.title}</h3>
            <p>{translated ? translation.description : article.description}</p>

            {translation && (
                <button
                    className="ghost-btn"
                    style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}
                    onClick={() => setShowOriginal(!showOriginal)}
                >
                    <FiRepeat /> {showOriginal ? `Show ${article.source} translation` : 'Show original'}
                </button>
            )}

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
                            {translated ? translation.aiSummary : article.aiSummary}
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
