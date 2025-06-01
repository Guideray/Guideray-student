import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiSun, FiMoon, FiPlus, FiMinus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './index.css';

function Navbar({ darkMode, toggleTheme, toggleSidebar, mobileSidebarOpen, userInitials, showSidebarToggle }) {
  const navigate = useNavigate();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showZoomControls, setShowZoomControls] = useState(false);

  const handleZoomIn = () => {
    if (zoomLevel < 150) {
      const newZoom = zoomLevel + 10;
      setZoomLevel(newZoom);
      document.body.style.zoom = `${newZoom}%`;
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      const newZoom = zoomLevel - 10;
      setZoomLevel(newZoom);
      document.body.style.zoom = `${newZoom}%`;
    }
  };

  const resetZoom = () => {
    setZoomLevel(100);
    document.body.style.zoom = '100%';
  };

  useEffect(() => {
    // Initialize zoom level
    document.body.style.zoom = `${zoomLevel}%`;
    
    return () => {
      // Reset zoom when component unmounts
      document.body.style.zoom = '100%';
    };
  }, []);

  return (
    <nav className="guideray-student-dashboard-navbar">
      <div className="guideray-student-dashboard-navbar-left">
        {showSidebarToggle && (
          <button
            className="guideray-student-dashboard-sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {mobileSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        )}

        <div
          className="guideray-student-dashboard-logo no-select no-copy"
          onClick={() => navigate('/')}
          title="Go to Dashboard"
          style={{ cursor: 'pointer' }}
        >
          <img
            src={
              darkMode
                ? 'https://res.cloudinary.com/dx97khgxd/image/upload/v1747826507/b4r9unmciqqgfiuncwcp.png'
                : 'https://res.cloudinary.com/dx97khgxd/image/upload/v1747826507/b4r9unmciqqgfiuncwcp.png'
            }
            alt="Portal Logo"
            draggable="false"
          />
        </div>
      </div>

      <div className="guideray-student-dashboard-navbar-right">
        <div 
          className="guideray-student-dashboard-zoom-controls"
          onMouseEnter={() => setShowZoomControls(true)}
          onMouseLeave={() => setShowZoomControls(false)}
        >
          
          {showZoomControls && (
            <div className="zoom-controls-popup">
              <button 
                className="zoom-button" 
                onClick={handleZoomIn}
                disabled={zoomLevel >= 150}
                aria-label="Zoom in"
              >
                <FiPlus size={14} />
              </button>
              <button 
                className="zoom-button" 
                onClick={resetZoom}
                aria-label="Reset zoom"
              >
                Reset
              </button>
              <button 
                className="zoom-button" 
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
                aria-label="Zoom out"
              >
                <FiMinus size={14} />
              </button>
            </div>
          )}
        </div>

        <button
          className={`guideray-student-dashboard-theme-toggle ${darkMode ? 'active' : ''}`}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <div className="guideray-student-dashboard-toggle-circle">
            {darkMode ? <FiMoon size={12} /> : <FiSun size={12} />}
          </div>
        </button>

        <div className="guideray-student-dashboard-profile">
          <div className="guideray-student-dashboard-avatar">
            {userInitials}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;