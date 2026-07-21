import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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