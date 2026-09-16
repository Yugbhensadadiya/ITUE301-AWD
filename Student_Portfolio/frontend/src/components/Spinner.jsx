import React from 'react';

/**
 * Reusable Spinner Component
 * Displays a clean animated CSS spinner while asynchronous API data is loading.
 */
function Spinner({ message = 'Loading repositories from GitHub...' }) {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="loading-spinner"></div>
      <p className="spinner-text">{message}</p>
    </div>
  );
}

export default Spinner;
