import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import courseContent from '../../VideoCourceComponents/CourceData.json';
import { FaStar, FaRegStar, FaClock, FaBook, FaLaptopCode, FaCertificate } from 'react-icons/fa';
import './index.css';

const GuiderayStudentRecentCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const studentId = "684e8df52d038e0ae2fa5d26"; // Default student ID

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch enrolled courses
                const enrolledResponse = await fetch(`https://webservice.guideray.in/api/consistancy/${studentId}`);
                if (!enrolledResponse.ok) throw new Error('Failed to fetch enrolled courses');
                const enrolledData = await enrolledResponse.json();
                
                const enrolledCourses = enrolledData.success && enrolledData.data && enrolledData.data.cp 
                    ? enrolledData.data.cp 
                    : [];
                setCourses(enrolledCourses);

                // Fetch available courses
                const availableResponse = await fetch('https://webservice.guideray.in/api/courses/available');
                if (!availableResponse.ok) throw new Error('Failed to fetch available courses');
                const availableData = await availableResponse.json();
                
                // Filter out courses that are already registered
                const registeredCourseIds = enrolledCourses.map(c => c.n);
                const filteredAvailableCourses = availableData.data 
                    ? availableData.data.filter(course => !registeredCourseIds.includes(course._id))
                    : [];
                
                setAvailableCourses(filteredAvailableCourses);

            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    const GuiderayStudentRecentCourses_getCurrentTopic = (course) => {
        if (!course.t || !Array.isArray(course.t)) return null;
        
        const midProgressTopic = course.t.find(topic => topic.p > 0 && topic.p < 75);
        if (midProgressTopic) return midProgressTopic;

        const seventyFiveTopicIndex = course.t.findIndex(topic => topic.p === 75);
        if (seventyFiveTopicIndex !== -1 && seventyFiveTopicIndex + 1 < course.t.length) {
            return course.t[seventyFiveTopicIndex + 1];
        }

        return course.t.find(topic => topic.p === 0) || course.t[0];
    };

    const GuiderayStudentRecentCourses_getCourseDetails = (courseName) => {
        const course = courseContent[courseName];
        if (!course) return null;

        const category = Object.keys(course)[0];
        const concept = Object.keys(course[category])[0];
        const content = course[category][concept];

        return {
            category,
            concept,
            thumbnail: content.videoComponent.thumbnail,
            title: content.videoComponent.title
        };
    };

    const GuiderayStudentRecentCourses_handleCourseClick = (course, isAvailable = false) => {
        if (isAvailable) {
            navigate('/course-details', { state: { course } });
            return;
        }

        const currentTopic = GuiderayStudentRecentCourses_getCurrentTopic(course);
        const courseDetails = GuiderayStudentRecentCourses_getCourseDetails(course.n);

        navigate(`/video-courses/${course.n}`, {
            state: {
                topicIndex: currentTopic?.t || 0,
                topicName: courseDetails?.concept || 'Introduction',
                courseName: course.n,
                courseData: courseContent[course.n]
            }
        });
    };

    const GuiderayStudentRecentCourses_getProgressText = (course) => {
        const currentTopic = GuiderayStudentRecentCourses_getCurrentTopic(course);
        
        if (!currentTopic) return "Start learning now";
        if (currentTopic.p === 0) return "You haven't started this course yet";
        if (currentTopic.p === 100) return "You've completed this topic!";
        if (currentTopic.p > 0 && currentTopic.p < 100) return `You're ${currentTopic.p}% through this topic`;
        return "Continue your learning journey";
    };

    const GuiderayStudentRecentCourses_renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="GuiderayStudentRecentCourses-filled" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStar key={i} className="GuiderayStudentRecentCourses-half" />);
            } else {
                stars.push(<FaRegStar key={i} />);
            }
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="GuiderayStudentRecentCourses-container GuiderayStudentRecentCourses-loading-state">
                <div className="GuiderayStudentRecentCourses-loader"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="GuiderayStudentRecentCourses-container">
                <div className="GuiderayStudentRecentCourses-error">
                    Error: {error}
                </div>
            </div>
        );
    }

    const showRecommendations = courses.length <= 2 && availableCourses.length > 0;

    return (
        <div className="GuiderayStudentRecentCourses-container">
            
            {/* Enrolled Courses Section */}
            {courses.length > 0 && (
                <div className="GuiderayStudentRecentCourses-courses-section">
                    <div className="GuiderayStudentRecentCourses-courses-grid">
                        {courses.map((course, index) => {
                            const courseDetails = GuiderayStudentRecentCourses_getCourseDetails(course.n);
                            if (!courseDetails) return null;

                            return (
                                <div 
                                    key={`enrolled-${index}`} 
                                    className="GuiderayStudentRecentCourses-course-card GuiderayStudentRecentCourses-enrolled"
                                    onClick={() => GuiderayStudentRecentCourses_handleCourseClick(course)}
                                >
                                    <div className="GuiderayStudentRecentCourses-card-image">
                                        <img 
                                            src={courseDetails.thumbnail} 
                                            alt={courseDetails.title} 
                                        />
                                    </div>
                                    <div className="GuiderayStudentRecentCourses-card-content">
                                        <h3 className="GuiderayStudentRecentCourses-card-title">{courseDetails.title}</h3>
                                        <div className='GuiderayStudentRecentCourses-card-title-inner'>
                                            <p className="GuiderayStudentRecentCourses-category">{courseDetails.category}</p>
                                            <p className="GuiderayStudentRecentCourses-concept">{courseDetails.concept}</p>
                                        </div>
                                        <p className="GuiderayStudentRecentCourses-progress">
                                            {GuiderayStudentRecentCourses_getProgressText(course)}
                                        </p>
                                        <button 
                                            className="GuiderayStudentRecentCourses-action-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                GuiderayStudentRecentCourses_handleCourseClick(course);
                                            }}
                                        >
                                            {course.t && course.t[0]?.p === 0 ? "Start Course" : "Continue Course"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Recommendations Section */}
            {showRecommendations && (
                <div className="GuiderayStudentRecentCourses-courses-section">
                    <div className="GuiderayStudentRecentCourses-courses-grid">
                        {availableCourses.slice(0, 4).map((course, index) => (
                            <div 
                                key={`available-${index}`} 
                                className="GuiderayStudentRecentCourses-course-card GuiderayStudentRecentCourses-available"
                                onClick={() => GuiderayStudentRecentCourses_handleCourseClick(course, true)}
                            >
                                <div className="GuiderayStudentRecentCourses-card-image">
                                    <img 
                                        src={course.image} 
                                        alt={course.name} 
                                    />
                                </div>
                                <div className="GuiderayStudentRecentCourses-card-content">
                                    <div className='GuiderayStudentRecentCourses-card-content-1'>
                                        <h3 className="GuiderayStudentRecentCourses-card-title">{course.name}</h3>
                                        <p className="GuiderayStudentRecentCourses-category">{course.category}</p>
                                    </div>
                                    <div className="GuiderayStudentRecentCourses-rating">
                                        {GuiderayStudentRecentCourses_renderStars(course.rating)}
                                        <span>{course.rating.toFixed(1)} ({course.students} students)</span>
                                    </div>
                                    <div className="GuiderayStudentRecentCourses-meta">
                                        <span><FaClock /> {course.duration}</span>
                                        <span><FaBook /> {course.modules} modules</span>
                                        {course.projects > 0 && <span><FaLaptopCode /> {course.projects} projects</span>}
                                        {course.certificate && <span><FaCertificate /> Certificate</span>}
                                    </div>
                                    <button 
                                        className="GuiderayStudentRecentCourses-enroll-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            GuiderayStudentRecentCourses_handleCourseClick(course, true);
                                        }}
                                    >
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {courses.length === 0 && availableCourses.length === 0 && (
                <div className="GuiderayStudentRecentCourses-empty">
                    <p>No courses available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default GuiderayStudentRecentCourses;