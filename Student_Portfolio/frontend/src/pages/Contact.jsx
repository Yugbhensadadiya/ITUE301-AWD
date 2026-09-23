import React, { useState } from 'react';

/**
 * Contact Page Component
 * 
 * Practical 2 & Practical 5 Integration:
 * 1. Practical 2: Controlled Form Inputs (name & message) using useState.
 * 2. Practical 2: Dynamic Character Counter & Live Synchronous Preview.
 * 3. Practical 2: Conditional UI visibility toggle (Contact Details & Viva Note).
 * 4. Practical 5 Extension: Direct MongoDB Integration via Express REST API.
 *    - Sends POST http://localhost:5000/tasks
 *    - Persists document in MongoDB Compass (taskmanager.tasks)
 *    - Frontend validation & clean error/success state handling.
 */
function Contact({ studentProfile }) {
  // Practical 2 - State 1: Controlled input state for user message
  const [message, setMessage] = useState('');

  // Practical 2 - State 2: Controlled sender name
  const [senderName, setSenderName] = useState('');

  // Practical 2 - State 3: Boolean state to toggle visibility of contact details
  const [showContactInfo, setShowContactInfo] = useState(true);

  // Practical 2 - State 4: Quick Help / Guidance message toggle
  const [showHelp, setShowHelp] = useState(false);

  // Practical 5 Extension State: Submission loading, status message, and validation errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [validationErrors, setValidationErrors] = useState({ name: '', message: '' });

  /**
   * Practical 5 Handler: Send POST request to Express API to save data to MongoDB.
   * Target endpoint: POST http://localhost:5000/tasks
   * Payload: { title: senderName, description: message }
   */
  const handleSaveToMongoDB = async (e) => {
    e.preventDefault();

    // Reset previous notifications
    setStatusMessage({ text: '', type: '' });

    // Step 1: Frontend Validation (Name and Message cannot be empty)
    const errors = {};
    if (!senderName || senderName.trim() === '') {
      errors.name = 'Name is required.';
    }
    if (!message || message.trim() === '') {
      errors.message = 'Message is required.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setStatusMessage({
        text: 'Please provide both Name and Message before saving.',
        type: 'error'
      });
      return;
    }

    setValidationErrors({ name: '', message: '' });
    setIsSubmitting(true);

    try {
      // Step 2: Send POST request to backend Express API
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: senderName.trim(),
          description: message.trim()
        })
      });

      const data = await response.json();

      // Step 3: Handle API Error Responses
      if (!response.ok) {
        throw new Error(data.error || `Server responded with HTTP status ${response.status}`);
      }

      // Step 4: Handle Successful Persistence
      setStatusMessage({
        text: 'Message sent successfully! Thank you for reaching out.',
        type: 'success'
      });

      // Clear both form fields and reset character counter
      setSenderName('');
      setMessage('');

    } catch (err) {
      console.error('MongoDB Submission Error:', err);
      const isNetworkError = err.message.includes('Failed to fetch') || err.message.includes('NetworkError');
      setStatusMessage({
        text: isNetworkError
          ? 'Unable to connect to backend server at http://localhost:5000. Please ensure the Express server is running (npm start).'
          : `Error: ${err.message}`,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to clear form and reset state
  const handleClearForm = () => {
    setSenderName('');
    setMessage('');
    setValidationErrors({ name: '', message: '' });
    setStatusMessage({ text: '', type: '' });
  };

  return (
    <div className="page-container contact-page">
      <section className="portfolio-section">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-subtitle">Get In Touch</span>
          <h2 className="section-title">Contact &amp; Connect</h2>
          <div className="section-divider"></div>
          <p className="section-lead">
            Have a question, opportunity, or project idea? Feel free to reach out using the form below.
          </p>
        </div>

        <div className="contact-container">
          {/* Card 1: Controlled Input Form */}
          <div className="contact-card">
            <span className="viva-badge">Direct Message</span>
            <h3 className="card-heading">Send a Direct Message</h3>
            <p className="card-subtext">
              Type your name and message below to get in touch.
            </p>

            {/* Status Alert Notification (Success / Error) */}
            {statusMessage.text && (
              <div
                className={`mongo-status-alert ${
                  statusMessage.type === 'success' ? 'status-success' : 'status-error'
                }`}
                role="alert"
              >
                <span className="status-icon">
                  {statusMessage.type === 'success' ? '✅' : '⚠️'}
                </span>
                <span className="status-text">{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveToMongoDB}>
              {/* Name Input */}
              <div className="form-group">
                <label htmlFor="sender-name" className="form-label">
                  Your Name: <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="sender-name"
                  type="text"
                  className={`form-input ${validationErrors.name ? 'input-error' : ''}`}
                  placeholder="e.g. Yug Bhensadadiya"
                  value={senderName}
                  onChange={(e) => {
                    setSenderName(e.target.value);
                    if (validationErrors.name) setValidationErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  disabled={isSubmitting}
                />
                {validationErrors.name && (
                  <span className="field-error-text">{validationErrors.name}</span>
                )}
              </div>

              {/* Message Textarea */}
              <div className="form-group">
                <label htmlFor="contact-message" className="form-label">
                  Your Message: <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  id="contact-message"
                  className={`form-textarea ${validationErrors.message ? 'input-error' : ''}`}
                  rows="4"
                  placeholder="Type your message here (e.g. Hello MongoDB)..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (validationErrors.message) setValidationErrors((prev) => ({ ...prev, message: '' }));
                  }}
                  disabled={isSubmitting}
                />

                {/* Dynamic Character Counter (Practical 2 Requirement) */}
                <div className="char-counter-bar">
                  <span>Dynamic Counter</span>
                  <span className="char-counter-badge">
                    {message.length} characters
                  </span>
                </div>
                {validationErrors.message && (
                  <span className="field-error-text">{validationErrors.message}</span>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="form-actions-group">
                <button
                  type="submit"
                  className="btn-save-mongo"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="btn-spinner"></span>
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>✉️</span>
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {/* Clear Form Button */}
                {(message.length > 0 || senderName.length > 0) && (
                  <button
                    type="button"
                    className="btn-clear-form"
                    onClick={handleClearForm}
                    disabled={isSubmitting}
                  >
                    Clear Form
                  </button>
                )}
              </div>
            </form>

            {/* Real-Time Live Message Preview (Practical 2 Requirement) */}
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

          {/* Card 2: UI Visibility Toggling using useState (Practical 2 Requirement) */}
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

            {/* Additional Help / Viva Concept Note Toggle */}
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
                <span>{showHelp ? '▾ Close Note' : '▸ Information Note'}</span>
              </button>

              {showHelp && (
                <div className="help-box">
                  💡 <strong>Note:</strong> Messages sent through this form are transmitted to the Express REST API and persisted directly into the MongoDB database.
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
