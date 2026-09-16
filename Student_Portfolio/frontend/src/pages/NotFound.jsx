import React from 'react';
import { Link } from 'react-router-dom';

// 404 Not Found Page Component
function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-code">404</div>
      <h2 className="notfound-title">Page Not Found</h2>
      <p className="notfound-desc">
        Oops! The page you are looking for doesn't exist or has been moved.
        Use client-side routing to navigate back safely.
      </p>
      <Link to="/" className="btn-primary" style={{ backgroundColor: '#06b6d4' }}>
        ← Return to Home
      </Link>
    </div>
  );
}

export default NotFound;
