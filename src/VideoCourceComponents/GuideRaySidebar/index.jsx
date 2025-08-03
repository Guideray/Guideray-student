import React, { useState, useEffect } from 'react';
import { 
  FaChevronDown, 
  FaChevronRight, 
  FaLock,
  FaClock
} from 'react-icons/fa';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { Link } from 'react-router-dom';
import './index.css';

const GuideRaySidebar = ({ 
  courseData, 
  selectedConcept, 
  selectedTopic, 
  onSelect, 
  progressData,
  darkMode,
  collapsed
}) => {
  const [expandedConcepts, setExpandedConcepts] = useState({});

  useEffect(() => {
    if (courseData) {
      const initialState = {};
      Object.keys(courseData).forEach(concept => {
        initialState[concept] = true;
      });
      setExpandedConcepts(initialState);
    }
  }, [courseData]);

  useEffect(() => {
    // Auto-select the last unlocked topic when component mounts or progress updates
    if (courseData && progressData) {
      const allTopics = getAllTopics();
      let lastUnlockedIndex = -1;
      
      // Find the last unlocked topic
      for (let i = 0; i < allTopics.length; i++) {
        if (isTopicUnlocked(i)) {
          lastUnlockedIndex = i;
        } else {
          break; // Topics are sequential, so we can break at first locked one
        }
      }
      
      // If we found an unlocked topic and no topic is currently selected
      if (lastUnlockedIndex >= 0 && (!selectedConcept || !selectedTopic)) {
        const topicToSelect = allTopics[lastUnlockedIndex];
        if (topicToSelect.concept !== selectedConcept || topicToSelect.topic !== selectedTopic) {
          onSelect(topicToSelect.concept, topicToSelect.topic);
        }
      }
    }
  }, [courseData, progressData]);

  const calculateCourseProgress = () => {
    if (!progressData || !progressData.t) {
      return {
        overallConsistency: 0,
        completedTopics: 0,
        totalTopics: 0
      };
    }

    const totalTopics = progressData.t.length;
    let completedTopics = 0;
    let totalProgress = 0;

    progressData.t.forEach(topic => {
      if (topic.p >= 75) completedTopics++;
      totalProgress += topic.p;
    });

    const overallConsistency = Math.round(totalProgress / totalTopics);

    return {
      overallConsistency,
      completedTopics,
      totalTopics
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
          globalIndex
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
    if (!progressData || !progressData.t) return false;
    return progressData.t[topicIndex - 1]?.p >= 75;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return '#10b981';
    if (percentage >= 50) return '#4dabf7';
    if (percentage >= 25) return '#f59f00';
    return '#94a3b8';
  };

  const getProgressIcon = (p) => {
    if (p >= 75) {
      return <IoMdCheckmarkCircle className="progress-icon" style={{ color: getProgressColor(p) }} />;
    }
    return <FaClock className="progress-icon" style={{ color: getProgressColor(p) }} />;
  };

  if (!courseData) {
    return (
      <div className={`guideray-sidebar-container ${darkMode ? 'dark-mode' : ''} ${collapsed ? 'collapsed' : ''}`}>
        <p>Course data not available</p>
      </div>
    );
  }

  return (
    <div className={`guideray-sidebar-container ${darkMode ? 'dark-mode' : ''} ${collapsed ? 'collapsed' : ''}`}>
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
                  {conceptTopics.filter(t => isTopicCompleted(t.globalIndex)).length}/{conceptTopics.length}
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
                    >
                      <div className="guideray-sidebar-timeline-marker">
                        {getProgressIcon(progress)}
                      </div>
                      
                      <div 
                        className={`guideray-sidebar-timeline-content ${selectedConcept === item.concept && selectedTopic === item.topic ? 'active' : ''}`}
                        onClick={() => unlocked && onSelect(item.concept, item.topic)}
                      >
                        <div className="guideray-sidebar-timeline-topic">{item.topic}</div>
                        {!unlocked && <FaLock className="guideray-sidebar-timeline-lock" />}
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
            <span>Progress</span>
            <span>{courseProgress.overallConsistency}%</span>
          </div>
          <div className="guideray-sidebar-progress-bar">
            <div 
              className="guideray-sidebar-progress-fill" 
              style={{ 
                width: `${courseProgress.overallConsistency}%`,
                backgroundColor: getProgressColor(courseProgress.overallConsistency)
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideRaySidebar;