import React from 'react';
import { NavLink, Link } from 'react-router-dom';

// Reusable NavBar component implementing React Router navigation and Theme toggle
function NavBar({ isDarkMode, setIsDarkMode }) {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand logo navigates to Home without page reload */}
        <Link to="/" className="navbar-brand">
          <span className="brand-logo">YB</span>
          <div className="brand-text">
            <span className="brand-name">Yug Bhensadadiya</span>
          </div>
        </Link>

        {/* Client-side navigation using NavLink from react-router-dom (no anchor tags) */}
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Tasks (P6)
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Projects
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Contact
          </NavLink>
        </nav>

        {/* Theme Toggle & Badge */}
        <div className="nav-actions">
          {/* Light/Dark mode toggle button using useState */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          <div className="nav-badge">
            <span className="status-dot"></span>
            <span>React Router v6</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
