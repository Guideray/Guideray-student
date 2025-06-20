import React from 'react';
import GuideRayVideoComponent from '../GuideRayVideoComponent';
import GuideRayCodingPracticeComponent from '../GuideRayCodingPracticeComponent';
import GuideRayPractice from '../../LearnPageComponents/GuideRayPractice';
import './index.css';

const GuideRayTopicContent = ({ topicData, darkMode }) => {
  return (
    <div className={`GuideRayTopicContent-container ${darkMode ? 'dark' : ''}`}>
      <div className="GuideRayTopicContent-header">
        <h2 className="GuideRayTopicContent-title">{topicData.title || 'Learning Path'}</h2>
        <div className="GuideRayTopicContent-progress">
          <div className="GuideRayTopicContent-progress-bar" style={{ width: '75%' }}></div>
        </div>
      </div>
      
      <ul className="GuideRayTopicContent-timeline">
        {topicData.videoComponent && (
          <li className="GuideRayTopicContent-timeline-item">
            <div className="GuideRayTopicContent-timeline-point">
              <div className="GuideRayTopicContent-timeline-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 5h16v14H4V5zm2 2v10h12V7H6zm5 2l5 3-5 3V9z" />
                </svg>
              </div>
            </div>
            <div className="GuideRayTopicContent-timeline-content">
              <div className="GuideRayTopicContent-timeline-date">Step 1</div>
              <h3 className="GuideRayTopicContent-timeline-title">Video Lesson</h3>
              <GuideRayVideoComponent videoData={topicData.videoComponent} darkMode={darkMode} />
            </div>
          </li>
        )}
        
        {topicData.practiceMcq && (
          <li className="GuideRayTopicContent-timeline-item">
            <div className="GuideRayTopicContent-timeline-point">
              <div className="GuideRayTopicContent-timeline-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm1-12h-2v6h2V8zm0 8h-2v2h2v-2z" />
                </svg>
              </div>
            </div>
            <div className="GuideRayTopicContent-timeline-content">
              <div className="GuideRayTopicContent-timeline-date">Step 2</div>
              <h3 className="GuideRayTopicContent-timeline-title">Practice Questions</h3>
              <GuideRayPractice data={topicData.practiceMcq} darkMode={darkMode} />
            </div>
          </li>
        )}
        
        {topicData.codingPractice && (
          <li className="GuideRayTopicContent-timeline-item">
            <div className="GuideRayTopicContent-timeline-point">
              <div className="GuideRayTopicContent-timeline-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 3v2h3V3H8zm5 0v2h3V3h-3zm5 0v2h1c.552 0 1 .448 1 1v14c0 .552-.448 1-1 1H5c-.552 0-1-.448-1-1V6c0-.552.448-1 1-1h1V3H3v18h18V3h-3zM8 17v-2H5v2h3zm5 0v-2h-3v2h3zm5 0v-2h-3v2h3zm0-5v-2H5v2h13z" />
                </svg>
              </div>
            </div>
            <div className="GuideRayTopicContent-timeline-content">
              <div className="GuideRayTopicContent-timeline-date">Step 3</div>
              <h3 className="GuideRayTopicContent-timeline-title">Coding Challenge</h3>
              <GuideRayCodingPracticeComponent codingData={topicData.codingPractice} darkMode={darkMode} />
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default GuideRayTopicContent;