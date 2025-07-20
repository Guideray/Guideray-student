import React, { useState, useEffect } from 'react';
import { 
  FaChevronDown, 
  FaChevronRight, 
  FaYoutube,
  FaQuestionCircle,
  FaCode,
  FaBook,
  FaGraduationCap,
  FaLock,
  FaCheck
} from 'react-icons/fa';
import './index.css';

const GuideRaySidebar = ({ courseData, selectedConcept, selectedTopic, onSelect, progressData }) => {
  const [expandedConcepts, setExpandedConcepts] = useState(() => {
    const initialState = {};
    Object.keys(courseData).forEach(concept => {
      initialState[concept] = selectedConcept === concept;
    });
    return initialState;
  });

  const toggleConcept = (concept) => {
    setExpandedConcepts(prev => ({
      ...prev,
      [concept]: !prev[concept]
    }));
  };

  // Check if a topic is completed
  const isTopicCompleted = (concept, topic) => {
    if (!progressData) return false;
    const course = progressData.courseProgress.find(cp => cp.courseName === concept);
    if (!course) return false;
    const topicIndex = Object.keys(courseData[concept]).indexOf(topic);
    return course.topics[topicIndex]?.completionPercentage === 100;
  };

  // Check if a topic is unlocked
  const isTopicUnlocked = (concept, topic) => {
    // First topic in first concept is always unlocked
    if (concept === Object.keys(courseData)[0] && 
        topic === Object.keys(courseData[concept])[0]) {
      return true;
    }
    
    // Check previous topic completion
    const concepts = Object.keys(courseData);
    const conceptIndex = concepts.indexOf(concept);
    
    // If not first concept, check last topic of previous concept
    if (conceptIndex > 0) {
      const prevConcept = concepts[conceptIndex - 1];
      const prevConceptTopics = Object.keys(courseData[prevConcept]);
      const lastTopicPrevConcept = prevConceptTopics[prevConceptTopics.length - 1];
      
      if (!isTopicCompleted(prevConcept, lastTopicPrevConcept)) {
        return false;
      }
    }
    
    // Check previous topic in same concept
    const topics = Object.keys(courseData[concept]);
    const topicIndex = topics.indexOf(topic);
    
    if (topicIndex > 0) {
      const prevTopic = topics[topicIndex - 1];
      if (!isTopicCompleted(concept, prevTopic)) {
        return false;
      }
    }
    
    return true;
  };

  return (
    <div className="guideray-video-course-sidebar-container">
      <div className="guideray-video-course-sidebar-header">
        <h2 className="guideray-video-course-sidebar-title">
          <FaGraduationCap className="guideray-video-course-sidebar-icon" />
          <div className='guideray-video-course-sidebar-icon-contain'>
            Python Mastery
            <span className="guideray-video-course-sidebar-subtitle">Complete Developer Course</span>
          </div>
        </h2>
      </div>
      
      <div className="guideray-video-course-sidebar-concepts">
        {Object.keys(courseData).map((concept) => (
          <div key={concept} className="guideray-video-course-sidebar-concept">
            <div 
              className={`guideray-video-course-sidebar-concept-header ${selectedConcept === concept ? 'active' : ''}`}
              onClick={() => toggleConcept(concept)}
            >
              <span className="guideray-video-course-sidebar-chevron">
                {expandedConcepts[concept] ? <FaChevronDown /> : <FaChevronRight />}
              </span>
              <span className="guideray-video-course-sidebar-concept-title">
                {concept}
              </span>
              <span className="guideray-video-course-sidebar-concept-count">
                {Object.keys(courseData[concept]).length}
              </span>
            </div>
            
            {expandedConcepts[concept] && (
              <div className="guideray-video-course-sidebar-topics">
                {Object.keys(courseData[concept]).map((topic) => {
                  const unlocked = isTopicUnlocked(concept, topic);
                  const completed = isTopicCompleted(concept, topic);
                  
                  return (
                    <div
                      key={topic}
                      className={`guideray-video-course-sidebar-topic ${selectedTopic === topic ? 'active' : ''} ${!unlocked ? 'locked' : ''}`}
                      onClick={() => unlocked && onSelect(concept, topic)}
                    >
                      <div className="guideray-video-course-sidebar-topic-content">
                        <span className="guideray-video-course-sidebar-topic-icon">
                          {getTopicIcon(courseData[concept][topic])}
                        </span>
                        <span className="guideray-video-course-sidebar-topic-title">
                          {topic}
                        </span>
                        {!unlocked && (
                          <span className="guideray-video-course-sidebar-topic-lock">
                            <FaLock />
                          </span>
                        )}
                        {completed && (
                          <span className="guideray-video-course-sidebar-topic-completed">
                            <FaCheck />
                          </span>
                        )}
                      </div>
                      <div className="guideray-video-course-sidebar-topic-badges">
                        {courseData[concept][topic].videoComponent && (
                          <span className="guideray-video-course-sidebar-badge video">
                            <FaYoutube />
                          </span>
                        )}
                        {courseData[concept][topic].practiceMcq && (
                          <span className="guideray-video-course-sidebar-badge mcq">
                            <FaQuestionCircle />
                          </span>
                        )}
                        {courseData[concept][topic].codingPractice && (
                          <span className="guideray-video-course-sidebar-badge coding">
                            <FaCode />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="guideray-video-course-sidebar-footer">
        <div className="guideray-video-course-sidebar-progress">
          <div className="guideray-video-course-sidebar-progress-bar">
            <div className="guideray-video-course-sidebar-progress-fill" style={{ width: `${progressData?.overallConsistency || 0}%` }}></div>
          </div>
          <span className="guideray-video-course-sidebar-progress-text">{progressData?.overallConsistency || 0}% Complete</span>
        </div>
      </div>
    </div>
  );
};

// Helper function to determine topic icon
function getTopicIcon(topicData) {
  if (topicData.videoComponent) return <FaYoutube />;
  if (topicData.codingPractice) return <FaCode />;
  if (topicData.practiceMcq) return <FaQuestionCircle />;
  return <FaBook />;
}

export default GuideRaySidebar;