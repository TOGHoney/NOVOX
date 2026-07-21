import { useEffect, useMemo, useState } from 'react';
import NewsCard from '../components/NewsCard';
import ArticlePanel from '../components/ArticlePanel';
import NotFound from './NotFound';
import { fetchHeadlines } from '../api/newsService';

export default function Home() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        fetchHeadlines('general')
            .then((data) => {
                setArticles(data);
                if (data.length > 0) setActiveId(data[0].id);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    const activeArticle = useMemo(
        () => articles.find((item) => item.id === activeId) ?? articles[0],
        [activeId, articles]
    );

    if (error) return <NotFound />;

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
