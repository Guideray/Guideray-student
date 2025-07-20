import React from 'react';
import { FaStar, FaUserGraduate, FaPlayCircle } from 'react-icons/fa';
import { GiGraduateCap, GiBookshelf } from 'react-icons/gi';
import { IoIosTime, IoMdPricetag } from 'react-icons/io';
import { MdCategory } from 'react-icons/md';
import './index.css';

const RecommendationCard = ({ course, darkMode, onRegisterClick }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="guideray-recommendation-star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="guideray-recommendation-star half" />);
      } else {
        stars.push(<FaRegStar key={i} className="guideray-recommendation-star" />);
      }
    }
    return stars;
  };

  return (
    <div className={`guideray-recommendation-card ${darkMode ? 'guideray-recommendation-dark-mode' : ''}`}>
      <div className="guideray-recommendation-image-container">
        <img src={course.image} alt={course.name} className="guideray-recommendation-image" />
 
      </div>
      
      <div className="guideray-recommendation-content">
        <div className="guideray-recommendation-header">
          <h3 className="guideray-recommendation-title">{course.name}</h3>
          <div className="guideray-recommendation-rating">
            {renderStars(course.rating)}
            <span>{course.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="guideray-recommendation-category">
          <MdCategory className="guideray-recommendation-category-icon" />
          <span>{course.category || 'Development'}</span>
        </div>
        
        <div className="guideray-recommendation-meta">
          <div className="guideray-recommendation-meta-item">
            <IoIosTime className="guideray-recommendation-meta-icon" />
            <span>{course.duration || '8 Weeks'}</span>
          </div>
          <div className="guideray-recommendation-meta-item">
            <GiBookshelf className="guideray-recommendation-meta-icon" />
            <span>{course.modules || 12} Modules</span>
          </div>
        </div>
        
        <div className="guideray-recommendation-footer">
          <div className="guideray-recommendation-price">
            <IoMdPricetag className="guideray-recommendation-price-icon" />
            <span>{course.price ? `₹${course.price}` : 'Free'}</span>
          </div>
          <button 
            className="guideray-recommendation-enroll-button"
            onClick={() => onRegisterClick(course)}
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

const CourseRecommendations = ({ courses, darkMode, onRegisterClick, userData }) => {
  if (courses.length === 0) return null;

  return (
    <div className={`guideray-recommendations-container ${darkMode ? 'guideray-recommendations-dark-mode' : ''}`}>
      <h3 className="guideray-recommendations-title">Recommended For You</h3>
      <div className="guideray-recommendations-list">
        {courses.map((course) => (
          <RecommendationCard 
            key={course._id} 
            course={course} 
            darkMode={darkMode}
            onRegisterClick={onRegisterClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseRecommendations;