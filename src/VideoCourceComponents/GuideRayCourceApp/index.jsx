import React, { useState, useEffect } from 'react';
import courseData from '../CourceData.json';
import GuideRaySidebar from '../GuideRaySidebar';
import GuideRayTopicContent from '../GuideRayTopicContent';
import './index.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../../../config';

const GuideRayApp = ({ darkMode, userData }) => {
  const { courseId } = useParams();
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const studentId = userData.id

  // Initialize selected concept and topic
  useEffect(() => {
    if (courseId && courseData[courseId] && !initialized) {
      const concepts = Object.keys(courseData[courseId]);
      if (concepts.length > 0) {
        const firstConcept = concepts[0];
        const topics = Object.keys(courseData[courseId][firstConcept]);
        if (topics.length > 0) {
          setSelectedConcept(firstConcept);
          setSelectedTopic(topics[0]);
          setInitialized(true);
        }
      }
    }
  }, [courseId, initialized]);

  // Fetch progress data
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/consistancy/progress/${studentId}/${courseId}`
        );
        if (response.data.success) {
          setProgressData(response.data.data);
          
          if (response.data.data?.lastAccessed) {
            const lastConcept = response.data.data.lastAccessed.concept;
            const lastTopic = response.data.data.lastAccessed.topic;
            
            if (courseData[courseId]?.[lastConcept]?.[lastTopic]) {
              setSelectedConcept(lastConcept);
              setSelectedTopic(lastTopic);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (courseId && courseData[courseId] && studentId) {
      fetchProgress();
    }
  }, [studentId, courseId]);

  const updateTopicProgress = async (studentId, concept, topicIndex, completionType) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/consistancy/progress/${studentId}`,
        {
          courseName: concept,
          topicIndex: topicIndex,
          completionType: completionType,
          date: new Date().toISOString()
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating progress:', error);
      return null;
    }
  };

  useEffect(() => {
    setHeaderVisible(true);
    return () => setHeaderVisible(false);
  }, [selectedTopic]);

  const handleSelection = (concept, topic) => {
    if (!concept || !topic) return;
    
    setIsLoading(true);
    setHeaderVisible(false);
    
    if (progressData) {
      setProgressData(prev => ({
        ...prev,
        lastAccessed: {
          concept,
          topic
        }
      }));
    }
    
    setTimeout(() => {
      setSelectedConcept(concept);
      setSelectedTopic(topic);
      setIsLoading(false);
    }, 400);
  };

  const handleTopicComplete = async (step) => {
    try {
      if (!selectedConcept || !selectedTopic) return;
      
      const topics = Object.keys(courseData[courseId][selectedConcept]);
      const topicIndex = topics.indexOf(selectedTopic);
      
      const updatedData = await updateTopicProgress(
        studentId,
        selectedConcept,
        topicIndex,
        step === 'video' ? 'video' : 
        step === 'mcq' ? 'practice' : 
        'coding'
      );
      
      if (updatedData) {
        setProgressData(updatedData);
      }
      
      const topicData = courseData[courseId][selectedConcept][selectedTopic];
      const allStepsCompleted = 
        (!topicData.videoComponent || step === 'video') &&
        (!topicData.practiceMcq || step === 'mcq') &&
        (!topicData.codingPractice || step === 'coding');
      
      if (allStepsCompleted) {
        const finalUpdate = await updateTopicProgress(
          studentId,
          selectedConcept,
          topicIndex,
          'quiz'
        );
        if (finalUpdate) {
          setProgressData(finalUpdate);
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const isTopicLocked = () => {
    if (!progressData || !courseId || !selectedConcept || !selectedTopic) return false;
    
    // First topic is always unlocked
    if (selectedConcept === Object.keys(courseData[courseId])[0] && 
        selectedTopic === Object.keys(courseData[courseId][selectedConcept])[0]) {
      return false;
    }
    
    const concepts = Object.keys(courseData[courseId]);
    const conceptIndex = concepts.indexOf(selectedConcept);
    
    if (conceptIndex > 0) {
      const prevConcept = concepts[conceptIndex - 1];
      const prevConceptTopics = Object.keys(courseData[courseId][prevConcept]);
      const lastTopicPrevConcept = prevConceptTopics[prevConceptTopics.length - 1];
      
      const prevTopicIndex = prevConceptTopics.indexOf(lastTopicPrevConcept);
      if (progressData.t?.[prevTopicIndex]?.p < 75) {
        return true;
      }
    }
    
    const topics = Object.keys(courseData[courseId][selectedConcept]);
    const topicIndex = topics.indexOf(selectedTopic);
    
    if (topicIndex > 0) {
      const prevTopicIndex = topicIndex - 1;
      if (progressData.t?.[prevTopicIndex]?.p < 75) {
        return true;
      }
    }
    
    return false;
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!courseId || !courseData[courseId]) {
    return (
      <div className={`guideray-course-app-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="guideray-course-app-loading-state">
          <div className="guideray-course-app-progress-bar">
            <div className="guideray-course-app-progress-fill"></div>
          </div>
          <p>Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`guideray-course-app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="guideray-course-app-background-pattern"></div>
      
      <GuideRaySidebar 
        courseData={courseData[courseId]} 
        selectedConcept={selectedConcept}
        selectedTopic={selectedTopic}
        onSelect={handleSelection}
        darkMode={darkMode}
        studentId={studentId}
        courseId={courseId}
        progressData={progressData}
        collapsed={sidebarCollapsed}
      />
      
      <div className={`guideray-course-app-main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {selectedConcept && selectedTopic ? (
          <>
            <div className={`guideray-course-app-content-header-wrapper ${headerVisible ? 'visible' : ''}`}>
              <div className="guideray-course-app-header-content">
  <div className="guideray-course-app-header-text">
    <h1 className="guideray-course-app-content-header">
      <div className="guideray-course-app-breadcrumb">
        <span>{selectedConcept}</span> &gt; {selectedTopic}
      </div>
    </h1>
  </div>
  
  {/* User Profile Container */}
  <div className="guideray-course-app-user-profile-container">
    <div className="guideray-course-app-user-profile-content">
      <img 
        src={userData.profilePic} 
        alt="Profile" 
        className="guideray-course-app-user-profile-pic"
      />
      <div className="guideray-course-app-user-profile-info">
        <div className="guideray-course-app-user-profile-name">{userData.name}</div>
        <div className="guideray-course-app-user-profile-email">{userData.email}</div>
      </div>
    </div>
  </div>
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
                topicData={courseData[courseId][selectedConcept][selectedTopic]} 
                darkMode={darkMode}
                isLocked={isTopicLocked()}
                onComplete={handleTopicComplete}
                progressData={progressData}
                concept={selectedConcept}
                topic={selectedTopic}
                topicIndex={Object.keys(courseData[courseId][selectedConcept]).indexOf(selectedTopic)}
                courseId={courseId}
                userData={userData}
              />
            )}
          </>
        ) : (
          <div className="guideray-course-app-loading-state">
            <div className="guideray-course-app-progress-bar">
              <div className="guideray-course-app-progress-fill"></div>
            </div>
            <p>Selecting topic...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideRayApp;