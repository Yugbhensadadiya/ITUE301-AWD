import React from 'react';

function Header({ name, role, university, themeColor, targetRoles }) {
  // Theme color prop applied as inline style as required by supplementary problem
  const headerStyle = {
    borderColor: themeColor,
    boxShadow: `0 20px 40px -15px ${themeColor}25`,
  };

  const accentBadgeStyle = {
    backgroundColor: `${themeColor}15`,
    color: themeColor,
    borderColor: `${themeColor}40`,
  };

  return (
    <section className="hero-section" style={headerStyle}>
      <div className="hero-content">
        <div className="hero-badge" style={accentBadgeStyle}>
          <span className="pulse-icon">⚡</span>
          <span>CO1 / PO3, PO5 • React Component Architecture</span>
        </div>

        <h1 className="hero-title">
          Hi, I'm <span className="highlight-name" style={{ color: themeColor }}>{name}</span>
        </h1>

        <p className="hero-role">
          {role}
        </p>

        <p className="hero-university">
          🎓 <strong>{university}</strong> | Department of Information Technology
        </p>

        {targetRoles && targetRoles.length > 0 && (
          <div className="target-roles-wrapper">
            <span className="roles-label">Focus Areas:</span>
            <div className="roles-tags">
              {targetRoles.map((r, idx) => (
                <span key={idx} className="role-tag">
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="hero-actions">
          <a href="#projects" className="btn-primary" style={{ backgroundColor: themeColor }}>
            View My Projects
          </a>
          <a href="#skills" className="btn-secondary">
            Explore Skills
          </a>
          <a href="#contact" className="btn-outline">
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
}

export default Header;
