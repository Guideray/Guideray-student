// components/Sidebar.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import {
  MdHome,
  MdMenuBook,
  MdCode,
  MdEmojiEvents,
  MdMessage
} from 'react-icons/md';
import './index.css'

const Sidebar = ({
  sidebarCollapsed,
  mobileSidebarOpen,
  toggleSidebar
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
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
