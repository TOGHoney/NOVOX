import { FiBookOpen, FiClock, FiGlobe } from 'react-icons/fi';
export default function NewsCard({ article, activeId, onSelect }) {
  const isActive = activeId === article.id;

  return (
    <article className={`news-card ${isActive ? 'selected' : ''}`}>
      <div className="news-meta-row">
        <span className="pill">{article.category}</span>
        <span className="muted">{article.level}</span>
      </div>
      <h3>{article.title}</h3>
      <p>{article.summary}</p>
      <div className="news-meta-grid">
        <span><FiGlobe /> {article.language}</span>
        <span><FiClock /> {article.readTime}</span>
        <span><FiBookOpen /> {article.progressTag}</span>
      </div>
      <button className="primary-btn" onClick={() => onSelect(article.id)}>
        {isActive ? 'Reading now' : 'Open article'}
      </button>
    </article>
  );
}