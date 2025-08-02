import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiAward, FiBookOpen, FiCheck } from 'react-icons/fi';
import { FaRegLightbulb } from 'react-icons/fa';
import axios from 'axios';
import './index.css';
import API_BASE_URL from '../../../config';

const GuideRayPractice = ({ data, darkMode, courseId, studentId, studentName, topic, topicIndex, concept }) => {
  const navigate = useNavigate();
  const [isMarkedRead, setIsMarkedRead] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/consistancy/progress/${studentId}/${courseId}`
        );
        if (response.data.success) {
          // Check if this topic is already marked as completed (>= 50% progress)
          const topicProgress = response.data.data.t.find(t => t.t === topicIndex);
          if (topicProgress && topicProgress.p >= 50) {
            setIsMarkedRead(true);
          }
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };

    if (studentId && courseId) {
      fetchProgressData();
    }
  }, [studentId, courseId, topicIndex]);

  const handleStartPractice = () => {
    navigate('/student-practice', {
      state: {
        quizData: data.quizQuestions,
        quizTime: data.time,
        courseId: courseId,
        studentId: studentId,
        studentName: studentName,
        topic: topic,
        topicIndex: topicIndex,
        concept: concept
      }
    });
  };

  const handleMarkAsRead = async () => {
    if (isMarkedRead) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/consistancy/progress/${studentId}`,
        {
          courseName: courseId,
          topicIndex: topicIndex,
          completionType: "manual",
          date: new Date().toISOString()
        }
      );
      
      if (response.data.success) {
        setIsMarkedRead(true);
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "backOut"
      }
    }
  };

  return (
    <div className={`guideray-student-practice-outer-container ${darkMode ? 'guideray-student-practice-dark' : 'guideray-student-practice-light'}`}>
      <motion.div 
        className="guideray-student-practice-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="guideray-student-practice-image-container">
          <img 
            src="https://res.cloudinary.com/dx97khgxd/image/upload/v1752734465/Pngtree_test_pen_multiple_choice_questions_7090053_opozvl.png" 
            alt="Practice Test Illustration"
            className="guideray-student-practice-image"
          />
        </div>

        <div className="guideray-student-practice-content">
          {/* Header */}
          <motion.div 
            className="guideray-student-practice-header"
            variants={itemVariants}
          >
            <motion.h2 
              className="guideray-student-practice-title"
              variants={itemVariants}
            >
              Test Your Knowledge
            </motion.h2>
            
            <motion.p 
              className="guideray-student-practice-description"
              variants={itemVariants}
            >
              <FaRegLightbulb className="guideray-student-practice-icon" />
              {data.description || "Challenge yourself with these practice questions to reinforce your learning."}
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="guideray-student-practice-stats"
            variants={itemVariants}
          >
            <div className="guideray-student-practice-stat">
              <FiBookOpen className="guideray-student-practice-stat-icon" />
              <span>{data.quizQuestions.length} Questions</span>
            </div>
            
            <div className="guideray-student-practice-stat">
              <FiAward className="guideray-student-practice-stat-icon" />
              <span>{data.time} Minute Test</span>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="guideray-student-practice-actions">
            <motion.button 
              className="guideray-student-practice-button"
              onClick={handleStartPractice}
              whileHover={{ scale: 1.03, boxShadow: "0 6px 20px rgba(106, 17, 203, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Begin Practice Now</span>
              <FiArrowRight className="guideray-student-practice-icon" />
            </motion.button>

            <div className="guideray-student-practice-mark-read-container">
              <button
                className={`guideray-student-practice-mark-read-button ${isMarkedRead ? 'completed' : ''}`}
                onClick={handleMarkAsRead}
                disabled={isMarkedRead || isLoading}
                data-tooltip={
                  isMarkedRead
                    ? 'Topic already marked as read'
                    : 'Mark this topic as completed without taking the test'
                }
              >
                <span className="guideray-student-practice-mark-read-circle">
                  {isMarkedRead && <FiCheck size={12} />}
                </span>
                <span>
                  {isLoading ? 'Processing...' : 
                   isMarkedRead ? 'Marked as Read' : 'Mark as Read'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GuideRayPractice;