import React from 'react';
import { FaLock } from 'react-icons/fa';
import './index.css';

const LockedTopic = ({ darkMode }) => {
  return (
    <div className={`locked-topic-container ${darkMode ? 'dark' : ''}`}>
      <div className="locked-icon">
        <FaLock size={48} />
      </div>
      <h2 className="locked-title">Topic Locked</h2>
      <p className="locked-message">
        Complete the previous topics to unlock this content.
      </p>
    </div>
  );
};

export default LockedTopic;