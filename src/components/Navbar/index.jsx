import React, { useState, useEffect, useRef } from 'react';
import {
  FiMenu, FiX, FiSun, FiMoon, FiUser, FiLogOut,
  FiChevronLeft, FiChevronDown, FiChevronRight,
  FiHome, FiBook, FiCalendar, FiSettings,
  FiMessageSquare, FiAward, FiPieChart, FiBell
} from 'react-icons/fi';
import { RiNotificationLine, RiDashboardLine } from 'react-icons/ri';
import { BsStars, BsGearFill } from 'react-icons/bs';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axiosInstance from '../../api/axiosInstance';
import './index.css';

const Navbar = ({
  darkMode,
  toggleTheme,
  isAuthenticated,
  loadingProgress,
  onLogout,
  isLoading,
  collapsed,
  toggleCollapse,
  userData
}) => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['studentToken']);
  const [studentData, setStudentData] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'New assignment posted in Mathematics',
      time: '2 hours ago',
      read: false,
      icon: <FiBook className="guideray-notification-icon text-blue-500" />
    },
    {
      id: 2,
      message: 'Your submission was graded A+',
      time: '1 day ago',
      read: true,
      icon: <FiAward className="guideray-notification-icon text-green-500" />
    },
    {
      id: 3,
      message: 'Upcoming deadline: Science project',
      time: '3 days ago',
      read: true,
      icon: <FiCalendar className="guideray-notification-icon text-yellow-500" />
    },
    {
      id: 4,
      message: 'New message from your tutor',
      time: 'Just now',
      read: false,
      icon: <FiMessageSquare className="guideray-notification-icon text-purple-500" />
    }
  ]);
  const [activeItem, setActiveItem] = useState('home');
  const [hoverItem, setHoverItem] = useState(null);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (userData) {
      setStudentData(userData);
    }
  }, [userData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getUserInitials = () => {
    if (!studentData?.name) return <FiUser size={16} />;
    const names = studentData.name.split(' ');
    return `${names[0]?.[0] || ''}${names[1]?.[0] || ''}`.toUpperCase();
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotifications(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileDropdown(false);
  };

  const handleLogout = () => {
    document.cookie = 'studentToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    onLogout();
    navigate('/login');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const navItems = [
    { id: 'home', icon: <RiDashboardLine size={20} />, label: 'Dashboard', path: '/' },
    { id: 'courses', icon: <FiBook size={20} />, label: 'My Courses', path: '/courses' },
    { id: 'performance', icon: <FiPieChart size={20} />, label: 'Performance', path: '/performance' },
    { id: 'schedule', icon: <FiCalendar size={20} />, label: 'Schedule', path: '/schedule' },
    { id: 'messages', icon: <FiMessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { id: 'achievements', icon: <FiAward size={20} />, label: 'Achievements', path: '/achievements' },
    { id: 'settings', icon: <FiSettings size={20} />, label: 'Settings', path: '/settings' }
  ];

  return (
    <div
      className={`guideray-student-navbar ${collapsed ? 'collapsed' : ''} ${darkMode ? 'dark' : ''}`}
      ref={sidebarRef}
    >
      {isLoading && (
        <div className="guideray-student-navbar-loading-container">
          <div
            className={`guideray-student-navbar-loading-progress ${loadingProgress >= 100 ? 'guideray-student-navbar-loading-complete' : ''}`}
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}

      <div className="guideray-student-navbar-container">
        <div className="guideray-student-navbar-header">
          <div
            className="guideray-student-navbar-logo"
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
          >
            <img
              src={darkMode ?
                "https://res.cloudinary.com/dx97khgxd/image/upload/v1747826507/b4r9unmciqqgfiuncwcp.png" :
                "https://res.cloudinary.com/dx97khgxd/image/upload/v1747826507/b4r9unmciqqgfiuncwcp.png"}
              alt="Portal Logo"
              draggable="false"
              className="guideray-student-navbar-logo-image"
            />

          </div>

        </div>

        <div className="guideray-student-navbar-nav">
          {navItems.map(item => (
            <div
              key={item.id}
              className={`guideray-student-navbar-nav-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveItem(item.id);
                navigate(item.path);
              }}
              onMouseEnter={() => setHoverItem(item.id)}
              onMouseLeave={() => setHoverItem(null)}
              role="button"
              tabIndex={0}
            >
              <div className="guideray-student-navbar-nav-icon">
                {React.cloneElement(item.icon, {
                  className: `guideray-nav-icon ${activeItem === item.id ? 'text-white scale-110' :
                    hoverItem === item.id ? 'text-white scale-105' : 'text-blue-200'}`
                })}
              </div>
              {!collapsed && (
                <span className="guideray-student-navbar-nav-label">
                  {item.label}

                </span>
              )}
              {collapsed && hoverItem === item.id && (
                <div className="guideray-nav-item-tooltip">
                  {item.label}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="guideray-student-navbar-footer">
          <div className="guideray-student-navbar-action-group">
            <button
              className={`guideray-student-navbar-theme-toggle ${darkMode ? 'active' : ''}`}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <div className="guideray-student-navbar-toggle-circle">
                {darkMode ?
                  <FiMoon size={14} className="guideray-theme-icon text-indigo-800" /> :
                  <FiSun size={14} className="guideray-theme-icon text-yellow-500" />}
              </div>
              {!collapsed && (
                <span className="guideray-student-navbar-theme-label">
                  {darkMode ? 'Dark Theme' : 'Light Theme'}
                </span>
              )}
            </button>
          </div>

          <div className="guideray-student-navbar-action-group" ref={notificationRef}>
            <div
              className="guideray-student-navbar-notification-bell"
              onClick={handleNotificationClick}
              aria-label="Notifications"
              role="button"
              tabIndex={0}
            >
              <div className="guideray-notification-bell-container">
                <IoMdNotificationsOutline size={22} className="guideray-notification-icon" />
                {notifications.some(n => !n.read) && (
                  <span className="guideray-student-navbar-notification-badge"></span>
                )}
              </div>
              {!collapsed && (
                <span className="guideray-student-navbar-notification-text">Notifications</span>
              )}

              {showNotifications && (
                <div className="guideray-student-navbar-notification-dropdown">
                  <div className="guideray-student-navbar-dropdown-header">
                    <h4 className="guideray-dropdown-header-title">Recent Notifications</h4>
                    <span
                      className="guideray-student-navbar-mark-all-read"
                      onClick={markAllAsRead}
                      role="button"
                      tabIndex={0}
                    >
                      Mark all as read
                    </span>
                  </div>
                  <div className="guideray-student-navbar-notification-list">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`guideray-student-navbar-notification-item ${!notification.read ? 'unread' : ''}`}
                        onClick={() => {
                          markNotificationAsRead(notification.id);
                          setShowNotifications(false);
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="guideray-student-navbar-notification-icon-container">
                          {notification.icon}
                        </div>
                        <div className="guideray-student-navbar-notification-dot"></div>
                        <div className="guideray-student-navbar-notification-content">
                          <p className="guideray-student-navbar-notification-message">{notification.message}</p>
                          <span className="guideray-student-navbar-notification-time">{notification.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className="guideray-student-navbar-dropdown-footer"
                    onClick={() => {
                      navigate('/notifications');
                      setShowNotifications(false);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    View all notifications
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="guideray-student-navbar-profile-container" ref={dropdownRef}>
            <div
              className="guideray-student-navbar-profile"
              onClick={handleProfileClick}
              aria-label="User profile"
              role="button"
              tabIndex={0}
            >
              {studentData?.profilePic ? (
                <img
                  src={studentData.profilePic}
                  alt="Profile"
                  className="guideray-student-navbar-avatar"
                />
              ) : (
                <div className="guideray-student-navbar-avatar guideray-avatar-fallback">
                  {getUserInitials()}
                </div>
              )}
              {!collapsed && (
                <div className="guideray-student-navbar-profile-info">
                  <span className="guideray-student-navbar-profile-name">
                    {studentData?.name || 'User'}
                  </span>
                  <span className="guideray-student-navbar-profile-email">
                    {studentData?.email || 'user@example.com'}
                  </span>
                </div>
              )}
              {!collapsed && (
                <FiChevronDown
                  className={`guideray-student-navbar-dropdown-arrow ${showProfileDropdown ? 'open' : ''}`}
                />
              )}
            </div>

            {showProfileDropdown && !collapsed && (
              <div className="guideray-student-navbar-profile-dropdown">
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
                    {studentData?.premium && (
                      <div className="guideray-premium-badge">
                        <BsStars className="guideray-premium-icon" />
                      </div>
                    )}
                  </div>
                  <div className="guideray-student-navbar-profile-details">
                    <h3 className="guideray-student-navbar-user-name">
                      {studentData?.name || 'User'}
                      {studentData?.premium && (
                        <span className="guideray-premium-tag">PRO</span>
                      )}
                    </h3>
                    <p className="guideray-student-navbar-user-email">
                      {studentData?.email || 'user@example.com'}
                    </p>
                    <div className="guideray-student-navbar-id-container">
                      <span className="guideray-student-navbar-id-text">
                        ID: {studentData?.studentId || 'STUXXXXX'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="guideray-student-navbar-dropdown-menu">
                  <div
                    className="guideray-student-navbar-dropdown-item"
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileDropdown(false);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <FiUser className="guideray-student-navbar-item-icon guideray-profile-icon" />
                    <span>My Profile</span>
                  </div>
                  <div
                    className="guideray-student-navbar-dropdown-item"
                    onClick={() => {
                      navigate('/settings');
                      setShowProfileDropdown(false);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <BsGearFill className="guideray-student-navbar-item-icon guideray-settings-icon" />
                    <span>Account Settings</span>
                  </div>
                  <div className="guideray-student-navbar-dropdown-divider"></div>
                  <div
                    className="guideray-student-navbar-dropdown-item guideray-logout-item"
                    onClick={handleLogout}
                    role="button"
                    tabIndex={0}
                  >
                    <FiLogOut className="guideray-student-navbar-item-icon guideray-logout-icon" />
                    <span>Logout</span>
                    <span className="guideray-logout-arrow">⇨</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;