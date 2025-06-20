import React, { useState } from 'react';
import { 
  FaChevronDown, 
  FaChevronRight, 
  FaYoutube,
  FaQuestionCircle,
  FaCode,
  FaBook,
  FaGraduationCap
} from 'react-icons/fa';
import './index.css';

const GuideRaySidebar = ({ courseData, selectedConcept, selectedTopic, onSelect }) => {
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
                {Object.keys(courseData[concept]).map((topic) => (
                  <div
                    key={topic}
                    className={`guideray-video-course-sidebar-topic ${selectedTopic === topic ? 'active' : ''}`}
                    onClick={() => onSelect(concept, topic)}
                  >
                    <div className="guideray-video-course-sidebar-topic-content">
                      <span className="guideray-video-course-sidebar-topic-icon">
                        {getTopicIcon(courseData[concept][topic])}
                      </span>
                      <span className="guideray-video-course-sidebar-topic-title">
                        {topic}
                      </span>
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
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="guideray-video-course-sidebar-footer">
        <div className="guideray-video-course-sidebar-progress">
          <div className="guideray-video-course-sidebar-progress-bar">
            <div className="guideray-video-course-sidebar-progress-fill" style={{ width: '65%' }}></div>
          </div>
          <span className="guideray-video-course-sidebar-progress-text">65% Complete</span>
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