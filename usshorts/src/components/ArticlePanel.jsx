import { FiBookmark, FiMic, FiPlayCircle, FiGlobe } from 'react-icons/fi';

export default function ArticlePanel({ article }) {
  return (
    <section className="article-panel">
      <div className="article-toolbar">
        <span className="pill soft">Full article</span>
        <div className="toolbar-actions">
          <button className="ghost-btn"><FiGlobe /> Translate</button>
          <button className="ghost-btn"><FiBookmark /> Save words</button>
          <button className="ghost-btn"><FiMic /> Discuss</button>
        </div>
      </div>
      <div className="article-body">
        <p className="eyebrow">{article.language} article · Preferred language: {article.targetLanguage}</p>
        <h2>{article.title}</h2>
        <p>{article.fullArticle}</p>
        <div className="translation-box">
          <div>
            <span className="mini-label">Instant context translation</span>
            <h4>Selected phrase</h4>
            <p>“Contextual overlays make difficult stories easier to understand.”</p>
          </div>
          <div>
            <span className="mini-label">Preferred language meaning</span>
            <p>“Sandarbh ke saath diya gaya arth kathin samachar ko samajhna aasaan bana deta hai.”</p>
          </div>
        </div>
        <div className="discussion-card">
          <div>
            <span className="mini-label">Speaking practice room</span>
            <h4>Today’s debate prompt</h4>
            <p>Do translation tools improve language fluency, or do they make learners too dependent?</p>
          </div>
          <button className="primary-btn secondary-tone"><FiPlayCircle /> Join room</button>
        </div>
      </div>
    </section>
  );
}