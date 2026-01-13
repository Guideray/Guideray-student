import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axiosInstance from './api/axiosInstance';

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
import CourseDetailsRouteWrapper from './MainComponents/CourseDetailsRouteWrapper';
import GuiderayStudentNotification from './OtherComponents/StudentNotification';
import GuideRayStudentProgressCalendar from './OtherComponents/StudentProgressBox';
import StudentAuth from './MainComponents/StudentAuth';
import PaymentStatus from './components/PaymentStatus';
import GuideRayGuideTalk from './MainComponents/GuideRayGuideTalk';
import GuideRayCheetSheet from './LearnPageComponents/GuideRayCheetSheet/index.jsx';

// Styles Injection
const styles = `
* { box-sizing: border-box; }
/* Disable outer scrolling for the App container to let Dashboard handle it */
.App { 
  text-align: center; 
  width: 100%; 
  height: 100vh; 
  overflow: hidden; 
  background-color: var(--bg-main, #020202); 
  display: flex;
  flex-direction: column;

}

/* Loading Overlay */
.loading-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255, 255, 255, 0.9); display: flex; justify-content: center; align-items: center; z-index: 9999; backdrop-filter: blur(5px); }
.loading-overlay.dark { background-color: rgba(0, 0, 0, 0.9); }
.spinner-container { position: relative; width: 180px; height: 180px; display: flex; justify-content: center; align-items: center; }
.spinner-ring { position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px solid transparent; border-top-color: #4a90e2; border-right-color: #4a90e2; animation: spin 1.8s linear infinite; box-shadow: 0 0 15px rgba(74, 144, 226, 0.3); }
.spinner-ring:nth-child(1) { width: 90px; height: 90px; border-top-color: #50c9ba; border-right-color: #50c9ba; animation-direction: reverse; animation-duration: 2.2s; }
.spinner-ring:nth-child(2) { width: 80px; height: 80px; border-top-color: #a178df; border-right-color: #a178df; animation-duration: 2s; }
.spinner-ring:nth-child(3) { width: 70px; height: 70px; border-top-color: #ff00fb5d; border-right-color: #ff00fb5d; animation-duration: 1.6s; }
.center-icon { position: relative; width: 100px; height: 100px; z-index: 2; display: flex; justify-content: center; align-items: center; border-radius: 100px; }
.center-icon img { height: 50px; margin-left: 3px; margin-bottom: 3px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* Theme Classes */
.dark-theme { background-color: #020202; color: #ffffff; }
.light-theme { background-color: #f4f6f8; color: #1a202c; }

/* Main Layout Logic */
:root {
  --sidebar-w: 240px;
  --sidebar-w-collapsed: 72px;
}

.main-content { 
flex : 1;
  height: 100%;
  overflow: hidden; /* Prevent double scrollbars */
  transition: margin-left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;

}

/* Sidebar Offsets */
.main-content.sidebar-expanded { margin-left: calc(var(--sidebar-w));}
.main-content.sidebar-collapsed { margin-left: var(--sidebar-w-collapsed); }
.main-content.standalone { margin-left: 0; }

@media (max-width: 1024px) {
  .main-content.sidebar-collapsed, .main-content.sidebar-expanded { margin-left: 0; }
}
`;

