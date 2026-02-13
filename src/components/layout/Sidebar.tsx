import { NavLink } from 'react-router-dom';
import { useTheme } from '../../theme/useTheme';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: '⚡' },
  { to: '/price-demand', label: 'Price & Demand', icon: '📈' },
  { to: '/fuel-mix', label: 'Fuel Mix', icon: '🔥' },
  { to: '/renewables', label: 'Renewables', icon: '🌱' },
  { to: '/interconnectors', label: 'Interconnectors', icon: '🔗' },
  { to: '/historical', label: 'Historical', icon: '📊' },
];

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">
          <span className="logo-icon">⚡</span>
          AEMOVis
        </h1>
        <span className="sidebar-subtitle">Energy Dashboard</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={to === '/'}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? '☀️' : '🌙'} {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
        <span className="sidebar-credit">Data: AEMO Public API</span>
      </div>
    </aside>
  );
}
