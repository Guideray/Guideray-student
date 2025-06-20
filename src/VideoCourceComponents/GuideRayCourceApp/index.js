import React, { useState } from 'react';
import courseData from '../CourceData.json';
import GuideRaySidebar from '../GuideRaySidebar';
import GuideRayTopicContent from '../GuideRayTopicContent';
import './index.css';

const GuideRayApp = () => {
  const [selectedConcept, setSelectedConcept] = useState(Object.keys(courseData)[0]);
  const [selectedTopic, setSelectedTopic] = useState(Object.keys(courseData[Object.keys(courseData)[0]])[0]);

  const handleSelection = (concept, topic) => {
    if (concept) setSelectedConcept(concept);
    if (topic) setSelectedTopic(topic);
  };

  return (
    <div className="guideray-video-course-app-container">
      <GuideRaySidebar 
        courseData={courseData} 
        selectedConcept={selectedConcept}
        selectedTopic={selectedTopic}
        onSelect={handleSelection}
      />
      <div className="guideray-video-course-main-content">
        <h1 className="guideray-video-course-content-header">{selectedTopic}</h1>
        <GuideRayTopicContent topicData={courseData[selectedConcept][selectedTopic]} />
      </div>
    </div>
  );
};

export default GuideRayApp;