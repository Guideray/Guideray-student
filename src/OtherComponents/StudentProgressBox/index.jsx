import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './index.css';

const GuideRayStudentProgressCalendar = ({ consistencyData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const checkActivity = (day) => {
    if (!consistencyData || !consistencyData.dp) return false;
    
    // Construct date string YYYY-MM-DD manually to avoid timezone issues
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const checkDateStr = `${year}-${month}-${dayStr}`;

    return consistencyData.dp.some(d => {
      // Assuming d.d is ISO format like "2023-10-25T00:00:00.000Z"
      const dataDateStr = d.d.split('T')[0];
      return dataDateStr === checkDateStr;
    });
  };

  const days = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const today = new Date();

  return (
    <div className="gspc-widget">
      {/* Header */}
      <div className="gspc-header">
        <h3 className="gspc-title">My Activity</h3>
        <div className="gspc-nav">
          <button className="gspc-nav-btn" onClick={() => changeMonth(-1)}><FiChevronLeft /></button>
          <span className="gspc-month-label">{monthName}</span>
          <button className="gspc-nav-btn" onClick={() => changeMonth(1)}><FiChevronRight /></button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="gspc-weekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="gspc-weekday">{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="gspc-grid">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        
        {days.map(day => {
           const isActive = checkActivity(day);
           const isToday = today.getDate() === day && 
                           today.getMonth() === currentDate.getMonth() && 
                           today.getFullYear() === currentDate.getFullYear();
           
           return (
             <div 
               key={day} 
               className={`gspc-day ${isActive ? 'active' : 'inactive'} ${isToday ? 'today' : ''}`}
             >
               {day}
             </div>
           );
        })}
      </div>

      {/* Legend */}
      <div className="gspc-legend">
        <div className="gspc-legend-item">
          <span className="gspc-dot active"></span> Active
        </div>
        <div className="gspc-legend-item">
          <span className="gspc-dot inactive"></span> Inactive
        </div>
        <div className="gspc-legend-item">
          <span className="gspc-dot today"></span> Today
        </div>
      </div>
    </div>
  );
};

export default GuideRayStudentProgressCalendar;