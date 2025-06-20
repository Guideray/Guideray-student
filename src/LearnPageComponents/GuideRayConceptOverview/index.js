import React from 'react';
import { FiBookOpen, FiCode, FiCheck, FiX } from 'react-icons/fi';
import GuideRayTechnicalWords from '../GuideRayTechnicalWords';
import './index.css';

const GuideRayConceptOverview = ({ data, darkMode }) => {
  const themeClass = darkMode ? 'dark' : 'light';

  return (
    <div className={`guideray-concept-overview-container ${themeClass}`}>
      <div className="guideray-concept-overview-header">
        
        <div className="guideray-concept-overview-header-content">
          <h1 className={`guideray-concept-overview-title ${themeClass}`}>{data.header}</h1>
          <div className={`guideray-concept-overview-divider ${themeClass}`}></div>
        </div>
      </div>
      
      <div className="guideray-concept-overview-body">
        <p className={`guideray-concept-overview-description ${themeClass}`}>{data.description}</p>
        
        {/* Naming Rules Section */}
        {data.namingRules && (
          <div className={`guideray-naming-rules-container ${themeClass}`}>
            <h3 className={`guideray-naming-rules-title ${themeClass}`}>
              <FiCode className="guideray-naming-rules-icon" /> 
              Variable Naming Rules
            </h3>
            <p className={`guideray-naming-rules-description ${themeClass}`}>
              {data.namingRules.description}
            </p>
            
            <div className="guideray-naming-rules-grid">
              <div className="guideray-naming-rules-column">
                <h4 className={`guideray-naming-rules-subtitle ${themeClass}`}>Rules:</h4>
                <ul className={`guideray-naming-rules-list ${themeClass}`}>
                  {data.namingRules.rules.map((rule, index) => (
                    <li key={index} className={`guideray-naming-rules-item ${themeClass}`}>
                      <FiCheck className="guideray-naming-rules-check" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="guideray-naming-rules-column">
                <h4 className={`guideray-naming-rules-subtitle ${themeClass}`}>Examples:</h4>
                <div className="guideray-naming-rules-examples">
                  <div>
                    <h5 className={`guideray-naming-rules-example-title ${themeClass}`}>
                      Valid Names
                    </h5>
                    <ul className={`guideray-naming-rules-valid-list ${themeClass}`}>
                      {data.namingRules.examples.valid.map((example, index) => (
                        <li key={index} className="guideray-naming-rules-valid-item">
                          <FiCheck className="guideray-naming-rules-valid-icon" />
                          <code>{example}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className={`guideray-naming-rules-example-title ${themeClass}`}>
                      Invalid Names
                    </h5>
                    <ul className={`guideray-naming-rules-invalid-list ${themeClass}`}>
                      {data.namingRules.examples.invalid.map((example, index) => (
                        <li key={index} className="guideray-naming-rules-invalid-item">
                          <FiX className="guideray-naming-rules-invalid-icon" />
                          <code>{example}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {data.technicalWords && (
        <div className={`guideray-concept-overview-technical-container ${themeClass}`}>
          <GuideRayTechnicalWords words={data.technicalWords} theme={themeClass} />
        </div>
      )}
    </div>
  );
};

export default GuideRayConceptOverview;