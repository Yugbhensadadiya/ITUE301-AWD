import React from 'react';
import { Link } from 'react-router-dom';

// Projects Page: Dedicated route for showcasing projects from Practical 1
function Projects({ projectList }) {
  return (
    <div className="page-container projects-page">
      <section className="portfolio-section">
        <div className="section-header">
          <span className="section-subtitle">Portfolio Showcase</span>
          <h2 className="section-title">My Projects</h2>
          <div className="section-divider"></div>
          <p className="section-lead">
            Explore key academic and industry projects built using modern web stacks and machine learning frameworks.
          </p>
        </div>

        <div className="projects-grid">
          {projectList.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-card-top">
                <span className="project-badge">{project.category}</span>
                <span className="project-number">0{project.id}</span>
              </div>

              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>

              <div className="project-highlights">
                {project.highlights.map((h, i) => (
                  <div key={i} className="highlight-item">
                    <span className="bullet">▹</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="project-tags">
                {project.technologies.map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Interested in collaborating or discussing any of these projects?
          </p>
          <Link to="/contact" className="btn-primary" style={{ backgroundColor: '#06b6d4' }}>
            Reach Out via Contact Page ➔
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Projects;
