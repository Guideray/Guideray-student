import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiSun, FiMoon, FiUser, FiSettings, FiLogOut ,FiHash ,FiCreditCard ,FiChevronRight } from 'react-icons/fi';
import { RiDashboardLine, RiNotificationLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import './index.css';

function Navbar({
  darkMode,
  toggleTheme,
  toggleSidebar,
  mobileSidebarOpen,
  showSidebarToggle,
}) {
  const navigate = useNavigate();
  const [cookies] = useCookies(['studentToken']);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileDetailsExpanded, setProfileDetailsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch student data
  const cookieItem = cookies['studentToken'];

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students/me', {
          headers: {
            Authorization: `Bearer ${cookieItem}`
          }
        });

        setStudentData(response.data.data);
        
        // Mock notifications - replace with actual API call
        setNotifications([
          { id: 1, message: 'New assignment posted', time: '2 hours ago', read: false },
          { id: 2, message: 'Your submission was graded', time: '1 day ago', read: true },
          { id: 3, message: 'Upcoming deadline reminder', time: '3 days ago', read: true }
        ]);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError(err.response?.data?.message || 'Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    if (cookies['studentToken']) {
      fetchStudentData();
    } else {
      setLoading(false);
    }
  }, [cookies]);

  const getUserInitials = () => {
    if (!studentData) return <FiUser size={16} />;
    const { firstName, lastName } = studentData;
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotifications(false); // Close notifications if open
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileDropdown(false); // Close profile if open
  };

  const toggleProfileDetails = () => {
    setProfileDetailsExpanded(!profileDetailsExpanded);
  };

  const handleLogout = () => {
    document.cookie = 'studentToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <nav className={`guideray-student-dashboard-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="guideray-student-dashboard-navbar-left">
        {showSidebarToggle && (
          <button
            className="guideray-student-dashboard-sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {mobileSidebarOpen ? (
              <FiX size={20} className="nav-icon" />
            ) : (
              <FiMenu size={20} className="nav-icon" />
            )}
          </button>
        )}

        <div
          className="guideray-student-dashboard-logo no-select no-copy"
          onClick={() => navigate('/')}
          title="Go to Dashboard"
        >
          <img
            src={darkMode 
              ? "https://res.cloudinary.com/dx97khgxd/image/upload/v1747826507/b4r9unmciqqgfiuncwcp.png" 
              : "https://res.cloudinary.com/dx97khgxd/image/upload/v1747826507/b4r9unmciqqgfiuncwcp.png"}
            alt="Portal Logo"
            draggable="false"
            className="logo-image"
          />
        </div>
      </div>

      <div className="guideray-student-dashboard-navbar-right">
        <div className="nav-action-group">
          <button
            className={`guideray-student-dashboard-theme-toggle ${darkMode ? 'active' : ''}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <div className="guideray-student-dashboard-toggle-circle">
              {darkMode ? <FiMoon size={12} /> : <FiSun size={12} />}
            </div>
          </button>
        </div>

        <div className="nav-action-group">
          <div className="notification-bell" onClick={handleNotificationClick}>
            <RiNotificationLine size={20} className="nav-icon" />
            {notifications.some(n => !n.read) && (
              <span className="notification-badge"></span>
            )}
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="dropdown-header">
                  <h4>Notifications</h4>
                  <span className="mark-all-read">Mark all as read</span>
                </div>
                <div className="notification-list">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    >
                      <div className="notification-dot"></div>
                      <div className="notification-content">
                        <p className="notification-message">{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="dropdown-footer">
                  View all notifications
                </div>
              </div>
            )}
          </div>

          <div 
            className="guideray-student-dashboard-profile" 
            onClick={handleProfileClick}
          >
            {studentData?.profilePic ? (
              <img
                src={studentData.profilePic}
                alt="Profile"
                className="guideray-student-dashboard-avatar"
              />
            ) : (
              <div className="guideray-student-dashboard-avatar">
                {getUserInitials()}
              </div>
            )}
            
{showProfileDropdown && (
  <div className="guideray-student-navbar-dropdown-container">
    {/* Profile Header */}
    <div className="guideray-student-navbar-profile-header">
      <div className="guideray-student-navbar-avatar-wrapper">
        {studentData?.profilePic ? (
          <img
            src={studentData.profilePic}
            alt="Profile"
            className="guideray-student-navbar-profile-image"
          />
        ) : (
          <div className="guideray-student-navbar-avatar-fallback">
            {getUserInitials()}
          </div>
        )}
      </div>
      
      <div className="guideray-student-navbar-profile-details">
        <div className="guideray-student-navbar-name-container">
          <h3 className="guideray-student-navbar-user-name">
            {studentData?.name || 'User'}
          </h3>
          {studentData?.isVerified && (
            <span className="guideray-student-navbar-verification-badge">
              <FiCheckCircle />
            </span>
          )}
        </div>
        <p className="guideray-student-navbar-user-email">
          {studentData?.email || 'student@example.com'}
        </p>
        <div className="guideray-student-navbar-id-container">
          <FiCreditCard className="guideray-student-navbar-id-icon" />
          <span className="guideray-student-navbar-id-text">
            {studentData?.studentId || 'STUXXXXX'}
          </span>
        </div>
      </div>
    </div>

    {/* Menu Items */}
    <div className="guideray-student-navbar-dropdown-menu">
      <div 
        className="guideray-student-navbar-menu-item"
        onClick={() => navigate('/profile')}
      >
        <div className="guideray-student-navbar-menu-icon">
          <FiUser />
        </div>
        <span className="guideray-student-navbar-menu-text">My Profile</span>
        <div className="guideray-student-navbar-menu-arrow">
          <FiChevronRight />
        </div>
      </div>
      
      <div 
        className="guideray-student-navbar-menu-item guideray-student-navbar-logout-item"
        onClick={handleLogout}
      >
        <div className="guideray-student-navbar-menu-icon">
          <FiLogOut />
        </div>
        <span className="guideray-student-navbar-menu-text">Logout</span>
      </div>
    </div>

    {/* Footer */}

  </div>
)}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;