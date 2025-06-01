import React from 'react';
import { FiHash } from 'react-icons/fi';
import './index.css';

const GuideRayTechnicalWords = ({ words, theme }) => {
  if (!words || words.length === 0) return null;

  const themeClass = theme

  console.log(themeClass)

  return (
    <div className={`guideray-technical-words-container ${themeClass}`}>
      <div className={`guideray-technical-words-header ${themeClass}`}>
        <FiHash className={`guideray-technical-words-icon ${themeClass}`} />
        <h3 className={`guideray-technical-words-title ${themeClass}`}>Learn Important Technical Terms </h3>
      </div>
      <dl className={`guideray-technical-words-list ${themeClass}`}>
        {words.map((word, index) => (
          <div 
            key={`${word.term}-${index}`} 
            className={`guideray-technical-words-item ${themeClass}`}
          >
            <dt className={`guideray-technical-words-term ${themeClass}`}>
              {word.term}
            </dt>
            <dd className={`guideray-technical-words-meaning ${themeClass}`}>
              {word.meaning}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default GuideRayTechnicalWords;