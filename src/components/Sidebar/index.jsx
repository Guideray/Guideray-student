import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { MdHome, MdMenuBook, MdCode, MdEmojiEvents, MdMessage } from 'react-icons/md';
import './index.css';

const Sidebar = ({ sidebarCollapsed, userData, toggleTheme, darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const menuItems = [
    { path: '/', name: 'Home', icon: MdHome },
    { path: '/course', name: 'Learn', icon: MdMenuBook },
    { path: '/student-practice', name: 'Practice', icon: MdCode },
    { path: '/contest', name: 'Contest', icon: MdEmojiEvents },
    { path: '/guidetalk', name: 'GuideTalk', icon: MdMessage, badge: 3 }
  ];

  const getUserInitials = () => {
    if (!userData?.name) return 'U';
    return userData.name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    // Add clear cookie logic if needed here
    navigate('/login');
  };

  return (
    <aside className={`guideray-student-dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className='guideray-sidebar-icon'>
        <img src="/src/assets/images/guideray_logo_white.svg" alt="GuideRay" />
      </div>

      <ul className="guideray-student-dashboard-menu">
        {menuItems.map((item, index) => (
          <li key={index} className={`guideray-student-dashboard-menu-item ${location.pathname === item.path ? 'active' : ''}`}>
            <Link to={item.path} className="guideray-student-dashboard-menu-link">
              <item.icon className="guideray-student-dashboard-menu-icon" />
              <span className="guideray-student-dashboard-menu-text">{item.name}</span>
              {item.badge && !sidebarCollapsed && <span className="guideray-student-dashboard-menu-badge">{item.badge}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <div className="guideray-student-navbar-profile-container">
        <div className="guideray-student-navbar-profile" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
          <div className="guideray-student-navbar-avatar">
            {userData?.profilePic ? (
              <img src={userData.profilePic} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : (
              getUserInitials()
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="guideray-student-navbar-profile-info">
              <div style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>{userData?.name || 'User'}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>{userData?.email}</div>
            </div>
          )}
        </div>
      </div>

      <button className="guideray-student-dashboard-theme-btn" onClick={toggleTheme}>
        {darkMode ? <FiSun /> : <FiMoon />}
        <span className="guideray-student-dashboard-logout-text">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>

      <button className="guideray-student-dashboard-logout-btn" onClick={handleLogout}>
        <FiLogOut />
        <span className="guideray-student-dashboard-logout-text">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;