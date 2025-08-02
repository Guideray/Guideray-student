import React, { useState, useEffect } from 'react';
import { 
  FaChevronDown, 
  FaChevronRight, 
  FaYoutube,
  FaQuestionCircle,
  FaCode,
  FaLock,
  FaFire,
  FaClock
} from 'react-icons/fa';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../../../config';

import axios from 'axios';
import './index.css';

const GuideRaySidebar = ({ courseData, selectedConcept, selectedTopic, onSelect, studentId, courseId }) => {
  const [expandedConcepts, setExpandedConcepts] = useState({});
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/consistancy/progress/${studentId}/${courseId}`
        );
        setProgressData(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    if (studentId && courseId) {
      fetchProgressData();
      const intervalId = setInterval(fetchProgressData, 30000);
      return () => clearInterval(intervalId);
    }
  }, [studentId, courseId]);

  useEffect(() => {
    if (courseData) {
      const initialState = {};
      Object.keys(courseData).forEach(concept => {
        initialState[concept] = true;
      });
      setExpandedConcepts(initialState);
    }
  }, [courseData]);

  const calculateCourseProgress = () => {
    if (!progressData || !progressData.t) {
      return {
        overallConsistency: 0,
        streak: 0,
        completedTopics: 0,
        totalTopics: 0,
        inProgress: 0,
        notStarted: 0
      };
    }

    const totalTopics = progressData.t.length;
    let completedTopics = 0;
    let inProgress = 0;
    let totalProgress = 0;

    progressData.t.forEach(topic => {
      if (topic.p >= 75) completedTopics++;
      else if (topic.p > 0) inProgress++;
      totalProgress += topic.p;
    });

    const overallConsistency = Math.round(totalProgress / totalTopics);
    const notStarted = totalTopics - completedTopics - inProgress;

    return {
      overallConsistency,
      streak: progressData.streak?.c || 0,
      completedTopics,
      totalTopics,
      inProgress,
      notStarted
    };
  };

  const courseProgress = calculateCourseProgress();

  const toggleConcept = (concept) => {
    setExpandedConcepts(prev => ({
      ...prev,
      [concept]: !prev[concept]
    }));
  };

  const getAllTopics = () => {
    if (!courseData) return [];
    
    let topics = [];
    let globalIndex = 0;
    Object.keys(courseData).forEach(concept => {
      Object.keys(courseData[concept]).forEach(topic => {
        topics.push({
          concept,
          topic,
          globalIndex,
          data: courseData[concept][topic]
        });
        globalIndex++;
      });
    });
    return topics;
  };

  const allTopics = getAllTopics();

  const isTopicCompleted = (topicIndex) => {
    if (!progressData || !progressData.t || !progressData.t[topicIndex]) return false;
    return progressData.t[topicIndex].p >= 75;
  };

  const isTopicUnlocked = (topicIndex) => {
    if (topicIndex === 0) return true;
    return isTopicCompleted(topicIndex - 1);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return '#10b981';
    if (percentage >= 50) return '#4dabf7';
    if (percentage >= 25) return '#f59f00';
    return '#94a3b8';
  };

  const formatCourseName = (id) => {
    if (!id) return '';
    const parts = id.split('_');
    if (parts.length < 2) return id;
    return parts.slice(1)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const getProgressIcon = (p) => {
    if (p >= 75) {
      return <IoMdCheckmarkCircle className="progress-icon" style={{ color: getProgressColor(p) }} />;
    }
    return <FaClock className="progress-icon-1" style={{ color: getProgressColor(p) }} />;
  };

  if (loading) {
    return (
      <div className="guideray-sidebar-container loading">
        <div className="loading-spinner"></div>
        <p>Loading your progress...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guideray-sidebar-container error">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="guideray-sidebar-container error">
        <p className="error-message">Course data not available</p>
      </div>
    );
  }

  return (
    <div className="guideray-sidebar-container">
      <div className="guideray-sidebar-header">
      <div className="guideray-sidebar-logo-container">
  <Link to="/">
    <img 
      src="https://res.cloudinary.com/dx97khgxd/image/upload/v1747826507/b4r9unmciqqgfiuncwcp.png" 
      alt="GuideRay Logo" 
      className="guideray-sidebar-logo"
    />
  </Link>
</div>
        <h2 className="guideray-sidebar-title">
          {formatCourseName(progressData?.n)}
        </h2>
      </div>

      <div className="guideray-sidebar-concepts">
        {Object.keys(courseData).map((concept) => {
          const conceptTopics = allTopics.filter(topic => topic.concept === concept);
          
          return (
            <div key={concept} className="guideray-sidebar-concept">
              <div 
                className={`guideray-sidebar-concept-header ${selectedConcept === concept ? 'active' : ''}`}
                onClick={() => toggleConcept(concept)}
              >
                <span className="guideray-sidebar-chevron">
                  {expandedConcepts[concept] ? <FaChevronDown /> : <FaChevronRight />}
                </span>
                <span className="guideray-sidebar-concept-title">{concept}</span>
                <span className="guideray-sidebar-concept-count">
                  {conceptTopics.filter(t => isTopicCompleted(t.globalIndex)).length} / {conceptTopics.length}
                </span>
              </div>
              
              <div className={`guideray-sidebar-timeline-section ${expandedConcepts[concept] ? '' : 'collapsed'}`}>
                <div className="guideray-sidebar-timeline-line"></div>
                
                {conceptTopics.map((item) => {
                  const globalIndex = item.globalIndex;
                  const unlocked = isTopicUnlocked(globalIndex);
                  const progress = progressData?.t?.[globalIndex]?.p || 0;
                  const completed = isTopicCompleted(globalIndex);
                  
                  return (
                    <div
                      key={`${item.concept}-${item.topic}`}
                      className={`guideray-sidebar-timeline-item ${completed ? 'completed' : ''} ${!unlocked ? 'locked' : ''}`}
                      data-progress={progress}
                    >
                      <div className="guideray-sidebar-timeline-marker">
                        {getProgressIcon(progress)}
                      </div>
                      
                      <div 
                        className={`guideray-sidebar-timeline-content ${selectedConcept === item.concept && selectedTopic === item.topic ? 'active' : ''}`}
                        onClick={() => unlocked && onSelect(item.concept, item.topic)}
                      >
                        <div className="guideray-sidebar-timeline-topic">{item.topic}</div>
                        
                        {!unlocked && (
                          <FaLock className="guideray-sidebar-timeline-lock" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="guideray-sidebar-footer">
        <div className="guideray-sidebar-progress-container">
          <div className="guideray-sidebar-progress-text">
            <span>Overall Progress</span>
            <span>{courseProgress.overallConsistency}%</span>
          </div>
          <div className="guideray-sidebar-progress">
            <div className="guideray-sidebar-progress-bar">
              <div 
                className="guideray-sidebar-progress-fill" 
                style={{ 
                  width: `${courseProgress.overallConsistency}%`,
                  background: getProgressColor(courseProgress.overallConsistency)
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideRaySidebar;