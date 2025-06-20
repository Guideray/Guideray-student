import React from 'react';
import './index.css';

const GuiderayStudentUpcomingClasses = ({ darkMode }) => {
  const classes = [
    { id: 1, name: 'Mathematics', time: '10:00 AM', teacher: 'Mr. Smith' },
    { id: 2, name: 'Physics', time: '12:30 PM', teacher: 'Ms. Johnson' },
    { id: 3, name: 'English', time: '02:00 PM', teacher: 'Mr. Brown' }
  ];

  return (
    <div className={`guideray-student-upcoming-classes ${darkMode ? 'guideray-student-upcoming-classes-dark' : 'guideray-student-upcoming-classes-light'}`}>
      <h3 className="guideray-student-upcoming-classes-title">Upcoming Classes</h3>
      <div className="guideray-student-upcoming-classes-list">
        {classes.map(cls => (
          <div key={cls.id} className="guideray-student-upcoming-class-item">
            <div className="guideray-student-upcoming-class-time">{cls.time}</div>
            <div className="guideray-student-upcoming-class-details">
              <div className="guideray-student-upcoming-class-name">{cls.name}</div>
              <div className="guideray-student-upcoming-class-teacher">{cls.teacher}</div>
            </div>
            <button className="guideray-student-upcoming-class-join">Join</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuiderayStudentUpcomingClasses;