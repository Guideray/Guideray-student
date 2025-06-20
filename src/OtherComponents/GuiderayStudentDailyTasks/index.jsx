import React from 'react';
import './index.css';

const GuiderayStudentDailyTasks = ({ darkMode }) => {
  const tasks = [
    { id: 1, name: 'Complete Math Assignment', completed: true },
    { id: 2, name: 'Read Chapter 5 of Physics', completed: false },
    { id: 3, name: 'Submit English Essay', completed: false },
    { id: 4, name: 'Practice Coding Problems', completed: true }
  ];

  return (
    <div className={`guideray-student-daily-tasks ${darkMode ? 'guideray-student-daily-tasks-dark' : 'guideray-student-daily-tasks-light'}`}>
      <h3 className="guideray-student-daily-tasks-title">Today's Tasks</h3>
      <div className="guideray-student-daily-tasks-list">
        {tasks.map(task => (
          <div key={task.id} className="guideray-student-daily-task-item">
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => {}}
              className="guideray-student-daily-task-checkbox"
            />
            <span className={`guideray-student-daily-task-name ${task.completed ? 'guideray-student-daily-task-completed' : ''}`}>
              {task.name}
            </span>
          </div>
        ))}
      </div>
      <button className="guideray-student-daily-tasks-add">
        + Add New Task
      </button>
    </div>
  );
};

export default GuiderayStudentDailyTasks;