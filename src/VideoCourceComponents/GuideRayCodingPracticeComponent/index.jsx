import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiBarChart2,
  FiClock,
  FiTag,
  FiCpu
} from 'react-icons/fi';
import './index.css';

const GuideRayCodingPracticeComponent = ({ codingData }) => {
  const navigate = useNavigate();

  const handleProblemClick = (problem) => {
    navigate('/coding-platform', { 
      state: {
        problems: [problem]
      } 
    });
  };

  return (
    <div className="GuideRayCodingPracticeComponent-container">

      
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
                Acceptance
              </th>
              <th className="GuideRayCodingPracticeComponent-actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codingData.problems.map((problem) => (
              <tr 
                key={problem.id}
                className="GuideRayCodingPracticeComponent-row"
              >
                <td className="GuideRayCodingPracticeComponent-status-cell">
                  <div className="GuideRayCodingPracticeComponent-status-indicator"></div>
                </td>
                <td className="GuideRayCodingPracticeComponent-problem-cell">
                  <div className="GuideRayCodingPracticeComponent-problem-title">
                    {problem.title}
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
                  {problem.acceptanceRate}%
                </td>
                <td className="GuideRayCodingPracticeComponent-actions-cell">
                  <button 
                    className="GuideRayCodingPracticeComponent-solve-btn"
                    onClick={() => handleProblemClick(problem)}
                  >
                    Solve <FiArrowRight className="GuideRayCodingPracticeComponent-arrow-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuideRayCodingPracticeComponent;