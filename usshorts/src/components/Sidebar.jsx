import { FiAward, FiBookOpen, FiCompass, FiHome, FiMessageCircle, FiUser } from 'react-icons/fi';
import Logo from './Logo';

const items = [
  { label: 'Home', icon: FiHome },
  { label: 'Explore', icon: FiCompass },
  { label: 'Articles', icon: FiBookOpen },
  { label: 'Debates', icon: FiMessageCircle },
  { label: 'Progress', icon: FiAward },
  { label: 'Profile', icon: FiUser }
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  return (
    <>
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <Logo />
        <nav aria-label="Primary navigation">
          {items.map(({ label, icon: Icon }, index) => (
            <button key={label} className={`nav-item ${index === 0 ? 'active' : ''}`}>
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-card">
          <p>Language pair</p>
          <strong>Hindi → Japanese</strong>
          <span>Context-based news practice</span>
        </div>
      </aside>
      {mobileOpen && <button className="backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    </>
  );
}