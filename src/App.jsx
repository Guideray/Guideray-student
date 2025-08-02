import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import API_BASE_URL from '../config';


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
import CourseDetails from './MainComponents/StudentCourseDetails';
import GuiderayStudentNotification from './OtherComponents/StudentNotification';
import GuideRayStudentProgressCalendar from './OtherComponents/StudentProgressBox';
import StudentAuth from './MainComponents/StudentAuth';
import PaymentStatus from './components/PaymentStatus';
import CourseDetailsRouteWrapper from './MainComponents/CourseDetailsRouteWrapper';
import GuideRayGuideTalk from './MainComponents/GuideRayGuideTalk';

// Styles
const styles = `
* {
  box-sizing: border-box;
}

.App {
  text-align: center;
  max-width: 100vw;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 100vh;
  background-color: white;
  box-sizing: content-box;
}

/* New Loading Overlay Styles */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.loading-overlay.dark {
  background-color: rgba(0, 0, 0, 0.9);
}

.spinner-container {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: #4a90e2;
  border-right-color: #4a90e2;
  animation: spin 1.8s linear infinite;
  box-shadow: 0 0 15px rgba(74, 144, 226, 0.3);
}

.spinner-ring:nth-child(1) {
  width: 90px;
  height: 90px;
  border-top-color: #50c9ba;
  border-right-color: #50c9ba;
  animation-direction: reverse;
  animation-duration: 2.2s;
}

.spinner-ring:nth-child(2) {
  width: 80px;
  height: 80px;
  border-top-color: #a178df;
  border-right-color: #a178df;
  animation-duration: 2s;
}

.spinner-ring:nth-child(3) {
  width: 70px;
  height: 70px;
  border-top-color: #ff00fb5d;
  border-right-color: #ff00fb5d;
  animation-duration: 1.6s;
}

.center-icon {
  position: relative;
  width: 100px;
  height: 100px;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
}

.center-icon svg {
  width: 100%;
  height: 100%;
  fill: #4a90e2;
}

.intoit {
  height: 50px;
  margin-left: 3px;
  margin-bottom: 3px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.sparkle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  filter: blur(1px);
  animation: sparkle 3s linear infinite;
  opacity: 0;
}

@keyframes sparkle {
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  50% {
    transform: translate(20px, -20px) scale(1.5);
    opacity: 0;
  }
  100% {
    transform: translate(40px, -40px) scale(0);
    opacity: 0;
  }
}

.dark-theme {
  background-color: #1a202c;
  color: #f7fafc;
}

.light-theme {
  background-color: #f7fafc;
  color: #1a202c;
}

.main-content {
  transition: margin-left 0.3s ease;
  min-width: calc(100vw - 243px);
  max-width: calc(100vw - 243px);
}

.main-content.with-navbar {
}

.main-content.sidebar-collapsed {
  margin-left: 80px;
}

.main-content.sidebar-expanded {
  margin-left: 235px;
  min-width: calc(100vw - 235px);
  max-width: calc(100vw - 235px);
}

.main-content.standalone {
  margin-left: 0;
  padding-top: 0;
}

@media (max-width: 768px) {
  .spinner-container { 
    width: 140px; 
    height: 140px; 
  }
  .spinner-ring:nth-child(1) { 
    width: 70px; 
    height: 70px; 
  }
  .spinner-ring:nth-child(2) { 
    width: 60px; 
    height: 60px; 
  }
  .spinner-ring:nth-child(3) { 
    width: 50px; 
    height: 50px; 
  }
  .center-icon { 
    width: 80px; 
    height: 80px; 
  }
  
  .main-content.sidebar-collapsed,
  .main-content.sidebar-expanded {
    margin-left: 0;
  }
}
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || false;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['studentToken']);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();



  // Memoized route configurations
  const routeConfig = useMemo(() => ({
    public: ['/login', '/student-registration'],
    private: ['/', '/home', '/intro', '/student-practice', '/course', 
             '/video-course', '/coding-platform', '/profile', 
             '/notifications', '/progress', '/auth','course-details'],
    hideNavbar: ['/login', '/student-registration','/','/home','/video-courses','/course-details', '/video-courses/', '/student-practice','/coding-platform','/guidetalk'],
    showSidebar: ['/', '/home','/course','/course-details','/guidetalk'],
    showProfile: ['/', '/home', '/course', '/profile', '/notifications', '/progress'],
    standalonePages: ['/login', '/student-registration',"/student-practice",'/coding-platform']
  }), []);

  // Fetch user data from API
  const fetchUserData = useCallback(async () => {
    try {
      setLoadingUserData(true);
      const response = await axios.get(`${API_BASE_URL}/api/students/me`, {
        headers: {
          'Authorization': `Bearer ${cookies.studentToken}`
        }
      });
      
      if (response.data && response.data.success) {
        const user = response.data.data;
        const initials = user.first_name && user.last_name 
          ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
          : 'ST';
        
        setUserData({
          ...user,
          initials
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      if (error.response && error.response.status === 401) {
        removeCookie('studentToken', { path: '/' });
        setIsAuthenticated(false);
        setUserData(null);
        navigate('/login', { replace: true });
      }
    } finally {
      setLoadingUserData(false);
    }
  }, [cookies.studentToken, navigate, removeCookie]);

  // Stable auth check function
  const checkAuthStatus = useCallback(async () => {
    const token = cookies.studentToken;
    if (token) {
      try {
        setIsAuthenticated(true);
        await fetchUserData();
      } catch (error) {
        console.error("Auth verification failed:", error);
        removeCookie('studentToken', { path: '/' });
        setIsAuthenticated(false);
        setUserData(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserData(null);
    }
    setAuthChecked(true);
  }, [cookies.studentToken, fetchUserData, removeCookie]);

  // Initial auth check
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Handle login success
  const handleLoginSuccess = useCallback(async (token, user) => {
    setCookie('studentToken', token, {
      path: '/',
      maxAge: 3600,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    setIsAuthenticated(true);
    await fetchUserData();
    navigate('/', { replace: true });
  }, [navigate, setCookie, fetchUserData]);

  // Handle logout
  const handleLogout = useCallback(() => {
    removeCookie('studentToken', { path: '/' });
    setIsAuthenticated(false);
    setUserData(null);
    navigate('/login', { replace: true });
  }, [navigate, removeCookie]);

  // Route protection and redirection
  useEffect(() => {
    if (!authChecked) return;

    const currentPath = location.pathname;
    const isPublic = routeConfig.public.includes(currentPath);
    const isPrivate = routeConfig.private.includes(currentPath);

    if (isAuthenticated && isPublic) {
      navigate('/', { replace: true });
    } else if (!isAuthenticated && isPrivate) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, location.pathname, authChecked, navigate, routeConfig]);

  // Theme management
  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkMode);
    document.body.classList.toggle('light-theme', !darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleTheme = useCallback(() => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', newMode);
      return newMode;
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  }, []);

  const toggleSidebarCollapse = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  // New Loading Component
  const LoadingOverlay = () => (
    <div className={`loading-overlay ${darkMode ? 'dark' : ''}`}>
      <div className="spinner-container">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="center-icon">
          <img
            src="https://res.cloudinary.com/dx97khgxd/image/upload/v1747826507/ztn55zzd1exaemchuevl.png"
            alt="guideray"
            className="intoit"
          />
        </div>
        <div className="sparkle" style={{ top: '30%', left: '30%', animationDelay: '0s' }}></div>
        <div className="sparkle" style={{ top: '40%', left: '60%', animationDelay: '0.5s' }}></div>
        <div className="sparkle" style={{ top: '70%', left: '40%', animationDelay: '1s' }}></div>
        <div className="sparkle" style={{ top: '20%', left: '50%', animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );

  // Route protection components
  const ProtectedRoute = useCallback(({ children }) => {
    if (!authChecked || loadingUserData) {
      return <LoadingOverlay />;
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  }, [authChecked, isAuthenticated, loadingUserData]);

  const AuthRoute = useCallback(({ children }) => {
    if (!authChecked) {
      return <LoadingOverlay />;
    }
    return !isAuthenticated ? children : <Navigate to="/" replace />;
  }, [authChecked, isAuthenticated]);

  // Determine UI visibility
  const currentPath = location.pathname;
  const hideNavbarDynamic = currentPath.startsWith('/video-courses/') && currentPath.split('/').length > 2;
  const hideNavbarExact = routeConfig.hideNavbar;
  const showNavbar = !(hideNavbarExact.includes(currentPath) || hideNavbarDynamic);
  const showSidebar = isAuthenticated && routeConfig.showSidebar.includes(currentPath);
  const isStandalonePage = routeConfig.standalonePages.includes(currentPath);

  // Determine main content class
  const mainContentClass = useMemo(() => {
    let classes = ['main-content'];
    
    if (isStandalonePage) {
      classes.push('standalone');
    } else {
      if (showNavbar) {
        classes.push('with-navbar');
      }
      if (sidebarCollapsed) {
        classes.push('sidebar-collapsed');
      } else {
        classes.push('sidebar-expanded');
      }
    }
    
    return classes.join(' ');
  }, [isStandalonePage, showNavbar, sidebarCollapsed]);

  return (
    <>
      {/* Show loading overlay while auth is being checked */}
      {!authChecked && <LoadingOverlay />}

      {/* Main app content when auth is checked */}
      {authChecked && (
        <>
          {showNavbar && (
            <Navbar
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              isAuthenticated={isAuthenticated}
              loadingProgress={loadingProgress}
              onLogout={handleLogout}
              isLoading={isLoading}
              collapsed={sidebarCollapsed}
              toggleCollapse={toggleSidebarCollapse}
            />
          )}

          {showSidebar && (
            <Sidebar
              sidebarCollapsed={sidebarCollapsed}
              mobileSidebarOpen={mobileSidebarOpen}
              toggleSidebar={toggleSidebar}
              darkMode={darkMode}
              userData={userData}
            />
          )}

          <main className={mainContentClass}>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <StudentDashboard 
                    darkMode={darkMode}
                    toggleTheme={toggleTheme}
                    sidebarCollapsed={sidebarCollapsed}
                    userData={userData}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/home" element={
                <ProtectedRoute>
                  <StudentDashboard 
                    darkMode={darkMode}
                    toggleTheme={toggleTheme}
                    userData={userData}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/intro" element={
                <ProtectedRoute>
                  <GuideRayTopicIntroPage 
                    data={pythonData} 
                    darkMode={darkMode} 
                    userData={userData}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/student-practice" element={
                <ProtectedRoute>
                  <StudentPracticeTest 
                    darkMode={darkMode} 
                    userData={userData}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/course" element={
                <ProtectedRoute>
                  <StudentCource 
                    darkMode={darkMode} 
                    userData={userData}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/video-courses/:courseId" element={
                <ProtectedRoute>
                  <GuideRayApp 
                    darkMode={darkMode} 
                    userData={userData}

                    cookie = {cookies.studentToken}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/course-details" element={
                <ProtectedRoute>
                  <CourseDetailsRouteWrapper 
                    darkMode={darkMode} 
                    userData={userData}
                  />
                </ProtectedRoute>
              } />

              <Route path="/coding-platform" element={
                <ProtectedRoute>
                  <GuidedRayCodingPlatform 
                    darkMode={darkMode} 
                    userData={userData}
                  />
                </ProtectedRoute>
              } />

              <Route path="/guidetalk" element={
                <ProtectedRoute>
                  <GuideRayGuideTalk 
                    darkMode={darkMode} 
                    userData={userData}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/student-registration" element={
                <AuthRoute>
                  <StudentRegistration darkMode={darkMode} />
                </AuthRoute>
              } />
              
              <Route path="/login" element={
                <AuthRoute>
                  <StudentLogin 
                    darkMode={darkMode} 
                    onLoginSuccess={handleLoginSuccess} 
                  />
                </AuthRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <StudentProfile 
                    darkMode={darkMode} 
                    userData={userData}
                    onUpdateProfile={setUserData}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <GuiderayStudentNotification 
                    darkMode={darkMode} 
                    userData={userData}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/progress" element={
                <ProtectedRoute>
                  <GuideRayStudentProgressCalendar 
                    darkMode={darkMode} 
                    userData={userData}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/payment-status" element={<PaymentStatus darkMode={darkMode} />} />
              
              <Route path="/auth" element={
                <ProtectedRoute>
                  <StudentAuth 
                    darkMode={darkMode}
                    userData={userData}
                    onSuccess={() => navigate('/')}
                    onLogout={handleLogout}
                  />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;