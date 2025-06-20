import React, { useState, useEffect } from 'react';
import { FiEdit2, FiSave, FiX, FiUser, FiPhone, FiMail, FiCalendar, FiBook, FiUsers, FiHash, FiLock } from 'react-icons/fi';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import './index.css';

const StudentProfile = ({ darkMode }) => {
  const [cookies] = useCookies(['studentToken']);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students/me', {
          headers: {
            Authorization: `Bearer ${cookies.studentToken}`
          }
        });
        setStudentData(response.data.data);
        setFormData({
          name: response.data.data.name,
          mobile: response.data.data.mobile,
          college: response.data.data.college,
          currentYear: response.data.data.currentYear,
          department: response.data.data.department,
          branch: response.data.data.branch,
          dob: response.data.data.dob.split('T')[0],
          gender: response.data.data.gender
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch student data');
        setLoading(false);
      }
    };

    if (cookies.studentToken) {
      fetchStudentData();
    } else {
      setError('Authentication required. Please login.');
      setLoading(false);
    }
  }, [cookies.studentToken]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/students/${studentData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies.studentToken}`
          }
        }
      );
      setStudentData(response.data.data);
      setEditMode(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`guideray-student-profile-loading ${darkMode ? 'guideray-student-profile-dark' : ''}`}>
        <div className="guideray-student-profile-loading-spinner"></div>
        <p>Loading your profile...</p>
        <div className="guideray-student-profile-loading-progress"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`guideray-student-profile-error ${darkMode ? 'guideray-student-profile-dark' : ''}`}>
        <FiLock className="guideray-student-profile-error-icon" />
        <h3>Access Restricted</h3>
        <p>{error}</p>
        <a href="/login" className="guideray-student-profile-error-link">
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className={`guideray-student-profile-container ${darkMode ? 'guideray-student-profile-dark' : ''}`}>
      {/* Profile Header */}
      <div className="guideray-student-profile-header">
        <div className="guideray-student-profile-avatar-container">
          {studentData.profilePic ? (
            <img
              src={studentData.profilePic}
              alt="Profile"
              className="guideray-student-profile-avatar"
            />
          ) : (
            <div className="guideray-student-profile-avatar-fallback">
              {studentData.name.charAt(0)}
            </div>
          )}
          <div className={`guideray-student-profile-status ${studentData.isActive ? 'active' : 'inactive'}`}>
            {studentData.isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
        
        <div className="guideray-student-profile-info">
          <div className="guideray-student-profile-name-container">
            <h1 className="guideray-student-profile-name">
              {studentData.name}
            </h1>
            <span className="guideray-student-profile-id">
              <FiHash className="guideray-student-profile-id-icon" />
              {studentData.studentId}
            </span>
          </div>
          
          <div className="guideray-student-profile-email">
            <FiMail className="guideray-student-profile-email-icon" />
            {studentData.email}
          </div>
        </div>
        
        <button
          className={`guideray-student-profile-edit-btn ${editMode ? 'cancel' : ''}`}
          onClick={() => setEditMode(!editMode)}
          disabled={isSubmitting}
        >
          {editMode ? (
            <>
              <FiX className="guideray-student-profile-edit-icon" />
              Cancel
            </>
          ) : (
            <>
              <FiEdit2 className="guideray-student-profile-edit-icon" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Profile Content */}
      <div className="guideray-student-profile-content">
        {/* Personal Information Section */}
        <div className="guideray-student-profile-section">
          <h2 className="guideray-student-profile-section-title">
            <FiUser className="guideray-student-profile-section-icon" />
            Personal Information
          </h2>
          
          {editMode ? (
            <form onSubmit={handleSubmit} className="guideray-student-profile-form">
              <div className="guideray-student-profile-form-group">
                <label className="guideray-student-profile-form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="guideray-student-profile-form-input"
                  required
                />
              </div>
              
              <div className="guideray-student-profile-form-group">
                <label className="guideray-student-profile-form-label">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="guideray-student-profile-form-input"
                  required
                />
              </div>
              
              <div className="guideray-student-profile-form-group">
                <label className="guideray-student-profile-form-label">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="guideray-student-profile-form-input"
                  required
                />
              </div>
              
              <div className="guideray-student-profile-form-group">
                <label className="guideray-student-profile-form-label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="guideray-student-profile-form-input"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="guideray-student-profile-save-btn"
                disabled={isSubmitting}
              >
                <FiSave className="guideray-student-profile-save-icon" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <div className="guideray-student-profile-details-grid">
              <div className="guideray-student-profile-detail-item">
                <FiUser className="guideray-student-profile-detail-icon" />
                <div>
                  <span className="guideray-student-profile-detail-label">Full Name</span>
                  <span className="guideray-student-profile-detail-value">{studentData.name}</span>
                </div>
              </div>
              
              <div className="guideray-student-profile-detail-item">
                <FiPhone className="guideray-student-profile-detail-icon" />
                <div>
                  <span className="guideray-student-profile-detail-label">Mobile</span>
                  <span className="guideray-student-profile-detail-value">{studentData.mobile || 'Not provided'}</span>
                </div>
              </div>
              
              <div className="guideray-student-profile-detail-item">
                <FiCalendar className="guideray-student-profile-detail-icon" />
                <div>
                  <span className="guideray-student-profile-detail-label">Date of Birth</span>
                  <span className="guideray-student-profile-detail-value">
                    {studentData.dob ? new Date(studentData.dob).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Not provided'}
                  </span>
                </div>
              </div>
              
              <div className="guideray-student-profile-detail-item">
                <FiUser className="guideray-student-profile-detail-icon" />
                <div>
                  <span className="guideray-student-profile-detail-label">Gender</span>
                  <span className="guideray-student-profile-detail-value">{studentData.gender || 'Not specified'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Academic Information Section */}
        <div className="guideray-student-profile-section">
          <h2 className="guideray-student-profile-section-title">
            <FiBook className="guideray-student-profile-section-icon" />
            Academic Information
          </h2>
          
          <div className="guideray-student-profile-details-grid">
            <div className="guideray-student-profile-detail-item">
              <FiBook className="guideray-student-profile-detail-icon" />
              <div>
                <span className="guideray-student-profile-detail-label">College</span>
                <span className="guideray-student-profile-detail-value">{studentData.college || 'Not provided'}</span>
              </div>
            </div>
            
            <div className="guideray-student-profile-detail-item">
              <FiBook className="guideray-student-profile-detail-icon" />
              <div>
                <span className="guideray-student-profile-detail-label">Current Year</span>
                <span className="guideray-student-profile-detail-value">
                  {studentData.currentYear ? `Year ${studentData.currentYear}` : 'Not provided'}
                </span>
              </div>
            </div>
            
            <div className="guideray-student-profile-detail-item">
              <FiBook className="guideray-student-profile-detail-icon" />
              <div>
                <span className="guideray-student-profile-detail-label">Department</span>
                <span className="guideray-student-profile-detail-value">{studentData.department || 'Not provided'}</span>
              </div>
            </div>
            
            <div className="guideray-student-profile-detail-item">
              <FiBook className="guideray-student-profile-detail-icon" />
              <div>
                <span className="guideray-student-profile-detail-label">Branch</span>
                <span className="guideray-student-profile-detail-value">{studentData.branch || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mentor Information Section */}
        {studentData.mentor && (
          <div className="guideray-student-profile-section">
            <h2 className="guideray-student-profile-section-title">
              <FiUsers className="guideray-student-profile-section-icon" />
              Mentor Information
            </h2>
            
            <div className="guideray-student-profile-mentor-card">
              <div className="guideray-student-profile-mentor-avatar">
                {studentData.mentor.name.charAt(0)}
              </div>
              
              <div className="guideray-student-profile-mentor-info">
                <h3 className="guideray-student-profile-mentor-name">
                  {studentData.mentor.name}
                </h3>
                
                <div className="guideray-student-profile-mentor-email">
                  <FiMail className="guideray-student-profile-mentor-email-icon" />
                  {studentData.mentor.email}
                </div>
                
                <a
                  href={`mailto:${studentData.mentor.email}`}
                  className="guideray-student-profile-mentor-contact"
                >
                  Contact Mentor
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;