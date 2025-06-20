import React, { useState } from 'react';
import './index.css';
import GuiderayStudentPerformanceChart from '../GuiderayStudentPerformanceChart';

const GuiderayStudentConsistencyScoreBar = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [score, setScore] = useState(0);

  // Animate score on component mount
  React.useEffect(() => {
    const targetScore = 1300349;
    const duration = 2000; // 2 seconds
    const increment = targetScore / (duration / 16); // 60fps
    
    const animate = () => {
      setScore(prev => {
        if (prev >= targetScore) return targetScore;
        return prev + increment;
      });
      
      if (score < targetScore) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, []);

  const consistencyData = {
    currentStreak: 12,
    longestStreak: 18,
    courses: [
      {
        id: 1,
        name: "Mathematics",
        score: 923456,
        currentStreak: 15,
        longestStreak: 22,
        lastActive: "2023-06-15"
      },
      {
        id: 2,
        name: "Physics",
        score: 784321,
        currentStreak: 8,
        longestStreak: 14,
        lastActive: "2023-06-14"
      },
      {
        id: 3,
        name: "Chemistry",
        score: 856789,
        currentStreak: 12,
        longestStreak: 18,
        lastActive: "2023-06-15"
      },
      {
        id: 4,
        name: "Biology",
        score: 812345,
        currentStreak: 10,
        longestStreak: 16,
        lastActive: "2023-06-13"
      }
    ]
  };

  const toggleCoursesModal = () => {
    setShowCoursesModal(!showCoursesModal);
  };

  const togglePerformanceModal = () => {
    setShowPerformanceModal(!showPerformanceModal);
  };

  return (
    <div className={`guideray-student-streak-card ${darkMode ? 'dark' : 'light'}`}>
                <h3>Learning Consistency</h3>

      <div className="guideray-student-streak-header">
        <div className="guideray-student-streak-tabs">
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'courses' ? 'active' : ''}
            onClick={toggleCoursesModal}
          >
            Courses
          </button>
          <button 
            className="guideray-student-performance-button"
            onClick={togglePerformanceModal}
          >
            Performance
          </button>
        </div>
      </div>

      <div className="guideray-student-streak-overview">
        <div className="guideray-student-streak-score">
          <div className="guideray-student-streak-score-value">
            {Math.floor(score).toLocaleString()}
          </div>
          <div className="guideray-student-streak-score-label">Consistency Points</div>
        </div>

        <div className="guideray-student-streak-indicators">
          <div className="guideray-student-streak-indicator">
            <div className="guideray-student-streak-flame">🔥</div>
            <div>
              <div className="guideray-student-streak-count">{consistencyData.currentStreak} days</div>
              <div className="guideray-student-streak-label">Current Streak</div>
            </div>
          </div>

          <div className="guideray-student-streak-indicator">
            <div className="guideray-student-streak-trophy">🏆</div>
            <div>
              <div className="guideray-student-streak-count">{consistencyData.longestStreak} days</div>
              <div className="guideray-student-streak-label">Longest Streak</div>
            </div>
          </div>
        </div>

        <div className="guideray-student-streak-progress">
          <div 
            className="guideray-student-streak-progress-bar"
            style={{ width: `${(score / 1300349) * 100}%` }}
          ></div>
        </div>
      </div>

      {showCoursesModal && (
        <div className="guideray-student-courses-modal">
          <div className="guideray-student-courses-modal-content">
            <div className="guideray-student-courses-modal-header">
              <h4>Course Consistency</h4>
              <button 
                className="guideray-student-courses-modal-close"
                onClick={toggleCoursesModal}
              >
                ✕
              </button>
            </div>
            <div className="guideray-student-courses-list">
              {consistencyData.courses.map(course => (
                <div key={course.id} className="guideray-student-course-item">
                  <div className="guideray-student-course-name">{course.name}</div>
                  <div className="guideray-student-course-score">
                    {course.score.toLocaleString()} pts
                  </div>
                  <div className="guideray-student-course-details">
                    <div>
                      <span>Current:</span> {course.currentStreak} days
                    </div>
                    <div>
                      <span>Longest:</span> {course.longestStreak} days
                    </div>
                    <div>
                      <span>Last Active:</span> {new Date(course.lastActive).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showPerformanceModal && (
        <div className="guideray-student-performance-modal">
          <div className="guideray-student-performance-modal-content">
            <div className="guideray-student-performance-modal-header">
              <h4>Performance Analytics</h4>
              <button 
                className="guideray-student-performance-modal-close"
                onClick={togglePerformanceModal}
              >
                ✕
              </button>
            </div>
            <GuiderayStudentPerformanceChart darkMode={darkMode} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GuiderayStudentConsistencyScoreBar;