import { useState, useMemo } from 'react';
import { shortNews } from '../data/mockData';
import NewsCard from '../components/NewsCard';
import ArticlePanel from '../components/ArticlePanel';

export default function Articles() {
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeId, setActiveId] = useState(shortNews[0]?.id || null);

    const levels = ['All', 'A2', 'B1', 'B2'];
    const categories = ['All', 'World', 'Technology', 'Business'];

    const filteredArticles = useMemo(() => {
        return shortNews.filter((article) => {
            const matchesLevel = selectedLevel === 'All' || article.level === selectedLevel;
            const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
            return matchesLevel && matchesCategory;
        });
    }, [selectedLevel, selectedCategory]);

    const activeArticle = useMemo(() => {
        return shortNews.find((item) => item.id === activeId) ?? filteredArticles[0] ?? shortNews[0];
    }, [activeId, filteredArticles]);

    return (
        <div className="articles-page" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-head" style={{ marginBottom: '2rem' }}>
                <div>
                    <p className="eyebrow">Article Library</p>
                    <h2>Read full articles with interactive tools</h2>
                </div>
            </div>

            <div className="filters-container" style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div>
                    <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Difficulty Level</h4>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {levels.map((level) => (
                            <button
                                key={level}
                                onClick={() => setSelectedLevel(level)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: selectedLevel === level ? 'var(--primary)' : 'var(--bg-card)',
                                    color: selectedLevel === level ? 'white' : 'var(--text)',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Category</h4>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: selectedCategory === category ? 'var(--primary)' : 'var(--bg-card)',
                                    color: selectedCategory === category ? 'white' : 'var(--text)',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="feed-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                <div className="news-column">
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Available Articles ({filteredArticles.length})</h3>
                    <div className="news-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredArticles.map((article) => (
                            <NewsCard
                                key={article.id}
                                article={article}
                                activeId={activeId}
                                onSelect={(id) => setActiveId(id)}
                            />
                        ))}
                        {filteredArticles.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                <p style={{ color: 'var(--text-muted)' }}>No articles match the selected filters.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Reader Panel</h3>
                    {activeArticle ? (
                        <ArticlePanel article={activeArticle} />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                            <p style={{ color: 'var(--text-muted)' }}>Select an article to start reading.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
