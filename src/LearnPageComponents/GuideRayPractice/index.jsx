import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiAward, FiBookOpen } from 'react-icons/fi';
import { FaRegLightbulb } from 'react-icons/fa';
import './index.css'
const GuideRayPractice = ({ data, darkMode }) => {
  const navigate = useNavigate();
  
  const handleStartPractice = () => {
    navigate('/student-practice', { state: { quizData: data.quizQuestions } });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <motion.div 
      className={`guideray-student-practice-container ${darkMode ? 'guideray-student-practice-dark' : 'guideray-student-practice-light'}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {data.quizQuestions && (
        <motion.div 
          className="guideray-student-practice-action-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="guideray-student-practice-ready-text">Ready to test your knowledge?</p>
          <motion.button 
            className="guideray-student-practice-button"
            onClick={handleStartPractice}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Begin Practice</span>
            <FiArrowRight className="guideray-student-practice-icon" />
          </motion.button>
          <p className="guideray-student-practice-encouragement">
            <FiAward className="guideray-student-practice-icon" /> You're going to do great!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GuideRayPractice;