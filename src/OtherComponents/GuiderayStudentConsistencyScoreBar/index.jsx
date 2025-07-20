import React, { useState, useEffect } from 'react';
import './index.css';
import GuiderayStudentPerformanceChart from '../GuiderayStudentPerformanceChart';

const GuiderayStudentConsistencyScoreBar = ({ darkMode, studentId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [score, setScore] = useState(0);
  const [consistencyData, setConsistencyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsistencyData = async () => {
      try {
        const response = await fetch(`https://webservice.guideray.in/api/consistancy/${studentId}`);
        const data = await response.json();
        if (data.success) {
          setConsistencyData(data.data);
          
          // Animate score
          const targetScore = calculateTotalScore(data.data);
          const duration = 2000;
          const increment = targetScore / (duration / 16);
          
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
        }
      } catch (error) {
        console.error('Error fetching consistency data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsistencyData();
  }, [studentId]);

  const calculateTotalScore = (data) => {
    if (!data || !data.dp) return 0;
    
    // Calculate score based on activity hours and count
    return data.dp.reduce((total, day) => {
      return total + (day.ah * 1000) + (day.ct * 500);
    }, 0);
  };

  const formatCourseData = (data) => {
    if (!data || !data.cp) return [];
    
    return data.cp.map(course => ({
      id: course.n,
      name: course.n.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      score: course.cs * 1000,
      currentStreak: course.s.c,
      longestStreak: course.s.l,
      lastActive: course.lad
    }));
  };

  const toggleCoursesModal = () => {
    setShowCoursesModal(!showCoursesModal);
  };

  const togglePerformanceModal = () => {
    setShowPerformanceModal(!showPerformanceModal);
  };

  if (loading) {
    return (
      <div className={`guideray-student-streak-card loading ${darkMode ? 'dark' : 'light'}`}>
        <div className="guideray-student-streak-loader">
          <div className="guideray-student-streak-spinner"></div>
        </div>
      </div>
    );
  }

  if (!consistencyData) {
    return (
      <div className={`guideray-student-streak-card ${darkMode ? 'dark' : 'light'}`}>
        <div className="guideray-student-streak-error">Failed to load consistency data</div>
      </div>
    );
  }

  const courses = formatCourseData(consistencyData);
  const totalScore = calculateTotalScore(consistencyData);

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
              <div className="guideray-student-streak-count">
                {consistencyData.streaks.daily.c} days
              </div>
              <div className="guideray-student-streak-label">Current Streak</div>
            </div>
          </div>

          <div className="guideray-student-streak-indicator">
            <div className="guideray-student-streak-trophy">🏆</div>
            <div>
              <div className="guideray-student-streak-count">
                {consistencyData.streaks.daily.l} days
              </div>
              <div className="guideray-student-streak-label">Longest Streak</div>
            </div>
          </div>
        </div>

        <div className="guideray-student-milestones">
          <h4>Next Milestones</h4>
          <div className="guideray-student-milestone-container">
            <div className="guideray-student-milestone">
              <div className="guideray-student-milestone-header">
                <span className="guideray-student-milestone-icon">📅</span>
                <span className="guideray-student-milestone-title">Daily</span>
              </div>
              <div className="guideray-student-milestone-progress">
                <div 
                  className="guideray-student-milestone-progress-bar"
                  style={{ width: `${consistencyData.streakStatus.daily.nextMilestone.progress}%` }}
                ></div>
              </div>
              <div className="guideray-student-milestone-details">
                <span>{consistencyData.streaks.daily.c} of {consistencyData.streakStatus.daily.nextMilestone.target} days</span>
                <span>{consistencyData.streakStatus.daily.nextMilestone.remaining} to go</span>
              </div>
            </div>

            <div className="guideray-student-milestone">
              <div className="guideray-student-milestone-header">
                <span className="guideray-student-milestone-icon">🗓️</span>
                <span className="guideray-student-milestone-title">Weekly</span>
              </div>
              <div className="guideray-student-milestone-progress">
                <div 
                  className="guideray-student-milestone-progress-bar"
                  style={{ width: `${consistencyData.streakStatus.weekly.nextMilestone.progress}%` }}
                ></div>
              </div>
              <div className="guideray-student-milestone-details">
                <span>{consistencyData.streaks.weekly.c} of {consistencyData.streakStatus.weekly.nextMilestone.target} weeks</span>
                <span>{consistencyData.streakStatus.weekly.nextMilestone.remaining} to go</span>
              </div>
            </div>

            <div className="guideray-student-milestone">
              <div className="guideray-student-milestone-header">
                <span className="guideray-student-milestone-icon">📆</span>
                <span className="guideray-student-milestone-title">Monthly</span>
              </div>
              <div className="guideray-student-milestone-progress">
                <div 
                  className="guideray-student-milestone-progress-bar"
                  style={{ width: `${consistencyData.streakStatus.monthly.nextMilestone.progress}%` }}
                ></div>
              </div>
              <div className="guideray-student-milestone-details">
                <span>{consistencyData.streaks.monthly.c} of {consistencyData.streakStatus.monthly.nextMilestone.target} months</span>
                <span>{consistencyData.streakStatus.monthly.nextMilestone.remaining} to go</span>
              </div>
            </div>
          </div>
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
              {courses.map(course => (
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
            <GuiderayStudentPerformanceChart 
              darkMode={darkMode} 
              streakData={consistencyData.streaks}
              streakStatus={consistencyData.streakStatus}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GuiderayStudentConsistencyScoreBar;