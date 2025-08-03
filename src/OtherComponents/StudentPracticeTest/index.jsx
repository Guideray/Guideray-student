import React, { useState, useEffect, useRef } from 'react';
import { FaClock, FaFlag, FaChevronLeft, FaChevronRight, FaSun, FaMoon, FaBookmark, FaHistory, FaTrophy, FaRedo } from 'react-icons/fa';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { RiQuestionnaireFill } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdCheckCircle } from 'react-icons/md';
import './index.css';
import API_BASE_URL from '../../../config';

const StudentPracticeTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    quizData: initialQuizQuestions,
    quizTime,
    courseId,
    studentId,
    studentName,
    topic,
    topicIndex,
    concept,
    hasCodingPractice
  } = location.state || {};
  
  const [questions, setQuestions] = useState(initialQuizQuestions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quizTime * 60 || 600);
  const [theme, setTheme] = useState('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const timerBarRef = useRef(null);

  useEffect(() => {
    const checkCompletionStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/consistancy/progress/${studentId}/${courseId}`);
        const data = await response.json();
        
        if (data.success) {
          const topicProgress = data.data.t.find(t => t.t === topicIndex);
          if (topicProgress && topicProgress.p >= 50) {
            setAlreadyCompleted(true);
          }
        }
      } catch (error) {
        console.error("Error checking completion status:", error);
      }
    };

    if (studentId && courseId) {
      checkCompletionStatus();
    }
  }, [studentId, courseId, topicIndex]);

  const answeredQuestions = questions.filter(q => q.status === "answered").length;
  const progressPercentage = Math.round((answeredQuestions / questions.length) * 100);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timerBarRef.current) {
      const percentageLeft = (timeLeft / (quizTime * 60)) * 100;
      timerBarRef.current.style.width = `${percentageLeft}%`;
      
      if (percentageLeft <= 5) {
        timerBarRef.current.style.backgroundColor = '#ff0000';
      } else if (percentageLeft <= 20) {
        const orangeToRedRatio = (percentageLeft - 5) / 15;
        timerBarRef.current.style.backgroundColor = `rgb(255, ${Math.floor(165 * orangeToRedRatio)}, 0)`;
      } else if (percentageLeft <= 40) {
        const blueToOrangeRatio = (percentageLeft - 20) / 20;
        timerBarRef.current.style.backgroundColor = `rgb(0, ${Math.floor(165 * (1 - blueToOrangeRatio))}, ${Math.floor(255 * (1 - blueToOrangeRatio))})`;
      } else {
        timerBarRef.current.style.backgroundColor = theme === 'dark' ? '#3A86FF' : '#0066CC';
      }
    }
  }, [timeLeft, theme, quizTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[currentQuestionIndex]?.status === "unseen") {
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

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (q.selectedAnswer === q.correctAnswer) {
        correct++;
      }
    });

    setCorrectAnswers(correct);
    const percentage = (correct / questions.length) * 100;
    setScore(percentage);
    return percentage;
  };

  const updateProgress = async (completionType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/consistancy/progress/${studentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName: courseId,
          topicIndex: topicIndex,
          completionType: completionType,
          date: new Date().toISOString()
        })
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating progress:", error);
      return { success: false };
    }
  };

  const handleSubmit = async () => {
    setShowSubmitModal(false);
    const scorePercentage = calculateScore();
    
    if (scorePercentage >= 70) {
      if (!alreadyCompleted) {
        if (hasCodingPractice) {
          const result = await updateProgress("quiz");
          if (result.success) {
            setShowSuccessModal(true);
          }
        } else {
          const quizResult = await updateProgress("quiz");
          const topicResult = await updateProgress("quiz");
          if (quizResult.success && topicResult.success) {
            setShowSuccessModal(true);
          }
        }
      } else {
        setShowSuccessModal(true);
      }
    } else {
      setShowFailureModal(true);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const allQuestionsAnswered = questions.every(q => q.status === "answered");
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className={`guideray-student-practice-test-app-container guideray-student-practice-test-${theme}`}>
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
            className="guideray-student-practice-test-theme-toggle"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </nav>

      <div className="guideray-student-practice-test-timer-progress-container">
        <div 
          ref={timerBarRef}
          className="guideray-student-practice-test-timer-progress-bar"
        ></div>
      </div>

      <div className="guideray-student-practice-test-exam-container">
        <div className="guideray-student-practice-test-question-main">
          <div className="guideray-student-practice-test-question-container">
            <div className="guideray-student-practice-test-question-header">
              <h3>Question {currentQuestion?.id}</h3>
              <div className="guideray-student-practice-test-question-status">
                {currentQuestion?.status === 'answered' && (
                  <span className="guideray-student-practice-test-status-badge guideray-student-practice-test-answered">
                    <MdCheckCircle /> Answered
                  </span>
                )}
                {currentQuestion?.status === 'marked' && (
                  <span className="guideray-student-practice-test-status-badge guideray-student-practice-test-marked">
                    <FaFlag /> Marked
                  </span>
                )}
                {currentQuestion?.status === 'hold' && (
                  <span className="guideray-student-practice-test-status-badge guideray-student-practice-test-hold">
                    <FaClock /> On Hold
                  </span>
                )}
              </div>
            </div>

            <div className="guideray-student-practice-test-question-text">
              <p>{currentQuestion?.text}</p>
            </div>

            {/* NEW CODE DISPLAY SECTION */}
            {currentQuestion?.code && (
              <div className="guideray-student-practice-test-code-display">
                <div className="guideray-student-practice-test-code-header">
                  <span>Code Example</span>
                </div>
                <pre className="guideray-student-practice-test-code-content">
                  <code>{currentQuestion.code}</code>
                </pre>
              </div>
            )}

            <div className="guideray-student-practice-test-options-container">
              {currentQuestion?.options?.map((option, idx) => (
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
            </div>

            <div className="guideray-student-practice-test-navigation-buttons">
              <button
                className="guideray-student-practice-test-nav-btn guideray-student-practice-test-prev-btn"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              >
                <FaChevronLeft /> Previous
              </button>
              {isLastQuestion ? (
                <button
                  className="guideray-student-practice-test-nav-btn guideray-student-practice-test-submit-btn"
                  onClick={() => setShowSubmitModal(true)}
                >
                  Submit Test
                </button>
              ) : (
                <button
                  className="guideray-student-practice-test-nav-btn guideray-student-practice-test-next-btn"
                  disabled={currentQuestionIndex === questions.length - 1}
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                >
                  Next <FaChevronRight />
                </button>
              )}
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

      {showSubmitModal && (
        <div className="guideray-student-practice-test-modal-overlay">
          <div className="guideray-student-practice-test-modal">
            <h3>Submit Test</h3>
            <p>Are you sure you want to submit your test? You won't be able to make changes after submission.</p>
            <div className="guideray-student-practice-test-modal-buttons">
              <button 
                className="guideray-student-practice-test-modal-cancel"
                onClick={() => setShowSubmitModal(false)}
              >
                Cancel
              </button>
              <button 
                className="guideray-student-practice-test-modal-submit"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="guideray-student-practice-test-modal-overlay">
          <div className="guideray-student-practice-test-success-modal">
            <div className="guideray-student-practice-test-success-icon-container">
              <div className="guideray-student-practice-test-success-icon-circle">
                <FaTrophy size={50} color="#FFD700" />
              </div>
            </div>
            <h3>Congratulations {studentName}!</h3>
            <div className="guideray-student-practice-test-success-details">
              <p>You have successfully completed:</p>
              <div className="guideray-student-practice-test-success-detail-item">
                <strong>Concept:</strong> {concept}
              </div>
              <div className="guideray-student-practice-test-success-detail-item">
                <strong>Topic:</strong> {topic}
              </div>
              <div className="guideray-student-practice-test-success-detail-item">
                <strong>Score:</strong> <span className="guideray-student-practice-test-success-score">{score.toFixed(0)}%</span> ({correctAnswers}/{questions.length} correct answers)
              </div>
            </div>
            <div className="guideray-student-practice-test-success-actions">
              <button 
                className="guideray-student-practice-test-continue-btn"
                onClick={() => navigate(`/video-courses/${courseId}`)}
              >
                Continue Course
              </button>
            </div>
            <div className="guideray-student-practice-test-success-celebration"></div>
          </div>
        </div>
      )}

      {showFailureModal && (
        <div className="guideray-student-practice-test-modal-overlay">
          <div className="guideray-student-practice-test-failure-modal">
            <div className="guideray-student-practice-test-failure-icon-container">
              <div className="guideray-student-practice-test-failure-icon-circle">
                <HiOutlineLightBulb size={50} color="#FF9800" />
              </div>
            </div>
            <h3>Keep Practicing, {studentName}!</h3>
            <div className="guideray-student-practice-test-failure-details">
              <p>You need at least 70% to complete this topic.</p>
              <div className="guideray-student-practice-test-failure-detail-item">
                <strong>Your Score:</strong> <span className="guideray-student-practice-test-failure-score">{score.toFixed(0)}%</span> ({correctAnswers}/{questions.length} correct answers)
              </div>
            </div>
            <div className="guideray-student-practice-test-failure-actions">
              <button 
                className="guideray-student-practice-test-retry-btn"
                onClick={() => window.location.reload()}
              >
                <FaRedo /> Try Again
              </button>
              <button 
                className="guideray-student-practice-test-back-btn"
                onClick={() => navigate(`/video-courses/${courseId}`)}
              >
                Back to Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPracticeTest;