import DashboardPanel from '../components/DashboardPanel';

export default function Progress() {
    return (
        <div className="progress-page">
            <div className="section-head" style={{ marginBottom: '2rem' }}>
                <div>
                    <p className="eyebrow">Learning dashboard</p>
                    <h2>Track your language acquisition progress</h2>
                </div>
            </div>
            <DashboardPanel />
        </div>
    );
}
