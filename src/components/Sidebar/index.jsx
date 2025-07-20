// components/Sidebar.js
import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';
import { BsGearFill, BsStars } from 'react-icons/bs';
import {
  MdHome,
  MdMenuBook,
  MdCode,
  MdEmojiEvents,
  MdMessage
} from 'react-icons/md';
import './index.css';

const Sidebar = ({
  sidebarCollapsed,
  mobileSidebarOpen,
  toggleSidebar,
  userData
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const getUserInitials = () => {
    if (!userData?.name) return 'U';
    const names = userData.name.split(' ');
    return names.map(name => name[0]).join('').toUpperCase();
  };

  const menuItems = [
    { path: '/', name: 'Home', icon: MdHome },
    { path: '/course', name: 'Learn', icon: MdMenuBook },
    { path: '/practice', name: 'Practice', icon: MdCode },
    { path: '/contest', name: 'Contest', icon: MdEmojiEvents },
    {
      path: '/guidetalk',
      name: 'GuideTalk',
      icon: MdMessage,
      badge: 3
    }
  ];

  return (
    <aside
      className={`guideray-student-dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'guideray-student-dashboard-sidebar-open' : ''}`}
    >
      <div className='guideray-sidebar-icon'>
        <img
          src="https://res.cloudinary.com/dx97khgxd/image/upload/v1747826507/b4r9unmciqqgfiuncwcp.png" 
          alt="Portal Logo"
          draggable="false"
          className="logo-image"
        />
      </div>
      <ul className="guideray-student-dashboard-menu">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`guideray-student-dashboard-menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <Link
              to={item.path}
              className="guideray-student-dashboard-menu-link"
              onClick={() => window.innerWidth <= 768 && toggleSidebar()}
            >
              <item.icon className="guideray-student-dashboard-menu-icon" />
              <span className="guideray-student-dashboard-menu-text">{item.name}</span>
              {item.badge && (
                <span className="guideray-student-dashboard-menu-badge">{item.badge}</span>
              )}
            </Link>
            <span className="tooltip">{item.name}</span>
          </li>
        ))}
      </ul>

      <div>
        <div className="guideray-student-navbar-profile-container" ref={dropdownRef}>
          <div 
            className="guideray-student-navbar-profile" 
            onClick={handleProfileClick}
            aria-label="User profile"
            role="button"
            tabIndex={0}
          >
            {userData?.profilePic ? (
              <img
                src={userData.profilePic}
                alt="Profile"
                className="guideray-student-navbar-avatar"
              />
            ) : (
              <div className="guideray-student-navbar-avatar guideray-avatar-fallback">
                {getUserInitials()}
              </div>
            )}
            {!sidebarCollapsed && (
              <div className="guideray-student-navbar-profile-info">
                <span className="guideray-student-navbar-profile-name">
                  {userData?.name || 'User'}
                </span>
                <span className="guideray-student-navbar-profile-email">
                  {userData?.email || 'user@example.com'}
                </span>
              </div>
            )}
            {!sidebarCollapsed && (
              <FiChevronDown 
                className={`guideray-student-navbar-dropdown-arrow ${showProfileDropdown ? 'open' : ''}`} 
              />
            )}
          </div>

          {showProfileDropdown && !sidebarCollapsed && (
            <div className="guideray-student-navbar-profile-dropdown">
              <div className="guideray-student-navbar-profile-header">
                <div className="guideray-student-navbar-avatar-wrapper">
                  {userData?.profilePic ? (
                    <img
                      src={userData.profilePic}
                      alt="Profile"
                      className="guideray-student-navbar-profile-image"
                    />
                  ) : (
                    <div className="guideray-student-navbar-avatar-fallback">
                      {getUserInitials()}
                    </div>
                  )}
                  {userData?.premium && (
                    <div className="guideray-premium-badge">
                      <BsStars className="guideray-premium-icon" />
                    </div>
                  )}
                </div>
                <div className="guideray-student-navbar-profile-details">
                  <h3 className="guideray-student-navbar-user-name">
                    {userData?.name || 'User'}
                    {userData?.premium && (
                      <span className="guideray-premium-tag">PRO</span>
                    )}
                  </h3>
                  <p className="guideray-student-navbar-user-email">
                    {userData?.email || 'user@example.com'}
                  </p>
                  <div className="guideray-student-navbar-id-container">
                    <span className="guideray-student-navbar-id-text">
                      ID: {userData?.studentId || 'STUXXXXX'}
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

      <button
        className="guideray-student-dashboard-logout-btn"
        onClick={handleLogout}
      >
        <FiLogOut className="guideray-student-dashboard-logout-icon" />
        <span className="guideray-student-dashboard-logout-text">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;