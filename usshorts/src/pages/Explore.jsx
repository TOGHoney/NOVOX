import { useState, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import { topics, shortNews } from '../data/mockData';
import NewsCard from '../components/NewsCard';

export default function Explore() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopic, setSelectedTopic] = useState(null);

    const filteredArticles = useMemo(() => {
        return shortNews.filter((article) => {
            const matchesSearch =
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.fullArticle.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTopic = selectedTopic
                ? article.category.toLowerCase() === selectedTopic.toLowerCase()
                : true;
            return matchesSearch && matchesTopic;
        });
    }, [searchQuery, selectedTopic]);

    return (
        <div className="explore-page" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-head" style={{ marginBottom: '2rem' }}>
                <div>
                    <p className="eyebrow">Explore Topics</p>
                    <h2>Find news and vocabulary by interest</h2>
                </div>
            </div>

            <div className="search-container" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <div className="search-box" style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.75rem 1rem' }}>
                    <FiSearch style={{ marginRight: '0.75rem', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search topics, keywords, or levels..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ background: 'none', border: 'none', color: 'var(--text)', width: '100%', outline: 'none', fontSize: '1rem' }}
                    />
                </div>
            </div>

            <div className="topics-section" style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Personalized Focus Areas</h3>
                <div className="topic-wrap" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setSelectedTopic(null)}
                        className={`topic-chip ${selectedTopic === null ? 'active' : ''}`}
                        style={{
                            padding: '0.5rem 1.25rem',
                            borderRadius: '20px',
                            border: '1px solid var(--border)',
                            background: selectedTopic === null ? 'var(--primary)' : 'var(--bg-card)',
                            color: selectedTopic === null ? 'white' : 'var(--text)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontWeight: 500
                        }}
                    >
                        All Topics
                    </button>
                    {topics.map((topic) => (
                        <button
                            key={topic}
                            onClick={() => setSelectedTopic(topic)}
                            className={`topic-chip ${selectedTopic === topic ? 'active' : ''}`}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '20px',
                                border: '1px solid var(--border)',
                                background: selectedTopic === topic ? 'var(--primary)' : 'var(--bg-card)',
                                color: selectedTopic === topic ? 'white' : 'var(--text)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontWeight: 500
                            }}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>

            <div className="results-section">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                    {selectedTopic ? `${selectedTopic} Articles` : 'All Recommended Articles'} ({filteredArticles.length})
                </h3>
                {filteredArticles.length > 0 ? (
                    <div className="news-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {filteredArticles.map((article) => (
                            <NewsCard
                                key={article.id}
                                article={article}
                                activeId={null}
                                onSelect={() => { }}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No articles found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
