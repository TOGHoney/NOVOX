import { useMemo, useState } from 'react';
import NewsCard from '../components/NewsCard';
import ArticlePanel from '../components/ArticlePanel';
import { shortNews } from '../data/mockData';

export default function Home() {
  const [activeId, setActiveId] = useState(shortNews[0].id);

  const activeArticle = useMemo(
    () => shortNews.find((item) => item.id === activeId) ?? shortNews[0],
    [activeId]
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      <section className="feed-layout">
        <div className="news-column">
          <div className="section-head">
            <div>
              <p className="eyebrow">Smart short feed</p>
              <h2>Briefs matched to your reading behavior</h2>
            </div>
            <span className="pill soft">Based on time spent + topic interest</span>
          </div>
          <div className="news-list">
            {shortNews.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                activeId={activeId}
                onSelect={(id) => {
                  setActiveId(id);
                }}
              />
            ))}
          </div>
        </div>
        <ArticlePanel article={activeArticle} />
      </section>
    </div>
  );
}
