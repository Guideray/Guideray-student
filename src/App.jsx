import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

// Import components
import GuideRayTopicIntroPage from './LearnPageComponents/GuideRayTopicIntroPage';
import StudentDashboard from './MainComponents/StudentDashboard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import pythonData from './CourceData/python_data.json';
import StudentPracticeTest from './OtherComponents/StudentPracticeTest';
import GuideRayApp from './VideoCourceComponents/GuideRayCourceApp';
import StudentCource from './MainComponents/StudentCource';
import GuidedRayCodingPlatform from './OtherComponents/GuidedRayCodingPlatform';
import StudentRegistration from './MainComponents/StudentRegistration';
import StudentLogin from './MainComponents/StudentLogin';
import StudentProfile from './OtherComponents/StudentProfile';
import GuiderayStudentNotification from './OtherComponents/StudentNotification';
import GuideRayStudentProgressCalendar from './OtherComponents/StudentProgressBox';

const styles = `
.App {
  text-align: center;
  max-width: 100vw;
  overflow: auto;
  max-height:100vh;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

/* Loading Spinner Styles */
.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.spinner {
  width: 64px;
  height: 64px;
  position: relative;
}

.spinner-inner {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-radius: 50%;
  animation: spinner-rotate 1.5s linear infinite;
}

.spinner-inner:nth-child(1) {
  border-top-color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.spinner-inner:nth-child(2) {
  border-left-color:rgb(52, 81, 197);
  border-right-color:rgb(72, 72, 195);
  animation-delay: 0.1s;
}

.spinner-inner:nth-child(3) {
  border-top-color:rgb(73, 252, 85);
  border-bottom-color:rgb(37, 255, 62);
  animation-delay: 0.2s;
}

@keyframes spinner-rotate {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.loader-text {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #4b5563;
  font-weight: 500;
  animation: pulse 2s infinite;
}

.loader-subtext {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #6b7280;
  animation: fadeInOut 3s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

@keyframes fadeInOut {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

/* Progress bar animation */
@keyframes progress {
  0% {
    width: 0%;
    left: 0;
  }
  50% {
    width: 100%;
    left: 0;
  }
  100% {
    width: 0%;
    left: 100%;
  }
}

.progress-bar {
  width: 200px;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  margin: 20px auto;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  width: 0%;
  background-color: #3b82f6;
  border-radius: 2px;
  animation: progress 2s ease-in-out infinite;
}

/* Secure content styles */
.secure-content {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Print prevention */
@media print {
  body * {
    visibility: hidden;
  }
  
  .secure-content {
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
  }
}

/* Dark mode styles */
.dark-theme {
  background-color: #1a202c;
  color: #f7fafc;
}

.light-theme {
  background-color: #f7fafc;
  color: #1a202c;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .loader-text {
    font-size: 1rem;
  }
  
  .loader-subtext {
    font-size: 0.8rem;
  }
  
  .spinner {
    width: 48px;
    height: 48px;
  }
}
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['studentToken']);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userInitials = "AB";

  // Check authentication status on initial render
  useEffect(() => {
    const token = cookies['studentToken'];
    setIsAuthenticated(!!token);
    setAuthChecked(true);
  }, [cookies]);

  // Allow sidebar toggle only on these routes
  const collapsibleSidebarRoutes = ['/', '/practice', '/contest'];
  const isCollapsibleSidebarRoute = collapsibleSidebarRoutes.includes(location.pathname);

  // Show profile only on these routes
  const profileRoutes = ['/', '/intro', '/student-practice', '/course', '/video-course', '/coding-platform','/profile'];
  const showProfile = profileRoutes.includes(location.pathname);

  // Handle login success
  const handleLoginSuccess = (token) => {
    setCookie('studentToken', token, { path: '/', maxAge: 3600 });
    setIsAuthenticated(true);
    navigate('/', { replace: true });
  };

  // Handle logout
  const handleLogout = () => {
    removeCookie('studentToken', { path: '/' });
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  // Redirect logic
  useEffect(() => {
    if (!authChecked) return;

    if (isAuthenticated) {
      if (location.pathname === '/login' || location.pathname === '/student-registration') {
        navigate('/', { replace: true });
      }
    } else {
      if (location.pathname !== '/login' && location.pathname !== '/student-registration') {
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, location.pathname, authChecked, navigate]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const toggleSidebar = () => {
    if (!isCollapsibleSidebarRoute) return;

    if (window.innerWidth <= 768) {
      setMobileSidebarOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  // Set theme class
  useEffect(() => {
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(darkMode ? 'dark-theme' : 'light-theme');
  }, [darkMode]);

  // ProtectedRoute component
  const ProtectedRoute = ({ children }) => {
    if (!authChecked) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
  };

  // AuthRoute component
  const AuthRoute = ({ children }) => {
    if (!authChecked) return null;
    if (isAuthenticated) return <Navigate to="/" replace />;
    return children;
  };

  if (!authChecked) {
    return (
      <div className="loader-container">
        <div className="spinner">
          <div className="spinner-inner"></div>
          <div className="spinner-inner"></div>
          <div className="spinner-inner"></div>
        </div>
        <p className="loader-text">Securing your session</p>
        <p className="loader-subtext">Just a moment...</p>
        <div className="progress-bar">
          <div className="progress-bar-fill"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
        mobileSidebarOpen={mobileSidebarOpen}
        userInitials={userInitials}
        showSidebarToggle={isCollapsibleSidebarRoute}
        showProfile={showProfile}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {isCollapsibleSidebarRoute && (
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          mobileSidebarOpen={mobileSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <StudentDashboard
                darkMode={darkMode}
                toggleTheme={toggleTheme}
                toggleSidebar={toggleSidebar}
                mobileSidebarOpen={mobileSidebarOpen}
                sidebarCollapsed={sidebarCollapsed}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/intro"
          element={
            <ProtectedRoute>
              <GuideRayTopicIntroPage data={pythonData} darkMode={darkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-practice"
          element={
            <ProtectedRoute>
              <StudentPracticeTest />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/course"
          element={
            <ProtectedRoute>
              <StudentCource darkMode={darkMode} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/video-course"
          element={
            <ProtectedRoute>
              <GuideRayApp darkMode={darkMode} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/coding-platform"
          element={
            <ProtectedRoute>
              <GuidedRayCodingPlatform darkMode={darkMode} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student-registration"
          element={
            <AuthRoute>
              <StudentRegistration darkMode={darkMode} />
            </AuthRoute>
          } 
        />
        <Route 
          path="/login"
          element={
            <AuthRoute>
              <StudentLogin 
                darkMode={darkMode}
                onLoginSuccess={handleLoginSuccess}
              />
            </AuthRoute>
          } 
        />
          <Route 
            path="/profile"
            element={
              <ProtectedRoute>
                <StudentProfile 
                  darkMode={darkMode}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications"
            element={
              <ProtectedRoute>
                <GuiderayStudentNotification 
                  darkMode={darkMode}
                />
              </ProtectedRoute>
            } 
          />
                  <Route 
            path="/progress"
            element={
              <ProtectedRoute>
                <GuideRayStudentProgressCalendar 
                  darkMode={darkMode}
                />
              </ProtectedRoute>
            } 
          />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App secure-content">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;