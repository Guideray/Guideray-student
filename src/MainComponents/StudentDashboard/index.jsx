import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { FiSettings, FiUser, FiBell, FiLogOut, FiCalendar, FiActivity } from 'react-icons/fi';
import { useCookies } from 'react-cookie';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import StudentAuth from '../StudentAuth';

// Components
import GuiderayStudentRecentCourses from '../../OtherComponents/GuiderayStudentRecentCourses';
import GuideRayStudentProgressCalendar from '../../OtherComponents/StudentProgressBox';
import GuiderayStudentConsistencyScoreBar from '../../OtherComponents/GuiderayStudentConsistencyScoreBar';

const StudentDashboard = ({ userData }) => {
  const [cookies] = useCookies(['studentToken']);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const navigate = useNavigate();

  const settingsRef = useRef(null);
  const notificationRef = useRef(null);
  const [consistencyData, setConsistencyData] = useState(null);

  // --- API ---
  useEffect(() => {
    if (userData && (userData.id || userData._id)) {
      const studentId = userData.id || userData._id;
      const controller = new AbortController();
      fetchNotifications(studentId, controller.signal);
      fetchConsistencyData(studentId, controller.signal);
      return () => controller.abort();
    }
  }, [userData]);

  const fetchConsistencyData = async (studentId, signal) => {
    try {
      const response = await axiosInstance.get(`/api/consistency/${studentId}`, { signal });
      if (response.data.success) setConsistencyData(response.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchNotifications = async (studentId, signal) => {
    try {
      const response = await axiosInstance.get(`/api/notifications/${studentId}`, { signal });
      setNotifications(response.data.data.slice(0, 3));
    } catch (err) { console.error(err); }
  };

  // --- AUTH ---
  useEffect(() => {
    const faceAuthStatus = localStorage.getItem('faceAuth');
    if (!faceAuthStatus || faceAuthStatus !== 'true') {
      const timer = setTimeout(() => setShowAuthPopup(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAuthSuccess = () => {
    localStorage.setItem('faceAuth', 'true');
    setShowAuthPopup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('faceAuth');
    document.cookie = 'studentToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.reload();
  };

  // --- UTILS ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) setShowSettings(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitials = () => {
    return `${userData?.name?.charAt(0) || ''}${userData?.lastName?.charAt(0) || ''}`;
  };

  return (
    <div className="guideray-student-dashboard-container">

      {showAuthPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <StudentAuth onSuccess={handleAuthSuccess} onLogout={handleLogout} />
        </div>
      )}

      <div className="guideray-dashboard-layout">

        {/* --- LEFT COLUMN --- */}
        <div className="guideray-dashboard-left-col">

          {/* TOP ROW: 13vh */}
          <div className="guideray-dashboard-top-row">

            {/* Banner (Gradient Blue, Left Aligned Text) */}
            <div className="guideray-card guideray-banner-card">
              <div className="guideray-banner-text">
                <h1>Hello, {userData?.name || 'Student'}!</h1>
                <p>Ready to level up your skills today?</p>
              </div>
              <img src="https://cdn-icons-png.flaticon.com/512/3074/3074063.png" alt="Study" className="guideray-banner-img" />
            </div>

            {/* Profile (White, Left Aligned) */}
            <div className="guideray-card guideray-profile-mini">
              <div className="guideray-profile-info-block">
                {userData?.profilePic ? (
                  <img src={userData.profilePic} alt="Profile" className="guideray-profile-pic" />
                ) : (
                  <div className="guideray-profile-pic" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef5ff', color: '#006ee7', fontSize: '1.1rem', fontWeight: '600', borderRadius: '14px', border: '2px solid #eef5ff', boxShadow: '0 4px 10px rgba(0, 110, 231, 0.15)' }}>
                    {getUserInitials()}
                  </div>
                )}
                <div className="guideray-profile-text">
                  <h3>{userData?.name || 'User'}</h3>
                  <span>{userData?.studentId || 'Student'}</span>
                </div>
              </div>

              <div className="guideray-profile-actions">
                <div style={{ position: 'relative' }} ref={notificationRef}>
                  <button className="guideray-icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                    <FiBell />
                    {notifications.length > 0 && <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: '#ff4757', border: '2px solid #fff', borderRadius: '50%' }}></span>}
                  </button>
                  {showNotifications && (
                    <div className="guideray-dropdown">
                      {notifications.length > 0 ? notifications.map(n => <div key={n._id} className="guideray-dd-item">{n.title}</div>) : <div className="guideray-dd-item">No alerts</div>}
                    </div>
                  )}
                </div>

                <div style={{ position: 'relative' }} ref={settingsRef}>
                  <button className="guideray-icon-btn" onClick={() => setShowSettings(!showSettings)}>
                    <FiSettings />
                  </button>
                  {showSettings && (
                    <div className="guideray-dropdown">
                      <div className="guideray-dd-item" onClick={() => navigate('/profile')}> <FiUser /> My Profile</div>
                      <div className="guideray-dd-item" onClick={handleLogout} style={{ color: '#ff4757' }}> <FiLogOut /> Logout</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* COURSES (Left Aligned Header) */}
          <div className="guideray-card guideray-courses-container">
            <div className="guideray-panel-header">
              <FiActivity /> Recent Activity
            </div>
            <div className="guideray-scroll-area">
              <GuiderayStudentRecentCourses
                userData={userData}
                consistencyData={consistencyData}
              />
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="guideray-dashboard-right-col">

          {/* 1. CALENDAR (Header Left, Dates Center) */}
          <div className="guideray-card guideray-progress-card">
            <div className="guideray-panel-header">
              <FiCalendar /> Study Calendar
            </div>
            <div className="guideray-progress-body">
              <GuideRayStudentProgressCalendar
                studentId={userData?.id}
                consistencyData={consistencyData}
              />
            </div>
          </div>

          {/* 2. CONSISTENCY (Header Left, Score Center) */}
          <div className="guideray-card guideray-consistency-card">
            <div style={{ marginBottom: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, fontSize: '1rem', color: '#1b2559' }}>
              <FiActivity color="#006ee7" /> Daily Consistency
            </div>
            <GuiderayStudentConsistencyScoreBar
              studentId={userData?.id}
              consistencyData={consistencyData}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;