import React from 'react';

/**
 * Reusable ErrorMessage Component
 * Displays a user-friendly error message when an API fetch fails,
 * along with a Retry button to re-trigger the API request,
 * and an optional button to load offline cached repositories.
 */
function ErrorMessage({ message, onRetry, onFallback }) {
  return (
    <div className="error-container" role="alert">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">Failed to Load Repositories</h3>
      <p className="error-message">
        {message || 'An unexpected error occurred while connecting to the GitHub API.'}
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {onRetry && (
          <button
            type="button"
            className="retry-btn"
            onClick={onRetry}
            title="Click to retry fetching repositories"
          >
            🔄 Retry Request
          </button>
        )}
        {onFallback && (
          <button
            type="button"
            className="retry-btn"
            onClick={onFallback}
            style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            title="Load sample repositories from cache"
          >
            📦 Load Cached Repositories
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
