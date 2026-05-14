import React from 'react';
import './footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p className="footer-copyright">
            © {currentYear} <span className="brand-accent">Utkal University</span>. 
            <span className="footer-tagline"> Empowering Excellence since 1943.</span>
          </p>
        </div>
        
        <div className="footer-right">
          <div className="footer-nav">
            <a href="#" className="footer-nav-link">Privacy Policy</a>
            <span className="footer-dot"></span>
            <a href="#" className="footer-nav-link">Terms of Service</a>
            <span className="footer-dot"></span>
            <a href="#" className="footer-nav-link">Help Center</a>
          </div>
          <div className="footer-version-wrapper">
            <span className="version-label">BUILD</span>
            <span className="version-number">v1.0.0-beta</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
