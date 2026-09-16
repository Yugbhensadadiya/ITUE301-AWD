import React, { useState } from 'react';

/**
 * Contact Page Component
 * Demonstrates Practical 2 State Management:
 * 1. Controlled Form Input (message) using useState hook.
 * 2. Real-time live message preview and dynamic character counter.
 * 3. Conditional UI visibility toggle (showContactInfo) using second useState hook.
 */
function Contact({ studentProfile }) {
  // State 1: Controlled input state for user message
  const [message, setMessage] = useState('');

  // State 2: Boolean state to toggle visibility of contact details
  const [showContactInfo, setShowContactInfo] = useState(true);

  // Optional extra state: Quick Help / Guidance message toggle
  const [showHelp, setShowHelp] = useState(false);

  // Optional: Controlled sender name
  const [senderName, setSenderName] = useState('');

  return (
    <div className="page-container contact-page">
      <section className="portfolio-section">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-subtitle">Get In Touch</span>
          <h2 className="section-title">Contact &amp; Feedback</h2>
          <div className="section-divider"></div>
          <p className="section-lead">
            Demonstrating React controlled input state and conditional UI rendering.
          </p>
        </div>

        <div className="contact-container">
          {/* Card 1: Controlled Input Form & Real-time Sync */}
          <div className="contact-card">
            <span className="viva-badge">State Variable 1: Controlled Input</span>
            <h3 className="card-heading">Send a Direct Message</h3>
            <p className="card-subtext">
              Type a message below. The text is stored in React state and synced in real time.
            </p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="sender-name" className="form-label">
                  Your Name:
                </label>
                <input
                  id="sender-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex Smith"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message" className="form-label">
                  Your Message:
                </label>
                {/* Controlled textarea bound to 'message' state */}
                <textarea
                  id="contact-message"
                  className="form-textarea"
                  rows="4"
                  placeholder="Type your message here to see live state preview..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                {/* Live Character Count Requirement */}
                <div className="char-counter-bar">
                  <span>Dynamic Counter</span>
                  <span className="char-counter-badge">
                    {message.length} characters
                  </span>
                </div>
              </div>

              {/* Quick clear button */}
              {message.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMessage('')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    marginTop: '4px',
                  }}
                >
                  Clear Message
                </button>
              )}
            </form>

            {/* Real-Time Live Message Preview */}
            <div className="preview-box">
              <div className="preview-header">
                <span className="preview-pulse"></span>
                <span>Live State Preview (Synced in Real Time)</span>
              </div>
              {senderName && (
                <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                  From: {senderName}
                </p>
              )}
              {message ? (
                <p className="preview-content">"{message}"</p>
              ) : (
                <p className="preview-placeholder">
                  Your typed message will appear here as you type...
                </p>
              )}
            </div>
          </div>

          {/* Card 2: UI Visibility Toggling using useState */}
          <div className="contact-card">
            <span className="viva-badge">State Variable 2: UI Visibility Toggle</span>
            <h3 className="card-heading">Contact Information</h3>
            <p className="card-subtext">
              Click the button below to dynamically show or hide the contact details.
            </p>

            {/* Toggle Button for Contact Info */}
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShowContactInfo(!showContactInfo)}
            >
              <span>{showContactInfo ? '👁️ Hide Contact Information' : '👁️ Show Contact Information'}</span>
            </button>

            {/* Conditional Rendering based on showContactInfo state */}
            {showContactInfo ? (
              <div className="toggleable-details">
                <div className="info-row">
                  <span className="info-icon">👤</span>
                  <span className="info-label">Name:</span>
                  <span className="info-value">{studentProfile?.name || 'Yug Bhensadadiya'}</span>
                </div>
                <div className="info-row">
                  <span className="info-icon">📧</span>
                  <span className="info-label">Email:</span>
                  <span className="info-value">yugbhensadadiya@gmail.com</span>
                </div>
                <div className="info-row">
                  <span className="info-icon">🎓</span>
                  <span className="info-label">University:</span>
                  <span className="info-value">CHARUSAT University</span>
                </div>
                <div className="info-row">
                  <span className="info-icon">📍</span>
                  <span className="info-label">Location:</span>
                  <span className="info-value">Gujarat, India</span>
                </div>
                <div className="info-row">
                  <span className="info-icon">💼</span>
                  <span className="info-label">LinkedIn:</span>
                  <a
                    href="https://www.linkedin.com/in/yug-bhensadadiya"
                    target="_blank"
                    rel="noreferrer"
                    className="info-value"
                    style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}
                  >
                    linkedin.com/in/yug-bhensadadiya
                  </a>
                </div>
                <div className="info-row">
                  <span className="info-icon">🐙</span>
                  <span className="info-label">GitHub:</span>
                  <a
                    href="https://github.com/YugBhensadadiya"
                    target="_blank"
                    rel="noreferrer"
                    className="info-value"
                    style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}
                  >
                    github.com/YugBhensadadiya
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '20px', padding: '16px', border: '1px dashed var(--border-color)', borderRadius: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>
                Contact information is currently hidden. Click the button above to view.
              </div>
            )}

            {/* Additional Help Message Toggle */}
            <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-emerald)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{showHelp ? '▾ Close Help Hint' : '▸ Need Help / Viva Note?'}</span>
              </button>

              {showHelp && (
                <div className="help-box">
                  💡 <strong>Viva Concept Note:</strong> In React, a controlled component is one where form data is handled by a React component via <code>useState</code>. Every keystroke triggers an <code>onChange</code> event, updating state, which triggers a re-render showing the live message preview and character count.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
