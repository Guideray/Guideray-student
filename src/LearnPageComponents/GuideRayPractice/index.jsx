import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './index.css';

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
      className={`guideray_practice_container ${darkMode ? 'dark' : 'light'}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >

      
      {/* Header section */}
      <div className="guideray_header">
        <motion.h2 
          className="guideray_practice_title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {data.title}
        </motion.h2>
        
        <motion.p 
          className="guideray_practice_description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.4 }}
        >
          {data.description}
          <span className="guideray_description_tip">
            Pro tip: Complete all tasks sequentially for maximum learning benefit.
          </span>
        </motion.p>
      </div>
      
      {/* Tasks list */}
      <motion.ol 
        className="guideray_practice_list"
        initial="hidden"
        animate="visible"
      >
        {data.tasks && data.tasks.map((task, index) => (
          <motion.li 
            key={index} 
            className="guideray_practice_item"
            custom={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="guideray_practice_task">
              <span className="guideray_task_icon">📌</span>
              {task}
            </div>
          </motion.li>
        ))}
      </motion.ol>

      {/* Action section */}
      {data.quizQuestions && (
        <motion.div 
          className="guideray_action_section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="guideray_ready_text">
            Ready to test your knowledge? This practice test contains {data.quizQuestions.length} carefully crafted questions.
          </p>
          <motion.button 
            className={`guideray_practice_button ${darkMode ? 'dark' : 'light'}`}
            onClick={handleStartPractice}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="guideray_button_text">Start Practice Test</span>
            <span className="guideray_button_icon">🚀</span>
          </motion.button>
          <p className="guideray_encouragement">
            You've got this! Practice makes perfect.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GuideRayPractice;