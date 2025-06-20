import React, { useState, useEffect, useRef } from 'react';
import { FaClock, FaFlag, FaChevronLeft, FaChevronRight, FaSun, FaMoon, FaBookmark, FaHistory } from 'react-icons/fa';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { RiQuestionnaireFill } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';

import { MdCheckCircle } from 'react-icons/md';
import './index.css';

const StudentPracticeTest = () => {
  // Sample questions data
    const location = useLocation();
      const quizQuestions = location.state?.quizData || [];

      console.log(quizQuestions)


  const [questions, setQuestions] = useState(quizQuestions);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5400); // 90 minutes in seconds
  const [theme, setTheme] = useState('dark');
  const [examTitle] = useState("Sample Certification Exam");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const timerBarRef = useRef(null);

  // Calculate progress percentage
  const answeredQuestions = questions.filter(q => q.status === "answered").length;
  const progressPercentage = Math.round((answeredQuestions / questions.length) * 100);

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle timer bar animation and color transition
  useEffect(() => {
    if (timerBarRef.current) {
      const percentageLeft = (timeLeft / 5400) * 100;
      timerBarRef.current.style.width = `${percentageLeft}%`;
      
      // Smooth color transition based on time left
      if (percentageLeft <= 5) {
        // Last 5% - red
        timerBarRef.current.style.backgroundColor = '#ff0000';
      } else if (percentageLeft <= 20) {
        // Last 20% - transition from orange to red
        const orangeToRedRatio = (percentageLeft - 5) / 15; // 15% range (5-20%)
        timerBarRef.current.style.backgroundColor = `rgb(255, ${Math.floor(165 * orangeToRedRatio)}, 0)`;
      } else if (percentageLeft <= 40) {
        // 20-40% - transition from blue to orange
        const blueToOrangeRatio = (percentageLeft - 20) / 20; // 20% range (20-40%)
        timerBarRef.current.style.backgroundColor = `rgb(0, ${Math.floor(165 * (1 - blueToOrangeRatio))}, ${Math.floor(255 * (1 - blueToOrangeRatio))})`;
      } else {
        // Above 40% - blue
        timerBarRef.current.style.backgroundColor = theme === 'dark' ? '#3A86FF' : '#0066CC';
      }
    }
  }, [timeLeft, theme]);

  // Handle timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mark current question as viewed when changed
  useEffect(() => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[currentQuestionIndex].status === "unseen") {
      updatedQuestions[currentQuestionIndex].status = "viewed";
      setQuestions(updatedQuestions);
    }
  }, [currentQuestionIndex, questions]);

  const handleOptionSelect = (option) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].selectedAnswer = option;
    updatedQuestions[currentQuestionIndex].status = "answered";
    setQuestions(updatedQuestions);
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleMarkForReview = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].status = "marked";
    setQuestions(updatedQuestions);
  };

  const handleHoldQuestion = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].status = "hold";
    setQuestions(updatedQuestions);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const getQuestionStatusColor = (status) => {
    switch(status) {
      case 'answered': return '#4CAF50';
      case 'viewed': return '#9C27B0';
      case 'marked': return '#FF9800';
      case 'hold': return '#FF5722';
      case 'unseen': return '#FFFFFF33';
      default: return '#FFFFFF33';
    }
  };

  const getQuestionStatusIcon = (status) => {
    switch(status) {
      case 'answered': return <MdCheckCircle size={10} />;
      case 'marked': return <FaBookmark size={10} />;
      case 'hold': return <FaHistory size={10} />;
      case 'viewed': return <RiQuestionnaireFill size={10} />;
      default: return null;
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={`guideray-student-practice-test-app-container guideray-student-practice-test-${theme}`}>
      {/* Progress bar for answered questions */}
      <div className="guideray-student-practice-test-progress-container">
        <div 
          className="guideray-student-practice-test-progress-bar"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <div className="guideray-student-practice-test-progress-text">
          {progressPercentage}% Completed ({answeredQuestions}/{questions.length} questions)
        </div>
      </div>

      <nav className="guideray-student-practice-test-navbar">
        <div className="guideray-student-practice-test-logo">
          <img src="https://res.cloudinary.com/dx97khgxd/image/upload/v1747826507/b4r9unmciqqgfiuncwcp.png" alt="Exam Logo" />
        </div>
        <div className="guideray-student-practice-test-exam-info">
          <div className="guideray-student-practice-test-timer-container">
            <div className="guideray-student-practice-test-timer-icon">
              <FaClock />
            </div>
            <div className="guideray-student-practice-test-timer">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
        <div className="guideray-student-practice-test-theme-toggle-container">
          <button 
            className={`guideray-student-practice-test-theme-toggle ${theme === 'dark' ? 'dark' : 'light'}`}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <div className="guideray-student-practice-test-toggle-switch">
              {theme === 'dark' ? <FaMoon className="moon-icon" /> : <FaSun className="sun-icon" />}
            </div>
          </button>
        </div>
      </nav>

      {/* New full-width timer progress bar */}
      <div className="guideray-student-practice-test-timer-progress-container">
        <div 
          ref={timerBarRef}
          className="guideray-student-practice-test-timer-progress-bar"
        ></div>
      </div>

      <div className="guideray-student-practice-test-exam-container">
        <div className="guideray-student-practice-test-question-main">
          <div className="guideray-student-practice-test-question-container">
            {/* ... rest of the question container content remains the same ... */}
            <div className="guideray-student-practice-test-question-header">
              <h3>Question {currentQuestion.id}</h3>
              <div className="guideray-student-practice-test-question-status">
                {currentQuestion.status === 'answered' && (
                  <span className="guideray-student-practice-test-status-badge guideray-student-practice-test-answered">
                    <MdCheckCircle /> Answered
                  </span>
                )}
                {currentQuestion.status === 'marked' && (
                  <span className="guideray-student-practice-test-status-badge guideray-student-practice-test-marked">
                    <FaFlag /> Marked
                  </span>
                )}
                {currentQuestion.status === 'hold' && (
                  <span className="guideray-student-practice-test-status-badge guideray-student-practice-test-hold">
                    <FaClock /> On Hold
                  </span>
                )}
              </div>
            </div>

            <div className="guideray-student-practice-test-question-text">
              <p>{currentQuestion.text}</p>
            </div>

            <div className="guideray-student-practice-test-options-container">
              {currentQuestion.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`guideray-student-practice-test-option ${currentQuestion.selectedAnswer === option ? 'guideray-student-practice-test-selected' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <div className="guideray-student-practice-test-option-letter">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div className="guideray-student-practice-test-option-text">{option}</div>
                  {currentQuestion.selectedAnswer === option && (
                    <div className="guideray-student-practice-test-option-check">
                      <MdCheckCircle />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="guideray-student-practice-test-question-actions">
              <button
                className="guideray-student-practice-test-action-btn guideray-student-practice-test-mark-btn"
                onClick={handleMarkForReview}
              >
                <FaFlag /> Mark for Review
              </button>
              <button
                className="guideray-student-practice-test-action-btn guideray-student-practice-test-hold-btn"
                onClick={handleHoldQuestion}
              >
                <FaClock /> Hold Question
              </button>
              <button 
                className="guideray-student-practice-test-action-btn guideray-student-practice-test-hint-btn"
                onClick={() => alert('Hint feature coming soon!')}
              >
                <HiOutlineLightBulb /> Get Hint
              </button>
            </div>

            <div className="guideray-student-practice-test-navigation-buttons">
              <button
                className="guideray-student-practice-test-nav-btn guideray-student-practice-test-prev-btn"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              >
                <FaChevronLeft /> Previous
              </button>
              <button
                className="guideray-student-practice-test-nav-btn guideray-student-practice-test-next-btn"
                disabled={currentQuestionIndex === questions.length - 1}
                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              >
                Next <FaChevronRight />
              </button>
            </div>
          </div>
        </div>

        <div className={`guideray-student-practice-test-questions-sidebar ${sidebarCollapsed ? 'guideray-student-practice-test-collapsed' : ''}`}>
          {!sidebarCollapsed && (
            <>
              <div className='guideray-student-practice-test-sidebar-inner1'>
                <h3 className="guideray-student-practice-test-sidebar-title">Questions</h3>
                <div className="guideray-student-practice-test-questions-grid">
                  {questions.map((q, index) => (
                    <div
                      key={q.id}
                      className={`guideray-student-practice-test-question-box ${currentQuestionIndex === index ? 'guideray-student-practice-test-active' : ''}`}
                      onClick={() => handleQuestionNavigation(index)}
                      style={{ backgroundColor: getQuestionStatusColor(q.status) }}
                    >
                      {q.id}
                      <span className="guideray-student-practice-test-status-icon">
                        {getQuestionStatusIcon(q.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className='guideray-student-practice-test-sidebar-inner2'>
                <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Question Status</h3>
                <div className="guideray-student-practice-test-status-legend">
                  <div className="guideray-student-practice-test-legend-item">
                    <div className="guideray-student-practice-test-legend-color guideray-student-practice-test-answered"></div>
                    <span>Answered</span>
                  </div>
                  <div className="guideray-student-practice-test-legend-item">
                    <div className="guideray-student-practice-test-legend-color guideray-student-practice-test-marked"></div>
                    <span>Marked</span>
                  </div>
                  <div className="guideray-student-practice-test-legend-item">
                    <div className="guideray-student-practice-test-legend-color guideray-student-practice-test-hold"></div>
                    <span>On Hold</span>
                  </div>
                  <div className="guideray-student-practice-test-legend-item">
                    <div className="guideray-student-practice-test-legend-color guideray-student-practice-test-viewed"></div>
                    <span>Viewed</span>
                  </div>
                  <div className="guideray-student-practice-test-legend-item">
                    <div className="guideray-student-practice-test-legend-color guideray-student-practice-test-unseen"></div>
                    <span>Unseen</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPracticeTest;