import React, { useEffect, useState } from 'react';
import { FaFire } from 'react-icons/fa';
import './index.css';

const GuiderayStudentConsistencyScoreBar = ({ consistencyData }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Score Calculation
  const totalScore = consistencyData?.dp 
    ? consistencyData.dp.reduce((acc, curr) => acc + (curr.ah * 10) + (curr.ct * 5), 0)
    : 0;

  const currentStreak = consistencyData?.streaks?.daily?.c || 0;
  const longestStreak = consistencyData?.streaks?.daily?.l || 0;

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = Math.ceil(totalScore / (duration / 16)) || 1;

    if (totalScore === 0) {
      setAnimatedScore(0);
      return;
    }

    const timer = setInterval(() => {
      start += increment;
      if (start >= totalScore) {
        setAnimatedScore(totalScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [totalScore]);

  const level = Math.floor(totalScore / 1000) + 1;
  const progressPercent = Math.min(((totalScore % 1000) / 1000) * 100, 100);

  return (
    <div className="gscs-widget">
      <div className="gscs-bg-glow"></div>
      
      <div className="gscs-top-row">
        <div className="gscs-icon-box">
          <FaFire className="gscs-fire-anim" />
        </div>
        <div className="gscs-title-box">
           <span className="gscs-label">Consistency Score</span>
           <span className="gscs-level-badge">Lvl {level}</span>
        </div>
      </div>

      <div className="gscs-main-score">
        {animatedScore.toLocaleString()} <span className="gscs-xp">XP</span>
      </div>

      <div className="gscs-progress-container">
        <div className="gscs-bar-bg">
          <div className="gscs-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="gscs-next-lvl">Next Level: {level * 1000} XP</div>
      </div>

      <div className="gscs-divider"></div>

      <div className="gscs-stats-grid">
        <div className="gscs-stat-box">
          <span className="gscs-stat-value">{currentStreak}</span>
          <span className="gscs-stat-label">Day Streak</span>
        </div>
        <div className="gscs-stat-box">
          <span className="gscs-stat-value">{longestStreak}</span>
          <span className="gscs-stat-label">Best Streak</span>
        </div>
      </div>
    </div>
  );
};

export default GuiderayStudentConsistencyScoreBar;