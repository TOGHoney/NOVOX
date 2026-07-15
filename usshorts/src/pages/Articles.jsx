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
        <div className="articles-page">
            <div className="section-head" style={{ marginBottom: '2rem' }}>
                <div>
                    <p className="eyebrow">Article Library</p>
                    <h2>Read full articles with interactive tools</h2>
                </div>
            </div>

            <div className="filters-container">
                <div className="filter-group">
                    <h4>Difficulty Level</h4>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {levels.map((level) => (
                            <button
                                key={level}
                                className={`filter-btn ${selectedLevel === level ? 'active' : ''}`}
                                onClick={() => setSelectedLevel(level)}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <h4>Category</h4>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="feed-layout" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
                <div className="news-column">
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Available Articles ({filteredArticles.length})</h3>
                    <div className="news-list">
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
                                <p style={{ color: 'var(--muted)' }}>No articles match the selected filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
