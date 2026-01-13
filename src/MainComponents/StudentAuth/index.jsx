import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import './index.css';

const StudentAuth = ({ onSuccess, onLogout }) => {
  const [mode, setMode] = useState('check');
  const [status, setStatus] = useState('Checking security clearance...');
  const [statusType, setStatusType] = useState('waiting');
  const [cookies] = useCookies(['studentToken']);
  const token = cookies.studentToken;
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const checkSessionCalledRef = useRef(false);

  useEffect(() => {
    if (token && !checkSessionCalledRef.current) {
      checkSessionCalledRef.current = true;
      checkAuthStatus();
    }
    return () => cleanup();
  }, []);

  const cleanup = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    clearInterval(progressIntervalRef.current);
  };

  const checkAuthStatus = async () => {
    try {
      // Simulate API call delay
      await new Promise(r => setTimeout(r, 1000));
      // Assume user needs verification for demo purposes
      handleNeedsVerification();
    } catch (error) {
      setStatus('Connection failed');
      setStatusType('error');
    }
  };

  const handleNeedsVerification = () => {
    setMode('verify');
    setStatus('Initializing biometric scanner...');
    startCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setStatus('Align face within the frame');
      setStatusType('processing');
    } catch (err) {
      setStatus('Camera access denied');
      setStatusType('error');
    }
  };

  const handleAction = () => {
    setStatus('Verifying biometric data...');
    setStatusType('processing');
    // Simulate verification success
    setTimeout(() => {
        setStatus('Identity Verified');
        setStatusType('success');
        setTimeout(onSuccess, 1000);
    }, 2000);
  };

  return (
    <div className="guideray-student-auth-card">
      <h1 className="guideray-student-auth-title">Security Check</h1>

      {mode !== 'check' && (
        <div className="guideray-student-auth-video-container">
          <video ref={videoRef} autoPlay playsInline muted className="guideray-student-auth-video" />
          <div className="guideray-student-auth-video-overlay">
             {/* Optional circle overlay */}
             <div style={{width:'180px', height:'180px', border:'2px dashed rgba(0,110,231,0.5)', borderRadius:'50%'}}></div>
          </div>
        </div>
      )}

      <div className={`guideray-student-auth-status guideray-student-auth-status-${statusType}`}>
        <span>{status}</span>
      </div>

      <div className="guideray-student-auth-button-group">
        {statusType === 'error' ? (
           <button onClick={() => window.location.reload()} className="guideray-student-auth-button guideray-student-auth-retry-button">Retry Connection</button>
        ) : (
           <button 
             onClick={handleAction} 
             className="guideray-student-auth-button guideray-student-auth-primary-button"
             disabled={statusType === 'success'}
           >
             {statusType === 'processing' ? 'Processing...' : 'Verify Identity'}
           </button>
        )}
      </div>
    </div>
  );
};

export default StudentAuth;