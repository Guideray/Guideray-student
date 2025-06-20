import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPython, FaClock, FaBook, FaLaptopCode, FaJs, FaDatabase, FaServer
} from 'react-icons/fa';
import { MdComputer } from 'react-icons/md';
import './index.css';

const CourseCard = ({ course, darkMode }) => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/intro', { state: { path: course.path } });
  };

  const getCourseIcon = (courseName) => {
    const name = courseName.toLowerCase();
    if (name.includes('python')) return <FaPython className="guideray-student-course-icon" />;
    if (name.includes('javascript')) return <FaJs className="guideray-student-course-icon" />;
    if (name.includes('data')) return <FaDatabase className="guideray-student-course-icon" />;
    if (name.includes('web')) return <FaServer className="guideray-student-course-icon" />;
    return <MdComputer className="guideray-student-course-icon" />;
  };

  const getCourseImage = (courseName) => {
    const name = courseName.toLowerCase();
    if (name.includes('python')) return 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1000&q=80';
    if (name.includes('javascript')) return 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=1000&q=80';
    if (name.includes('data')) return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80';
    if (name.includes('web')) return 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80';
    return 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80';
  };

  return (
    <div className={`guideray-student-course-card ${darkMode ? 'guideray-student-course-dark' : 'guideray-student-course-light'}`}>
      <div className="guideray-student-course-image-container">
        <img
          src={getCourseImage(course.courseName)}
          alt={course.courseName}
          className="guideray-student-course-image"
          loading="lazy"
        />
        <div className="guideray-student-course-icon-container">
          {getCourseIcon(course.courseName)}
        </div>
      </div>

      <div className="guideray-student-course-content">
        <h3 className="guideray-student-course-title">{course.courseName}</h3>
        <p className="guideray-student-course-description">{course.description}</p>

        <div className="guideray-student-course-meta">
          <div className="guideray-student-course-meta-item">
            <FaClock className="guideray-student-course-meta-icon" />
            <span>{course.duration}</span>
          </div>
          <div className="guideray-student-course-meta-item">
            <FaBook className="guideray-student-course-meta-icon" />
            <span>15 Modules</span>
          </div>
          <div className="guideray-student-course-meta-item">
            <FaLaptopCode className="guideray-student-course-meta-icon" />
            <span>Hands-on Projects</span>
          </div>
        </div>

        <button
          className={`guideray-student-course-enroll-button ${darkMode ? 'guideray-student-course-dark' : 'guideray-student-course-light'}`}
          onClick={handleExploreClick}
        >
          Explore Course
          <span className="guideray-student-course-button-arrow">→</span>
        </button>
      </div>
    </div>
  );
};

const StudentCource = ({ darkMode }) => {
  const courses = [
    {
      courseName: "Python Mastery: From Basics to Advanced",
      description: "A comprehensive Python course covering everything from basic syntax to advanced topics like object-oriented programming, file handling, and modules. Perfect for beginners and intermediate learners.",
      duration: "12 weeks",
      path: "PythonData"
    },
    {
      courseName: "JavaScript Fundamentals",
      description: "Master the language of the web with this complete JavaScript course covering ES6+ features, DOM manipulation, and async programming.",
      duration: "8 weeks",
      path: "javascript_data.json"
    },
    {
      courseName: "Data Science with Python",
      description: "Learn data analysis, visualization, and machine learning using Python's powerful data science stack including Pandas, NumPy, and Matplotlib.",
      duration: "10 weeks",
      path: "data_science_data.json"
    },
    {
      courseName: "Web Development Bootcamp",
      description: "Full-stack web development course covering HTML, CSS, JavaScript, React, Node.js, and MongoDB to build modern web applications.",
      duration: "14 weeks",
      path: "webdev_data.json"
    }
  ];

  return (
    <div className={`guideray-student-course-grid-container ${darkMode ? 'guideray-student-course-dark' : 'guideray-student-course-light'}`}>
      <h2 className="guideray-student-course-grid-title">Featured Courses</h2>
      <p className="guideray-student-course-grid-subtitle">Start your learning journey with our most popular courses</p>
      <div className="guideray-student-course-grid">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
};

export default StudentCource;
