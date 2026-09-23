import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

/**
 * Practical 7: Signup / Registration Page Component
 * 
 * Features:
 * - Controlled inputs for Name, Email, Password, and Confirm Password.
 * - Client-side form validation (matching passwords, minimum length, email syntax).
 * - Submits registration data to Express backend (POST /register).
 * - Hashes password via bcryptjs in MongoDB.
 * - Navigates user to Login page upon successful creation.
 */
function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // 1. Validation Checks
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify and try again.');
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password
      });

      setSuccessMsg('Account created successfully! Redirecting to login...');

      // Redirect to login after brief delay to show success feedback
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Registration successful! Please sign in with your credentials.' }
        });
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <span className="auth-badge">New User Registration</span>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Sign up to access protected portfolio features and task management.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-alert auth-alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span className="alert-text">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="auth-alert auth-alert-success" role="alert">
            <span className="alert-icon">✓</span>
            <span className="alert-text">{successMsg}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="signup-name" className="form-label">
              Full Name <span className="required-star">*</span>
            </label>
            <input
              id="signup-name"
              type="text"
              className="form-input"
              placeholder="e.g. Yug Bhensadadiya"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoComplete="name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="signup-email" className="form-label">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              id="signup-email"
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

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="signup-password" className="form-label">
              Password <span className="required-star">*</span>
            </label>
            <input
              id="signup-password"
              type="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="signup-confirm-password" className="form-label">
              Confirm Password <span className="required-star">*</span>
            </label>
            <input
              id="signup-confirm-password"
              type="password"
              className="form-input"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
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
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account ➔'
            )}
          </button>
        </form>

        {/* Footer & Navigation Link */}
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
