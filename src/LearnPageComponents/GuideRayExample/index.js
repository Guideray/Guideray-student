// src/components/GuideRayExample.js
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { 
  materialLight, 
  materialOceanic 
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import GuideRayTechnicalWords from '../GuideRayTechnicalWords';
import './index.css';

const GuideRayExample = ({ data, darkMode }) => {
  const themeClass = darkMode ? 'dark' : 'light';
  const codeStyle = darkMode ? materialOceanic : materialLight;
  
  return (
    <div className={`guideray-example-container ${themeClass}`}>
      <div className="guideray-example-header">
        <div className="guideray-example-header-content">
          <h2 className="guideray-example-title">{data.title}</h2>
          <p className="guideray-example-subtitle">{data.subtitle}</p>
        </div>
        <div className={`guideray-example-badge ${themeClass}`}>
          {data.category}
        </div>
      </div>
      
      <div className="guideray-example-description">
        {data.description}
      </div>

      <div className="guideray-example-code-container">
        <div className="guideray-example-code-toolbar">
          <span className="guideray-example-code-language">
            {data.language || 'python'}
          </span>
          <button className="guideray-example-copy-button">
            <span className="guideray-example-copy-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M8 4V16C8 17.1046 8.89543 18 10 18H18C19.1046 18 20 17.1046 20 16V7.2426C20 6.44772 19.6839 5.68478 19.1213 5.12215L16.8779 2.87868C16.3152 2.31607 15.5523 2 14.7574 2H10C8.89543 2 8 2.89543 8 4Z" 
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4 8V20C4 21.1046 4.89543 22 6 22H14C15.1046 22 16 21.1046 16 20V8C16 6.89543 15.1046 6 14 6H6C4.89543 6 4 6.89543 4 8Z" 
                      stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </span>
            Copy
          </button>
        </div>
        <SyntaxHighlighter
          language={data.language || 'python'}
          style={codeStyle}
          wrapLines={true}
          showLineNumbers={true}
          lineNumberStyle={{ 
            color: darkMode ? '#6b7280' : '#9ca3af',
            minWidth: '2.5em'
          }}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            borderRadius: '0 0 8px 8px',
            background: darkMode ? '#1e293b' : '#f3f4f6'
          }}
        >
          {data.code.join('\n')}
        </SyntaxHighlighter>
      </div>

      {data.technicalWords && (
        <GuideRayTechnicalWords 
          words={data.technicalWords} 
          theme={themeClass} 
        />
      )}
    </div>
  );
};

export default GuideRayExample;