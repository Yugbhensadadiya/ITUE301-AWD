import React from 'react';

function About({ summary, education, experience, strengths }) {
  return (
    <section id="about" className="portfolio-section">
      <div className="section-header">
        <span className="section-subtitle">Background</span>
        <h2 className="section-title">About Me</h2>
        <div className="section-divider"></div>
      </div>

      <div className="about-grid">
        <div className="about-card main-summary">
          <div className="card-icon">🚀</div>
          <h3>Professional Summary</h3>
          <p className="summary-text">{summary}</p>

          <div className="strengths-box">
            <h4>Key Strengths</h4>
            <div className="tags-cloud">
              {strengths.map((strength, index) => (
                <span key={index} className="strength-chip">
                  ✓ {strength}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="about-side-column">
          <div className="about-card">
            <div className="card-icon">🎓</div>
            <h3>Education</h3>
            <div className="timeline-item">
              <h4 className="degree-title">{education.degree}</h4>
              <p className="institution">{education.university}</p>
              <span className="timeline-badge">{education.status}</span>
            </div>
          </div>

          <div className="about-card">
            <div className="card-icon">💼</div>
            <h3>Internship Experience</h3>
            <div className="timeline-item">
              <h4 className="role-title">{experience.role}</h4>
              <p className="company">{experience.company}</p>
              <p className="project-highlight">
                <strong>Project:</strong> {experience.project}
              </p>
              <p className="exp-desc">{experience.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
