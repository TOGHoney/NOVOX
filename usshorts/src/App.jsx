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
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Articles from './pages/Articles';
import Debates from './pages/Debates';
import Progress from './pages/Progress';
import Profile from './pages/Profile';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <div className={`app-shell ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* Single fixed toggle button that blends with sidebar when open */}
      <button
        className={`sidebar-toggle-btn ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label="Toggle navigation"
      >
        <FiMenu size={20} />
      </button>

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="app-main">
        <Header />
        <main className="content-area">
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
      )}
    </Router>
  );
}