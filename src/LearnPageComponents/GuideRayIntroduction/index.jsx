import React from 'react';
import { FiInfo } from 'react-icons/fi';
import GuideRayTechnicalWords from '../GuideRayTechnicalWords';
import './index.css';

const GuideRayIntroduction = ({ data, darkMode }) => {
  const themeClass = darkMode ? 'dark' : 'light';


  return (
    <div className={`guideray-introduction-container ${themeClass}`}>
      <div className={`guideray-introduction-header ${themeClass}`}>
        <FiInfo className={`guideray-introduction-icon ${themeClass}`} />
        <h2 className={`guideray-introduction-title ${themeClass}`}>
          {data.title}
        </h2>
      </div>
      <div className={`guideray-introduction-content ${themeClass}`}>
        <p className={`guideray-introduction-description ${themeClass}`}>
          {data.description}
        </p>
      </div>
      
      {data.technicalWords && (
        <div className="guideray-introduction-technical-container">
          <GuideRayTechnicalWords words={data.technicalWords} theme={themeClass} />
        </div>
      )}
    </div>
  );
};

export default GuideRayIntroduction;