import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiBarChart2,
  FiClock,
  FiTag,
  FiCpu,
  FiCheck,
  FiBookmark
} from 'react-icons/fi';
import './index.css';
import API_BASE_URL from '../../../config';
const GuideRayCodingPracticeComponent = ({ codingData, topicIndex, topic, concept, studentName, studentId, courseId }) => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMarkedRead, setIsMarkedRead] = useState(false);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/consistancy/progress/${studentId}/${courseId}`);
        const { data } = await response.json();
        setProgressData(data);
        
        // Check if current topic is marked as read (all problems >= 70%)
        const currentTopic = data.t[topicIndex];
        if (currentTopic && currentTopic.cq) {
          const allCompleted = codingData.problems.every(problem => {
            const question = currentTopic.cq.find(q => q.q == problem.id);
            return question && question.p >= 70;
          });
          setIsMarkedRead(allCompleted);
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [studentId, courseId, topicIndex, codingData.problems]);

  const handleProblemClick = (problem) => {
    navigate('/coding-platform', { 
      state: {
        problems: [problem],
        topicIndex: topicIndex,
        courseId: courseId,
        studentId: studentId,
        studentName: studentName,
        topic: topic,
        concept: concept
      }
    });
  };

  const handleMarkAsRead = async () => {
    try {
      // Make API call to mark topic as read
      const response = await fetch(`${API_BASE_URL}/api/consistancy/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          courseId,
          topicIndex
        })
      });
      
      if (response.ok) {
        setIsMarkedRead(true);
      }
    } catch (error) {
      console.error('Error marking topic as read:', error);
    }
  };

  const getTopicCompletion = () => {
    if (!progressData) return 0;
    const currentTopic = progressData.t[topicIndex];
    return currentTopic?.p || 0;
  };

  const isProblemCompleted = (problemId) => {
    if (!progressData) return false;
    const currentTopic = progressData.t[topicIndex];
    if (!currentTopic?.cq) return false;
    
    const question = currentTopic.cq.find(q => q.q == problemId);
    return question && question.p >= 70;
  };

  const getProblemAcceptance = (problemId) => {
    if (!progressData) return '0%';
    const currentTopic = progressData.t[topicIndex];
    if (!currentTopic?.cq) return '0%';
    
    const question = currentTopic.cq.find(q => q.q == problemId);
    return question ? `${question.p}%` : '0%';
  };

  const allProblemsCompleted = () => {
    if (!progressData) return false;
    const currentTopic = progressData.t[topicIndex];
    if (!currentTopic?.cq) return false;
    
    return codingData.problems.every(problem => {
      const question = currentTopic.cq.find(q => q.q == problem.id);
      return question && question.p >= 70;
    });
  };

  const completionPercentage = getTopicCompletion();
  const isTopicReadyToMark = allProblemsCompleted();

  if (loading) {
    return <div className="GuideRayCodingPracticeComponent-loading">Loading progress data...</div>;
  }

  return (
    <div className="GuideRayCodingPracticeComponent-container">
      <div className="GuideRayCodingPracticeComponent-header">
       
        
   
      </div>
      
      <div className="GuideRayCodingPracticeComponent-table-wrapper">
        <table className="GuideRayCodingPracticeComponent-table">
          <thead>
            <tr>
              <th className="GuideRayCodingPracticeComponent-status-header">Status</th>
              <th className="GuideRayCodingPracticeComponent-problem-header">Problem</th>
              <th className="GuideRayCodingPracticeComponent-difficulty-header">
                <FiBarChart2 className="GuideRayCodingPracticeComponent-header-icon" />
                Difficulty
              </th>
              <th className="GuideRayCodingPracticeComponent-acceptance-header">
                <FiClock className="GuideRayCodingPracticeComponent-header-icon" />
                Your Progress
              </th>
              <th className="GuideRayCodingPracticeComponent-actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codingData.problems.map((problem) => {
              const problemCompleted = isProblemCompleted(problem.id);
              const acceptanceRate = getProblemAcceptance(problem.id);
              
              return (
                <tr 
                  key={problem.id}
                  className={`GuideRayCodingPracticeComponent-row ${problemCompleted ? 'completed' : ''}`}
                >
                  <td className="GuideRayCodingPracticeComponent-status-cell">
                    <div className={`GuideRayCodingPracticeComponent-status-indicator ${problemCompleted ? 'completed' : ''}`}>
                      {problemCompleted && <FiCheck />}
                    </div>
                  </td>
                  <td className="GuideRayCodingPracticeComponent-problem-cell">
                    <div className="GuideRayCodingPracticeComponent-problem-title">
                      {problem.title}
                      {problemCompleted && (
                        <span className="GuideRayCodingPracticeComponent-completed-icon">
                          <FiCheck />
                        </span>
                      )}
                    </div>
                    <div className="GuideRayCodingPracticeComponent-problem-tags">
                      <FiTag className="GuideRayCodingPracticeComponent-tag-icon" />
                      {problem.tags?.map((tag, i) => (
                        <span key={i} className="GuideRayCodingPracticeComponent-tag">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className={`GuideRayCodingPracticeComponent-difficulty-cell GuideRayCodingPracticeComponent-difficulty-${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </td>
                  <td className="GuideRayCodingPracticeComponent-acceptance-cell">
                    {acceptanceRate}
                  </td>
                  <td className="GuideRayCodingPracticeComponent-actions-cell">
                    <button 
                      className="GuideRayCodingPracticeComponent-solve-btn"
                      onClick={() => handleProblemClick(problem)}
                    >
                      {problemCompleted ? 'Review' : 'Solve'} <FiArrowRight className="GuideRayCodingPracticeComponent-arrow-icon" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="GuideRayCodingPracticeComponent-mark-read-container">
        <button
          className={`GuideRayCodingPracticeComponent-mark-read-button ${isMarkedRead ? 'completed' : ''}`}
          onClick={handleMarkAsRead}
          disabled={!isTopicReadyToMark || isMarkedRead}
          data-tooltip={
            isMarkedRead
              ? 'Topic completed'
              : isTopicReadyToMark
                ? 'Click to mark as read'
                : 'Complete all problems to mark as read'
          }
        >
          <span className="GuideRayCodingPracticeComponent-mark-read-circle">
            {isMarkedRead && <FiCheck className="check-icon" />}
          </span>
          <span>{isMarkedRead ? 'Marked as Read' : 'Mark as Read'}</span>
        </button>
      </div>
    </div>
  );
};

export default GuideRayCodingPracticeComponent;