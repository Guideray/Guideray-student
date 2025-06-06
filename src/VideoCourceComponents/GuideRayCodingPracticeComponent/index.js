import React from 'react';

const GuideRayCodingPracticeComponent = ({ codingData }) => {
  return (
    <div className="guideraycodingpracticecomponent-container">
      <h2 className="guideraycodingpracticecomponent-title">Coding Practice</h2>
      <div className="guideraycodingpracticecomponent-practicelinks">
        {codingData.links.map((link, index) => (
          <div key={index} className="guideraycodingpracticecomponent-practicelink">
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="guideraycodingpracticecomponent-link">
              {link.title}
            </a>
            <span className="guideraycodingpracticecomponent-linkicon">→</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuideRayCodingPracticeComponent;