import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaLock, FaArrowRight, FaBook, FaChalkboardTeacher, FaClock, FaLaptopCode, FaCheckCircle } from 'react-icons/fa';
import { MdEmail, MdOutlineSms } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import axios from 'axios';
import languagesData from './courses.json';
import './index.css';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1); // 1: email, 2: OTP
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();

  // Refs for OTP input focus management
  const otpInputs = useRef([]);

  // Auto-scroll functionality for languages
  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const isHoveredRef = useRef(false);

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

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
    const response = await axios.post(
  'https://webservice.guideray.in/api/student-auth/request-otp',
  {
    email: email
  },
  {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
);

      if (response.data.success) {
        setOtpSent(true);
        setStep(2);
        setCountdown(30); // 30 seconds countdown
        setSuccessMessage('OTP sent to your email!');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
     const response = await axios.post(
  'https://webservice.guideray.in/api/student-auth/verify-otp',
  {
    email: email,
    otp: otpCode
  },
  {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true  // Important to allow cookie/session transfer
  }
);

      if (response.data.success) {
        setStudentData(response.data.data);
        // Store token in cookies
        document.cookie = `studentToken=${response.data.data.token}; path=/; max-age=86400`; // 1 day
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(response.data.message || 'OTP verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('https://webservice.guideray.in/api/student-auth/request-otp', {
        email: email
      });

      if (response.data.success) {
        setCountdown(30);
        setSuccessMessage('New OTP sent to your email!');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setError(response.data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="guideray-student-login-container">
      <div className="guideray-student-login-left-section">
        {/* Background Icons */}
<div className="guideray-student-login-icon-background">
  {/* First set of 16 icons */}
  <FaBook className="guideray-student-login-bg-icon guideray-student-login-bg-icon-1" />
  <FaChalkboardTeacher className="guideray-student-login-bg-icon guideray-student-login-bg-icon-2" />
  <FaLaptopCode className="guideray-student-login-bg-icon guideray-student-login-bg-icon-3" />
  <FaUserGraduate className="guideray-student-login-bg-icon guideray-student-login-bg-icon-4" />
  <FaBook className="guideray-student-login-bg-icon guideray-student-login-bg-icon-5" />
  <FaClock className="guideray-student-login-bg-icon guideray-student-login-bg-icon-6" />
  <FaLaptopCode className="guideray-student-login-bg-icon guideray-student-login-bg-icon-7" />
  <FaChalkboardTeacher className="guideray-student-login-bg-icon guideray-student-login-bg-icon-8" />
  <FaUserGraduate className="guideray-student-login-bg-icon guideray-student-login-bg-icon-9" />
  <FaBook className="guideray-student-login-bg-icon guideray-student-login-bg-icon-10" />
  <FaClock className="guideray-student-login-bg-icon guideray-student-login-bg-icon-11" />
  <FaLaptopCode className="guideray-student-login-bg-icon guideray-student-login-bg-icon-12" />
  <FaChalkboardTeacher className="guideray-student-login-bg-icon guideray-student-login-bg-icon-13" />
  <FaUserGraduate className="guideray-student-login-bg-icon guideray-student-login-bg-icon-14" />
  <FaBook className="guideray-student-login-bg-icon guideray-student-login-bg-icon-15" />
  <FaClock className="guideray-student-login-bg-icon guideray-student-login-bg-icon-16" />
  
  {/* Second set of 16 icons (duplicates with different positions) */}
  <FaBook className="guideray-student-login-bg-icon guideray-student-login-bg-icon-17" />
  <FaChalkboardTeacher className="guideray-student-login-bg-icon guideray-student-login-bg-icon-18" />
  <FaLaptopCode className="guideray-student-login-bg-icon guideray-student-login-bg-icon-19" />
  <FaUserGraduate className="guideray-student-login-bg-icon guideray-student-login-bg-icon-20" />
  <FaBook className="guideray-student-login-bg-icon guideray-student-login-bg-icon-21" />
  <FaClock className="guideray-student-login-bg-icon guideray-student-login-bg-icon-22" />
  <FaLaptopCode className="guideray-student-login-bg-icon guideray-student-login-bg-icon-23" />
  <FaChalkboardTeacher className="guideray-student-login-bg-icon guideray-student-login-bg-icon-24" />
  <FaUserGraduate className="guideray-student-login-bg-icon guideray-student-login-bg-icon-25" />
  <FaBook className="guideray-student-login-bg-icon guideray-student-login-bg-icon-26" />
  <FaClock className="guideray-student-login-bg-icon guideray-student-login-bg-icon-27" />
  <FaLaptopCode className="guideray-student-login-bg-icon guideray-student-login-bg-icon-28" />
  <FaChalkboardTeacher className="guideray-student-login-bg-icon guideray-student-login-bg-icon-29" />
  <FaUserGraduate className="guideray-student-login-bg-icon guideray-student-login-bg-icon-30" />
  <FaBook className="guideray-student-login-bg-icon guideray-student-login-bg-icon-31" />
  <FaClock className="guideray-student-login-bg-icon guideray-student-login-bg-icon-32" />
</div>
<div className='guideray-student-login-logo'>
      <img
            src="https://res.cloudinary.com/dx97khgxd/image/upload/v1747826507/b4r9unmciqqgfiuncwcp.png" 
            alt="Portal Logo"
            draggable="false"
            className="logo-image"
          />

</div>

        <div className="guideray-student-login-welcome-content">
       
          <h2 className="guideray-student-login-welcome-title">
            Learn Programming in Telugu
          </h2>
          <p className="guideray-student-login-welcome-text">
            Master programming languages with our comprehensive Telugu video courses. 
            Designed specifically for Telugu-speaking learners with expert instruction 
            in your native language.
          </p>
          
          <div className="guideray-student-login-features">
            <div className="guideray-student-login-feature-item">
              <FaBook className="guideray-student-login-feature-icon" />
              <span>Telugu Video Lectures</span>
            </div>
            <div className="guideray-student-login-feature-item">
              <FaChalkboardTeacher className="guideray-student-login-feature-icon" />
              <span>Native Telugu Instructors</span>
            </div>
            <div className="guideray-student-login-feature-item">
              <FaClock className="guideray-student-login-feature-icon" />
              <span>Learn at Your Own Pace</span>
            </div>
            <div className="guideray-student-login-feature-item">
              <FaLaptopCode className="guideray-student-login-feature-icon" />
              <span>Hands-on Coding Exercises</span>
            </div>
          </div>
        </div>

        <div className="guideray-student-login-language-scroll-container">
          <div 
            className="guideray-student-login-languages-scroll-wrapper"
            ref={scrollContainerRef}
          >
            <div className="guideray-student-login-languages-container">
              {languagesData.languages.map((language) => (
                <div key={language.id} className="guideray-student-login-language-card">
                  <div className="guideray-student-login-language-image">
                    <img 
                      src={language.image} 
                      alt={language.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                      }} 
                    />
                  </div>
                  <div className="guideray-student-login-language-info">
                    <h3 className="guideray-student-login-language-name">{language.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="guideray-student-login-right-section">
        <div className="guideray-student-login-form-container">
          {step === 1 ? (
            <>
              <div className="guideray-student-login-form-header">
                <FaUserGraduate className="guideray-student-login-user-icon" />
                <h2>Student Login</h2>
                <p>Welcome back! Please enter your registered email</p>
              </div>

              <form onSubmit={handleEmailSubmit}>
                {error && <div className="guideray-student-login-error-message">{error}</div>}
                {successMessage && <div className="guideray-student-login-success-message">{successMessage}</div>}
                
                <div className="guideray-student-login-input-group">
                  <label htmlFor="email">Email</label>
                  <div className="guideray-student-login-input-wrapper">
                    <MdEmail className="guideray-student-login-input-icon" />
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="guideray-student-login-input"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="guideray-student-login-button" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Sending OTP...'
                  ) : (
                    <>
                      Continue <FaArrowRight className="guideray-student-login-arrow-icon" />
                    </>
                  )}
                </button>
              </form>

              <div className="guideray-student-login-signup-link">
                Don't have an account? <a href="/student-registration">Register</a>
              </div>
            </>
          ) : (
            <>
              <div className="guideray-student-login-form-header">
                <RiLockPasswordLine className="guideray-student-login-user-icon" />
                <h2>OTP Verification</h2>
                <p>We've sent a 6-digit code to {email}</p>
              </div>

              <form onSubmit={handleOtpSubmit}>
                {error && <div className="guideray-student-login-error-message">{error}</div>}
                {successMessage && <div className="guideray-student-login-success-message">{successMessage}</div>}
                
                <div className="guideray-student-login-otp-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      ref={(el) => (otpInputs.current[index] = el)}
                      className="guideray-student-login-otp-input"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <div className="guideray-student-login-otp-resend">
                  Didn't receive code? 
                  <button 
                    type="button" 
                    onClick={resendOtp} 
                    disabled={countdown > 0}
                    className="guideray-student-login-resend-button"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>

                <button 
                  type="submit" 
                  className="guideray-student-login-button" 
                  disabled={isLoading || otp.join('').length !== 6}
                >
                  {isLoading ? (
                    'Verifying...'
                  ) : (
                    <>
                      Verify OTP <FaCheckCircle className="guideray-student-login-arrow-icon" />
                    </>
                  )}
                </button>
              </form>

              <div className="guideray-student-login-back-to-email">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="guideray-student-login-back-button"
                >
                  ← Back to email
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;