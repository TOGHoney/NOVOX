import React from 'react';
import { FiCpu } from 'react-icons/fi';

export default function ArticlePanel({ article, onSelectWord }) {
    const handleTextSelection = () => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText && selectedText.length > 0 && selectedText.length < 50) {
            onSelectWord(selectedText);
        }
    };

    // Helper to clean up API artifacts like [+2555 chars] and raw HTML tags
    const cleanContent = (text) => {
        if (!text) return '';
        return text
            .replace(/\[\+\d+\s*chars\]/gi, '') // Removes [+2555 chars]
            .replace(/<\/?[^>]+(>|$)/g, '');    // Strips HTML tags like <ul>, <li>
    };

    return (
        <section className="article-panel" style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="article-body" onMouseUp={handleTextSelection}>
                <p className="eyebrow" style={{ opacity: 0.6, fontSize: '0.85rem' }}>
                    {article.source} · {new Date(article.publishedAt).toLocaleDateString()}
                </p>
                
                <h2 style={{ fontSize: '1.6rem', margin: '0.5rem 0 1rem 0' }}>{article.title}</h2>

                {article.aiSummary && (
                    <div style={{
                        padding: '1rem 1.25rem',
                        background: 'var(--bg-card, rgba(255,255,255,0.03))',
                        border: '1px solid var(--border, rgba(255,255,255,0.08))',
                        borderRadius: '12px',
                        marginBottom: '1.25rem',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                            <FiCpu size={14} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', opacity: 0.7 }}>
                                AI Summary
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                            {article.aiSummary}
                        </p>
                    </div>
                )}

                <p style={{ lineHeight: 1.7, fontSize: '1.05rem', color: 'var(--text-main, inherit)' }}>
                    {cleanContent(article.description)}
                </p>
                
                {article.content && (
                    <p style={{ lineHeight: 1.7, fontSize: '1rem', opacity: 0.9 }}>
                        {cleanContent(article.content)}
                    </p>
                )}
            </div>
        </section>
    );
}