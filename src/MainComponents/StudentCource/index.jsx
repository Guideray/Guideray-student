import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaClock, FaBook, FaLaptopCode, FaLock,
  FaSpinner, FaExclamationTriangle, FaRegStar, FaStar,
  FaChevronRight, FaArrowLeft, FaCheck, FaUserGraduate,
  FaSearch, FaServer, FaCertificate, FaTimes, FaChartLine, FaChevronDown, FaArrowRight
} from 'react-icons/fa';
import { MdComputer, MdCloud, MdCode, MdDataUsage } from 'react-icons/md';
import { IoMdNotificationsOutline, IoMdNotifications } from 'react-icons/io';
import axiosInstance from '../../api/axiosInstance';
import { useCookies } from 'react-cookie';
import LearningPathModal from '../LearningPathModal';
import PaymentButton from '../../components/PaymentButton';
import CourseRecommendations from '../CourseRecommendations';
import CourseDetails from '../StudentCourseDetails';
import './index.css';

const CourseCard = ({ course, darkMode, isLocked, onRegisterClick, userData, isRegistered, onNotifyClick, isNotified, onCourseVisit }) => {
  const navigate = useNavigate();

  const handleActionClick = () => {
    if (isLocked && !isRegistered) {
      onRegisterClick(course);
    } else {
      navigate(`/courses/${course._id}`);
    }
  };

  const handleVisitCourse = async () => {
    await onCourseVisit(course);
    navigate(`/video-courses/${course._id}`);
  };

  const getCategoryIcon = () => {
    switch (course.category) {
      case 'Programming': return <MdCode className="guideray-student-courses-card-category-icon" />;
      case 'Data Science': return <MdDataUsage className="guideray-student-courses-card-category-icon" />;
      case 'Web Development': return <FaServer className="guideray-student-courses-card-category-icon" />;
      case 'DevOps': return <MdCloud className="guideray-student-courses-card-category-icon" />;
      default: return <MdComputer className="guideray-student-courses-card-category-icon" />;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="guideray-student-courses-card-star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="guideray-student-courses-card-star half" />);
      } else {
        stars.push(<FaRegStar key={i} className="guideray-student-courses-card-star" />);
      }
    }
    return stars;
  };

  const handleNotify = (e) => {
    e.stopPropagation();
    onNotifyClick(course);
  };

  return (
    <div className={`guideray-student-courses-card ${darkMode ? 'guideray-student-courses-dark-mode' : ''} ${isRegistered ? 'registered' : ''}`}>
      <div className="guideray-student-courses-card-image-container">
        <img src={course.image} alt={course.name} className="guideray-student-courses-card-image" />
        {isLocked && !isRegistered && (
          <div className="guideray-student-courses-card-lock-overlay">
            <FaLock />
            <span>Enroll to access</span>
          </div>
        )}
        <div className="guideray-student-courses-card-category">
          {getCategoryIcon()}
          <span>{course.category}</span>
        </div>
        {!isLocked && !isRegistered && (
          <button
            className="guideray-student-courses-card-notify-btn"
            onClick={handleNotify}
          >
            {isNotified ?
              <IoMdNotifications style={{ color: '#6e8efb' }} /> :
              <IoMdNotificationsOutline />}
          </button>
        )}
      </div>

      <div className="guideray-student-courses-card-content">
        <div className="guideray-student-courses-card-header">
          <h3 className="guideray-student-courses-card-title">{course.name}</h3>
          <div className="guideray-student-courses-card-rating">
            {renderStars(course.rating)}
            <span>{course.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="guideray-student-courses-card-description">{course.description}</p>

        <div className="guideray-student-courses-card-meta">
          <div className="guideray-student-courses-card-meta-item">
            <FaClock className="guideray-student-courses-card-meta-icon" />
            <span>{course.duration}</span>
          </div>
          <div className="guideray-student-courses-card-meta-item">
            <FaBook className="guideray-student-courses-card-meta-icon" />
            <span>{course.modules} Modules</span>
          </div>
          {course.projects && (
            <div className="guideray-student-courses-card-meta-item">
              <FaLaptopCode className="guideray-student-courses-card-meta-icon" />
              <span>{course.projects} Projects</span>
            </div>
          )}
        </div>

        <div className="guideray-student-courses-card-footer">
          <span className="guideray-student-courses-card-students">
            <FaUserGraduate /> {course.students.toLocaleString()}
          </span>
          {isRegistered ? (
            <button
              className="guideray-student-courses-card-button visit-course"
              onClick={handleVisitCourse}
            >
              Visit Course
              <FaArrowRight className="arrow-icon" />
            </button>
          ) : isLocked ? (
            <button
              className="guideray-student-courses-card-button enroll"
              onClick={handleActionClick}
            >
              Enroll Now
              <FaChevronRight className="arrow-icon" />
            </button>
          ) : (
            <button
              className={`guideray-student-courses-card-button ${darkMode ? 'guideray-student-courses-dark-mode' : ''}`}
              onClick={handleActionClick}
            >
              Explore Course
              <FaChevronRight className="arrow-icon" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};



const StudentCourse = ({ darkMode, userData }) => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['studentToken']);
  const [courses, setCourses] = useState({
    registered: [],
    available: [],
    upcoming: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('registered');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifiedCourses, setNotifiedCourses] = useState([]);
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [initializedCourses, setInitializedCourses] = useState([]);



  useEffect(() => {
    let controller = new AbortController();

    const fetchCourses = async () => {
      try {
        if (!userData || !userData.id) {
          throw new Error('User data not available');
        }

        setLoading(true);

        const [registeredRes, availableRes, upcomingRes] = await Promise.all([
          axiosInstance.get(`/api/students/${userData.id}/courses`, { signal: controller.signal }),
          axiosInstance.get('/api/courses/available', { signal: controller.signal }),
          axiosInstance.get('/api/courses/upcoming', { signal: controller.signal })
        ]);

        if (!controller.signal.aborted) {
          setCourses({
            registered: registeredRes.data?.data || [],
            available: availableRes.data?.data || [],
            upcoming: upcomingRes.data?.data || []
          });
          setLoading(false);
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
          console.error('Error fetching courses:', err);
          setError(err.response?.data?.error || err.message);
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      controller.abort();
    };
  }, [userData?.id]);

  const checkCourseInitialized = async (course) => {
    try {
      const response = await axiosInstance.get(`/api/consistency/progress/${userData.id}/${course._id}`);
      return response.data?.data !== null;
    } catch (error) {
      // If we get a 404, it means the course is not initialized
      if (error.response?.status === 404) {
        return false;
      }
      console.error('Error checking course initialization:', error);
      return false;
    }
  };

  const initializeConsistencyTracking = async (course) => {
    try {
      // First check if the course is already initialized
      const isInitialized = await checkCourseInitialized(course);
      if (isInitialized) {
        return;
      }

      // Initialize with topicCount 20 (as requested)
      await axiosInstance.post(`/api/consistency/initialize/${userData.id}`, {
        courses: [{
          courseName: course._id,
          topicCount: 20
        }],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      // Mark this course as initialized
      setInitializedCourses([...initializedCourses, course._id]);
    } catch (error) {
      console.error('Error initializing consistency tracking:', error);
    }
  };

  const handleRegisterClick = (course) => {
    setSelectedCourse(course);
    setShowDetails(true);
  };

  const handleCourseVisit = async (course) => {
    // Initialize consistency tracking when visiting a course for the first time
    await initializeConsistencyTracking(course);
  };

  const handleNotifyClick = (course) => {
    if (notifiedCourses.includes(course._id)) {
      setNotifiedCourses(notifiedCourses.filter(id => id !== course._id));
    } else {
      setNotifiedCourses([...notifiedCourses, course._id]);
    }
  };

  const handleEnroll = async () => {
    try {
      if (!userData || !userData.id) {
        throw new Error('User data not available');
      }

      const response = await axiosInstance.post(`/api/students/${userData.id}/courses`, {
        courseId: selectedCourse._id
      });

      if (response.status !== 201) {
        throw new Error('Registration failed');
      }

      setCourses(prev => ({
        registered: [...prev.registered, selectedCourse],
        available: prev.available.filter(c => c._id !== selectedCourse._id),
        upcoming: prev.upcoming
      }));

      return true;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return false;
    }
  };

  const isCourseRegistered = (courseId) => {
    return courses.registered.some(course => course._id === courseId);
  };

  const filteredCourses = (type) => {
    let courseList = courses[type];
    if (searchTerm) {
      courseList = courseList.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return courseList;
  };

  if (loading) {
    return (
      <div className={`guideray-student-courses-loading ${darkMode ? 'guideray-student-courses-dark-mode' : ''}`}>
        <FaSpinner className="guideray-student-courses-spinner" />
        <p>Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`guideray-student-courses-error ${darkMode ? 'guideray-student-courses-dark-mode' : ''}`}>
        <FaExclamationTriangle className="guideray-student-courses-error-icon" />
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button
          className="guideray-student-courses-error-retry"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (showDetails && selectedCourse) {
    return (
      <CourseDetails
        course={selectedCourse}
        darkMode={darkMode}
        onBack={() => setShowDetails(false)}
        onEnroll={handleEnroll}
        userData={userData}
        courses={courses}
        onCourseVisit={handleCourseVisit}
      />
    );
  }

  return (
    <div className={`guideray-student-courses-container ${darkMode ? 'guideray-student-courses-dark-mode' : ''}`}>
      {showLearningPath && (
        <LearningPathModal
          darkMode={darkMode}
          onClose={() => setShowLearningPath(false)}
        />
      )}

      <div className="guideray-student-courses-layout">
        <div className="guideray-student-courses-main-content123">
          <div className="guideray-student-courses-tabs-container">
            <div className="guideray-student-courses-search-container">
              <div className="guideray-student-courses-search-wrapper">
                <div className="guideray-student-courses-search">
                  <FaSearch className="guideray-student-courses-search-icon" />
                  <input
                    type="text"
                    placeholder="Search courses by name, category or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="guideray-student-courses-search-input"
                  />
                </div>
                <button
                  className="guideray-student-courses-learning-path-button"
                  onClick={() => setShowLearningPath(true)}
                >
                  <FaChartLine className="guideray-student-courses-learning-path-icon" />
                  View Learning Paths
                </button>
              </div>
            </div>

            <div className="guideray-student-courses-tabs">
              <button
                className={`guideray-student-courses-tab ${activeTab === 'registered' ? 'active' : ''}`}
                onClick={() => setActiveTab('registered')}
              >
                <FaUserGraduate className="guideray-student-courses-tab-icon" />
                My Courses
                {courses.registered.length > 0 && (
                  <span className="guideray-student-courses-tab-badge">{courses.registered.length}</span>
                )}
              </button>
              <button
                className={`guideray-student-courses-tab ${activeTab === 'available' ? 'active' : ''}`}
                onClick={() => setActiveTab('available')}
              >
                <FaBook className="guideray-student-courses-tab-icon" />
                Available Courses
                <span className="guideray-student-courses-tab-badge">{courses.available.length}</span>
              </button>
              <button
                className={`guideray-student-courses-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                <FaClock className="guideray-student-courses-tab-icon" />
                Upcoming Courses
                <span className="guideray-student-courses-tab-badge">{courses.upcoming.length}</span>
              </button>
            </div>
          </div>

          <section className="guideray-student-courses-section">
            {activeTab === 'registered' && (
              <>
                {filteredCourses('registered').length > 0 ? (
                  <div className="guideray-student-courses-grid">
                    {filteredCourses('registered').map(course => (
                      <CourseCard
                        key={course._id}
                        course={course}
                        darkMode={darkMode}
                        isLocked={false}
                        isRegistered={true}
                        onRegisterClick={handleRegisterClick}
                        userData={userData}
                        onNotifyClick={handleNotifyClick}
                        isNotified={notifiedCourses.includes(course._id)}
                        onCourseVisit={handleCourseVisit}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={`guideray-student-courses-empty ${darkMode ? 'guideray-student-courses-dark-mode' : ''}`}>
                    <img
                      src="https://res.cloudinary.com/dx97khgxd/image/upload/v1752329571/Pngtree_not_found_5408094_rhugij.png"
                      alt="No courses yet"
                      className="guideray-student-courses-empty-image"
                    />
                    <h3>Your learning journey starts here</h3>
                    <p>You haven't enrolled in any courses yet. Explore our catalog to find the perfect course for you.</p>
                    <div className="guideray-student-courses-empty-actions">
                      <button
                        className="guideray-student-courses-explore-button"
                        onClick={() => setActiveTab('available')}
                      >
                        Browse Available Courses
                      </button>
                      <button
                        className={`guideray-student-courses-path-button ${darkMode ? 'guideray-student-courses-dark-mode' : ''}`}
                        onClick={() => setShowLearningPath(true)}
                      >
                        <FaChartLine /> Find My Learning Path
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'available' && (
              <>
                {filteredCourses('available').length > 0 ? (
                  <div className="guideray-student-courses-grid">
                    {filteredCourses('available').map(course => (
                      <CourseCard
                        key={course._id}
                        course={course}
                        darkMode={darkMode}
                        isLocked={true}
                        isRegistered={isCourseRegistered(course._id)}
                        onRegisterClick={handleRegisterClick}
                        userData={userData}
                        onNotifyClick={handleNotifyClick}
                        isNotified={notifiedCourses.includes(course._id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={`guideray-student-courses-empty ${darkMode ? 'guideray-student-courses-dark-mode' : ''}`}>
                    <img
                      src="https://res.cloudinary.com/dx97khgxd/image/upload/v1752329571/Pngtree_not_found_5408094_rhugij.png"
                      alt="No courses found"
                      className="guideray-student-courses-empty-image"
                    />
                    <h3>No courses match your search</h3>
                    <p>Try adjusting your search or browse our upcoming courses.</p>
                    <button
                      className="guideray-student-courses-explore-button"
                      onClick={() => {
                        setSearchTerm('');
                        setActiveTab('upcoming');
                      }}
                    >
                      View Upcoming Courses
                    </button>
                  </div>
                )}
              </>
            )}

            {activeTab === 'upcoming' && (
              <>
                {filteredCourses('upcoming').length > 0 ? (
                  <div className="guideray-student-courses-grid">
                    {filteredCourses('upcoming').map(course => (
                      <div key={course._id} className={`guideray-student-courses-card ${darkMode ? 'guideray-student-courses-dark-mode' : ''}`}>
                        <div className="guideray-student-courses-card-image-container">
                          <img src={course.image} alt={course.name} className="guideray-student-courses-card-image" />
                          <div className="guideray-student-courses-card-upcoming-badge">Coming Soon</div>
                          <div className="guideray-student-courses-card-category">
                            {course.category === 'Data Science' ?
                              <MdDataUsage className="guideray-student-courses-card-category-icon" /> :
                              <MdCloud className="guideray-student-courses-card-category-icon" />}
                            <span>{course.category}</span>
                          </div>
                          <button
                            className="guideray-student-courses-card-notify-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotifyClick(course);
                            }}
                          >
                            {notifiedCourses.includes(course._id) ?
                              <IoMdNotifications style={{ color: '#6e8efb' }} /> :
                              <IoMdNotificationsOutline />}
                          </button>
                        </div>

                        <div className="guideray-student-courses-card-content">
                          <div className="guideray-student-courses-card-header">
                            <h3 className="guideray-student-courses-card-title">{course.name}</h3>
                            <div className="guideray-student-courses-card-rating">
                              {[...Array(5)].map((_, i) => (
                                i < Math.floor(course.rating) ?
                                  <FaStar key={i} className="guideray-student-courses-card-star filled" /> :
                                  <FaRegStar key={i} className="guideray-student-courses-card-star" />
                              ))}
                              <span>{course.rating.toFixed(1)}</span>
                            </div>
                          </div>

                          <p className="guideray-student-courses-card-description">{course.description}</p>

                          <div className="guideray-student-courses-card-meta">
                            <div className="guideray-student-courses-card-meta-item">
                              <FaClock className="guideray-student-courses-card-meta-icon" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="guideray-student-courses-card-meta-item">
                              <FaBook className="guideray-student-courses-card-meta-icon" />
                              <span>{course.modules} Modules</span>
                            </div>
                          </div>

                          <div className="guideray-student-courses-card-footer">
                            <span className="guideray-student-courses-card-students">{course.students.toLocaleString()} interested</span>
                            <button
                              className={`guideray-student-courses-card-button ${notifiedCourses.includes(course._id) ? 'notified' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotifyClick(course);
                              }}
                            >
                              {notifiedCourses.includes(course._id) ?
                                <IoMdNotifications /> :
                                <IoMdNotificationsOutline />}
                              {notifiedCourses.includes(course._id) ? ' Notified' : ' Notify Me'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`guideray-student-courses-empty ${darkMode ? 'guideray-student-courses-dark-mode' : ''}`}>
                    <img
                      src="https://res.cloudinary.com/dx97khgxd/image/upload/v1752329571/Pngtree_not_found_5408094_rhugij.png"
                      alt="No upcoming courses"
                      className="guideray-student-courses-empty-image"
                    />
                    <h3>No upcoming courses at this time</h3>
                    <p>Check back later for new course announcements or browse our available courses.</p>
                    <button
                      className="guideray-student-courses-explore-button"
                      onClick={() => {
                        setSearchTerm('');
                        setActiveTab('available');
                      }}
                    >
                      View Available Courses
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        <div className="guideray-student-courses-sidebar">
          <CourseRecommendations
            courses={courses.available.slice(0, 5)}
            darkMode={darkMode}
            onRegisterClick={handleRegisterClick}
            userData={userData}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentCourse;