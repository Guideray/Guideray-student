import React, { useState, useEffect } from 'react';
import GuideRayVideoComponent from '../GuideRayVideoComponent';
import GuideRayCodingPracticeComponent from '../GuideRayCodingPracticeComponent';
import GuideRayPractice from '../../LearnPageComponents/GuideRayPractice';
import LockedTopic from '../LockedTopic';
import './index.css';

const GuideRayTopicContent = ({ topicData, darkMode, isLocked, onComplete, progressData, concept, topic, topicIndex, courseId, userData }) => {
  const [completedSteps, setCompletedSteps] = useState({
    video: false,
    mcq: false,
    coding: false
  });
  const [markedAsRead, setMarkedAsRead] = useState(false);
  const [topicProgress, setTopicProgress] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`https://webservice.guideray.in/api/consistancy/progress/${userData.id}/${courseId}`);
        const data = await response.json();
        if (data.success) {
          const topicProgressData = data.data.t[topicIndex];
          setTopicProgress(topicProgressData.p);
          
          setCompletedSteps({
            video: topicProgressData.p >= 0,
            mcq: topicProgressData.p >= 25,
            coding: topicProgressData.p >= 50
          });
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [userData.id, courseId, topicIndex]);

  const handleComplete = (step) => {
    const updatedSteps = { ...completedSteps, [step]: true };
    setCompletedSteps(updatedSteps);
    if (onComplete) onComplete(step);
  };

  const handleMarkAsRead = () => {
    setMarkedAsRead(!markedAsRead);
    console.log(`Marked as ${!markedAsRead ? 'read' : 'unread'}`);
  };

  if (loadingProgress) {
    return (
      <div className={`guideray-topic-content-loading ${darkMode ? 'guideray-topic-content-dark' : ''}`}>
        <div className="guideray-topic-content-spinner"></div>
        <p>Loading your progress...</p>
      </div>
    );
  }

  if (isLocked) {
    return <LockedTopic darkMode={darkMode} />;
  }

  return (
    <div className={`guideray-topic-content-container ${darkMode ? 'guideray-topic-content-dark' : ''}`}>
      <ul className="guideray-topic-content-learning-path">
        {topicData.videoComponent && (
          <li className="guideray-topic-content-path-step">
            <div className="guideray-topic-content-step-indicator">
              <div className="guideray-topic-content-step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 5h16v14H4V5zm2 2v10h12V7H6zm5 2l5 3-5 3V9z" />
                </svg>
              </div>
            </div>
            <div className="guideray-topic-content-step-content">
              <div className="guideray-topic-content-step-header">
                <span className="guideray-topic-content-step-number">Step 1: Foundation</span>
              </div>
              <h2 className="guideray-topic-content-step-title">Video Lesson</h2>
              <p className="guideray-topic-content-step-description">
                Watch this comprehensive video tutorial to understand the core concepts and fundamentals.
              </p>
              <GuideRayVideoComponent 
                videoData={topicData.videoComponent} 
                darkMode={darkMode} 
                onComplete={() => handleComplete('video')}
                isCompleted={completedSteps.video}
                topicIndex={topicIndex}
                courseId={courseId}
                studentId={userData.id}
              />
            </div>
          </li>
        )}
        
        {topicData.practiceMcq && (
          <li className="guideray-topic-content-path-step">
            <div className="guideray-topic-content-step-indicator">
              <div className="guideray-topic-content-step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm1-12h-2v6h2V8zm0 8h-2v2h2v-2z" />
                </svg>
              </div>
            </div>
            <div className="guideray-topic-content-step-content">
              <div className="guideray-topic-content-step-header">
                <span className="guideray-topic-content-step-number">Step 2: Reinforcement</span>
              </div>
              <div className="guideray-topic-content-locked-container">
                {topicProgress < 25 && (
                  <div className="guideray-topic-content-lock-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm-6 7h12v8H6v-8z"/>
                    </svg>
                  </div>
                )}
                <div className={`guideray-topic-content-locked-content ${topicProgress < 25 ? 'guideray-topic-content-blurred' : ''}`}>
                  <GuideRayPractice 
                    data={topicData.practiceMcq} 
                    darkMode={darkMode} 
                    onComplete={() => handleComplete('mcq')}
                    isLocked={topicProgress < 25}
                    topicIndex={topicIndex}
                    courseId={courseId}
                    studentId={userData.id}
                    studentName={userData.name}
                    topic={topic}
                    concept={concept}
                  />
                </div>
              </div>
            </div>
          </li>
        )}
        
        {topicData.codingPractice && (
          <li className="guideray-topic-content-path-step">
            <div className="guideray-topic-content-step-indicator">
              <div className="guideray-topic-content-step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 3v2h3V3H8zm5 0v2h3V3h-3zm5 0v2h1c.552 0 1 .448 1 1v14c0 .552-.448 1-1 1H5c-.552 0-1-.448-1-1V6c0-.552.448-1 1-1h1V3H3v18h18V3h-3zM8 17v-2H5v2h3zm5 0v-2h-3v2h3zm5 0v-2h-3v2h3zm0-5v-2H5v2h13z" />
                </svg>
              </div>
            </div>
            <div className="guideray-topic-content-step-content">
              <div className="guideray-topic-content-step-header">
                <span className="guideray-topic-content-step-number">Step 3: Application</span>
              </div>
              <div className="guideray-topic-content-locked-container">
                {topicProgress < 50 && (
                  <div className="guideray-topic-content-lock-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm-6 7h12v8H6v-8z"/>
                    </svg>
                  </div>
                )}
                <div className={`guideray-topic-content-locked-content ${topicProgress < 50 ? 'guideray-topic-content-blurred' : ''}`}>
                  <GuideRayCodingPracticeComponent 
                    codingData={topicData.codingPractice} 
                    darkMode={darkMode} 
                    onComplete={() => handleComplete('coding')}
                    isLocked={topicProgress < 50}
                    topicIndex={topicIndex}
                    courseId={courseId}
                    studentId={userData.id}
                    studentName={userData.name}
                    topic={topic}
                    concept={concept}
                  />
                </div>
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default GuideRayTopicContent;