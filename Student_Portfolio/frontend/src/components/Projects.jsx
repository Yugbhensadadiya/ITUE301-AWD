import React from 'react';

// Post Laboratory Work: Projects component rendering projects passed as props
function Projects({ projectList }) {
  return (
    <section id="projects" className="portfolio-section">
      <div className="section-header">
        <span className="section-subtitle">Practical Showcase</span>
        <h2 className="section-title">Featured Projects</h2>
        <div className="section-divider"></div>
        <p className="section-lead">
          Reusable Card components receiving structured props data.
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
    </section>
  );
}

export default Projects;
