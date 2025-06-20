import React from 'react';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <button 
      className="guideray_themetoggle_button"
      onClick={toggleDarkMode}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;