import React, { useState } from 'react';
import './index.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GuiderayStudentPerformanceChart = ({ darkMode }) => {
  const [timeRange, setTimeRange] = useState('weekly');
  
  // Enhanced data with hours studied and performance metrics
  const performanceData = {
    daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [72, 85, 78, 90, 88, 65, 82],
      hours: [3.2, 4.1, 3.8, 4.5, 4.3, 2.1, 3.7],
      tasks: [5, 7, 6, 8, 7, 3, 6]
    },
    weekly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [78, 82, 85, 88],
      hours: [18.5, 20.2, 21.7, 23.1],
      tasks: [32, 36, 38, 40]
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [65, 72, 78, 75, 82, 85],
      hours: [68.2, 75.5, 82.3, 78.7, 86.4, 89.1],
      tasks: [120, 135, 148, 142, 156, 162]
    },
    quarterly: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      data: [72, 78, 82, 85],
      hours: [226, 246, 258, 272],
      tasks: [403, 438, 456, 480]
    }
  };

  const chartData = {
    labels: performanceData[timeRange].labels,
    datasets: [
      {
        label: 'Performance Score',
        data: performanceData[timeRange].data,
        backgroundColor: darkMode 
          ? ['rgba(139, 92, 246, 0.7)'] 
          : ['rgba(109, 40, 217, 0.7)'],
        borderColor: darkMode ? '#8b5cf6' : '#6d28d9',
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: darkMode ? '#a78bfa' : '#7c3aed',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        titleColor: darkMode ? '#f8fafc' : '#1e293b',
        bodyColor: darkMode ? '#e2e8f0' : '#4b5563',
        borderColor: darkMode ? '#475569' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const hours = performanceData[timeRange].hours[index];
            const tasks = performanceData[timeRange].tasks[index];
            return [
              `Performance: ${context.raw}%`,
              `Hours studied: ${hours} hrs`,
              `Tasks completed: ${tasks}`
            ];
          },
          afterLabel: (context) => {
            const index = context.dataIndex;
            const efficiency = (performanceData[timeRange].data[index] / performanceData[timeRange].hours[index]).toFixed(2);
            return `Efficiency: ${efficiency} pts/hr`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 50,
        max: 100,
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b',
          stepSize: 10,
          callback: (value) => `${value}%`
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b'
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    hover: {
      animationDuration: 0
    }
  };

  return (
    <div className={`guideray-student-performance-chart ${darkMode ? 'dark' : 'light'}`}>
      <div className="guideray-student-performance-chart-header">
        <h3 className="guideray-student-performance-chart-title">Performance Analytics</h3>
        <div className="guideray-student-performance-chart-range-selector">
          {['daily', 'weekly', 'monthly', 'quarterly'].map((range) => (
            <button
              key={range}
              className={`guideray-student-performance-chart-range-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="guideray-student-performance-chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="guideray-student-performance-chart-footer">
        <div className="guideray-student-performance-chart-stats">
          <div className="guideray-student-performance-chart-stat">
            <span className="label">Current</span>
            <span className="value">{performanceData[timeRange].data.slice(-1)[0]}%</span>
          </div>
          <div className="guideray-student-performance-chart-stat">
            <span className="label">Change</span>
            <span className={`value ${
              (performanceData[timeRange].data.slice(-1)[0] - performanceData[timeRange].data[0]) >= 0 
                ? 'positive' 
                : 'negative'
            }`}>
              {((performanceData[timeRange].data.slice(-1)[0] - 
                performanceData[timeRange].data[0]) > 0 ? '+' : '')}
              {performanceData[timeRange].data.slice(-1)[0] - 
                performanceData[timeRange].data[0]}%
            </span>
          </div>
          <div className="guideray-student-performance-chart-stat">
            <span className="label">Avg Hours</span>
            <span className="value">
              {Math.round(
                performanceData[timeRange].hours.reduce((a, b) => a + b, 0) / 
                performanceData[timeRange].hours.length
              )}h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuiderayStudentPerformanceChart;