import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../services/api';

/**
 * Practical 7: Login Page Component
 * 
 * Features:
 * - Controlled inputs for Email and Password.
 * - Client-side validation.
 * - Authenticates against Express backend (POST /login).
 * - Stores JWT token and user profile in localStorage.
 * - Redirects to target protected page or Home on success.
 */
function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after successful login
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({
        email: email.trim(),
        password
      });

      // Save JWT token and user details to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Notify parent App component to update auth state
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }

      // Navigate to destination
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <span className="auth-badge">Secure Authentication</span>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to access your portfolio and task management workspace.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="auth-alert auth-alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span className="alert-text">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="e.g. yug@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">
              Password <span className="required-star">*</span>
            </label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="primary-gradient-btn auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              'Sign In ➔'
            )}
          </button>
        </form>

        {/* Footer & Navigation Link */}
        <div className="auth-footer">
          <p>
            Don't have an account yet?{' '}
            <Link to="/signup" className="auth-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
