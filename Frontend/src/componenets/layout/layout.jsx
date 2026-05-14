import React, { useState, useEffect } from 'react';
import Header from './header';
import Sidebar from './sidebar';
import Footer from './footer';
import './layout.css';

const Layout = ({ children, activePage, setActivePage, onLogout, onAddUser, onViewUsers }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className={`layout-wrapper ${isCollapsed && !isMobile ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile overlay backdrop */}
      {isMobile && mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <Sidebar
        isCollapsed={isMobile ? false : isCollapsed}
        isMobileOpen={mobileOpen}
        isMobile={isMobile}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="layout-main">
        <Header onMenuClick={handleMenuClick} onLogout={onLogout} onAddUser={onAddUser} onViewUsers={onViewUsers} />
        <main className="layout-content">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
