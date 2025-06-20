import React from 'react';
import './index.css';

const GuiderayStudentResourceRecommendations = ({ darkMode }) => {
  const resources = [
    { id: 1, title: 'Calculus Study Guide', type: 'PDF', subject: 'Math' },
    { id: 2, title: 'Physics Lab Template', type: 'Doc', subject: 'Physics' },
    { id: 3, title: 'Literature Analysis', type: 'Video', subject: 'English' },
    { id: 4, title: 'Programming Exercises', type: 'Interactive', subject: 'CS' }
  ];

  return (
    <div className={`guideray-student-resource-recommendations ${darkMode ? 'guideray-student-resource-recommendations-dark' : 'guideray-student-resource-recommendations-light'}`}>
      <h3 className="guideray-student-resource-recommendations-title">Recommended Resources</h3>
      <div className="guideray-student-resource-recommendations-list">
        {resources.map(resource => (
          <div key={resource.id} className="guideray-student-resource-item">
            <div className="guideray-student-resource-icon">
              {resource.type === 'PDF' && <span>📄</span>}
              {resource.type === 'Doc' && <span>📝</span>}
              {resource.type === 'Video' && <span>🎬</span>}
              {resource.type === 'Interactive' && <span>🖥️</span>}
            </div>
            <div className="guideray-student-resource-details">
              <div className="guideray-student-resource-title">{resource.title}</div>
              <div className="guideray-student-resource-subject">{resource.subject}</div>
            </div>
            <button className="guideray-student-resource-download">↓</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuiderayStudentResourceRecommendations;