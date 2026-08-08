import { Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Articles from './pages/Articles';
import Debates from './pages/Debates';
import DebateRoom from './pages/DebateRoom';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import { getUser } from './api/authService';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
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
              <Route path="/debates/:id" element={<DebateRoom />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}