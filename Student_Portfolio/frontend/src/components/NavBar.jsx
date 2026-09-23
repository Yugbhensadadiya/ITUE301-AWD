import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

/**
 * Reusable NavBar component implementing React Router v6 navigation,
 * Theme toggle, and Practical 7 Authentication Status / Logout.
 */
function NavBar({ isDarkMode, setIsDarkMode, currentUser, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const isAuthenticated = Boolean(currentUser || localStorage.getItem('token'));

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand logo navigates to Home if authenticated, else Login */}
        <Link to={isAuthenticated ? '/' : '/login'} className="navbar-brand">
          <span className="brand-logo">YB</span>
          <div className="brand-text">
            <span className="brand-name">Yug Bhensadadiya</span>
          </div>
        </Link>

        {/* Client-side navigation: show protected pages if authenticated */}
        <nav className="nav-links">
          {isAuthenticated ? (
            <>
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
                Tasks
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
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>

        {/* Theme Toggle, User Profile Badge & Logout */}
        <div className="nav-actions">
          {/* Light/Dark mode toggle button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          {/* User profile & Logout when logged in */}
          {isAuthenticated ? (
            <div className="user-nav-box">
              <span className="user-greeting" title={currentUser?.email || ''}>
                👤 {currentUser?.name ? currentUser.name.split(' ')[0] : 'User'}
              </span>
              <button
                type="button"
                className="logout-btn"
                onClick={handleLogoutClick}
                title="Sign out of your session"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <div className="nav-badge">
              <span className="status-dot"></span>
              <span>Secure Portal</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavBar;
