import { useLocation } from 'react-router-dom';
import { FiBell, FiGlobe, FiSearch } from 'react-icons/fi';

export default function Header() {
  const location = useLocation();

  // ONLY render header on Home page ('/')
  if (location.pathname !== '/') {
    return null;
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <p className="eyebrow">Today's learning feed</p>
          <h1>Read global news in the language you want to master</h1>
        </div>
      </div>

      <div className="topbar-actions">
        <label className="search-box" htmlFor="search-news">
          <FiSearch />
          <input
            id="search-news"
            type="text"
            placeholder="Search topic, word, or country"
          />
        </label>
        <button className="icon-btn" aria-label="Switch language pair">
          <FiGlobe />
        </button>
        <button className="icon-btn" aria-label="Notifications">
          <FiBell />
        </button>
      </div>
    </header>
  );
}