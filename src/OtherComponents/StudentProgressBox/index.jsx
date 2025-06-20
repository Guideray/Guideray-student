import React, { useState } from 'react';
import './index.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const GuideRayStudentProgressCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'year'

  // Sample progress data (replace with your actual data)
  const generateProgressData = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      
      if (date > today) {
        data.push({ status: 'future' });
      } else {
        // Randomly generate completion status for demo
        data.push({
          status: Math.random() > 0.4 ? 'completed' : 'incomplete'
        });
      }
    }
    return data;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateYear = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'month' ? 'year' : 'month');
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const progressData = generateProgressData(year, month);
    const today = new Date();

    // Create empty cells for days before the 1st of the month
    const emptyCells = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      emptyCells.push(<div key={`empty-${i}`} className="guderay-progress-empty-day"></div>);
    }

    return (
      <div className="guderay-progress-month-view">
        <div className="guderay-progress-month-header">
          <button 
            onClick={() => navigateMonth(-1)}
            className="guderay-progress-nav-button"
          >
            <FiChevronLeft />
          </button>
          <h2 onClick={toggleViewMode} className="guderay-progress-month-title">
            {monthName} {year}
          </h2>
          <button 
            onClick={() => {
              const nextMonth = new Date(year, month + 1, 1);
              if (nextMonth <= today) navigateMonth(1);
            }}
            className={`guderay-progress-nav-button ${
              new Date(year, month + 1, 1) > today ? 'guderay-progress-nav-disabled' : ''
            }`}
            disabled={new Date(year, month + 1, 1) > today}
          >
            <FiChevronRight />
          </button>
        </div>

        <div className="guderay-progress-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="guderay-progress-weekday">{day}</div>
          ))}
        </div>

        <div className="guderay-progress-days-grid">
          {emptyCells}
          {Array.from({ length: daysInMonth }).map((_, day) => {
            const date = new Date(year, month, day + 1);
            const isToday = date.toDateString() === today.toDateString();
            const dayStatus = progressData[day].status;

            return (
              <div
                key={`day-${day}`}
                className={`guderay-progress-day 
                  guderay-progress-${dayStatus}
                  ${isToday ? 'guderay-progress-today' : ''}
                `}
                title={`${monthName} ${day + 1}, ${year} - ${dayStatus}`}
              >
                {day + 1}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const year = currentDate.getFullYear();
    const today = new Date();

    return (
      <div className="guderay-progress-year-view">
        <div className="guderay-progress-year-header">
          <button 
            onClick={() => navigateYear(-1)}
            className="guderay-progress-nav-button"
          >
            <FiChevronLeft />
          </button>
          <h2 onClick={toggleViewMode} className="guderay-progress-year-title">
            {year}
          </h2>
          <button 
            onClick={() => {
              if (year < today.getFullYear()) navigateYear(1);
            }}
            className={`guderay-progress-nav-button ${
              year >= today.getFullYear() ? 'guderay-progress-nav-disabled' : ''
            }`}
            disabled={year >= today.getFullYear()}
          >
            <FiChevronRight />
          </button>
        </div>

        <div className="guderay-progress-months-grid">
          {Array.from({ length: 12 }).map((_, month) => {
            const monthDate = new Date(year, month, 1);
            const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
            const isFuture = monthDate > today;

            return (
              <div
                key={`month-${month}`}
                className={`guderay-progress-month-cell 
                  ${isCurrentMonth ? 'guderay-progress-current-month' : ''}
                  ${isFuture ? 'guderay-progress-future-month' : ''}
                `}
                onClick={() => {
                  if (!isFuture) {
                    setCurrentDate(new Date(year, month, 1));
                    setViewMode('month');
                  }
                }}
              >
                {new Date(year, month, 1).toLocaleString('default', { month: 'short' })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="guderay-progress-calendar-container">
      <div className="guderay-progress-calendar">
        {viewMode === 'month' ? renderMonthView() : renderYearView()}
      </div>

      <div className="guderay-progress-legend">
        <div className="guderay-progress-legend-item">
          <div className="guderay-progress-legend-color completed"></div>
          <span>Completed</span>
        </div>
        <div className="guderay-progress-legend-item">
          <div className="guderay-progress-legend-color incomplete"></div>
          <span>Incomplete</span>
        </div>
        <div className="guderay-progress-legend-item">
          <div className="guderay-progress-legend-color future"></div>
          <span>Future</span>
        </div>
        <div className="guderay-progress-legend-item">
          <div className="guderay-progress-legend-color today"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default GuideRayStudentProgressCalendar;