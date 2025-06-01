import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';

// Mock components for each section
const StudentHome = ({ darkMode }) => (
  <div className={`guideray-student-dashboard-content ${darkMode ? 'guideray-student-dashboard-dark' : 'guideray-student-dashboard-light'}`}>
    <h1>Welcome to Student Dashboard</h1>
    <p>Current theme: {darkMode ? 'Dark' : 'Light'}</p>
    <p>Explore your learning journey with our intuitive interface.</p>
  </div>
);

const Learn = () => <div className="guideray-student-dashboard-content"><h2>Learn Section</h2></div>;
const Practice = () => <div className="guideray-student-dashboard-content"><h2>Practice Section</h2></div>;
const Contest = () => <div className="guideray-student-dashboard-content"><h2>Contest Section</h2></div>;
const GuideTalk = () => <div className="guideray-student-dashboard-content"><h2>GuideTalk Section</h2></div>;

const StudentDashboard = ({ darkMode }) => {
  return (
    <div className={`guideray-student-dashboard-main ${darkMode ? 'guideray-student-dashboard-dark' : 'guideray-student-dashboard-light'}`}>
      <div className="guideray-student-dashboard-content-area">
        <Routes>
          <Route path="/" element={<StudentHome darkMode={darkMode} />} />
          <Route path="/course" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/contest" element={<Contest />} />
          <Route path="/guidetalk" element={<GuideTalk />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;
