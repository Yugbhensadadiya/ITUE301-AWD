import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import TaskManager from './TaskManager';

/**
 * Projects Page: Full Stack Integration (Practical 6) & GitHub Repos (Practical 3)
 *
 * Defaults to Practical 6 Full Stack MongoDB Task Manager as required by syllabus:
 * "Replace the GitHub repo data from Practical 3 with task data from your own backend."
 */
function Projects({ projectList }) {
  // Tab State: 'tasks' (Practical 6 MongoDB Integration) vs 'repos' (Practical 3 GitHub API)
  const [activeTab, setActiveTab] = useState('tasks');

  // Required State 1: Repositories fetched from GitHub REST API
  const [repos, setRepos] = useState([]);

  // Required State 2: Loading indicator state (true while network request is active)
  const [loading, setLoading] = useState(true);

  // Required State 3: Error state (stores error message string if request fails)
  const [error, setError] = useState(null);

  // State 4: Controlled input state for filtering repositories by name
  const [searchTerm, setSearchTerm] = useState('');

  // Fallback repositories data (Yug's actual GitHub repos) in case of offline / rate-limit
  const fallbackRepos = [
    {
      id: 1198035060,
      name: 'civic-backend',
      html_url: 'https://github.com/Yugbhensadadiya/civic-backend',
      description: 'Backend REST API services for Civic Complaint System built with Python, FastAPI, and PostgreSQL.',
      stargazers_count: 0,
      language: 'Python',
    },
    {
      id: 1199046200,
      name: 'civic-frontend',
      html_url: 'https://github.com/Yugbhensadadiya/civic-frontend',
      description: 'Full Stack Citizen & Admin portal built with Next.js, React, and TailwindCSS.',
      stargazers_count: 0,
      language: 'TypeScript',
    },
    {
      id: 1205011400,
      name: 'ITUE301-AWD',
      html_url: 'https://github.com/Yugbhensadadiya/ITUE301-AWD',
      description: 'Advanced Web Development course practicals, React portfolio, and Express backend projects.',
      stargazers_count: 1,
      language: 'JavaScript',
    },
    {
      id: 1206124500,
      name: 'DataSense-Analytics',
      html_url: 'https://github.com/Yugbhensadadiya',
      description: 'Data analytics engine with FastAPI and Pandas built during 9SERIES internship.',
      stargazers_count: 0,
      language: 'Python',
    },
  ];

  // API Fetch Function: Asynchronous request using native Fetch API
  const fetchRepos = async () => {
    // 1. Enter Loading State: reset error and turn on spinner
    setLoading(true);
    setError(null);

    try {
      // 2. Fetch public repository data from GitHub REST API
      const response = await fetch(
        'https://api.github.com/users/Yugbhensadadiya/repos?sort=updated'
      );

      // Check HTTP status (200-299 is success)
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded (60 requests/hour limit for unauthenticated requests).');
        }
        throw new Error(`GitHub API error: ${response.status} ${response.statusText || 'Error'}`);
      }

      // 3. Parse JSON and update Success State
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setRepos(data);
      } else {
        setRepos(fallbackRepos);
      }
    } catch (err) {
      // 4. Update Error State if network or HTTP request fails
      console.error('Failed to fetch repositories:', err);
      const isNetworkError = err.message.includes('Failed to fetch');
      setError(
        isNetworkError
          ? 'Network error: Failed to connect to GitHub API. (You may be offline, an adblocker blocked api.github.com, or GitHub rate-limited your IP).'
          : err.message
      );
    } finally {
      // 5. Exit Loading State regardless of success or failure
      setLoading(false);
    }
  };

  // Helper to load offline fallback repositories during viva or network outages
  const loadFallback = () => {
    setRepos(fallbackRepos);
    setError(null);
    setLoading(false);
  };

  /**
   * useEffect Hook:
   * The empty dependency array [] ensures this effect runs ONLY ONCE
   * when the Projects component mounts (equivalent to componentDidMount).
   */
  useEffect(() => {
    fetchRepos();
  }, []);

  // Filter repositories dynamically based on user search term
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container projects-page">
      {/* Practical Switcher Navigation Banner */}
      <div className="practical-tab-switcher">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'tasks' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <span className="tab-pill-badge">Practical 6</span>
          <span className="tab-btn-title">Full Stack Task Manager (MongoDB Backend)</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'repos' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('repos')}
        >
          <span className="tab-pill-badge tab-pill-muted">Practical 3</span>
          <span className="tab-btn-title">GitHub Live Repositories (REST API Fetch)</span>
        </button>
      </div>

      {/* Conditionally Render Practical 6 (Default) or Practical 3 */}
      {activeTab === 'tasks' ? (
        <TaskManager />
      ) : (
        <section className="portfolio-section">
          {/* Section Header */}
          <div className="section-header">
            <span className="section-subtitle">Practical 3 • REST API Integration</span>
            <h2 className="section-title">GitHub Live Repositories</h2>
            <div className="section-divider"></div>
            <p className="section-lead">
              Demonstrating asynchronous data fetching with <code>useEffect</code>, <code>fetch()</code>,
              and state-driven conditional rendering (Loading, Success, Error).
            </p>
          </div>

          {/* ================================================================
              Live GitHub Repositories Section (API Showcase)
              ================================================================ */}
          <div className="api-showcase-container">
          {/* Search Input Bar (Placed above repository list) */}
          <div className="repo-search-bar">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="repo-search-input"
                placeholder="Search repositories by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading || error !== null}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {!loading && !error && (
              <div className="repo-count-badge">
                Showing <strong>{filteredRepos.length}</strong> of <strong>{repos.length}</strong> Repositories
              </div>
            )}
          </div>

          {/* 1. Loading State: Render Spinner while fetching */}
          {loading && (
            <Spinner message="Connecting to GitHub REST API and loading repositories..." />
          )}

          {/* 2. Error State: Render ErrorMessage with Retry Button if fetch fails */}
          {!loading && error && (
            <ErrorMessage
              message={error}
              onRetry={fetchRepos}
              onFallback={loadFallback}
            />
          )}

          {/* 3. Success State: Render dynamic repository cards */}
          {!loading && !error && (
            <>
              {filteredRepos.length > 0 ? (
                <div className="repos-grid">
                  {filteredRepos.map((repo) => (
                    <div key={repo.id} className="repo-card">
                      <div className="repo-card-header">
                        {/* Repository Name */}
                        <h3 className="repo-name">
                          <span className="repo-icon">📁</span>
                          {repo.name}
                        </h3>

                        {/* Repository Star Count */}
                        <div className="repo-stars" title={`${repo.stargazers_count} stars on GitHub`}>
                          <span className="star-icon">⭐</span>
                          <span className="star-count">{repo.stargazers_count}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="repo-description">
                        {repo.description || 'No description provided for this repository.'}
                      </p>

                      <div className="repo-card-footer">
                        {/* Primary Language */}
                        {repo.language && (
                          <span className="repo-lang-tag">
                            <span className={`lang-dot lang-${repo.language.toLowerCase().replace(/[^a-z0-9]/g, '')}`}></span>
                            {repo.language}
                          </span>
                        )}

                        {/* Repository URL (Clickable link, opens in new tab) */}
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="repo-link-btn"
                        >
                          View on GitHub ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results-box">
                  <p>🔍 No repositories found matching "<strong>{searchTerm}</strong>".</p>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setSearchTerm('')}
                    style={{ marginTop: '12px' }}
                  >
                    Clear Search Filter
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ================================================================
            Practical 1 & 2 Featured Academic Projects (Preserved)
            ================================================================ */}
        {projectList && projectList.length > 0 && (
          <div className="academic-projects-section" style={{ marginTop: '64px' }}>
            <div className="section-header">
              <span className="section-subtitle">Academic Showcase</span>
              <h2 className="section-title">Featured Portfolio Projects</h2>
              <div className="section-divider"></div>
              <p className="section-lead">
                Curated full-stack web platforms and backend architecture projects from Practical 1.
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
          </div>
        )}

        {/* Bottom CTA to Contact Page */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Want to collaborate on any project or discuss ideas?
          </p>
          <Link to="/contact" className="btn-primary" style={{ backgroundColor: 'var(--accent-primary)' }}>
            Reach Out via Contact Page ➔
          </Link>
        </div>
      </section>
      )}
    </div>
  );
}

export default Projects;
