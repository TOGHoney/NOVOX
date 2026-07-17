import { Routes, Route } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { FiMenu } from 'react-icons/fi';

import ArticlePanel from './components/ArticlePanel';
import DashboardPanel from './components/DashboardPanel';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import Sidebar from './components/Sidebar';

import { shortNews } from './data/mockData';
import Login from './pages/login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Articles from './pages/Articles';
import Debates from './pages/Debates';
import Progress from './pages/Progress';
import Profile from './pages/Profile';

export default function App() {
  const [view, setView] = useState('signup');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState(shortNews[0]?.id);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeArticle = useMemo(
    () => shortNews.find((item) => item.id === activeId) ?? shortNews[0],
    [activeId]
  );

  if (view === 'login') {
    return <Login setView={setView} />;
  }

  if (view === 'signup') {
    return <Signup setView={setView} />;
  }

  return (
    <div className={`app-shell ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <button
        className={`sidebar-toggle-btn ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label="Toggle navigation"
      >
        <FiMenu size={20} />
      </button>

      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="app-main">
        <Header setMobileOpen={setMobileOpen} />

        <main className="content-area">
          <section className="feed-layout">
            <div className="news-column">
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

            {activeArticle && <ArticlePanel article={activeArticle} />}
          </section>

          <DashboardPanel />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/debates" element={<Debates />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}