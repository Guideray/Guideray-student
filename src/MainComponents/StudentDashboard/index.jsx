import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { FiSun, FiMoon, FiUser, FiLogOut, FiChevronRight, FiCheckCircle, FiSettings } from 'react-icons/fi';
import { RiNotificationLine } from 'react-icons/ri';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import GuiderayStudentConsistencyScoreBar from '../../OtherComponents/GuiderayStudentConsistencyScoreBar';
import GuideRayStudentProgressCalendar from '../../OtherComponents/StudentProgressBox';
import StudentAuth from '../StudentAuth';
import GuideRayStudentLivePrograms from '../../OtherComponents/GuideRayStudentLivePrograms';
import GuiderayStudentRecentCourses from '../../OtherComponents/GuiderayStudentRecentCourses';
import API_BASE_URL from '../../../config';

const StudentDashboard = ({ darkMode, toggleTheme, userData }) => {
  const [cookies] = useCookies(['studentToken']);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);

  const notificationRef = useRef(null);
  const settingsRef = useRef(null);

  useEffect(() => {
    const token = cookies['studentToken'];
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/students/me`, {
          headers: {
            Authorization: `Bearer ${token}`
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

    fetchStudentData();
  }, [cookies]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const faceAuthStatus = localStorage.getItem('faceAuth');
    if (!faceAuthStatus || faceAuthStatus !== 'true') {
      const timer = setTimeout(() => {
        setShowAuthPopup(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setAuthCompleted(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    localStorage.setItem('faceAuth', 'true');
    setAuthCompleted(true);
    setShowAuthPopup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('faceAuth');
    document.cookie = 'studentToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.reload();
  };

  const getUserInitials = () => {
    if (!studentData) return <FiUser size={16} />;
    const { name, lastName } = studentData;
    return `${name?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotifications(false);
    setShowSettings(false);
    setActiveDropdown(showProfileDropdown ? null : 'profile');
  };

  const handleNotificationClick = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
    setShowProfileDropdown(false);
    setShowSettings(false);
    setActiveDropdown(showNotifications ? null : 'notifications');
  };

  const handleSettingsClick = (e) => {
    e.stopPropagation();
    setShowSettings(!showSettings);
    setShowProfileDropdown(false);
    setShowNotifications(false);
    setActiveDropdown(showSettings ? null : 'settings');
  };

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationItemClick = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className={`guideray-student-dashboard-container ${darkMode ? 'guideray-student-dashboard-dark' : 'guideray-student-dashboard-light'}`}>
      {showAuthPopup && (
        <div className="guideray-student-dashboard-auth-overlay">
          <div className="guideray-student-dashboard-auth-popup">
            <StudentAuth 
              onSuccess={handleAuthSuccess} 
              onLogout={handleLogout} 
            />
          </div>
        </div>
      )}

      <div className={`guideray-student-dashboard-main ${darkMode ? 'guideray-student-dashboard-dark' : 'guideray-student-dashboard-light'}`}>
        <div className="guideray-student-dashboard-content">
          <div className="guideray-student-dashboard-left-content">
          </div>
          
          <div className='guideray-student-dashboard-right-column-main'>
            <div className='guideray-student-dashboard-left-column'>
              <div className='guideray-student-dashboard-left-column11'>
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
                  
                  <div className="guideray-student-dashboard-header-container">
                    <div className="guideray-student-dashboard-header-main-section">
                      <div className="guideray-student-dashboard-profile-section">
                        <div className="guideray-student-dashboard-profile-image-container">
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
                        </div>
                        <div className="guideray-student-dashboard-profile-details">
                          <h3 className="guideray-student-dashboard-profile-name">
                            {studentData?.name || 'User'} {studentData?.lastName || ''}
                          </h3>
                          <p className="guideray-student-dashboard-profile-email">
                            {studentData?.email || 'student@example.com'}
                          </p>
                          <p className="guideray-student-dashboard-profile-id">
                            ID: {studentData?.studentId || 'STUXXXXX'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="guideray-student-dashboard-header-controls-section">

                  

                    <div className="guideray-student-dashboard-settings-container" ref={settingsRef}>
                      <div 
                        className={`guideray-student-dashboard-settings-icon ${showSettings ? 'guideray-student-dashboard-active' : ''}`}
                        onClick={handleSettingsClick}
                      >
                        <FiSettings size={22} className="guideray-student-dashboard-notification-icon" />
                      </div>
                      
                      <div className={`guideray-student-dashboard-settings-dropdown ${showSettings ? 'show' : ''}`}>
                        <div 
                          className="guideray-student-dashboard-settings-item"
                          onClick={handleProfileClick}
                        >
                          <FiUser className="guideray-student-dashboard-settings-item-icon" />
                          <span className="guideray-student-dashboard-settings-item-text">Edit Profile</span>
                        </div>
                        <hr className="guideray-student-dashboard-settings-divider" />
                        <div 
                          className="guideray-student-dashboard-settings-item"
                          onClick={handleLogout}
                        >
                          <FiLogOut className="guideray-student-dashboard-settings-item-icon" />
                          <span className="guideray-student-dashboard-settings-item-text">Logout</span>
                        </div>
                      </div>
                    </div>

                      <div className="guideray-student-dashboard-notification-container" ref={notificationRef}>
                      <div 
                        className={`guideray-student-dashboard-notification-bell ${showNotifications ? 'guideray-student-dashboard-active' : ''}`} 
                        onClick={handleNotificationClick}
                      >
                        <RiNotificationLine size={22} className="guideray-student-dashboard-notification-icon" />
                        {notifications.some(n => !n.read) && (
                          <span className="guideray-student-dashboard-notification-badge"></span>
                        )}
                      </div>
                      
                      <div className={`guideray-student-dashboard-notification-dropdown ${showNotifications ? 'show' : ''}`}>
                        <div className="guideray-student-dashboard-dropdown-header">
                          <h4 className="guideray-student-dashboard-dropdown-title">Notifications</h4>
                          <span 
                            className="guideray-student-dashboard-mark-all-read"
                            onClick={handleMarkAllAsRead}
                          >
                            Mark all as read
                          </span>
                        </div>
                        <div className="guideray-student-dashboard-notification-list">
                          {notifications.map(notification => (
                            <div 
                              key={notification.id} 
                              className={`guideray-student-dashboard-notification-item ${!notification.read ? 'guideray-student-dashboard-unread' : ''}`}
                              onClick={(e) => handleNotificationItemClick(notification.id, e)}
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
                    </div>
                  </div>
                </div>
                <GuiderayStudentRecentCourses userData={userData}/>
              </div>
            </div>
            
            <div className="guideray-student-dashboard-right-column">
              <div className="guideray-student-dashboard-progress-container">
                <GuideRayStudentProgressCalendar studentId={userData.id} />
                <GuiderayStudentConsistencyScoreBar studentId={userData.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;