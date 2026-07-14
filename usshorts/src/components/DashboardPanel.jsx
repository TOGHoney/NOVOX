import { dashboardStats, leaderboard, quests, topics } from '../data/mockData';

export default function DashboardPanel() {
  return (
    <section className="dashboard-grid">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Learning dashboard</p>
            <h3>Weekly progress</h3>
          </div>
          <span className="pill success">On track</span>
        </div>
        <div className="stats-grid">
          {dashboardStats.map((item) => (
            <div className="stat-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.delta}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">This week</p>
            <h3>Quests</h3>
          </div>
        </div>
        <ul className="list">
          {quests.map((quest) => <li key={quest}>{quest}</li>)}
        </ul>
      </div>
      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Trending topics</p>
            <h3>Personalized focus</h3>
          </div>
        </div>
        <div className="topic-wrap">
          {topics.map((topic) => <span key={topic} className="topic-chip">{topic}</span>)}
        </div>
      </div>
      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Leaderboard</p>
            <h3>Community momentum</h3>
          </div>
        </div>
        <ul className="rank-list">
          {leaderboard.map((player, index) => (
            <li key={player.name}>
              <div>
                <strong>#{index + 1} {player.name}</strong>
                <span>{player.badge}</span>
              </div>
              <b>{player.xp} XP</b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}