import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Practical 7: Protected Route Component
 * 
 * Objective:
 * Guards application routes against unauthenticated access.
 * 
 * Behavior:
 * - Checks if a valid JWT token exists in localStorage.
 * - If token exists: Renders child components.
 * - If token is missing: Redirects user to /login with state preserved.
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Redirect unauthenticated visitor to /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
