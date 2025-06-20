import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import GuideRayTopicIntroPage from './LearnPageComponents/GuideRayTopicIntroPage';
import StudentDashboard from './MainComponents/StudentDashboard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import pythonData from './CourceData/python_data.json';
import StudentPracticeTest from './OtherComponents/StudentPracticeTest';
import GuideRayApp from './VideoCourceComponents/GuideRayCourceApp';
import StudentCource from './MainComponents/StudentCource';
import GuidedRayCodingPlatform from './OtherComponents/GuidedRayCodingPlatform';
function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const location = useLocation();
  const userInitials = "AB";

  // Allow sidebar toggle only on these routes
  const collapsibleSidebarRoutes = ['/', '/practice', '/contest'];
  const isCollapsibleSidebarRoute = collapsibleSidebarRoutes.includes(location.pathname);

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

  // Prevent right-click, keyboard shortcuts, text selection
  useEffect(() => {
    const preventActions = (e) => {
      // Disable copy, cut, right-click
      e.preventDefault();
      return false;
    };

    const blockKeys = (e) => {
      if (
        // Ctrl + C, Ctrl + X, Ctrl + U, Ctrl + S, Ctrl + Shift + I, Ctrl + P
        (e.ctrlKey && ['c', 'x', 'u', 's', 'p'].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') ||
        (e.key === 'F12')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', preventActions);
    document.addEventListener('copy', preventActions);
    document.addEventListener('cut', preventActions);
    document.addEventListener('keydown', blockKeys);

    return () => {
      document.removeEventListener('contextmenu', preventActions);
      document.removeEventListener('copy', preventActions);
      document.removeEventListener('cut', preventActions);
      document.removeEventListener('keydown', blockKeys);
    };
  }, []);

  return (
    <>
      <Navbar
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
        mobileSidebarOpen={mobileSidebarOpen}
        userInitials={userInitials}
        showSidebarToggle={isCollapsibleSidebarRoute}
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
            <StudentDashboard
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              toggleSidebar={toggleSidebar}
              mobileSidebarOpen={mobileSidebarOpen}
              sidebarCollapsed={sidebarCollapsed}
            />
          }
        />
        <Route
          path="/intro"
          element={<GuideRayTopicIntroPage data={pythonData} darkMode={darkMode}
 />}
        />
        <Route
          path="/student-practice"
          element={<StudentPracticeTest
 />}
        />
        <Route 
        path = "/course"
        element={<StudentCource               darkMode={darkMode}
/>} />
<Route 
        path = "/video-course"
        element={<GuideRayApp               darkMode={darkMode}
/>} />
<Route 
        path = "/coding-platform"
        element={<GuidedRayCodingPlatform               darkMode={darkMode}
/>} />
        {/* Add more routes as needed */}
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
