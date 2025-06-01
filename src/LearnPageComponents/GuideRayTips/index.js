import React from 'react';
import GuideRayTechnicalWords from '../GuideRayTechnicalWords';
import './index.css'
const GuideRayTips = ({ data }) => {
  return (
    <div className="guideray_tips_container">
      <h2 className="guideray_tips_title">{data.title}</h2>
      <p className="guideray_tips_description">{data.description}</p>
      
      <div className="guideray_tips_grid">
        {data.tips.map((tip, index) => (
          <div key={index} className="guideray_tips_card">
            <div className="guideray_tips_icon">💡</div>
            <div className="guideray_tips_content">{tip}</div>
          </div>
        ))}
      </div>
      
      {data.technicalWords && (
        <GuideRayTechnicalWords words={data.technicalWords} />
      )}
    </div>
  );
};

export default GuideRayTips;