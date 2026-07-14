import { useMemo, useState } from 'react';
import ArticlePanel from './components/ArticlePanel';
import DashboardPanel from './components/DashboardPanel';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import Sidebar from './components/Sidebar';
import { shortNews } from './data/mockData';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState(shortNews[0].id);

  const activeArticle = useMemo(
    () => shortNews.find((item) => item.id === activeId) ?? shortNews[0],
    [activeId]
  );

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="app-main">
        <Header setMobileOpen={setMobileOpen} />
        <main className="content-area">
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
                      setMobileOpen(false);
                    }}
                  />
                ))}
              </div>
            </div>
            <ArticlePanel article={activeArticle} />
          </section>
          <DashboardPanel />
        </main>
      </div>
    </div>
  );
}