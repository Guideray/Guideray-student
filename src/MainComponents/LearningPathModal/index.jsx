import React from 'react';
import { FaTimes, FaCheck, FaChartLine, FaArrowRight } from 'react-icons/fa';
import { MdCode, MdCloud, MdDataUsage } from 'react-icons/md';
import { FaServer } from 'react-icons/fa';
import './index.css';

const LearningPathModal = ({ darkMode, onClose }) => {
  const learningPaths = [
    {
      title: "Frontend Developer",
      description: "Master the art of building beautiful, interactive user interfaces",
      steps: [
        "HTML & CSS Fundamentals",
        "JavaScript Basics",
        "React or Vue.js Framework",
        "State Management",
        "Responsive Design",
        "Build Portfolio Projects"
      ],
      icon: <MdCode className="learning-path-icon" />,
      color: "#6e8efb",
      gradient: "linear-gradient(135deg, #6e8efb, #a777e3)"
    },
    {
      title: "Backend Developer",
      description: "Learn to build robust server-side applications and APIs",
      steps: [
        "Programming Fundamentals (Python/Java/Node.js)",
        "Database Management",
        "API Development",
        "Authentication & Security",
        "Cloud Deployment",
        "Build Scalable Applications"
      ],
      icon: <FaServer className="learning-path-icon" />,
      color: "#a777e3",
      gradient: "linear-gradient(135deg, #a777e3, #6e8efb)"
    },
    {
      title: "Data Scientist",
      description: "Unlock insights from data with statistical and machine learning techniques",
      steps: [
        "Python Programming",
        "Data Analysis with Pandas",
        "Data Visualization",
        "Machine Learning Basics",
        "Statistical Modeling",
        "Real-world Data Projects"
      ],
      icon: <MdDataUsage className="learning-path-icon" />,
      color: "#4caf50",
      gradient: "linear-gradient(135deg, #4caf50, #8bc34a)"
    },
    {
      title: "DevOps Engineer",
      description: "Bridge development and operations with automation and cloud technologies",
      steps: [
        "Linux Fundamentals",
        "Networking Basics",
        "Containerization (Docker)",
        "CI/CD Pipelines",
        "Cloud Services (AWS/Azure)",
        "Infrastructure as Code"
      ],
      icon: <MdCloud className="learning-path-icon" />,
      color: "#ff7043",
      gradient: "linear-gradient(135deg, #ff7043, #ffab40)"
    }
  ];

  return (
    <div className={`learning-path-modal ${darkMode ? 'dark' : ''}`}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="modal-header">
          <div className="header-icon">
            <FaChartLine />
          </div>
          <div>
            <h2>Choose Your Learning Path</h2>
            <p className="subtitle">
              Not sure where to start? Select a career path to see recommended courses that will help you achieve your goals.
            </p>
          </div>
        </div>
        
        <div className="paths-grid">
          {learningPaths.map((path, index) => (
            <div 
              key={index} 
              className="path-card"
              style={{ '--path-color': path.color, '--path-gradient': path.gradient }}
            >
              <div className="card-header">
                <div className="icon-wrapper">
                  {path.icon}
                </div>
                <div>
                  <h3>{path.title}</h3>
                  <p className="card-description">{path.description}</p>
                </div>
              </div>
              
              <div className="steps-container">
                <h4>Learning Journey</h4>
                <ol className="steps-list">
                  {path.steps.map((step, i) => (
                    <li key={i}>
                      <span className="step-number">{i + 1}</span>
                      <span className="step-text">{step}</span>
                      <FaCheck className="step-check" />
                    </li>
                  ))}
                </ol>
              </div>
              
              <button className="start-path-btn">
                Start This Path <FaArrowRight className="arrow-icon" />
              </button>
              
              <div className="card-decoration"></div>
            </div>
          ))}
        </div>
        
        <div className="modal-footer">
          <p className="footer-text">
            Still not sure? Take our <a href="/skill-assessment" className="footer-link">skill assessment</a> to get personalized recommendations.
          </p>
          <button className="close-modal-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningPathModal;