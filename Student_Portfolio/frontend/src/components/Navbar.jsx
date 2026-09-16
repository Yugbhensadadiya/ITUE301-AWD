import React from 'react';

function Navbar({ activeSection, setActiveSection, studentName }) {
  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-brand">
          <span className="brand-logo">YB</span>
          <div className="brand-text">
            <span className="brand-name">Yug Bhensadadiya Portfolio</span>
          </div>
        </div>

        <nav className="nav-links">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-badge">
          <span className="status-dot"></span>
          <span>React 19 + Vite</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