const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
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

  const routeConfig = useMemo(() => ({
    public: ['/login', '/student-registration'],
    private: ['/', '/home', '/intro', '/student-practice', '/course', '/video-course', '/coding-platform', '/profile', '/notifications', '/progress', '/auth', 'course-details'],
    hideNavbar: ['/login', '/student-registration', '/student-practice', '/coding-platform'],
    showSidebar: ['/', '/home', '/course', '/course-details', '/guidetalk', '/notifications', '/profile', '/progress'],
    standalonePages: ['/login', '/student-registration', "/student-practice", '/coding-platform']
  }), []);

  const fetchingUserRef = React.useRef(false);

  const fetchUserData = useCallback(async () => {
    if (fetchingUserRef.current) return;
    try {
      fetchingUserRef.current = true;
      setLoadingUserData(true);
      const response = await axiosInstance.get(`/api/students/me`);
      if (response.data && response.data.success) {
        setUserData(response.data.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        removeCookie('studentToken', { path: '/' });
        setIsAuthenticated(false);
        setUserData(null);
        navigate('/login', { replace: true });
      }
    } finally {
      setLoadingUserData(false);
      fetchingUserRef.current = false;
    }
  }, [cookies.studentToken, navigate, removeCookie]);

  const checkAuthStatus = useCallback(async () => {
    const token = cookies.studentToken;
    if (token) {
      if (!isAuthenticated) {
        try {
          setIsAuthenticated(true);
          await fetchUserData();
        } catch (error) {
          removeCookie('studentToken', { path: '/' });
          setIsAuthenticated(false);
          setUserData(null);
        }
      }
    } else {
      if (isAuthenticated) {
        setIsAuthenticated(false);
        setUserData(null);
      }
    }
    setAuthChecked(true);
  }, [cookies.studentToken, fetchUserData, removeCookie, isAuthenticated]);

  useEffect(() => { checkAuthStatus(); }, [checkAuthStatus]);

  const handleLoginSuccess = useCallback(async (token) => {
    setCookie('studentToken', token, { path: '/', maxAge: 86400, sameSite: 'strict' });
    setIsAuthenticated(true);
    await fetchUserData();
    navigate('/', { replace: true });
  }, [navigate, setCookie, fetchUserData]);

  const handleLogout = useCallback(() => {
    removeCookie('studentToken', { path: '/' });
    setIsAuthenticated(false);
    setUserData(null);
    navigate('/login', { replace: true });
  }, [navigate, removeCookie]);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkMode);
    document.body.classList.toggle('light-theme', !darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);
  const toggleSidebar = () => window.innerWidth <= 768 ? setMobileSidebarOpen(prev => !prev) : setSidebarCollapsed(prev => !prev);
  const toggleSidebarCollapse = () => setSidebarCollapsed(prev => !prev);

  const LoadingOverlay = () => (
    <div className={`loading-overlay ${darkMode ? 'dark' : ''}`}>
      <div className="spinner-container">
        <div className="spinner-ring"></div><div className="spinner-ring"></div><div className="spinner-ring"></div>
        <div className="center-icon"><img src="https://res.cloudinary.com/dx97khgxd/image/upload/v1747826507/ztn55zzd1exaemchuevl.png" alt="guideray" /></div>
      </div>
    </div>
  );

  const ProtectedRoute = ({ children }) => {
    if (!authChecked || loadingUserData) return <LoadingOverlay />;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const AuthRoute = ({ children }) => {
    if (!authChecked) return <LoadingOverlay />;
    return !isAuthenticated ? children : <Navigate to="/" replace />;
  };

  const currentPath = location.pathname;
  const isStandalonePage = routeConfig.standalonePages.includes(currentPath) || currentPath.startsWith('/cheetsheet/');
  const showSidebar = isAuthenticated && routeConfig.showSidebar.includes(currentPath);
  const showNavbar = isAuthenticated && !isStandalonePage && !showSidebar;

  const mainContentClass = isStandalonePage ? 'main-content standalone' : `main-content ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`;

  return (
    <>
      {!authChecked && <LoadingOverlay />}
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
              userData={userData}
            />
          )}

          {showSidebar && (
            <Sidebar
              sidebarCollapsed={sidebarCollapsed}
              mobileSidebarOpen={mobileSidebarOpen}
              toggleSidebar={toggleSidebar}
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              userData={userData}
            />
          )}

          <main className={mainContentClass}>
            <Routes>
              <Route path="/" element={<ProtectedRoute><StudentDashboard darkMode={darkMode} userData={userData} /></ProtectedRoute>} />
              <Route path="/home" element={<ProtectedRoute><StudentDashboard darkMode={darkMode} userData={userData} /></ProtectedRoute>} />
              <Route path="/intro" element={<ProtectedRoute><GuideRayTopicIntroPage data={pythonData} darkMode={darkMode} userData={userData} /></ProtectedRoute>} />
              <Route path="/student-practice" element={<ProtectedRoute><StudentPracticeTest darkMode={darkMode} userData={userData} /></ProtectedRoute>} />
              <Route path="/course" element={<ProtectedRoute><StudentCource darkMode={darkMode} userData={userData} /></ProtectedRoute>} />
              <Route path="/cheetsheet/:course/:topicName" element={<ProtectedRoute><GuideRayCheetSheet darkMode={darkMode} userData={userData} /></ProtectedRoute>} />
              <Route path="/video-courses/:courseId" element={<ProtectedRoute><GuideRayApp darkMode={darkMode} userData={userData} cookie={cookies.studentToken} /></ProtectedRoute>} />
              <Route path="/course-details" element={<ProtectedRoute><CourseDetailsRouteWrapper darkMode={darkMode} userData={userData} /></ProtectedRoute>} />
              <Route path="/coding-platform" element={<ProtectedRoute><GuidedRayCodingPlatform darkMode={darkMode} userData={userData} /></ProtectedRoute>} />
              <Route path="/guidetalk" element={<ProtectedRoute><GuideRayGuideTalk darkMode={darkMode} userData={userData} /></ProtectedRoute>} />
              <Route path="/student-registration" element={<AuthRoute><StudentRegistration darkMode={darkMode} /></AuthRoute>} />
              <Route path="/login" element={<AuthRoute><StudentLogin darkMode={darkMode} onLoginSuccess={handleLoginSuccess} /></AuthRoute>} />
              <Route path="/profile" element={<ProtectedRoute><StudentProfile darkMode={darkMode} userData={userData} onUpdateProfile={setUserData} /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><GuiderayStudentNotification darkMode={darkMode} userData={userData} /></ProtectedRoute>} />
              <Route path="/progress" element={<ProtectedRoute><GuideRayStudentProgressCalendar darkMode={darkMode} userData={userData} /></ProtectedRoute>} />
              <Route path="/payment-status" element={<PaymentStatus darkMode={darkMode} />} />
              <Route path="/auth" element={<ProtectedRoute><StudentAuth darkMode={darkMode} userData={userData} onSuccess={() => navigate('/')} onLogout={handleLogout} /></ProtectedRoute>} />
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