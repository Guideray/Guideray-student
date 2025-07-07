import React, { useState, useEffect } from 'react';
import courseData from '../CourceData.json';
import GuideRaySidebar from '../GuideRaySidebar';
import GuideRayTopicContent from '../GuideRayTopicContent';
import './index.css';

const GuideRayApp = ({ darkMode }) => {
  const [selectedConcept, setSelectedConcept] = useState(Object.keys(courseData)[0]);
  const [selectedTopic, setSelectedTopic] = useState(Object.keys(courseData[Object.keys(courseData)[0]])[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    setHeaderVisible(true);
    return () => setHeaderVisible(false);
  }, [selectedTopic]);

  const handleSelection = (concept, topic) => {
    setIsLoading(true);
    setHeaderVisible(false);
    setTimeout(() => {
      if (concept) setSelectedConcept(concept);
      if (topic) setSelectedTopic(topic);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className={`guideray-course-app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="guideray-course-app-background-pattern"></div>
      
      <GuideRaySidebar 
        courseData={courseData} 
        selectedConcept={selectedConcept}
        selectedTopic={selectedTopic}
        onSelect={handleSelection}
        darkMode={darkMode}
      />
      
      <div className="guideray-course-app-main-content">
        <div className={`guideray-course-app-content-header-wrapper ${headerVisible ? 'visible' : ''}`}>
          <div className="guideray-course-app-header-content">
            <div className="guideray-course-app-concept-chip">
              <span>{selectedConcept} &gt; {selectedTopic}</span>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
              </svg>
            </div>
            <h1 className="guideray-course-app-content-header">
              <div className="guideray-course-app-breadcrumb">
                <span>{selectedConcept}</span> &gt; {selectedTopic}
              </div>
            </h1>
  
          </div>
        </div>
        
        {isLoading ? (
          <div className="guideray-course-app-loading-state">
            <div className="guideray-course-app-progress-bar">
              <div className="guideray-course-app-progress-fill"></div>
            </div>
            <div className="guideray-course-app-pulse-animation">
              <div className="guideray-course-app-pulse-dot"></div>
              <div className="guideray-course-app-pulse-dot"></div>
              <div className="guideray-course-app-pulse-dot"></div>
            </div>
          </div>
        ) : (
          <GuideRayTopicContent 
            topicData={courseData[selectedConcept][selectedTopic]} 
            darkMode={darkMode} 
          />
        )}
      </div>
      
      {/* <div className="guideray-course-app-floating-actions">
        <button className="guideray-course-app-fab">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
        </button>
      </div> */}
    </div>
  );
};

export default GuideRayApp;