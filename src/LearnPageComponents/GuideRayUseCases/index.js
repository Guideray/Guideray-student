import React from 'react';
import { MdOutlineCases } from 'react-icons/md';
import GuideRayTechnicalWords from '../GuideRayTechnicalWords';
import './index.css';

const GuideRayUseCases = ({ data, darkMode }) => {
  const themeClass = darkMode ? 'dark' : 'light';

  return (
    <div className={`guideray-usecases-container ${themeClass}`}>
      <div className={`guideray-usecases-header ${themeClass}`}>
        <MdOutlineCases className={`guideray-usecases-icon ${themeClass}`} />
        <h2 className={`guideray-usecases-title ${themeClass}`}>{data.title}</h2>
      </div>
      
      <p className={`guideray-usecases-description ${themeClass}`}>
        {data.description}
      </p>
      
      <ul className={`guideray-usecases-list ${themeClass}`}>
        {data.examples.map((example, index) => (
          <li key={index} className={`guideray-usecases-item ${themeClass}`}>
            <div className={`guideray-usecases-bullet ${themeClass}`}></div>
            <span className={`guideray-usecases-text ${themeClass}`}>{example}</span>
          </li>
        ))}
      </ul>
      
      {data.technicalWords && (
        <div className="guideray-usecases-technical-container">
          <GuideRayTechnicalWords words={data.technicalWords} theme={themeClass} />
        </div>
      )}
    </div>
  );
};

export default GuideRayUseCases;