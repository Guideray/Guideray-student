import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { 
  FiBell, FiCheck, FiTrash2, FiAlertCircle, FiRefreshCw, 
  FiClock, FiX, FiCheckCircle, FiMail, FiStar, FiAlertTriangle,
  FiInfo, FiCalendar, FiBookmark, FiAward, FiMessageSquare
} from 'react-icons/fi';
import { 
  IoMdNotificationsOutline, IoMdCheckmarkCircleOutline,
  IoMdTrash, IoMdAlert, IoMdTime
} from 'react-icons/io';
import { 
  RiNotificationLine, RiNotificationOffLine,
  RiCheckboxCircleLine, RiDeleteBinLine
} from 'react-icons/ri';
import './index.css';

const GuiderayStudentNotification = () => {
  const [cookies] = useCookies(['studentToken']);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('https://webservice.guideray.in/api/students/me', {
          headers: {
            Authorization: `Bearer ${cookies.studentToken}`
          }
        });
        setStudentInfo(response.data.data);
      } catch (err) {
        setError('Failed to fetch student information');
        console.error(err);
      }
    };

    fetchStudentData();
  }, [cookies.studentToken]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!studentInfo) return;
      
      try {
        const response = await axios.get(`https://webservice.guideray.in/api/notifications/${studentInfo.studentId}`);
        const notificationsData = response.data.data || [];
        setNotifications(notificationsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch notifications');
        setLoading(false);
        console.error(err);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [studentInfo]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`https://webservice.guideray.in/api/notifications/${notificationId}/read`, {
        studentId: studentInfo.studentId
      }, {
        headers: {
          Authorization: `Bearer ${cookies.studentToken}`
        }
      });

      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === notificationId 
            ? { 
                ...notification, 
                is_seen_by: [...(notification.is_seen_by || []), studentInfo.studentId],
                is_read: true
              } 
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markSelectedAsRead = () => {
    selectedNotifications.forEach(id => {
      const notification = notifications.find(n => n._id === id);
      if (notification && !notification.is_seen_by?.includes(studentInfo.studentId)) {
        markAsRead(id);
      }
    });
    setSelectedNotifications([]);
  };

  const toggleSelectNotification = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notificationId => notificationId !== id) 
        : [...prev, id]
    );
  };

  const deleteSelectedNotifications = async () => {
    try {
      await axios.post('https://webservice.guideray.in/api/notifications/delete-selected', {
        ids: selectedNotifications
      }, {
        headers: {
          Authorization: `Bearer ${cookies.studentToken}`
        }
      });

      setNotifications(prev => prev.filter(notification => 
        !selectedNotifications.includes(notification._id)
      ));
      setSelectedNotifications([]);
      setShowDeleteConfirmation(false);
    } catch (err) {
      console.error('Error deleting notifications:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getNotificationIcon = (title) => {
    if (title.includes('Exam')) return <FiBookmark className="notification-type-icon exam" />;
    if (title.includes('Alert')) return <FiAlertTriangle className="notification-type-icon alert" />;
    if (title.includes('Event')) return <FiCalendar className="notification-type-icon event" />;
    if (title.includes('Important')) return <FiStar className="notification-type-icon important" />;
    return <FiInfo className="notification-type-icon info" />;
  };

  if (loading) {
    return (
      <div className="guideray-student-notification-loading-container">
        <div className="guideray-student-notification-spinner">
          <FiRefreshCw className="spin" />
        </div>
        <p>Loading your notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guideray-student-notification-error-container">
        <div className="guideray-student-notification-error-icon">
          <FiAlertCircle />
        </div>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="guideray-student-notification-retry-button"
        >
          <FiRefreshCw /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="guideray-student-notification-container">
      <div className="guideray-student-notification-header">
        <div className="guideray-student-notification-title">
          <RiNotificationLine className="guideray-student-notification-icon" />
          <h1>Notifications</h1>
          {notifications.length > 0 && (
            <span className="guideray-student-notification-count">
              {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
            </span>
          )}
        </div>
        
        {selectedNotifications.length > 0 && (
          <div className="guideray-student-notification-actions">
            <button 
              onClick={markSelectedAsRead}
              className="guideray-student-notification-action-btn guideray-student-notification-mark-read-btn"
            >
              <RiCheckboxCircleLine /> Mark as Read
            </button>
            <button 
              onClick={() => setShowDeleteConfirmation(true)}
              className="guideray-student-notification-action-btn guideray-student-notification-delete-btn"
            >
              <RiDeleteBinLine /> Delete
            </button>
            <span className="guideray-student-notification-selected-count">
              {selectedNotifications.length} selected
            </span>
          </div>
        )}
      </div>

      {showDeleteConfirmation && (
        <div className="guideray-student-notification-confirm-modal">
          <div className="guideray-student-notification-confirm-content">
            <div className="guideray-student-notification-confirm-icon">
              <IoMdAlert />
            </div>
            <h3>Delete Notifications</h3>
            <p>Are you sure you want to delete {selectedNotifications.length} selected notification(s)?</p>
            <div className="guideray-student-notification-confirm-buttons">
              <button 
                onClick={deleteSelectedNotifications}
                className="guideray-student-notification-confirm-btn guideray-student-notification-delete-confirm"
              >
                <IoMdTrash /> Delete
              </button>
              <button 
                onClick={() => setShowDeleteConfirmation(false)}
                className="guideray-student-notification-confirm-btn guideray-student-notification-cancel-btn"
              >
                <FiX /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="guideray-student-notification-empty-state">
          <div className="guideray-student-notification-empty-icon">
            <RiNotificationOffLine />
          </div>
          <h3>No notifications yet</h3>
          <p>Your notifications will appear here when available</p>
        </div>
      ) : (
        <div className="guideray-student-notification-list">
          {notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`guideray-student-notification-card ${
                notification.is_seen_by?.includes(studentInfo?.studentId) 
                  ? 'guideray-student-notification-read' 
                  : 'guideray-student-notification-unread'
              }`}
            >
              <div className="guideray-student-notification-checkbox">
                <input
                  type="checkbox"
                  id={`guideray-student-notification-${notification._id}`}
                  checked={selectedNotifications.includes(notification._id)}
                  onChange={() => toggleSelectNotification(notification._id)}
                />
                <label htmlFor={`guideray-student-notification-${notification._id}`}></label>
              </div>
              
              <div className="guideray-student-notification-content">
                <div className="guideray-student-notification-card-header">
                  <div className="guideray-student-notification-icon-container">
                    {getNotificationIcon(notification.title)}
                  </div>
                  <h3 
                    className="guideray-student-notification-title-text"
                    dangerouslySetInnerHTML={{ __html: notification.title }}
                  ></h3>
                  <span className="guideray-student-notification-time">
                    <IoMdTime /> {formatDate(notification.createdAt)}
                  </span>
                </div>
                
                <div 
                  className="guideray-student-notification-message"
                  dangerouslySetInnerHTML={{ __html: notification.message }}
                ></div>
                
                <div className="guideray-student-notification-footer">
                  {!notification.is_seen_by?.includes(studentInfo?.studentId) ? (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="guideray-student-notification-mark-read-btn"
                    >
                      <IoMdCheckmarkCircleOutline /> Mark as Read
                    </button>
                  ) : (
                    <span className="guideray-student-notification-read-indicator">
                      <FiCheckCircle /> Read
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuiderayStudentNotification;