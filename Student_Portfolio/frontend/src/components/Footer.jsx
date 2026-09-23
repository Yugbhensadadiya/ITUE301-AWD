import React from 'react';

function Footer({ author, github, linkedin, courseInfo, email }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="portfolio-footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-col brand-col">
            <h3 className="footer-brand">{author}</h3>
            <p className="footer-bio">
              Student Portfolio created for {courseInfo.code}: {courseInfo.title}.
              Demonstrating Vite + React functional components and prop-driven architecture.
            </p>
          </div>

          <div className="footer-col">
            <h4>Connect</h4>
            <div className="social-links-list">
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="social-btn github-btn"
              >
                <span>GitHub</span> ↗
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="social-btn linkedin-btn"
              >
                <span>LinkedIn</span> ↗
              </a>
              {email && (
                <a href={`mailto:${email}`} className="social-btn email-btn">
                  <span>Email</span> ↗
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© {currentYear} {author}. All rights reserved.</p>
          <span className="footer-badge">{courseInfo?.code || 'ITUE301'} AWD • CHARUSAT University</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
