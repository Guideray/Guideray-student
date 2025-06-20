import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiCode, FiCpu, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './index.css'

const GuideRayCodingPracticeComponent = ({ codingData }) => {
  const navigate = useNavigate();
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleProblemClick = (problem) => {
    navigate('/coding-platform', { 
      state: {
        problems: [problem]
      } 
    });
  };

  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="GuideRayCodingPracticeComponent-guideray-coding-container">
      <h2 className="GuideRayCodingPracticeComponent-guideray-coding-title">{codingData.title}</h2>
      <p className="GuideRayCodingPracticeComponent-guideray-coding-description">{codingData.discription}</p>
      
      <div className="GuideRayCodingPracticeComponent-guideray-coding-table-container">
        <table className="GuideRayCodingPracticeComponent-guideray-coding-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Problem</th>
              <th>Difficulty</th>
              <th>Acceptance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {codingData.problems.map((problem) => (
              <React.Fragment key={problem.id}>
                <tr 
                  className={`GuideRayCodingPracticeComponent-guideray-coding-table-row ${expandedRow === problem.id ? 'expanded' : ''}`}
                  onClick={() => toggleRowExpand(problem.id)}
                >
                  <td className="GuideRayCodingPracticeComponent-status-cell">
                    <div className="GuideRayCodingPracticeComponent-status-indicator"></div>
                  </td>
                  <td className="GuideRayCodingPracticeComponent-problem-title-cell">
                    <div className="GuideRayCodingPracticeComponent-problem-title">{problem.title}</div>
                    <div className="GuideRayCodingPracticeComponent-problem-tags">
                      {problem.tags?.map((tag, i) => (
                        <span key={i} className="GuideRayCodingPracticeComponent-tag">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className={`GuideRayCodingPracticeComponent-difficulty-cell ${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </td>
                  <td className="GuideRayCodingPracticeComponent-acceptance-cell">
                    {problem.acceptanceRate}%
                  </td>
                  <td className="GuideRayCodingPracticeComponent-actions-cell">
                    <button 
                      className="GuideRayCodingPracticeComponent-solve-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProblemClick(problem);
                      }}
                    >
                      Solve
                    </button>
                    <span className="GuideRayCodingPracticeComponent-expand-icon">
                      {expandedRow === problem.id ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                  </td>
                </tr>
                {expandedRow === problem.id && (
                  <tr className="GuideRayCodingPracticeComponent-details-row">
                    <td colSpan="5">
                      <div className="GuideRayCodingPracticeComponent-problem-details">
                        <div className="GuideRayCodingPracticeComponent-description-section">
                          <h4>Description</h4>
                          <p>{problem.description}</p>
                        </div>
                        <div className="GuideRayCodingPracticeComponent-sample-section">
                          <h4><FiCode /> Sample</h4>
                          <div className="GuideRayCodingPracticeComponent-sample-io">
                            <div className="GuideRayCodingPracticeComponent-input">
                              <label>Input:</label>
                              <pre>{problem.sampleInput}</pre>
                            </div>
                            <div className="GuideRayCodingPracticeComponent-output">
                              <label>Output:</label>
                              <pre>{problem.sampleOutput}</pre>
                            </div>
                          </div>
                        </div>
                        <div className="GuideRayCodingPracticeComponent-constraints-section">
                          <h4><FiCheckCircle /> Constraints</h4>
                          <ul>
                            {problem.constraints.map((constraint, index) => (
                              <li key={index}>{constraint}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="GuideRayCodingPracticeComponent-actions-footer">
                          <button 
                            className="GuideRayCodingPracticeComponent-solve-btn-main"
                            onClick={() => handleProblemClick(problem)}
                          >
                            Solve Problem <FiArrowRight />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProblem && (
        <div className="GuideRayCodingPracticeComponent-problem-modal">
          <div className="GuideRayCodingPracticeComponent-modal-content">
            <button 
              className="GuideRayCodingPracticeComponent-close-modal" 
              onClick={() => setSelectedProblem(null)}
            >
              <FiX />
            </button>
            <div className="GuideRayCodingPracticeComponent-modal-header">
              <h3>{selectedProblem.title}</h3>
              <span className={`GuideRayCodingPracticeComponent-difficulty-badge ${selectedProblem.difficulty.toLowerCase()}`}>
                {selectedProblem.difficulty}
              </span>
            </div>
            <div className="GuideRayCodingPracticeComponent-modal-body">
              <div className="GuideRayCodingPracticeComponent-problem-description">
                <p>{selectedProblem.description}</p>
              </div>
              <div className="GuideRayCodingPracticeComponent-problem-sample">
                <h4><FiCode /> Sample Input/Output</h4>
                <div className="GuideRayCodingPracticeComponent-sample-io">
                  <div className="GuideRayCodingPracticeComponent-input">
                    <label>Input:</label>
                    <pre>{selectedProblem.sampleInput}</pre>
                  </div>
                  <div className="GuideRayCodingPracticeComponent-output">
                    <label>Output:</label>
                    <pre>{selectedProblem.sampleOutput}</pre>
                  </div>
                </div>
              </div>
              <div className="GuideRayCodingPracticeComponent-problem-constraints">
                <h4><FiCheckCircle /> Constraints</h4>
                <ul>
                  {selectedProblem.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="GuideRayCodingPracticeComponent-modal-footer">
              <button 
                className="GuideRayCodingPracticeComponent-solve-btn"
                onClick={() => handleProblemClick(selectedProblem)}
              >
                Solve Problem <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideRayCodingPracticeComponent;