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
import axiosInstance from '../../api/axiosInstance';
import './index.css';
const GuideRayCodingPracticeComponent = ({ codingData, topicIndex, topic, concept, studentName, studentId, courseId, isCompleted, onComplete, progressData }) => {
  const navigate = useNavigate();

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
      onComplete();
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

  // Placeholder - deferring until prop is passed

  const completionPercentage = getTopicCompletion();
  const isTopicReadyToMark = allProblemsCompleted();

  // Parent confirms loading


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
          className={`GuideRayCodingPracticeComponent-mark-read-button ${isCompleted ? 'completed' : ''}`}
          onClick={handleMarkAsRead}
          disabled={!isTopicReadyToMark || isCompleted}
          data-tooltip={
            isCompleted
              ? 'Topic completed'
              : isTopicReadyToMark
                ? 'Click to mark as read'
                : 'Complete all problems to mark as read'
          }
        >
          <span className="GuideRayCodingPracticeComponent-mark-read-circle">
            {isCompleted && <FiCheck className="check-icon" />}
          </span>
          <span>{isCompleted ? 'Marked as Read' : 'Mark as Read'}</span>
        </button>
      </div>
    </div>
  );
};

export default GuideRayCodingPracticeComponent;