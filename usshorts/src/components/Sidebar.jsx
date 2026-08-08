import { NavLink, useNavigate } from 'react-router-dom';
import { FiAward, FiLogOut, FiBookOpen, FiCompass, FiHome, FiMessageCircle, FiUser } from 'react-icons/fi';
import Logo from './Logo';

const items = [
  { label: 'Home', icon: FiHome, path: '/' },
  { label: 'Explore', icon: FiCompass, path: '/explore' },
  { label: 'Articles', icon: FiBookOpen, path: '/articles' },
  { label: 'Debates', icon: FiMessageCircle, path: '/debates' },
  { label: 'Progress', icon: FiAward, path: '/progress' },
  { label: 'Profile', icon: FiUser, path: '/profile' }
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate=useNavigate();
  const logout=()=>{
    localStorage.removeItem('user');
    navigate('/login');
  }
  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo with left padding to clear the fixed toggle button */}
        <div style={{ paddingLeft: '48px' }}>
          <Logo />
        </div>
        <nav aria-label="Primary navigation">
          {items.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (window.innerWidth <= 900) {
                  setSidebarOpen(false);
                }
              }}
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="nav-item" onClick={logout}>
          <FiLogOut/>
          <span>Logout</span>
        </button>

        <div className="sidebar-card">
          <p>Language pair</p>
          <strong>Hindi → Japanese</strong>
          <span>Context-based news practice</span>
        </div>
      </aside>
      {sidebarOpen && window.innerWidth <= 900 && (
        <button className="backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  );
}