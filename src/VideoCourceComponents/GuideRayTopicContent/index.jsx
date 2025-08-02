import React, { useState, useEffect } from 'react';
import GuidedVideoRecommendation from '../GuidedVideoRecommendation';
import GuideRayCodingPracticeComponent from '../GuideRayCodingPracticeComponent';
import GuideRayPractice from '../../LearnPageComponents/GuideRayPractice';
import LockedTopic from '../LockedTopic';
import './index.css';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../../config';

const GuideRayTopicContent = ({ topicData, darkMode, isLocked, onComplete, progressData, concept, topic, topicIndex, courseId, userData }) => {
  const [completedSteps, setCompletedSteps] = useState({
    video: false,
    cheatsheet: false,
    mcq: false,
    coding: false
  });
  const [markedAsRead, setMarkedAsRead] = useState(false);
  const [topicProgress, setTopicProgress] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [videoWatchedPercentage, setVideoWatchedPercentage] = useState(0);
  const [reloadTrigger, setReloadTrigger] = useState(false); // New state for triggering reloads
  const navigate = useNavigate();

  // Function to get cookie value
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const fetchProgress = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/consistancy/progress/${userData.id}/${courseId}`);
      const data = await response.json();
      if (data.success) {
        const topicProgressData = data.data.t[topicIndex] || { p: 0 };
        setTopicProgress(topicProgressData.p);
        
        setCompletedSteps({
          video: topicProgressData.p >= 10,
          cheatsheet: topicProgressData.p >= 25,
          mcq: topicProgressData.p >= 50,
          coding: topicProgressData.p >= 100
        });
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoadingProgress(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [userData.id, courseId, topicIndex, reloadTrigger]); // Added reloadTrigger to dependencies

  const handleVideoProgress = (progress) => {
    setVideoWatchedPercentage(progress);
    if (progress >= 95 && !completedSteps.video) {
      handleComplete('video');
    }
  };

  const handleComplete = async (step) => {
    const updatedSteps = { ...completedSteps, [step]: true };
    setCompletedSteps(updatedSteps);
    
    // Calculate new progress based on completed steps
    let newProgress = 0;
    if (updatedSteps.video) newProgress = 25;
    if (updatedSteps.cheatsheet) newProgress = 50;
    if (updatedSteps.mcq) newProgress = 75;
    if (updatedSteps.coding) newProgress = 100;
    
    setTopicProgress(newProgress);
    
    // Trigger reload after state update
    if (onComplete) {
      await onComplete(step, newProgress);
      setReloadTrigger(prev => !prev); // Toggle reload trigger to force refresh
    }
  };

  const handleMarkAsRead = () => {
    setMarkedAsRead(!markedAsRead);
  };

  const handleCheatsheetClick = async () => {
    const token = getCookie('studentToken');
    if (!token) {
      alert('Please login to access this resource');
      navigate('/login');
      return;
    }
    
    if (topicData.cheetsheet?.link) {
      window.open(topicData.cheetsheet.link, '_blank');
      if (!completedSteps.cheatsheet) {
        await handleComplete('cheatsheet');
      }
    }
  };

  if (loadingProgress) {
    return (
      <div className={`guideRay-topic-content-loading ${darkMode ? 'guideRay-topic-content-dark' : ''}`}>
        <div className="guideRay-topic-content-spinner"></div>
        <p>Loading your progress...</p>
      </div>
    );
  }

  if (isLocked) {
    return <LockedTopic darkMode={darkMode} />;
  }

  return (
    <div className={`guideRay-topic-content-container ${darkMode ? 'guideRay-topic-content-dark' : ''}`}>
      <ul className="guideray-topic-content-learning-path">
        {topicData.videoRecomendation && (
          <li className={`guideray-topic-content-path-step ${completedSteps.video ? 'guideray-topic-content-completed' : ''}`}>
            <div className="guideray-topic-content-step-indicator">
              <div className={`guideray-topic-content-step-icon ${completedSteps.video ? 'guideray-topic-content-step-completed' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 5h16v14H4V5zm2 2v10h12V7H6zm5 2l5 3-5 3V9z" />
                </svg>
                {completedSteps.video && (
                  <div className="guideray-topic-content-completion-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="guideray-topic-content-step-content">
              <div className="guideray-topic-content-step-header">
                <span className="guideray-topic-content-step-number">Step 1: Foundation</span>
                {completedSteps.video && (
                  <span className="guideray-topic-content-step-completed-label">Completed</span>
                )}
              </div>
       
              <GuidedVideoRecommendation 
                videoData={topicData.videoRecomendation} 
                darkMode={darkMode} 
                onComplete={() => handleComplete('video')}
                onProgress={handleVideoProgress}
                isCompleted={completedSteps.video}
                topicIndex={topicIndex}
                courseId={courseId}
                studentId={userData.id}
              />
            </div>
          </li>
        )}

        {/* Cheatsheet Step */}
        {topicData.cheetsheet && (
          <li className={`guideray-topic-content-path-step ${completedSteps.cheatsheet ? 'guideray-topic-content-completed' : ''}`}>
            <div className="guideray-topic-content-step-indicator">
              <div className={`guideray-topic-content-step-icon ${completedSteps.cheatsheet ? 'guideray-topic-content-step-completed' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                {completedSteps.cheatsheet && (
                  <div className="guideray-topic-content-completion-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="guideray-topic-content-step-content">
              <div className="guideray-topic-content-step-header">
                <span className="guideray-topic-content-step-number">Step 2: Quick Reference</span>
                {completedSteps.cheatsheet && (
                  <span className="guideray-topic-content-step-completed-label">Completed</span>
                )}
              </div>
              <div className="guideray-topic-content-cheatsheet-container">
                <div className="guideray-topic-content-cheatsheet-card" onClick={handleCheatsheetClick}>
                  <div className="guideray-topic-content-cheatsheet-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                  </div>
                  <div className="guideray-topic-content-cheatsheet-info">
                    <h4>{topic} Cheatsheet</h4>
                    <p>Quick reference guide for key concepts</p>
                  </div>
                  <div className="guideray-topic-content-cheatsheet-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 17l5-5-5-5v10z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </li>
        )}
        
        {topicData.practiceMcq && (
          <li className={`guideray-topic-content-path-step ${completedSteps.mcq ? 'guideray-topic-content-completed' : ''}`}>
            <div className="guideray-topic-content-step-indicator">
              <div className={`guideray-topic-content-step-icon ${completedSteps.mcq ? 'guideray-topic-content-step-completed' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm1-12h-2v6h2V8zm0 8h-2v2h2v-2z" />
                </svg>
                {completedSteps.mcq && (
                  <div className="guideray-topic-content-completion-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="guideray-topic-content-step-content">
              <div className="guideray-topic-content-step-header">
                <span className="guideray-topic-content-step-number">Step 3: Reinforcement</span>
                {completedSteps.mcq && (
                  <span className="guideray-topic-content-step-completed-label">Completed</span>
                )}
              </div>
              <div className="guideray-topic-content-locked-container">
                {!completedSteps.video && (
                  <div className="guideray-topic-content-lock-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm-6 7h12v8H6v-8z"/>
                    </svg>
                    <p className="guideray-topic-content-lock-message">
                      Complete the video lesson first
                    </p>
                  </div>
                )}
                <div className={`guideray-topic-content-locked-content ${!completedSteps.video ? 'guideray-topic-content-blurred' : ''}`}>
                  <GuideRayPractice 
                    data={topicData.practiceMcq} 
                    darkMode={darkMode} 
                    onComplete={() => handleComplete('mcq')}
                    isLocked={!completedSteps.video}
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
          <li className={`guideray-topic-content-path-step ${completedSteps.coding ? 'guideray-topic-content-completed' : ''}`}>
            <div className="guideray-topic-content-step-indicator">
              <div className={`guideray-topic-content-step-icon ${completedSteps.coding ? 'guideray-topic-content-step-completed' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 3v2h3V3H8zm5 0v2h3V3h-3zm5 0v2h1c.552 0 1 .448 1 1v14c0 .552-.448 1-1 1H5c-.552 0-1-.448-1-1V6c0-.552.448-1 1-1h1V3H3v18h18V3h-3zM8 17v-2H5v2h3zm5 0v-2h-3v2h3zm5 0v-2h-3v2h3zm0-5v-2H5v2h13z" />
                </svg>
                {completedSteps.coding && (
                  <div className="guideray-topic-content-completion-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="guideray-topic-content-step-content">
              <div className="guideray-topic-content-step-header">
                <span className="guideray-topic-content-step-number">Step 4: Application</span>
                {completedSteps.coding && (
                  <span className="guideray-topic-content-step-completed-label">Completed</span>
                )}
              </div>
              <div className="guideray-topic-content-locked-container">
                {!completedSteps.mcq && (
                  <div className="guideray-topic-content-lock-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm-6 7h12v8H6v-8z"/>
                    </svg>
                    <p className="guideray-topic-content-lock-message">
                      Complete the MCQ practice first
                    </p>
                  </div>
                )}
                <div className={`guideray-topic-content-locked-content ${!completedSteps.mcq ? 'guideray-topic-content-blurred' : ''}`}>
                  <GuideRayCodingPracticeComponent 
                    codingData={topicData.codingPractice} 
                    darkMode={darkMode} 
                    onComplete={() => handleComplete('coding')}
                    isLocked={!completedSteps.mcq}
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