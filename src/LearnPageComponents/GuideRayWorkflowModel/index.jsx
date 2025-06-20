import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import GuideRayTechnicalWords from '../GuideRayTechnicalWords';

const GuideRayWorkflowModel = ({ data, darkMode }) => {
  const flow = data.model;
  const [activeStep, setActiveStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const executionQueue = useRef([]);
  const currentIndex = useRef(0);
  const timerRef = useRef(null);
  const themeClass = darkMode ? 'dark' : 'light';

  const buildExecutionQueue = (node) => {
    if (!node) return [];
    
    if (node.type === 'series') {
      let queue = [];
      node.steps.forEach(step => {
        if (step.type) {
          queue = [...queue, ...buildExecutionQueue(step)];
        } else {
          queue.push(step.id);
        }
      });
      return queue;
    } else if (node.type === 'parallel') {
      let queue = [];
      node.steps.forEach(branch => {
        if (branch.type) {
          queue = [...queue, ...buildExecutionQueue(branch)];
        } else {
          queue.push(branch.id);
        }
      });
      return queue;
    } else {
      return [node.id];
    }
  };

  const startFlow = () => {
    executionQueue.current = buildExecutionQueue(flow);
    currentIndex.current = 0;
    setCompletedSteps([]);
    setActiveStep(null);
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning || executionQueue.current.length === 0) return;

    const processNextStep = () => {
      if (currentIndex.current < executionQueue.current.length) {
        const stepId = executionQueue.current[currentIndex.current];
        
        if (activeStep) {
          setCompletedSteps(prev => [...prev, activeStep]);
        }
        
        setActiveStep(stepId);
        
        timerRef.current = setTimeout(() => {
          currentIndex.current += 1;
          processNextStep();
        }, 3000);
      } else {
        if (activeStep) {
          setCompletedSteps(prev => [...prev, activeStep]);
        }
        setActiveStep(null);
        setIsRunning(false);
      }
    };

    processNextStep();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isRunning, activeStep]);

  const isActive = (id) => activeStep === id;
  const isCompleted = (id) => completedSteps.includes(id);

  const renderStep = (step, index, isParallel = false, level = 0) => {
    if (step.type === 'series') {
      return (
        <div className={`guideray-workflow-series-container guideray-workflow-level-${level} ${themeClass}`} key={`series-${index}`}>
          {step.steps.map((s, i) => (
            <React.Fragment key={`series-step-${i}`}>
              {renderStep(s, i, isParallel, level + 1)}
              {i < step.steps.length - 1 && (
                <div className={`guideray-workflow-series-arrow ${themeClass} ${isActive(s.id) ? 'guideray-workflow-active' : ''} ${isCompleted(s.id) ? 'guideray-workflow-completed' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }

    if (step.type === 'parallel') {
      return (
        <div className={`guideray-workflow-parallel-container guideray-workflow-level-${level} ${themeClass}`} key={`parallel-${index}`}>
          <div className={`guideray-workflow-parallel-connector guideray-workflow-top ${themeClass} ${isActive(step.steps[0]?.id) ? 'guideray-workflow-active' : ''} ${isCompleted(step.steps[0]?.id) ? 'guideray-workflow-completed' : ''}`} />
          <div className="guideray-workflow-parallel-branches">
            {step.steps.map((branch, i) => (
              <div className="guideray-workflow-parallel-branch" key={`parallel-branch-${i}`}>
                <div className={`guideray-workflow-parallel-step ${themeClass} ${isActive(branch.id) ? 'guideray-workflow-active' : ''} ${isCompleted(branch.id) ? 'guideray-workflow-completed' : ''}`}>
                  {renderStep(branch, i, true, level + 1)}
                </div>
              </div>
            ))}
          </div>
          <div className={`guideray-workflow-parallel-connector guideray-workflow-bottom ${themeClass} ${isActive(step.steps[0]?.id) ? 'guideray-workflow-active' : ''} ${isCompleted(step.steps[0]?.id) ? 'guideray-workflow-completed' : ''}`} />
        </div>
      );
    }

    return (
      <div 
        className={`guideray-workflow-task-card ${themeClass} ${isActive(step.id) ? 'guideray-workflow-active' : ''} ${isCompleted(step.id) ? 'guideray-workflow-completed' : ''}`} 
        key={step.id}
        onClick={() => setSelectedStep(step)}
      >
        <div className="guideray-workflow-task-header">
          <div className={`guideray-workflow-task-name ${themeClass}`}>{step.name}</div>
        </div>
        <div className={`guideray-workflow-task-desc ${themeClass}`}>
          <div className={`guideray-workflow-description ${themeClass}`}>{step.description}</div>
        </div>
        <div className="guideray-workflow-task-status">
          {isCompleted(step.id) ? (
            <div className="guideray-workflow-status-icon guideray-workflow-completed">
              ✓
            </div>
          ) : isActive(step.id) ? (
            <div className="guideray-workflow-status-icon guideray-workflow-active">
              ●
            </div>
          ) : (
            <div className="guideray-workflow-status-icon guideray-workflow-pending">
              ○
            </div>
          )}
        </div>
      </div>
    );
  };

  const closeModal = () => setSelectedStep(null);

  return (
    <div className={`guideray-workflow-container ${themeClass}`}>
      <div className={`guideray-workflow-header ${themeClass}`}>
        <h2 className={`guideray-workflow-title ${themeClass}`}>{data.title}</h2>
        <p className={`guideray-workflow-description-text ${themeClass}`}>{data.description}</p>
      </div>
      
      <div className={`guideray-workflow-controls ${themeClass}`}>
        <button 
          className={`guideray-workflow-start-button ${themeClass} ${isRunning ? 'guideray-workflow-disabled' : ''}`} 
          onClick={startFlow}
          disabled={isRunning}
        >
          {isRunning ? (
            <span className="guideray-workflow-button-loading">
              <span className={`guideray-workflow-loading-dot ${themeClass}`}></span>
              <span className={`guideray-workflow-loading-dot ${themeClass}`}></span>
              <span className={`guideray-workflow-loading-dot ${themeClass}`}></span>
              Running
            </span>
          ) : (
            <>
              <span className="guideray-workflow-button-icon">▶</span>
              Start Workflow
            </>
          )}
        </button>
      </div>
      <div className={`guideray-workflow-chart ${themeClass}`}>
        {renderStep(flow)}
      </div>

      {selectedStep && (
        <div className={`guideray-workflow-modal-overlay ${themeClass}`} onClick={closeModal}>
          <div className={`guideray-workflow-modal-content ${themeClass}`} onClick={e => e.stopPropagation()}>
            <button className={`guideray-workflow-modal-close ${themeClass}`} onClick={closeModal}>×</button>
            <h2>{selectedStep.name}</h2>
            <div className="guideray-workflow-modal-description">
              <h3>Description</h3>
              <p>{selectedStep.description}</p>
            </div>
            <div className="guideray-workflow-modal-status">
              <span className={`guideray-workflow-status-badge ${isCompleted(selectedStep.id) ? 'guideray-workflow-completed' : isActive(selectedStep.id) ? 'guideray-workflow-active' : 'guideray-workflow-pending'}`}>
                {isCompleted(selectedStep.id) ? 'Completed' : isActive(selectedStep.id) ? 'Active' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      )}

       {data.technicalWords && (
        <GuideRayTechnicalWords words={data.technicalWords} theme={themeClass} />
      )}
    </div>
  );
};

export default GuideRayWorkflowModel;