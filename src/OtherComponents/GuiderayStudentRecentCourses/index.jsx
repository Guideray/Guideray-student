import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import courseContent from '../../VideoCourceComponents/CourceData.json';
import { FaClock, FaBook, FaLaptopCode, FaQuestionCircle } from 'react-icons/fa';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import './index.css';
import API_BASE_URL from '../../../config';

const GuiderayStudentCourseProgress = ({ userData }) => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const studentId = userData.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const enrolledResponse = await fetch(`${API_BASE_URL}/api/consistancy/${studentId}`);
                if (!enrolledResponse.ok) throw new Error('Failed to fetch enrolled courses');
                const enrolledData = await enrolledResponse.json();
                
                const enrolledCourses = enrolledData.success && enrolledData.data && enrolledData.data.cp 
                    ? enrolledData.data.cp 
                    : [];
                
                setCourses(enrolledCourses);
                if (enrolledCourses.length > 0) {
                    setSelectedCourse(enrolledCourses[0]);
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    const getCourseDetails = (courseName) => {
        return courseContent[courseName] || null;
    };

    const getTopicStatus = (topic) => {
        if (topic.p === 0) return 'not-started';
        if (topic.p === 25) return 'video-completed';
        if (topic.p === 50) return 'mcq-completed';
        if (topic.p >= 75) return 'completed';
        return 'in-progress';
    };

    const getStatusIcon = (status, step) => {
        if (status === 'completed') {
            return <IoMdCheckmarkCircle className="gscp-status-icon completed" />;
        }
        
        if (step === 'video' && status !== 'not-started') 
            return <IoMdCheckmarkCircle className="gscp-status-icon completed" />;
        
        if (step === 'mcq' && (status === 'mcq-completed' || status === 'completed' || status === 'completed')) 
            return <IoMdCheckmarkCircle className="gscp-status-icon completed" />;
        
        if (step === 'coding' && (status === 'completed' || status === 'completed')) 
            return <IoMdCheckmarkCircle className="gscp-status-icon completed" />;
        
        return <FaClock className="gscp-status-icon pending" />;
    };

    const hasVideoComponent = (content) => {
        return content && content.videoRecomendation && content.videoRecomendation.link;
    };

    const hasMcqComponent = (content) => {
        return content && content.practiceMcq && content.practiceMcq.quizQuestions && content.practiceMcq.quizQuestions.length > 0;
    };

    const hasCodingComponent = (content) => {
        return content && content.codingPractice && content.codingPractice.problems && content.codingPractice.problems.length > 0;
    };

    const handleTopicClick = (course, topicIndex) => {
        const courseDetails = getCourseDetails(course.n);
        if (!courseDetails) return;

        const topic = course.t[topicIndex];
        const status = getTopicStatus(topic);

        // Find which part contains this topic index
        let currentIndex = 0;
        let partName = '';
        let concept = '';
        
        // Iterate through all parts to find which one contains our topic index
        for (const [part, topics] of Object.entries(courseDetails)) {
            const topicCount = Object.keys(topics).length;
            if (topicIndex >= currentIndex && topicIndex < currentIndex + topicCount) {
                partName = part;
                concept = Object.keys(topics)[topicIndex - currentIndex];
                break;
            }
            currentIndex += topicCount;
        }

        if (!partName || !concept) return;


        // Navigate to the course with state containing the topic information
        navigate(`/video-courses/${course.n}`, {
            state: {
                topicIndex,
                partName,
                concept
            }
        });
    };

    const renderCourseTabs = () => {
        return (
            <div className="gscp-course-tabs">
                {courses.map((course, index) => (
                    <button
                        key={index}
                        className={`gscp-course-tab ${activeTab === index ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab(index);
                            setSelectedCourse(course);
                        }}
                    >
                        {course.n.replace('guideray_', '').replace(/_/g, ' ')}
                    </button>
                ))}
            </div>
        );
    };

    const renderCourseParts = () => {
        if (!selectedCourse) return null;
        
        const courseDetails = getCourseDetails(selectedCourse.n);
        if (!courseDetails) return <div className="gscp-error-message">Course details not found</div>;

        const partNames = Object.keys(courseDetails);
        let globalTopicIndex = 0;

        return (
            <div className="gscp-course-parts-container">
                {partNames.map((partName) => {
                    const concepts = Object.keys(courseDetails[partName]);
                    const partTopicCount = concepts.length;
                    const partStartIndex = globalTopicIndex;
                    
                    // Calculate completed count for this part
                    let completedCount = 0;
                    for (let i = 0; i < partTopicCount; i++) {
                        if (selectedCourse.t[partStartIndex + i]?.p === 100) {
                            completedCount++;
                        }
                    }
                    
                    const progressPercentage = Math.round((completedCount / partTopicCount) * 100);
                    
                    // Update global index for next part
                    globalTopicIndex += partTopicCount;
                    
                    return (
                        <div key={partName} className="gscp-course-part">
                            <div className="gscp-part-header">
                                <div className="gscp-part-header-content">
                                    <h3 className="gscp-part-title">{partName}</h3>
                                    <div className="gscp-part-progress-container">
                                        <span className="gscp-part-progress-text">
                                            {progressPercentage}% Complete
                                        </span>
                                        <div className="gscp-progress-bar">
                                            <div 
                                                className="gscp-progress-fill" 
                                                style={{ width: `${progressPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="gscp-topics-container">
                                {concepts.map((concept, partTopicIndex) => {
                                    const globalIndex = partStartIndex + partTopicIndex;
                                    const topic = selectedCourse.t[globalIndex];
                                    const status = topic ? getTopicStatus(topic) : 'not-started';
                                    const content = courseDetails[partName][concept];
                                    
                                    const showVideoStep = hasVideoComponent(content);
                                    const showMcqStep = hasMcqComponent(content);
                                    const showCodingStep = hasCodingComponent(content);
                                    
                                    return (
                                        <div key={globalIndex} className="gscp-topic-item">
                                            <div className="gscp-topic-header">
                                                <div className="gscp-topic-marker">
                                                    <div className={`gscp-marker-dot ${status}`}></div>
                                                    {partTopicIndex < concepts.length - 1 && (
                                                        <div className="gscp-marker-line"></div>
                                                    )}
                                                </div>
                                                <div className="gscp-topic-content">
                                                    <h4 
                                                        className={`gscp-topic-title ${status}`}
                                                        onClick={() => handleTopicClick(selectedCourse, globalIndex)}
                                                    >
                                                        {concept}
                                                    </h4>
                                                    
                                                    <div className="gscp-topic-steps">
                                                        {showVideoStep && (
                                                            <div 
                                                                className={`gscp-step ${status === 'completed' || status === 'video-completed' || status === 'mcq-completed' || status === 'completed' ? 'completed' : ''}`}
                                                                onClick={() => handleTopicClick(selectedCourse, globalIndex)}
                                                            >
                                                                {getStatusIcon(status, 'video')}
                                                                <span>Learn Topic</span>
                                                            </div>
                                                        )}
                                                        
                                                        {showMcqStep && (
                                                            <div 
                                                                className={`gscp-step ${status === 'completed' || status === 'mcq-completed' || status === 'completed' ? 'completed' : ''}`}
                                                                onClick={() => handleTopicClick(selectedCourse, globalIndex)}
                                                            >
                                                                {getStatusIcon(status, 'mcq')}
                                                                <span>MCQ Practice</span>
                                                            </div>
                                                        )}
                                                        
                                                        {showCodingStep && (
                                                            <div 
                                                                className={`gscp-step ${status === 'completed' || status === 'completed' ? 'completed' : ''}`}
                                                                onClick={() => handleTopicClick(selectedCourse, globalIndex)}
                                                            >
                                                                {getStatusIcon(status, 'coding')}
                                                                <span>Coding Practice</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="gscp-container gscp-loading-state">
                <div className="gscp-loader"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="gscp-container">
                <div className="gscp-error-message">
                    Error: {error}
                </div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="gscp-container">
                <div className="gscp-empty-message">
                    No courses enrolled yet.
                </div>
            </div>
        );
    }

    return (
        <div className="gscp-container">
            {selectedCourse && (
                <div className="gscp-course-content">
                    {renderCourseTabs()}
                    {renderCourseParts()}
                </div>
            )}
        </div>
    );
};

export default GuiderayStudentCourseProgress;