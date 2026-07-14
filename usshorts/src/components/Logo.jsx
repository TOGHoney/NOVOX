export default function Logo() {
  return (
    <div className="logo" aria-label="LinguaBrief logo">
      <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
        <rect x="6" y="8" width="36" height="28" rx="12" className="logo-shell" />
        <path d="M16 18h16M16 24h11M16 30h8" className="logo-lines" />
        <circle cx="34" cy="34" r="8" className="logo-orbit" />
      </svg>
      <div>
        <p>LinguaBrief</p>
        <span>Read. Learn. Speak.</span>
      </div>
    </div>
  );
}