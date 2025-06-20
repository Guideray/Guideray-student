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
    <div className={`guideray-app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="guideray-background-pattern"></div>
      
      <GuideRaySidebar 
        courseData={courseData} 
        selectedConcept={selectedConcept}
        selectedTopic={selectedTopic}
        onSelect={handleSelection}
        darkMode={darkMode}
      />
      
      <div className="guideray-main-content">
        <div className={`guideray-content-header-wrapper ${headerVisible ? 'visible' : ''}`}>
          <div className="guideray-header-content">
            <div className="guideray-concept-chip">
              <span>{selectedConcept}</span>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
              </svg>
            </div>
            <h1 className="guideray-content-header">
              <span className="guideray-header-highlight">{selectedTopic}</span>
            </h1>
            <div className="guideray-header-underline">
              <div className="guideray-underline-animation"></div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="guideray-loading-state">
            <div className="guideray-progress-bar">
              <div className="guideray-progress-fill"></div>
            </div>
            <div className="guideray-pulse-animation">
              <div className="guideray-pulse-dot"></div>
              <div className="guideray-pulse-dot"></div>
              <div className="guideray-pulse-dot"></div>
            </div>
          </div>
        ) : (
          <GuideRayTopicContent 
            topicData={courseData[selectedConcept][selectedTopic]} 
            darkMode={darkMode} 
          />
        )}
      </div>
      
      <div className="guideray-floating-actions">
        <button className="guideray-fab">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GuideRayApp;