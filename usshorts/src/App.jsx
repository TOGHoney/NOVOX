import { BrowserRouter as Router } from 'react-router-dom';
import { useMemo, useState } from 'react';
import ArticlePanel from './components/ArticlePanel';
import DashboardPanel from './components/DashboardPanel';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import Sidebar from './components/Sidebar';
import { shortNews } from './data/mockData';
import Login from './pages/login';
import Signup from './pages/Signup'; // Import your new page

export default function App() {
  const [view, setView] = useState('signup'); // 'dashboard', 'signup', or 'login'
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState(shortNews[0].id);

  const activeArticle = useMemo(() => 
    shortNews.find((item) => item.id === activeId) ?? shortNews[0], 
    [activeId]
  );

  // Otherwise, show your existing Dashboard
  return (
    <Router>
      {view === 'login' && <Login setView={setView} />}
      {view === 'signup' ? (
        <Signup setView={setView} />
      ) : (
        <div className="app-shell">
          <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          <div className="app-main">
        <Header setMobileOpen={setMobileOpen} />
        <main className="content-area">
          <section className="feed-layout">
            {/* ... rest of your existing news code ... */}
            <div className="news-column">
               {/* Your existing News List logic here */}
               {shortNews.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    activeId={activeId}
                    onSelect={(id) => { setActiveId(id); setMobileOpen(false); }}
                  />
                ))}
            </div>
            <ArticlePanel article={activeArticle} />
          </section>
          <DashboardPanel />
        </main>
      </div>
    </div>
      )}
    </Router>
  );
}