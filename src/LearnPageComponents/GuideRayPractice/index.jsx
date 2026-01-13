import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiAward, FiBookOpen, FiCheck } from 'react-icons/fi';
import { FaRegLightbulb } from 'react-icons/fa';
import axiosInstance from '../../api/axiosInstance';
import './index.css';

const GuideRayPractice = ({ data, darkMode, courseId, studentId, studentName, topic, topicIndex, concept, topicData, isCompleted, onComplete }) => {
  const navigate = useNavigate();
  // const [isLoading, setIsLoading] = useState(false); // Can remove or keep if we want visual feedback during parent update

  // Check if coding practice exists in the topic
  const hasCodingPractice = topicData?.codingPractice?.problems?.length > 0;

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
        concept: concept,
        hasCodingPractice: hasCodingPractice // Pass the flag to the navigation route
      }
    });
  };

  const handleMarkAsRead = async () => {
    if (isCompleted) return;
    onComplete();
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
                className={`guideray-student-practice-mark-read-button ${isCompleted ? 'completed' : ''}`}
                onClick={handleMarkAsRead}
                disabled={isCompleted}
                data-tooltip={
                  isCompleted
                    ? 'Topic already marked as read'
                    : 'Mark this topic as completed without taking the test'
                }
              >
                <span className="guideray-student-practice-mark-read-circle">
                  {isCompleted && <FiCheck size={12} />}
                </span>
                <span>
                  {isCompleted ? 'Marked as Read' : 'Mark as Read'}
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