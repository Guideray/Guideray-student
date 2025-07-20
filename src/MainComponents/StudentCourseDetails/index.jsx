import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronRight, FaStar, FaRegStar, FaClock, FaBook, FaLaptopCode, FaCertificate, FaChevronDown, FaCheck, FaArrowRight } from 'react-icons/fa';
import PaymentButton from '../../components/PaymentButton'; // Update this import based on your project

import CourseRecommendations from '../CourseRecommendations'; // Update this import if necessary

const CourseDetails = ({ course, darkMode, onBack, onEnroll, userData, courses, onCourseVisit }) => {
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();

  const handleEnroll = async () => {
    setEnrolling(true);
    setError(null);
    try {
      const success = await onEnroll();
      if (!success) {
        throw new Error('Enrollment failed. Please try again.');
      }
      setEnrolled(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  const handleVisitCourse = async () => {
    await onCourseVisit(course);
    navigate(`/video-courses/${course._id}`);
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(course.rating);
    const hasHalfStar = course.rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="guideray-student-courses-details-star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="guideray-student-courses-details-star half" />);
      } else {
        stars.push(<FaRegStar key={i} className="guideray-student-courses-details-star" />);
      }
    }
    return stars;
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className={`guideray-student-courses-details ${darkMode ? 'guideray-student-courses-details-dark-mode' : ''}`}>
      <div className="guideray-student-courses-details-header">
        <button className="guideray-student-courses-details-back" onClick={onBack}>
          <FaArrowLeft /> Back to Courses
        </button>
        <div className="guideray-student-courses-details-breadcrumb">
          <span>Courses</span>
          <FaChevronRight className="guideray-student-courses-details-breadcrumb-arrow" />
          <span>{course.category}</span>
          <FaChevronRight className="guideray-student-courses-details-breadcrumb-arrow" />
          <span>{course.name}</span>
        </div>
      </div>

      <div className="guideray-student-courses-details-content">
        <div className="guideray-student-courses-details-main">
          <div className="guideray-student-courses-details-image-container">
            <img src={course.image} alt={course.name} className="guideray-student-courses-details-image" />
            <div className="guideray-student-courses-details-rating">
              {renderStars()}
              <span>{course.rating.toFixed(1)} ({course.students.toLocaleString()} students)</span>
            </div>
          </div>

          <div className="guideray-student-courses-details-info">
            <div className="guideray-student-courses-details-title-section">
              <h1 className="guideray-student-courses-details-title">{course.name}</h1>
              <div className="guideray-student-courses-details-instructor-level">
                <p className="guideray-student-courses-details-instructor">
                  <span className="guideray-student-courses-details-label">Instructor:</span>
                  <span>{course.instructor}</span>
                </p>
                <p className="guideray-student-courses-details-level">
                  <span className="guideray-student-courses-details-label">Level:</span>
                  <span>{course.level}</span>
                </p>
              </div>
            </div>

            <div className="guideray-student-courses-details-meta">
              <div className="guideray-student-courses-details-meta-item">
                <FaClock className="guideray-student-courses-details-meta-icon" />
                <span>{course.duration}</span>
              </div>
              <div className="guideray-student-courses-details-meta-item">
                <FaBook className="guideray-student-courses-details-meta-icon" />
                <span>{course.modules} Modules</span>
              </div>
              {course.projects && (
                <div className="guideray-student-courses-details-meta-item">
                  <FaLaptopCode className="guideray-student-courses-details-meta-icon" />
                  <span>{course.projects} Projects</span>
                </div>
              )}
              {course.certificate && (
                <div className="guideray-student-courses-details-meta-item">
                  <FaCertificate className="guideray-student-courses-details-meta-icon" />
                  <span>Certificate</span>
                </div>
              )}
            </div>

            <div className="guideray-student-courses-details-description">
              <h2 className="guideray-student-courses-details-section-title">About This Course</h2>
              <div className="guideray-student-courses-details-description-text">
                <p>
                  {showFullDescription
                    ? course.fullDescription
                    : `${course.fullDescription.substring(0, 300)}...`}
                </p>
                <button className="guideray-student-courses-details-read-more" onClick={toggleDescription}>
                  {showFullDescription ? (
                    <>
                      Show Less <FaChevronDown className="guideray-student-courses-details-read-more-icon" />
                    </>
                  ) : (
                    <>
                      Read More <FaChevronDown className="guideray-student-courses-details-read-more-icon" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="guideray-student-courses-details-learning">
              <h2 className="guideray-student-courses-details-section-title">What You'll Learn</h2>
              <ul className="guideray-student-courses-details-learning-list">
                {course.learningOutcomes?.map((outcome, index) => (
                  <li key={index} className="guideray-student-courses-details-learning-item">
                    <FaCheck className="guideray-student-courses-details-learning-check" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="guideray-student-courses-details-sidebar">
          <div className="guideray-student-courses-details-pricing-card">
            <div className="guideray-student-courses-details-price-container">
              {course.discountPrice ? (
                <>
                  <span className="guideray-student-courses-details-original-price">${course.price}</span>
                  <div className="guideray-student-courses-details-price-wrapper">
                    <h3 className="guideray-student-courses-details-price">${course.discountPrice}</h3>
                    <span className="guideray-student-courses-details-discount">
                      {Math.round((1 - course.discountPrice / course.price) * 100)}% OFF
                    </span>
                  </div>
                </>
              ) : (
                <h3 className="guideray-student-courses-details-price">${course.price}</h3>
              )}
            </div>

            {error && (
              <div className="guideray-student-courses-details-error">
                {error}
              </div>
            )}

            {enrolled ? (
              <button className="guideray-student-courses-details-enroll visit-course" onClick={handleVisitCourse}>
                <FaArrowRight /> Visit Course
              </button>
            ) : (
              <PaymentButton
                course={course}
                userData={userData}
                darkMode={darkMode}
                onEnrollSuccess={handleEnroll}
              />
            )}
          </div>

          <div className="guideray-student-courses-details-includes-card">
            <h3 className="guideray-student-courses-details-includes-title">This course includes:</h3>
            <ul className="guideray-student-courses-details-includes-list">
              <li className="guideray-student-courses-details-includes-item">
                <FaCheck className="guideray-student-courses-details-includes-icon" />
                <span>{course.duration} of on-demand video</span>
              </li>
              <li className="guideray-student-courses-details-includes-item">
                <FaCheck className="guideray-student-courses-details-includes-icon" />
                <span>{course.modules} modules</span>
              </li>
              <li className="guideray-student-courses-details-includes-item">
                <FaCheck className="guideray-student-courses-details-includes-icon" />
                <span>{course.projects || 0} hands-on projects</span>
              </li>
              <li className="guideray-student-courses-details-includes-item">
                <FaCheck className="guideray-student-courses-details-includes-icon" />
                <span>Certificate of completion</span>
              </li>
              <li className="guideray-student-courses-details-includes-item">
                <FaCheck className="guideray-student-courses-details-includes-icon" />
                <span>Full lifetime access</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="guideray-student-courses-sidebar">
          <CourseRecommendations
            courses={courses.available.filter(c => c._id !== course._id).slice(0, 5)}
            darkMode={darkMode}
            onRegisterClick={onEnroll}
            userData={userData}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
