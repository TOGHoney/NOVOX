import { useState } from 'react';
import { FiBookmark, FiMic, FiExternalLink, FiCpu, FiRepeat } from 'react-icons/fi';

export default function ArticlePanel({ article, translation = null, onSelectWord }) {
    const [showOriginal, setShowOriginal] = useState(false);
    const translated = Boolean(translation) && !showOriginal;

    const handleTextSelection = () => {
        const selectedText = window.getSelection().toString().trim();
        if (onSelectWord && selectedText && selectedText.length > 0 && selectedText.length < 50) {
            onSelectWord(selectedText);
        }
    };

    const cleanContent = (text) => {
        if (!text) return '';
        return text
            .replace(/\[\+\d+\s*chars\]/gi, '')
            .replace(/<\/?[^>]+(>|$)/g, '');
    };

    return (
        <section className="article-panel">
            <div className="article-toolbar">
                <span className="pill soft">Full article</span>
                <div className="toolbar-actions">
                    {translation && (
                        <button className="ghost-btn" onClick={() => setShowOriginal(!showOriginal)}>
                            <FiRepeat /> {showOriginal ? 'Show translation' : 'Show original'}
                        </button>
                    )}
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="ghost-btn">
                        <FiExternalLink /> Open source
                    </a>
                    <button className="ghost-btn"><FiBookmark /> Save words</button>
                    <button className="ghost-btn"><FiMic /> Discuss</button>
                </div>
            </div>
            <div className="article-body" onMouseUp={handleTextSelection}>
                <p className="eyebrow">{article.source} · {new Date(article.publishedAt).toLocaleDateString()}</p>
                <h2>{translated ? translation.title : cleanContent(article.title)}</h2>

                {(translated ? translation.aiSummary : article.aiSummary) && (
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
                            {translated ? translation.aiSummary : cleanContent(article.aiSummary)}
                        </p>
                    </div>
                )}

                <p>{translated ? translation.description : cleanContent(article.description)}</p>
                {article.content && <p>{translated ? translation.content : cleanContent(article.content)}</p>}
            </div>
        </section>
    );
}
