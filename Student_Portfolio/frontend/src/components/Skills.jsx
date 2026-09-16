import React, { useState } from 'react';

// Skills component satisfies Step 4: accepts props array and renders dynamically using map()
function Skills({ skillList, categorizedSkills }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = categorizedSkills ? Object.keys(categorizedSkills) : [];

  return (
    <section id="skills" className="portfolio-section">
      <div className="section-header">
        <span className="section-subtitle">Technical Proficiency</span>
        <h2 className="section-title">Skills & Technologies</h2>
        <div className="section-divider"></div>
        <p className="section-lead">
          Dynamic component rendering via React props array and categorized modules.
        </p>
      </div>

      {/* Category filter tabs */}
      {categorizedSkills && (
        <div className="skills-filter-bar">
          <button
            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Skills ({skillList.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Render skills based on active view */}
      {activeCategory === 'all' ? (
        <div className="skills-grid-container">
          <div className="skills-card lab-spec-card">
            <div className="skills-spec-badge">
              <span>📋 Step 4 Implementation: Dynamic &lt;ul&gt; &amp; &lt;li&gt; map</span>
            </div>
            {/* Direct Step 4 implementation: unordered list mapped from skillList prop */}
            <ul className="skill-dynamic-list">
              {skillList.map((skill, index) => (
                <li key={skill} className="skill-pill-item">
                  <span className="skill-index">#{index + 1}</span>
                  <span className="skill-text">{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="categorized-skills-view">
          <div className="category-group-card">
            <h3 className="category-title">{activeCategory.toUpperCase()}</h3>
            <ul className="skill-dynamic-list">
              {categorizedSkills[activeCategory]?.map((skill) => (
                <li key={skill} className="skill-pill-item highlighted">
                  <span className="skill-check">✦</span>
                  <span className="skill-text">{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

export default Skills;
