import { NavLink, Outlet } from 'react-router-dom';

const nav = [
  ['/', 'Overview'], ['/reports', 'Incoming Reports'], ['/review', 'LINK / CREATE / HOLD'], ['/map', 'Disaster Map'], ['/audit', 'Audit History']
];

export default function AppShell() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">RQ</div><div><strong>ResQMap</strong><span>Decision Intelligence</span></div></div>
        <nav aria-label="Primary navigation">
          {nav.map(([to,label]) => <NavLink end={to === '/'} key={to} to={to} className={({isActive}) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>{label}</NavLink>)}
        </nav>
        <div className="sidebar-note"><span className="eyebrow">Architecture</span><strong>Separate API backend</strong><p>React stays presentation-only. Firebase Admin and Firestore access live on the server.</p></div>
      </aside>
      <div className="app-main">
        <header className="topbar"><div><span className="topbar-dot" /> Operations workspace <span className="topbar-context">/ Live response</span></div><div className="operator-chip"><span>DO</span> Demo Operator</div></header>
        <main><Outlet /></main>
      </div>
    </div>
  );
}
