export default function NotFound() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            width: '100vw',
            background: 'var(--bg, #0a0a0a)',
            color: 'var(--text, #fff)',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
        }}>
            <h1 style={{ fontSize: '6rem', fontWeight: 700, margin: 0, opacity: 0.15 }}>404</h1>
            <p style={{ fontSize: '1.25rem', margin: '0.5rem 0 0', opacity: 0.5 }}>Not Found</p>
        </div>
    );
}
