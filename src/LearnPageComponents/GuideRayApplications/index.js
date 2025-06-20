import React from 'react';
import './index.css';

const GuideRayApplications = ({ data, darkMode }) => {
  const themeClass = darkMode ? 'dark' : 'light';

  return (
    <div className={`guideray_applications_container ${themeClass}`}>
      <h2 className={`guideray_applications_title ${themeClass}`}>{data.title}</h2>
      <p className={`guideray_applications_description ${themeClass}`}>{data.description}</p>
      
      <div className="guideray_applications_grid">
        {data["examples"].map((app, index) => (
          <div 
            key={`app-${index}`} 
            className={`guideray_applications_card ${themeClass}`}
          >
            <div className={`guideray_applications_card_content ${themeClass}`}>
              {app}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuideRayApplications;


