import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import './index.css';

const GuideRayStudentLivePrograms = () => {
  // Sample program data with real image links and gradient colors
  const [programs, setPrograms] = useState([
    {
      id: 1,
      title: "Web Development Masterclass",
      description: "Learn modern web development with React, Node.js and MongoDB",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      time: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
      isRegistered: false,
      isLive: false,
      instructor: "Sarah Johnson",
      category: "Development",
      gradient: "linear-gradient(135deg, rgba(58, 65, 111, 0.7) 0%, rgba(20, 23, 39, 0.7) 100%)"
    },
    {
      id: 2,
      title: "Data Science Workshop",
      description: "Master data analysis, visualization and machine learning with Python",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      time: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
      isRegistered: true,
      isLive: false,
      instructor: "Michael Chen",
      category: "Data Science",
      gradient: "linear-gradient(135deg, rgba(106, 17, 203, 0.7) 0%, rgba(37, 117, 252, 0.7) 100%)"
    },
    {
      id: 3,
      title: "AI Fundamentals Live Session",
      description: "Introduction to artificial intelligence and neural networks with TensorFlow",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      isRegistered: true,
      isLive: true,
      instructor: "Dr. Alan Turing",
      category: "Artificial Intelligence",
      gradient: "linear-gradient(135deg, rgba(17, 153, 142, 0.7) 0%, rgba(56, 239, 125, 0.7) 100%)"
    },
    {
      id: 4,
      title: "Mobile App Development",
      description: "Build cross-platform apps with Flutter and Firebase",
      image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      time: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 day from now
      isRegistered: false,
      isLive: false,
      instructor: "Emma Wilson",
      category: "Mobile",
      gradient: "linear-gradient(135deg, rgba(252, 74, 26, 0.7) 0%, rgba(247, 183, 51, 0.7) 100%)"
    }
  ]);

  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  };

  // Function to handle registration
  const handleRegister = (id) => {
    setPrograms(programs.map(program => 
      program.id === id ? {...program, isRegistered: true} : program
    ));
  };

  // Function to check if program has started
  useEffect(() => {
    const interval = setInterval(() => {
      setPrograms(prevPrograms => prevPrograms.map(program => {
        const currentTime = new Date();
        const programTime = new Date(program.time);
        return {
          ...program,
          isLive: currentTime >= programTime
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Function to format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to calculate time remaining
  const getTimeRemaining = (dateString) => {
    const now = new Date();
    const programTime = new Date(dateString);
    const diff = programTime - now;

    if (diff <= 0) return "Live Now!";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `Starts in ${hours}h ${minutes}m`;
  };

  return (
    <div className="GuideRayStudentLivePrograms-container">
      <div className="GuideRayStudentLivePrograms-slider-container">
        <Slider {...settings}>
          {programs.map(program => (
            <div key={program.id} className="GuideRayStudentLivePrograms-slide">
              <div className="GuideRayStudentLivePrograms-card">
                {/* Background Image Layer */}
                <div className="GuideRayStudentLivePrograms-image-container">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="GuideRayStudentLivePrograms-image"
                  />
                </div>
                
                {/* Color Overlay Layer */}
                <div 
                  className="GuideRayStudentLivePrograms-color-overlay"
                  style={{ background: program.gradient }}
                ></div>
                
                {/* Content Layer */}
                <div className="GuideRayStudentLivePrograms-content">
                  <div className="GuideRayStudentLivePrograms-header">
                    <span className="GuideRayStudentLivePrograms-category">
                      {program.category}
                    </span>
                    <div className="GuideRayStudentLivePrograms-status">
                      {program.isLive ? (
                        <span className="GuideRayStudentLivePrograms-live-tag">
                          <span className="GuideRayStudentLivePrograms-live-dot"></span>
                          LIVE
                        </span>
                      ) : (
                        <span className="GuideRayStudentLivePrograms-time">
                          {formatTime(program.time)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='GuideRayStudentLivePrograms-text-content-out'>
                    <div className="GuideRayStudentLivePrograms-text-content">
                      <h3 className="GuideRayStudentLivePrograms-program-title">
                        {program.title}
                      </h3>
                      <p className="GuideRayStudentLivePrograms-description">
                        {program.description}
                      </p>
                      <p className="GuideRayStudentLivePrograms-instructor">
                        Instructor: <span>{program.instructor}</span>
                      </p>
                    </div>
                    
                    <div className="GuideRayStudentLivePrograms-action-section">
                      {program.isRegistered && !program.isLive && (
                        <div className="GuideRayStudentLivePrograms-timer">
                          <svg className="GuideRayStudentLivePrograms-timer-icon" viewBox="0 0 24 24">
                            <path d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z" />
                          </svg>
                          {getTimeRemaining(program.time)}
                        </div>
                      )}
                      
                      <div className="GuideRayStudentLivePrograms-action-button">
                        {program.isLive ? (
                          <button className="GuideRayStudentLivePrograms-join-button">
                            <svg className="GuideRayStudentLivePrograms-play-icon" viewBox="0 0 24 24">
                              <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                            </svg>
                            Join Now
                          </button>
                        ) : program.isRegistered ? (
                          <button className="GuideRayStudentLivePrograms-registered-button" disabled>
                            <svg className="GuideRayStudentLivePrograms-check-icon" viewBox="0 0 24 24">
                              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                            </svg>
                            Registered
                          </button>
                        ) : (
                          <button 
                            className="GuideRayStudentLivePrograms-register-button"
                            onClick={() => handleRegister(program.id)}
                          >
                            Register Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default GuideRayStudentLivePrograms;