import React, { useState, useEffect } from 'react';
import courseData from '../CourceData.json';
import GuideRaySidebar from '../GuideRaySidebar';
import GuideRayTopicContent from '../GuideRayTopicContent';
import './index.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GuideRayApp = ({ darkMode, studentId ,userData}) => {
  // Extract courseId from URL
  const { courseId } = useParams();
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [progressData, setProgressData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize selected concept and topic based on courseId
  useEffect(() => {
    if (courseId && courseData[courseId]) {
      const concepts = Object.keys(courseData[courseId]);
      if (concepts.length > 0) {
        const topics = Object.keys(courseData[courseId][concepts[0]]);
        if (topics.length > 0) {
          setSelectedConcept(concepts[0]);
          setSelectedTopic(topics[0]);
        }
      }
    }
  }, [courseId]);

  // Fetch progress data on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/consistancy/progress/${studentId}/${courseId}`
        );
        if (response.data.success) {
          setProgressData(response.data.data);
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

  // Update topic progress
  const updateTopicProgress = async (studentId, concept, topicIndex, completionType) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/consistancy/progress/${studentId}`,
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
    setIsLoading(true);
    setHeaderVisible(false);
    setTimeout(() => {
      if (concept) setSelectedConcept(concept);
      if (topic) setSelectedTopic(topic);
      setIsLoading(false);
    }, 400);
  };

  const handleTopicComplete = async (step) => {
    try {
      // Find the topic index
      const topics = Object.keys(courseData[courseId][selectedConcept]);
      const topicIndex = topics.indexOf(selectedTopic);
      
      // Update progress in backend
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
      
      // If all steps are completed, mark topic as complete
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
          'quiz' // Using quiz as final completion type
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
    
    // First topic in first concept is always unlocked
    if (selectedConcept === Object.keys(courseData[courseId])[0] && 
        selectedTopic === Object.keys(courseData[courseId][selectedConcept])[0]) {
      return false;
    }
    
    // Check previous topic completion
    const concepts = Object.keys(courseData[courseId]);
    const conceptIndex = concepts.indexOf(selectedConcept);
    
    // If not first concept, check last topic of previous concept
    if (conceptIndex > 0) {
      const prevConcept = concepts[conceptIndex - 1];
      const prevConceptTopics = Object.keys(courseData[courseId][prevConcept]);
      const lastTopicPrevConcept = prevConceptTopics[prevConceptTopics.length - 1];
      
      const prevConceptCourse = progressData.courseProgress.find(cp => cp.courseName === prevConcept);
      if (prevConceptCourse) {
        const prevTopicIndex = prevConceptTopics.indexOf(lastTopicPrevConcept);
        if (prevConceptCourse.topics[prevTopicIndex]?.completionPercentage !== 100) {
          return true;
        }
      }
    }
    
    // Check previous topic in same concept
    const topics = Object.keys(courseData[courseId][selectedConcept]);
    const topicIndex = topics.indexOf(selectedTopic);
    
    if (topicIndex > 0) {
      const prevTopic = topics[topicIndex - 1];
      const currentConceptCourse = progressData.courseProgress.find(cp => cp.courseName === selectedConcept);
      if (currentConceptCourse) {
        const prevTopicIndex = topics.indexOf(prevTopic);
        if (currentConceptCourse.topics[prevTopicIndex]?.completionPercentage !== 100) {
          return true;
        }
      }
    }
    
    return false;
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!courseId || !courseData[courseId] || !selectedConcept || !selectedTopic) {
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
        progressData={progressData}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      
      <div className={`guideray-course-app-main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className={`guideray-course-app-content-header-wrapper ${headerVisible ? 'visible' : ''}`}>
          <div className="guideray-course-app-header-content">
            <button 
              className="guideray-course-app-sidebar-toggle"
              onClick={toggleSidebar}
            >
              {sidebarCollapsed ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12h16M4 6h16M4 18h16" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              )}
            </button>
            
            <h1 className="guideray-course-app-content-header">
              <div className="guideray-course-app-breadcrumb">
                <span>{selectedConcept}</span> &gt; {selectedTopic}
              </div>
            </h1>
            
            <div className="guideray-course-app-header-actions">
              <button className="guideray-course-app-header-action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 6h18M7 12h10M5 18h14" />
                </svg>
              </button>
              <button className="guideray-course-app-header-action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
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
            courseId = {courseId}
            userData = {userData}
          />
        )}
        
        <div className="guideray-course-app-floating-actions">
          <button className="guideray-course-app-fab">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideRayApp;