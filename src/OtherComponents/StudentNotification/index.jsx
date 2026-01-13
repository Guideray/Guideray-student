import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axiosInstance from '../../api/axiosInstance';
import {
  FiChevronDown, FiChevronUp, FiCheck, FiTrash2,
  FiAlertCircle, FiRefreshCw, FiClock, FiCheckCircle,
  FiStar, FiAlertTriangle, FiInfo, FiCalendar,
  FiBookmark, FiMail, FiX, FiBell
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

const StudentNotifications = ({ userData }) => {
  const [cookies] = useCookies(['studentToken']);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [filter, setFilter] = useState('all');

  // Use userData for studentId (Mongo ID expected by backend)
  const studentId = userData?.id || userData?._id;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/notifications/${studentId}`);
        const notificationsData = response.data.data || [];
        setNotifications(notificationsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch notifications. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchNotifications();
  }, [cookies.studentToken, studentId]);

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.put(`/api/notifications/${notificationId}/read`, {
        studentId: studentId
      });

      setNotifications(prev => prev.map(n =>
        n._id === notificationId
          ? { ...n, isSeenBy: [...(n.isSeenBy || []), studentId] }
          : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isSeenBy?.includes(studentId));

      if (unreadNotifications.length === 0) return;

      // Parallel requests since no bulk endpoint exists
      await Promise.all(unreadNotifications.map(notification =>
        axiosInstance.put(`/api/notifications/${notification._id}/read`, {
          studentId: studentId
        })
      ));

      setNotifications(prev => prev.map(n => ({
        ...n,
        isSeenBy: [...(n.isSeenBy || []), studentId]
      })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const toggleSelectNotification = (id, e) => {
    e.stopPropagation();
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const deleteSelectedNotifications = async () => {
    try {
      await axiosInstance.post(`/api/notifications/delete-selected`, {
        ids: selectedNotifications
      });

      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n._id)));
      setSelectedNotifications([]);
      setShowDeleteConfirmation(false);
    } catch (err) {
      console.error('Error deleting notifications:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'exam': return <FiBookmark className="guideray-student-notifications-icon guideray-student-notifications-icon-exam" />;
      case 'alert': return <FiAlertTriangle className="guideray-student-notifications-icon guideray-student-notifications-icon-alert" />;
      case 'event': return <FiCalendar className="guideray-student-notifications-icon guideray-student-notifications-icon-event" />;
      case 'important': return <FiStar className="guideray-student-notifications-icon guideray-student-notifications-icon-important" />;
      default: return <FiInfo className="guideray-student-notifications-icon guideray-student-notifications-icon-info" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isSeenBy?.includes(studentId);
    if (filter === 'read') return notification.isSeenBy?.includes(studentId);
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isSeenBy?.includes(studentId)).length;

  if (loading) {
    return (
      <motion.div
        className="guideray-student-notifications-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="guideray-student-notifications-spinner">
          <FiRefreshCw className="guideray-student-notifications-spin" />
        </div>
        <p>Loading your notifications</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="guideray-student-notifications-error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="guideray-student-notifications-error-icon">
          <FiAlertCircle />
        </div>
        <h3>Error loading notifications</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="guideray-student-notifications-retry-button"
        >
          <FiRefreshCw /> Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="guideray-student-notifications-container">
      <div className="guideray-student-notifications-header">
        <div className="guideray-student-notifications-header-title">
          <FiBell className="guideray-student-notifications-header-icon" />
          <h1>Notifications</h1>
          {unreadCount > 0 && (
            <span className="guideray-student-notifications-unread-count">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="guideray-student-notifications-header-controls">
          <div className="guideray-student-notifications-filter-tabs">
            <button
              className={`guideray-student-notifications-filter-tab ${filter === 'all' ? 'guideray-student-notifications-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`guideray-student-notifications-filter-tab ${filter === 'unread' ? 'guideray-student-notifications-active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
            <button
              className={`guideray-student-notifications-filter-tab ${filter === 'read' ? 'guideray-student-notifications-active' : ''}`}
              onClick={() => setFilter('read')}
            >
              Read
            </button>
          </div>

          <div className="guideray-student-notifications-header-actions">
            {selectedNotifications.length > 0 ? (
              <>
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="guideray-student-notifications-delete-button"
                >
                  <FiTrash2 /> Delete
                </button>
                <span className="guideray-student-notifications-selected-count">
                  {selectedNotifications.length} selected
                </span>
              </>
            ) : (
              <button
                onClick={markAllAsRead}
                className="guideray-student-notifications-mark-all-read"
                disabled={unreadCount === 0}
              >
                <FiCheckCircle /> Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <motion.div
          className="guideray-student-notifications-empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="guideray-student-notifications-empty-icon">
            <FiBell />
          </div>
          <h3>No notifications found</h3>
          <p>When you get new notifications, they'll appear here</p>
        </motion.div>
      ) : (
        <motion.div
          className="guideray-student-notifications-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence>
            {filteredNotifications.map(notification => (
              <motion.div
                key={notification._id}
                className={`guideray-student-notifications-card ${notification.isSeenBy?.includes(studentId) ? 'guideray-student-notifications-read' : 'guideray-student-notifications-unread'
                  }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <div
                  className="guideray-student-notifications-checkbox-container"
                  onClick={(e) => toggleSelectNotification(notification._id, e)}
                >
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification._id)}
                    readOnly
                  />
                  <span className="guideray-student-notifications-checkmark"></span>
                </div>

                <div className="guideray-student-notifications-content">
                  <div className="guideray-student-notifications-card-header">
                    <div className="guideray-student-notifications-icon-container">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="guideray-student-notifications-title-container">
                      <h3>{notification.title}</h3>
                      <span className="guideray-student-notifications-time">
                        <FiClock /> {formatDate(notification.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="guideray-student-notifications-preview-text">
                    <p>{notification.message}</p>
                  </div>

                  <div className="guideray-student-notifications-html-content">
                    <div dangerouslySetInnerHTML={{ __html: notification.html || notification.message }} />
                  </div>

                  <div className="guideray-student-notifications-card-footer">
                    {!notification.isSeenBy?.includes(studentId) ? (
                      <button
                        className="guideray-student-notifications-mark-read-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification._id);
                        }}
                      >
                        <FiCheckCircle /> Mark as read
                      </button>
                    ) : (
                      <span className="guideray-student-notifications-read-indicator">
                        <FiCheck /> Read
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {showDeleteConfirmation && (
          <motion.div
            className="guideray-student-notifications-confirmation-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="guideray-student-notifications-modal-content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="guideray-student-notifications-modal-icon">
                <FiAlertTriangle />
              </div>
              <h3>Delete Notifications</h3>
              <p>Are you sure you want to delete {selectedNotifications.length} selected notification(s)? This action cannot be undone.</p>
              <div className="guideray-student-notifications-modal-actions">
                <button
                  className="guideray-student-notifications-cancel-button"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  <FiX /> Cancel
                </button>
                <button
                  className="guideray-student-notifications-confirm-button"
                  onClick={deleteSelectedNotifications}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentNotifications;