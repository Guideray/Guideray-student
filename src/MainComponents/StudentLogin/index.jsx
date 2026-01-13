import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPlayCircle,
  FaCode,
  FaClipboardCheck,
  FaArrowRight,
  FaCheckCircle
} from 'react-icons/fa';
import { MdEmail, MdVerifiedUser } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import axiosInstance from '../../api/axiosInstance';
import languagesData from './courses.json';
import './index.css';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1); // 1: email, 2: OTP
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const otpInputs = useRef([]);

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
      const response = await axiosInstance.post(
        '/api/students/request-otp',
        { email: email }
      );

      if (response.data.success) {
        setStep(2);
        setCountdown(30);
        setSuccessMessage('OTP sent successfully!');
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit code');
      setIsLoading(false);
      return;
    }


    try {
      const response = await axiosInstance.post(
        '/api/students/verify-otp',
        { email: email, otp: otpCode }
      );

      if (response.data.success) {
        document.cookie = `studentToken=${response.data.data.token}; path=/; max-age=86400`;
        setSuccessMessage('Verified! Redirecting...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(response.data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await axiosInstance.post('/api/students/request-otp', { email: email });
      if (response.data.success) {
        setCountdown(30);
        setSuccessMessage('New code sent!');
      } else {
        setError('Failed to resend');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpInputs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const scrollingLanguages = [...languagesData.languages, ...languagesData.languages];

  return (
    <div className="guideray-login-layout-wrapper">
      <div className="guideray-login-bg-grid"></div>

      {/* --- LEFT SIDE (60%) --- */}
      <div className="guideray-login-section-left">
        <div className="guideray-login-left-content">
          <div className="guideray-login-brand-header">
            <img src="/src/assets/images/guideray_logo_white.svg" alt="GuideRay" className="guideray-login-brand-logo" />
          </div>

          <h1 className="guideray-login-hero-title">
            The Hub for <br />
            <span className="guideray-login-text-highlight">Modern Education</span>
          </h1>



          <p className="guideray-login-hero-desc">
            GuideRay empowers educators to host content in a structured environment.
            Access video bundles, specialized coding environments, and comprehensive assessments.
          </p>

          <div className="guideray-login-features-row">
            <div className="guideray-login-feature-item"><FaPlayCircle className="guideray-login-f-icon" /> Video Bundles</div>
            <div className="guideray-login-feature-item"><FaCode className="guideray-login-f-icon" /> Code Labs</div>
            <div className="guideray-login-feature-item"><FaClipboardCheck className="guideray-login-f-icon" /> Skill Tests</div>
          </div>

          <div className="guideray-login-scroller-container">
            <div className="guideray-login-scroller-track">
              {scrollingLanguages.map((lang, index) => (
                <div key={index} className="guideray-login-tech-chip">
                  <img src={lang.image} alt="" onError={(e) => e.target.style.display = 'none'} />
                  <span>{lang.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE (40%) --- */}
      <div className="guideray-login-section-right">
        <div className="guideray-login-card">
          {step === 1 ? (
            <div className="guideray-login-form-wrapper guideray-login-fade-in">
              <div className="guideray-login-header">
                <div className="guideray-login-icon-circle"><MdVerifiedUser /></div>
                <h2>Student Portal</h2>
                <p>Login to continue your learning journey</p>
              </div>

              <form onSubmit={handleEmailSubmit}>
                {error && <div className="guideray-login-msg-box guideray-login-error">{error}</div>}
                {successMessage && <div className="guideray-login-msg-box guideray-login-success">{successMessage}</div>}

                <div className="guideray-login-input-group">
                  <label>Email Address</label>
                  <div className="guideray-login-field-wrapper">
                    <MdEmail className="guideray-login-field-icon" />
                    <input
                      type="email"
                      placeholder="student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="guideray-login-action-btn" disabled={isLoading}>
                  {isLoading ? 'Processing...' : <>Continue <FaArrowRight /></>}
                </button>
              </form>

              <div className="guideray-login-bottom-link">
                Don't have an account? <a href="/student-registration">Sign up</a>
              </div>
            </div>
          ) : (
            <div className="guideray-login-form-wrapper guideray-login-slide-up">
              <div className="guideray-login-header">
                <div className="guideray-login-icon-circle"><RiLockPasswordLine /></div>
                <h2>Verify Identity</h2>
                <p>Enter code sent to <b>{email}</b></p>
              </div>

              <form onSubmit={handleOtpSubmit}>
                {error && <div className="guideray-login-msg-box guideray-login-error">{error}</div>}
                {successMessage && <div className="guideray-login-msg-box guideray-login-success">{successMessage}</div>}

                <div className="guideray-login-otp-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      ref={(el) => (otpInputs.current[index] = el)}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <div className="guideray-login-resend-block">
                  <button type="button" onClick={resendOtp} disabled={countdown > 0}>
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                  </button>
                </div>

                <button type="submit" className="guideray-login-action-btn" disabled={isLoading || otp.join('').length !== 6}>
                  {isLoading ? 'Verifying...' : <>Login Securely <FaCheckCircle /></>}
                </button>
              </form>

              <div className="guideray-login-bottom-link">
                <button type="button" onClick={() => setStep(1)} className="guideray-login-text-btn">Change Email</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;