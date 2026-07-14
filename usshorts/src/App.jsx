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

  return (
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
  );
}