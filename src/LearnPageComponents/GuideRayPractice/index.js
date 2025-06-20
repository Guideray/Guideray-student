import React from 'react';
import { useNavigate } from 'react-router-dom';
import GuideRayTechnicalWords from '../GuideRayTechnicalWords';
import './index.css';

const GuideRayPractice = ({ data, darkMode }) => {
  const navigate = useNavigate();
  
  const handleStartPractice = () => {
    navigate('/student-practice', { state: { quizData: data.quizQuestions } });
  };

  return (
    <div className={`guideray_practice_container ${darkMode ? 'dark' : 'light'}`}>
      <h2 className="guideray_practice_title">{data.title}</h2>
      <p className="guideray_practice_description">{data.description}</p>
      
      <ol className="guideray_practice_list">
        {data.tasks && data.tasks.map((task, index) => (
          <li key={index} className="guideray_practice_item">
            <div className="guideray_practice_task">{task}</div>
          </li>
        ))}
      </ol>

      {data.quizQuestions && (
        <button 
          className={`guideray_practice_button ${darkMode ? 'dark' : 'light'}`}
          onClick={handleStartPractice}
        >
          Start Practice Test
        </button>
      )}
    </div>
  );
};

export default GuideRayPractice;