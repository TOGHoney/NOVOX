import { FiBookmark, FiMic, FiExternalLink, FiCpu } from 'react-icons/fi';

export default function ArticlePanel({ article }) {
    return (
        <section className="article-panel">
            <div className="article-toolbar">
                <span className="pill soft">Full article</span>
                <div className="toolbar-actions">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="ghost-btn">
                        <FiExternalLink /> Open source
                    </a>
                    <button className="ghost-btn"><FiBookmark /> Save words</button>
                    <button className="ghost-btn"><FiMic /> Discuss</button>
                </div>
            </div>
            <div className="article-body">
                <p className="eyebrow">{article.source} · {new Date(article.publishedAt).toLocaleDateString()}</p>
                <h2>{article.title}</h2>

                {article.aiSummary && (
                    <div style={{
                        padding: '1rem 1.25rem',
                        background: 'var(--bg-card, rgba(255,255,255,0.03))',
                        border: '1px solid var(--border, rgba(255,255,255,0.08))',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                            <FiCpu size={14} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7 }}>
                                AI Summary (60-80 words)
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7 }}>
                            {article.aiSummary}
                        </p>
                    </div>
                )}

                <p>{article.description}</p>
                {article.content && <p>{article.content}</p>}
            </div>
        </section>
    );
}
