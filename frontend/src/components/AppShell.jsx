import { Activity, ClipboardCheck, Map, Radio, ScrollText, ShieldAlert } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Command center', icon: Activity, end: true },
  { to: '/reports', label: 'Incoming reports', icon: Radio },
  { to: '/review', label: 'Verify', icon: ClipboardCheck },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/audit', label: 'History', icon: ScrollText },
];

export default function AppShell() {
  return (
    <div className="ops-shell">
      <aside className="ops-sidebar">
        <div className="ops-brand">
          <div className="ops-brand-mark"><ShieldAlert aria-hidden="true" size={19} /></div>
          <div><strong>RESQMAP</strong><span>Response network</span></div>
        </div>
        <nav aria-label="Primary navigation" className="ops-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink end={end} key={to} to={to} className={({ isActive }) => 'ops-nav-link' + (isActive ? ' ops-nav-link--active' : '')}>
              <Icon aria-hidden="true" size={17} strokeWidth={1.9} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="ops-sidebar-footer">
          <div className="ops-connection"><span aria-hidden="true" /> Operational</div>
          <div className="ops-operator"><span>DO</span><div><strong>Demo operator</strong><small>Coordination desk</small></div></div>
        </div>
      </aside>
      <main className="ops-main"><Outlet /></main>
    </div>
  );
}
