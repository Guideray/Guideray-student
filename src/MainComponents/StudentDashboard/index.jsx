import React, { useState, useEffect } from 'react';
import './index.css';
import { FiSun, FiMoon, FiUser, FiLogOut, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import { RiNotificationLine } from 'react-icons/ri';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import GuiderayStudentConsistencyScoreBar from '../../OtherComponents/GuiderayStudentConsistencyScoreBar';
import GuideRayStudentProgressCalendar from '../../OtherComponents/StudentProgressBox';

const StudentDashboard = ({ darkMode, toggleTheme }) => {
  const [cookies] = useCookies(['studentToken']);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('https://webservice.guideray.in/api/students/me', {
          headers: {
            Authorization: `Bearer ${cookies['studentToken']}`
          }
        });
        setStudentData(response.data.data);
        setNotifications([
          { id: 1, message: 'New assignment posted in Mathematics', time: '2 hours ago', read: false },
          { id: 2, message: 'Your submission was graded in Science', time: '1 day ago', read: true },
          { id: 3, message: 'Upcoming deadline for English project', time: '3 days ago', read: true }
        ]);
      } catch (err) {
        console.error('Error fetching student data:', err);
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
    const { name, lastName } = studentData;
    return `${name?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotifications(false);
    setActiveDropdown(showProfileDropdown ? null : 'profile');
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileDropdown(false);
    setActiveDropdown(showNotifications ? null : 'notifications');
  };

  const handleLogout = () => {
    document.cookie = 'studentToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.reload();
  };

  return (
    <div className={`guideray-student-dashboard-container ${darkMode ? 'guideray-student-dashboard-dark' : 'guideray-student-dashboard-light'}`}>
      <div className={`guideray-student-dashboard-main ${darkMode ? 'guideray-student-dashboard-dark' : 'guideray-student-dashboard-light'}`}>
        <div className="guideray-student-dashboard-content">
          <div className="guideray-student-dashboard-left-content">
            <div className="guideray-student-dashboard-bottom-section">
              <div className="guideray-student-dashboard-banner-container">
                <div className="guideray-student-dashboard-banner-content">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/3242/3242257.png" 
                    alt="Study Icon" 
                    className="guideray-student-dashboard-banner-image"
                  />
                  <div className="guideray-student-dashboard-banner-text">
                    <h2 className="guideray-student-dashboard-banner-title">Welcome to GuideRay</h2>
                    <p className="guideray-student-dashboard-banner-subtitle">Empowering Your Educational Journey</p>
                  </div>
                </div>
                <div className="guideray-student-dashboard-banner-decoration">
                  <div className="guideray-student-dashboard-banner-dot"></div>
                  <div className="guideray-student-dashboard-banner-dot"></div>
                  <div className="guideray-student-dashboard-banner-dot"></div>
                </div>
              </div>
              
              <div className={`guideray-student-dashboard-header-container ${activeDropdown ? 'guideray-student-dashboard-active' : ''}`}>
                <div className="guideray-student-dashboard-header-top-row">
                  <button
                    className={`guideray-student-dashboard-theme-toggle ${darkMode ? 'guideray-student-dashboard-active' : ''}`}
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                  >
                    <div className="guideray-student-dashboard-toggle-circle">
                      {darkMode ? <FiMoon size={12} /> : <FiSun size={12} />}
                    </div>
                  </button>

                  <div 
                    className={`guideray-student-dashboard-notification-bell ${showNotifications ? 'guideray-student-dashboard-active' : ''}`} 
                    onClick={handleNotificationClick}
                  >
                    <RiNotificationLine size={20} className="guideray-student-dashboard-notification-icon" />
                    <span className="guideray-student-dashboard-notification-text">Notifications</span>
                    {notifications.some(n => !n.read) && (
                      <span className="guideray-student-dashboard-notification-badge"></span>
                    )}
                    
                    {showNotifications && (
                      <div className="guideray-student-dashboard-notification-dropdown">
                        <div className="guideray-student-dashboard-dropdown-header">
                          <h4 className="guideray-student-dashboard-dropdown-title">Your Notifications</h4>
                          <span className="guideray-student-dashboard-mark-all-read">Mark all as read</span>
                        </div>
                        <div className="guideray-student-dashboard-notification-list">
                          {notifications.map(notification => (
                            <div 
                              key={notification.id} 
                              className={`guideray-student-dashboard-notification-item ${!notification.read ? 'guideray-student-dashboard-unread' : ''}`}
                            >
                              <div className="guideray-student-dashboard-notification-dot"></div>
                              <div className="guideray-student-dashboard-notification-content">
                                <p className="guideray-student-dashboard-notification-message">{notification.message}</p>
                                <span className="guideray-student-dashboard-notification-time">{notification.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="guideray-student-dashboard-dropdown-footer">
                          View all notifications
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="guideray-student-dashboard-header-bottom-row">
                  <div 
                    className={`guideray-student-dashboard-profile ${showProfileDropdown ? 'guideray-student-dashboard-active' : ''}`}
                    onClick={handleProfileClick}
                  >
                    <div className="guideray-student-dashboard-profile-info">
                      <span className="guideray-student-dashboard-profile-name">
                        {studentData?.name || 'User'} {studentData?.lastName || ''}
                      </span>
                    </div>
                    {studentData?.profilePic ? (
                      <img
                        src={studentData.profilePic}
                        alt="Profile"
                        className="guideray-student-dashboard-profile-image"
                      />
                    ) : (
                      <div className="guideray-student-dashboard-avatar">
                        {getUserInitials()}
                      </div>
                    )}
                    
                    {showProfileDropdown && (
                      <div className="guideray-student-dashboard-navbar-dropdown-container">
                        <div className="guideray-student-dashboard-navbar-profile-header">
                          <div className="guideray-student-dashboard-navbar-avatar-wrapper">
                            {studentData?.profilePic ? (
                              <img
                                src={studentData.profilePic}
                                alt="Profile"
                                className="guideray-student-dashboard-navbar-profile-image"
                              />
                            ) : (
                              <div className="guideray-student-dashboard-navbar-avatar-fallback">
                                {getUserInitials()}
                              </div>
                            )}
                          </div>
                          
                          <div className="guideray-student-dashboard-navbar-profile-details">
                            <div className="guideray-student-dashboard-navbar-name-container">
                              <h3 className="guideray-student-dashboard-navbar-user-name">
                                {studentData?.name || 'User'} {studentData?.lastName || ''}
                              </h3>
                              {studentData?.isVerified && (
                                <span className="guideray-student-dashboard-navbar-verification-badge">
                                  <FiCheckCircle />
                                </span>
                              )}
                            </div>
                            <p className="guideray-student-dashboard-navbar-user-email">
                              {studentData?.email || 'student@example.com'}
                            </p>
                          </div>
                        </div>

                        <div className="guideray-student-dashboard-navbar-dropdown-menu">
                          <div className="guideray-student-dashboard-navbar-menu-item">
                            <div className="guideray-student-dashboard-navbar-menu-icon">
                              <FiUser />
                            </div>
                            <span className="guideray-student-dashboard-navbar-menu-text">My Profile</span>
                            <div className="guideray-student-dashboard-navbar-menu-arrow">
                              <FiChevronRight />
                            </div>
                          </div>
                          
                          <div 
                            className="guideray-student-dashboard-navbar-menu-item guideray-student-dashboard-navbar-logout-item"
                            onClick={handleLogout}
                          >
                            <div className="guideray-student-dashboard-navbar-menu-icon">
                              <FiLogOut />
                            </div>
                            <span className="guideray-student-dashboard-navbar-menu-text">Logout</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='guideray-student-dashboard-right-column-main'>
          <div className="guideray-student-dashboard-right-column">
                        <div className="guideray-student-dashboard-progress-container">
              <GuiderayStudentConsistencyScoreBar />
            </div>
            <div className="guideray-student-dashboard-calendar-container">
              <GuideRayStudentProgressCalendar />
            </div>

          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;