import React from 'react';
import './index.css';
import GuideRayStudentProgressCalendar from '../../OtherComponents/StudentProgressBox';
import GuiderayStudentConsistencyScoreBar from '../../OtherComponents/GuiderayStudentConsistencyScoreBar';
import GuiderayStudentDailyTasks from '../../OtherComponents/GuiderayStudentDailyTasks';
import GuiderayStudentUpcomingClasses from '../../OtherComponents/GuiderayStudentUpcomingClasses';
import GuiderayStudentResourceRecommendations from '../../OtherComponents/GuiderayStudentResourceRecommendations';
import GuiderayStudentPerformanceChart from '../../OtherComponents/GuiderayStudentPerformanceChart';

const StudentDashboard = ({ darkMode }) => {
  return (
    <div className={`guideray-student-dashboard-container ${darkMode ? 'guideray-student-dashboard-dark' : 'guideray-student-dashboard-light'}`}>
      {/* Sidebar would be here in a complete implementation */}
      
      <div className={`guideray-student-dashboard-main ${darkMode ? 'guideray-student-dashboard-dark' : 'guideray-student-dashboard-light'}`}>
        <div className="guideray-student-dashboard-content">
          {/* Top Section - Consistency Score */}
          <div className="guideray-student-dashboard-top-section">
       <div className={`guideray-student-dashboard-card-2 ${darkMode ? 'guideray-student-dashboard-dark' : 'guideray-student-dashboard-light'}`}>
            
              <GuiderayStudentConsistencyScoreBar darkMode={darkMode} />
                           
            </div>
              

             <div className={`guideray-student-dashboard-card-2 ${darkMode ? 'guideray-student-dashboard-dark' : 'guideray-student-dashboard-light'}`}>
            
                        <div className="guideray-student-progress-calendar-container">
            <GuideRayStudentProgressCalendar darkMode={darkMode} />
                           
            </div>

              </div>
        

          </div>
          
          {/* Main Content Grid */}

                
          

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;