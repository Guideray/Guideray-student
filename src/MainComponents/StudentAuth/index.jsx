import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import './index.css';

const StudentAuth = ({ onSuccess, onLogout }) => {
  // State declarations
  const [mode, setMode] = useState('check');
  const [status, setStatus] = useState('Checking authentication status...');
  const [statusType, setStatusType] = useState('waiting');
  const [progress, setProgress] = useState(100);
  const [countdown, setCountdown] = useState(30);
  const [cookies] = useCookies(['studentToken']);
  const token = cookies.studentToken;
  
  // Refs
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const frameIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const checkSessionCalledRef = useRef(false);
  const apiCallInProgressRef = useRef(false);

  // Main effect - runs only once when component mounts
  useEffect(() => {
    if (token && !checkSessionCalledRef.current) {
      checkSessionCalledRef.current = true;
      checkAuthStatus();
    }

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthStatus = async () => {
    if (apiCallInProgressRef.current) return;
    
    try {
      apiCallInProgressRef.current = true;
      setStatus('Checking authentication status...');
      setStatusType('waiting');

      const response = await fetch('http://localhost:5000/check_session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.authenticated) {
        handleAuthenticationSuccess(data.email);
      } else if (data.status === 'not_registered') {
        handleNotRegistered();
      } else if (data.status === 'needs_verification') {
        handleNeedsVerification();
      } else if (data.status === 'invalid_token') {
        handleInvalidToken();
      } else {
        setStatus(data.message || 'Authentication check failed');
        setStatusType('error');
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setStatus(`Connection error: ${error.message}`);
      setStatusType('error');
    } finally {
      apiCallInProgressRef.current = false;
    }
  };

  const handleAuthenticationSuccess = (email) => {
    setStatus(`Authenticated as ${email}`);
    setStatusType('success');
    onSuccess();
  };

  const handleNotRegistered = () => {
    setMode('register');
    setStatus('Please register your face for authentication');
    startCamera();
  };

  const handleNeedsVerification = () => {
    setMode('verify');
    setStatus('Please verify your identity');
    startCamera();
  };

  const handleInvalidToken = () => {
    setStatus('Session expired. Please login again.');
    setStatusType('error');
    setTimeout(onLogout, 2000);
  };

  // Camera handling
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: { 
          width: { ideal: 500 },
          height: { ideal: 500 },
          facingMode: 'user' 
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => {
            console.error('Video play error:', e);
            setStatus('Camera error: ' + e.message);
            setStatusType('error');
          });
        };
      }
      streamRef.current = stream;
    } catch (err) {
      console.error('Camera access error:', err);
      setStatus('Camera error: ' + err.message);
      setStatusType('error');
    }
  };

  // Verification flow
  const startVerification = async () => {
    try {
      setStatus('Starting verification...');
      setStatusType('processing');

      const response = await fetch('http://localhost:5000/start_verification', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      setStatus('Please look at the camera and blink naturally');
      setStatusType('processing');
      startProgressBar();
      startFrameProcessing();
    } catch (error) {
      setStatus(error.message || 'Verification failed');
      setStatusType('error');
    }
  };

  // Registration flow
  const startRegistration = async () => {
    try {
      setStatus('Starting registration...');
      setStatusType('processing');

      const response = await fetch('http://localhost:5000/start_registration', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      setStatus('Please look at the camera and blink naturally');
      setStatusType('processing');
      startProgressBar();
      startFrameProcessing();
    } catch (error) {
      setStatus(error.message || 'Registration failed');
      setStatusType('error');
    }
  };

  // Progress bar handling
  const startProgressBar = () => {
    setProgress(100);
    setCountdown(30);

    clearInterval(progressIntervalRef.current);
    clearInterval(countdownIntervalRef.current);

    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => Math.max(0, prev - 100 / 30));
    }, 1000);

    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          verificationFailed();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Frame processing
  const startFrameProcessing = () => {
    clearInterval(frameIntervalRef.current);
    frameIntervalRef.current = setInterval(processFrame, 300);
  };

  const processFrame = async () => {
    if (!videoRef.current || !videoRef.current.videoWidth) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');

      const response = await fetch('http://localhost:5000/process_frame', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          image: imageData,
          mode,
          token
        })
      });

      const data = await response.json();

      if (data.status === 'blink_detected') {
        clearIntervals();
        if (mode === 'verify') {
          verifyIdentity();
        } else {
          registerIdentity();
        }
      }
    } catch (error) {
      console.error('Frame processing error:', error);
    }
  };

  // Identity verification
  const verifyIdentity = async () => {
    try {
      setStatus('Verifying identity...');
      setStatusType('processing');

      const response = await fetch('http://localhost:5000/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();

      if (data.verified) {
        setStatus(`Verified successfully! Confidence: ${(data.confidence * 100).toFixed(1)}%`);
        setStatusType('success');
        setTimeout(onSuccess, 1000);
      } else {
        setStatus(`Verification failed. Confidence: ${(data.confidence * 100).toFixed(1)}%`);
        setStatusType('error');
      }
    } catch (error) {
      setStatus(error.message || 'Error verifying identity');
      setStatusType('error');
      console.error('Verification error:', error);
    }
  };

  // Identity registration
  const registerIdentity = async () => {
    try {
      setStatus('Registering face...');
      setStatusType('processing');

      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (data.registered) {
        setStatus('Registration successful!');
        setStatusType('success');
        setTimeout(onSuccess, 1000);
      } else {
        setStatus(data.message || 'Registration failed');
        setStatusType('error');
      }
    } catch (error) {
      setStatus('Error registering identity');
      setStatusType('error');
      console.error('Registration error:', error);
    }
  };

  // Timeout handling
  const verificationFailed = () => {
    setStatus('Time expired. Please try again.');
    setStatusType('error');
    clearIntervals();
  };

  // Cleanup functions
  const clearIntervals = () => {
    clearInterval(progressIntervalRef.current);
    clearInterval(countdownIntervalRef.current);
    clearInterval(frameIntervalRef.current);
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    clearIntervals();
  };

  // Render method
  return (
    <div className="guideray-student-auth-container">
      <div className="guideray-student-auth-card">
        <h1 className="guideray-student-auth-title">Student Authentication</h1>

        {mode === 'check' && (
          <div className="guideray-student-auth-status-container">
            <div className={`guideray-student-auth-status guideray-student-auth-status-${statusType}`}>
              <div className="guideray-student-auth-status-message">
                {status}
                {statusType === 'processing' && (
                  <div className="guideray-student-auth-loader"></div>
                )}
              </div>
              {statusType === 'error' && (
                <button 
                  onClick={checkAuthStatus}
                  className="guideray-student-auth-button guideray-student-auth-retry-button"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {(mode === 'verify' || mode === 'register') && (
          <div className="guideray-student-auth-flow">
            <div className="guideray-student-auth-video-container">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="guideray-student-auth-video"
                style={{ display: statusType === 'error' ? 'none' : 'block' }}
              />
              {statusType === 'processing' && (
                <div className="guideray-student-auth-video-overlay">
                  <div className="guideray-student-auth-video-loader"></div>
                </div>
              )}
            </div>

            <div className="guideray-student-auth-progress-container">
              <div className="guideray-student-auth-progress-bar">
                <div 
                  className="guideray-student-auth-progress" 
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: progress > 50 ? '#4CAF50' : progress > 20 ? '#FFC107' : '#F44336'
                  }} 
                />
              </div>
              <div className="guideray-student-auth-countdown">
                <span className="guideray-student-auth-countdown-icon">⏱</span>
                Time remaining: {countdown}s
              </div>
            </div>

            <div className={`guideray-student-auth-status guideray-student-auth-status-${statusType}`}>
              <div className="guideray-student-auth-status-message">
                {status}
                {statusType === 'processing' && (
                  <div className="guideray-student-auth-loader"></div>
                )}
              </div>
              {statusType === 'error' && (
                <button 
                  onClick={mode === 'verify' ? startVerification : startRegistration}
                  className="guideray-student-auth-button guideray-student-auth-retry-button"
                >
                  Retry
                </button>
              )}
            </div>

            <div className="guideray-student-auth-button-group">
              <button
                onClick={mode === 'verify' ? startVerification : startRegistration}
                disabled={statusType === 'processing'}
                className={`guideray-student-auth-button guideray-student-auth-primary-button ${statusType === 'processing' ? 'guideray-student-auth-button-disabled' : ''}`}
              >
                {mode === 'verify' ? 'Authorize' : 'Register'}
              </button>
          
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAuth;