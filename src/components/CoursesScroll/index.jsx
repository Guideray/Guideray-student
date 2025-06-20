import React, { useRef, useEffect } from 'react';
import coursesData from './courses.json';
import './index.css';

const CourseScroll = () => {
  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const isHoveredRef = useRef(false);

  // Auto-scroll function
  const startAutoScroll = () => {
    if (scrollContainerRef.current && !isHoveredRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
          const maxScroll = scrollWidth - clientWidth;
          
          if (scrollLeft >= maxScroll - 10) {
            scrollContainerRef.current.scrollLeft = 0;
          } else {
            scrollContainerRef.current.scrollLeft += 1;
          }
        }
      }, 30);
    }
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    startAutoScroll();
  };

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="course-scroll-container">
      <h2 className="section-title">Featured Online Courses</h2>
      <div 
        className="courses-scroll-wrapper"
        ref={scrollContainerRef}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
      >
        <div className="courses-container">
          {coursesData.courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className={`status-badge ${course.status.toLowerCase()}`}>
                {course.status}
              </div>
              <div className="course-image">
                <img src={course.image} alt={course.title} onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/300x200?text=Course+Image";
                }} />
              </div>
              <div className="course-info">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-instructor">
                  <span className="instructor-label">Instructor:</span> {course.instructor}
                </p>
                <p className="course-duration">
                  <span className="duration-label">Duration:</span> {course.duration}
                </p>
                <p className="course-platform">
                  <span className="platform-label">Platform:</span> {course.platform}
                </p>
              </div>
            </div>
          ))}
          {/* Duplicate for seamless looping */}
          {coursesData.courses.map((course) => (
            <div key={`duplicate-${course.id}`} className="course-card">
              <div className={`status-badge ${course.status.toLowerCase()}`}>
                {course.status}
              </div>
              <div className="course-image">
                <img src={course.image} alt={course.title} onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/300x200?text=Course+Image";
                }} />
              </div>
              <div className="course-info">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-instructor">
                  <span className="instructor-label">Instructor:</span> {course.instructor}
                </p>
                <p className="course-duration">
                  <span className="duration-label">Duration:</span> {course.duration}
                </p>
                <p className="course-platform">
                  <span className="platform-label">Platform:</span> {course.platform}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseScroll;