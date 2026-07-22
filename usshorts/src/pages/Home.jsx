import { useEffect, useMemo, useState } from 'react';
import NewsCard from '../components/NewsCard';
import ArticlePanel from '../components/ArticlePanel';
import { fetchHeadlines } from '../api/newsService';

export default function Home() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeId, setActiveId] = useState(null);

    const loadHeadlines = () => {
        setLoading(true);
        setError(null);
        fetchHeadlines('general')
            .then((data) => {
                setArticles(data);
                if (data.length > 0) setActiveId(data[0].id);
            })
            .catch((err) => setError(err.response?.data?.error || err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadHeadlines();
    }, []);

    const activeArticle = useMemo(
        () => articles.find((item) => item.id === activeId) ?? articles[0],
        [activeId, articles]
    );

    if (error) {
        return (
            <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
                <div style={{ background: 'var(--bg-card, #1a1a1a)', border: '1px solid #e74c3c', borderTop: '3px solid #e74c3c', borderRadius: '12px', padding: '2rem' }}>
                    <h3 style={{ color: '#e74c3c', marginBottom: '0.5rem' }}>Failed to load news</h3>
                    <p style={{ color: 'var(--text-muted, #888)', marginBottom: '1.5rem' }}>{error}</p>
                    <button onClick={loadHeadlines} style={{ background: 'var(--primary, #6c63ff)', color: '#fff', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Try Again</button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <p style={{ opacity: 0.5 }}>Loading news...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
            <section className="feed-layout">
                <div className="news-column">
                    <div className="section-head">
                        <div>
                            <p className="eyebrow">Smart short feed</p>
                            <h2>Live news with AI-powered summaries</h2>
                        </div>
                        <span className="pill soft">{articles.length} articles</span>
                    </div>
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
                {activeArticle && <ArticlePanel article={activeArticle} />}
            </section>
        </div>
    );
}
