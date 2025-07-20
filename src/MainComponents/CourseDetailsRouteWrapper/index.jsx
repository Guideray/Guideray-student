import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronRight, FaStar, FaRegStar, FaClock, FaBook, FaLaptopCode, FaCertificate, FaChevronDown, FaCheck, FaArrowRight } from 'react-icons/fa';
import PaymentButton from '../../components/PaymentButton';
import CourseRecommendations from '../CourseRecommendations';
import CourseDetails from '../StudentCourseDetails';

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
        const response = await fetch('http://localhost:3001/api/courses/available');
        if (!response.ok) throw new Error('Failed to fetch available courses');
        const data = await response.json();
        
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
      const response = await fetch('http://localhost:3000/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.id,
          courseId: course._id
        })
      });

      if (!response.ok) throw new Error('Enrollment failed');
      
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Enrollment failed');
      
      setEnrolled(true);
    } catch (err) {
      setError(err.message);
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