import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import courseContent from '../../VideoCourceComponents/CourceData.json';
import { FaPlay, FaCode, FaListUl, FaCheck } from 'react-icons/fa';
import './index.css';

const GuiderayStudentRecentCourses = ({ userData, consistencyData }) => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (consistencyData && consistencyData.cp) {
            setCourses(consistencyData.cp);
            if (consistencyData.cp.length > 0 && !selectedCourse) {
                setSelectedCourse(consistencyData.cp[0]);
            }
            setLoading(false);
        } else if (consistencyData) {
            setCourses([]);
            setLoading(false);
        }
    }, [consistencyData, selectedCourse]);

    const getCourseDetails = (courseName) => {
        return courseContent[courseName] || null;
    };

    const getTopicStatus = (topic) => {
        if (topic.p === 0) return 'status-pending';
        if (topic.p === 100) return 'status-completed';
        return 'status-inprogress';
    };

    const renderStepIcon = (type, isAvailable, isCompleted, onClick) => {
        if (!isAvailable) return null;

        let icon;
        let label;
        if (type === 'video') { icon = <FaPlay />; label = "Watch"; }
        if (type === 'mcq') { icon = <FaListUl />; label = "Quiz"; }
        if (type === 'coding') { icon = <FaCode />; label = "Code"; }

        let statusClass = 'step-pending';
        if (isCompleted) {
            statusClass = 'step-completed';
            icon = <FaCheck />; 
        } else if (isAvailable) {
            statusClass = 'step-active';
        }

        return (
            <div 
                className={`gr-step-badge ${statusClass}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                title={label}
            >
                <span className="gr-step-icon">{icon}</span>
                <span className="gr-step-label">{label}</span>
            </div>
        );
    };

    const hasVideoComponent = (content) => content?.videoRecomendation?.link;
    const hasMcqComponent = (content) => content?.practiceMcq?.quizQuestions?.length > 0;
    const hasCodingComponent = (content) => content?.codingPractice?.problems?.length > 0;

    const handleTopicClick = (course, topicIndex) => {
        const courseDetails = getCourseDetails(course.n);
        if (!courseDetails) return;

        const topic = course.t[topicIndex];
        let currentIndex = 0;
        let partName = '';
        let concept = '';
        
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

        navigate(`/video-courses/${course.n}`, {
            state: { topicIndex, partName, concept }
        });
    };

    const renderCourseTabs = () => (
        <div className="gr-tabs-wrapper">
            {courses.map((course, index) => (
                <button
                    key={index}
                    className={`gr-tab-btn ${activeTab === index ? 'active' : ''}`}
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

    const renderCourseParts = () => {
        if (!selectedCourse) return null;
        
        const courseDetails = getCourseDetails(selectedCourse.n);
        if (!courseDetails) return <div className="gr-empty-state">Course details not found</div>;

        const partNames = Object.keys(courseDetails);
        let globalTopicIndex = 0;

        return (
            <div className="gr-parts-container">
                {partNames.map((partName) => {
                    const concepts = Object.keys(courseDetails[partName]);
                    const partTopicCount = concepts.length;
                    const partStartIndex = globalTopicIndex;
                    
                    let completedCount = 0;
                    for (let i = 0; i < partTopicCount; i++) {
                        if (selectedCourse.t[partStartIndex + i]?.p === 100) completedCount++;
                    }
                    
                    const progressPercentage = Math.round((completedCount / partTopicCount) * 100);
                    globalTopicIndex += partTopicCount;
                    
                    return (
                        <div key={partName} className="gr-module-card">
                            <div className="gr-module-header">
                                <div className="gr-module-info">
                                    <h3 className="gr-module-title">{partName}</h3>
                                    <span className="gr-module-stats">{completedCount}/{partTopicCount} Lessons Completed</span>
                                </div>
                                <div className="gr-circular-progress">
                                    <svg viewBox="0 0 36 36" className="gr-circular-chart">
                                        <path className="gr-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path 
                                            className="gr-circle" 
                                            strokeDasharray={`${progressPercentage}, 100`} 
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        />
                                    </svg>
                                    <span className="gr-circle-text">{progressPercentage}%</span>
                                </div>
                            </div>
                            
                            <div className="gr-topic-list">
                                {concepts.map((concept, partTopicIndex) => {
                                    const globalIndex = partStartIndex + partTopicIndex;
                                    const topic = selectedCourse.t[globalIndex];
                                    const statusClass = topic ? getTopicStatus(topic) : 'status-pending';
                                    const content = courseDetails[partName][concept];
                                    
                                    const isVideoDone = topic?.p >= 25;
                                    const isMcqDone = topic?.p >= 50;
                                    const isCodeDone = topic?.p >= 75;

                                    return (
                                        <div 
                                            key={globalIndex} 
                                            className={`gr-topic-row ${statusClass}`}
                                            onClick={() => handleTopicClick(selectedCourse, globalIndex)}
                                        >
                                            <div className="gr-topic-main">
                                                <h4 className="gr-topic-name">{concept}</h4>
                                                <span className="gr-topic-status-text">
                                                    {statusClass === 'status-completed' ? 'Completed' : 
                                                     statusClass === 'status-inprogress' ? 'In Progress' : 'Not Started'}
                                                </span>
                                            </div>

                                            <div className="gr-topic-actions">
                                                {renderStepIcon('video', hasVideoComponent(content), isVideoDone, () => handleTopicClick(selectedCourse, globalIndex))}
                                                {renderStepIcon('mcq', hasMcqComponent(content), isMcqDone, () => handleTopicClick(selectedCourse, globalIndex))}
                                                {renderStepIcon('coding', hasCodingComponent(content), isCodeDone, () => handleTopicClick(selectedCourse, globalIndex))}
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

    if (loading) return <div className="gr-loading-container"><div className="gr-spinner"></div></div>;
    if (error) return <div className="gr-message-box error">Error: {error}</div>;
    if (courses.length === 0) return <div className="gr-message-box">No courses enrolled yet.</div>;

    return (
        <div className="gr-main-wrapper">
            {selectedCourse && (
                <>
                    {renderCourseTabs()}
                    {renderCourseParts()}
                </>
            )}
        </div>
    );
};

export default GuiderayStudentRecentCourses;