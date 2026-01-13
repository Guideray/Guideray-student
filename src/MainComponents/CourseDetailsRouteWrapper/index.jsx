import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronRight, FaStar, FaRegStar, FaClock, FaBook, FaLaptopCode, FaCertificate, FaChevronDown, FaCheck, FaArrowRight } from 'react-icons/fa';
import PaymentButton from '../../components/PaymentButton';
import CourseRecommendations from '../CourseRecommendations';
import CourseDetails from '../StudentCourseDetails';
import axiosInstance from '../../api/axiosInstance';
const CourseDetailsRouteWrapper = ({ darkMode, userData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState(location.state?.course || null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (!course) {
      navigate('/courses');
      return;
    }

    const fetchAvailableCourses = async () => {
      try {
        const response = await axiosInstance.get('/api/courses/available');
        const data = response.data;

        // Filter out the current course from recommendations
        const filteredCourses = data.data
          ? data.data.filter(availableCourse => availableCourse._id !== course._id)
          : [];

        setAvailableCourses(filteredCourses);
      } catch (err) {
        console.error('Error fetching available courses:', err);
        setAvailableCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableCourses();
  }, [course, navigate]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setError(null);
    try {
      // Implement actual enrollment logic here
      const response = await axiosInstance.post('/api/enroll', {
        userId: userData.id,
        courseId: course._id
      });

      if (!response.data.success) throw new Error(response.data.message || 'Enrollment failed');

      setEnrolled(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setEnrolling(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleVisitCourse = () => {
    navigate(`/video-courses/${course._id}`);
  };

  if (!course) {
    return (
      <div className="course-details-loading">
        <p>Loading course details...</p>
      </div>
    );
  }

  return (
    <CourseDetails
      course={course}
      darkMode={darkMode}
      onBack={handleBack}
      userData={userData}
      courses={{ available: availableCourses }}
      onCourseVisit={handleVisitCourse}
      enrolling={enrolling}
      enrolled={enrolled}
      error={error}
      showFullDescription={showFullDescription}
      setShowFullDescription={setShowFullDescription}
    />
  );
};

export default CourseDetailsRouteWrapper;