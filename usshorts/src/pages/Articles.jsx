import { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import { fetchHeadlines } from '../api/newsService';

const CATEGORIES = [
    { label: 'All', value: 'general' },
    { label: 'Technology', value: 'technology' },
    { label: 'Business', value: 'business' },
    { label: 'Science', value: 'science' },
    { label: 'Health', value: 'health' },
    { label: 'Sports', value: 'sports' },
    { label: 'Entertainment', value: 'entertainment' },
];

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [activeId, setActiveId] = useState(null);

    const loadArticles = (category) => {
        setLoading(true);
        setError(null);
        fetchHeadlines(category)
            .then((data) => {
                setArticles(data);
                if (data.length > 0) setActiveId(data[0].id);
            })
            .catch((err) => setError(err.response?.data?.error || err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadArticles(selectedCategory);
    }, [selectedCategory]);

    if (error) {
        return (
            <div className="articles-page" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: 'var(--bg-card, #1a1a1a)', border: '1px solid #e74c3c', borderTop: '3px solid #e74c3c', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
                    <h3 style={{ color: '#e74c3c', marginBottom: '0.5rem' }}>Failed to load articles</h3>
                    <p style={{ color: 'var(--text-muted, #888)', marginBottom: '1.5rem' }}>{error}</p>
                    <button onClick={() => loadArticles(selectedCategory)} style={{ background: 'var(--primary, #6c63ff)', color: '#fff', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="articles-page">
            <div className="section-head" style={{ marginBottom: '2rem' }}>
                <div>
                    <p className="eyebrow">Article Library</p>
                    <h2>Read full articles with AI summaries</h2>
                </div>
            </div>

            <div className="filters-container">
                <div className="filter-group">
                    <h4>Category</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.value}
                                className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.value)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ opacity: 0.5 }}>Loading articles...</p>
                </div>
            ) : (
                <div className="feed-layout" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
                    <div className="news-column">
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Available Articles ({articles.length})</h3>
                        <div className="news-list">
                            {articles.map((article) => (
                                <NewsCard
                                    key={article.id}
                                    article={article}
                                    activeId={activeId}
                                    onSelect={(id) => setActiveId(id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
