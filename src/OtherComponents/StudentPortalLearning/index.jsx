import React, { useEffect, useRef, useState } from 'react';
import { 
  FaDatabase, 
  FaInfoCircle, 
  FaSlidersH, 
  FaBrain, 
  FaChartBar, 
  FaFileAlt, 
  FaBullseye 
} from 'react-icons/fa';
import { IoMdArrowRoundDown } from 'react-icons/io';
import './index.css';

const StudentPortalLearning = () => {
  const [activeStep, setActiveStep] = useState(null);
  const [stepDescription, setStepDescription] = useState('Click play to start the workflow visualization');
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef(null);

  // Define the animation sequence with detailed descriptions
  const animationSequence = [
    { 
      elements: ['.input-1'], 
      delay: 1500,
      description: 'STEP 1: RAW DATA COLLECTION - The system gathers unstructured data from various sources including databases, APIs, and user inputs. This forms the foundation for all subsequent processing.'
    },
    { 
      elements: ['.input-2'], 
      delay: 1500,
      description: 'STEP 2: METADATA LOADING - Structural information about the data is loaded, including schema definitions, data types, and relationships between datasets. This metadata guides how the raw data will be processed.'
    },
    { 
      elements: ['.input-3'], 
      delay: 1500,
      description: 'STEP 3: PARAMETERS CONFIGURATION - Processing rules and business parameters are loaded. These include thresholds, formulas, and business logic that will be applied during transformation.'
    },
    { 
      elements: ['.arrow-1-1', '.arrow-1-2', '.arrow-1-3'], 
      delay: 1500,
      description: 'STEP 4: DATA VALIDATION - The system performs quality checks on the collected data. This includes completeness checks, format validation, and identifying any anomalies or outliers.'
    },
    { 
      elements: ['.arrow-head-1'], 
      delay: 1500,
      description: 'STEP 5: DATA INTEGRATION - Validated data from multiple sources is merged into a unified dataset. Duplicates are removed and conflicting values are resolved according to business rules.'
    },
    { 
      elements: ['.process'], 
      delay: 2000,
      description: 'STEP 6: AI PROCESSING - The core transformation occurs here. Machine learning models clean the data, perform analysis, and extract patterns. This includes: 1) Data cleaning, 2) Feature engineering, 3) Model application'
    },
    { 
      elements: ['.arrow-2'], 
      delay: 1500,
      description: 'STEP 7: QUALITY ASSURANCE - Processed data undergoes verification. The system checks that transformations were applied correctly and that results meet expected quality standards.'
    },
    { 
      elements: ['.arrow-head-2'], 
      delay: 1500,
      description: 'STEP 8: RESULTS PREPARATION - The verified data is formatted for output. This includes converting to required formats, applying final calculations, and preparing for visualization.'
    },
    { 
      elements: ['.output-1'], 
      delay: 1500,
      description: 'STEP 9: VISUALIZATION GENERATION - Interactive dashboards and charts are created to represent the processed data visually, making trends and patterns easily understandable.'
    },
    { 
      elements: ['.output-2'], 
      delay: 1500,
      description: 'STEP 10: REPORT GENERATION - Detailed documents are produced containing analysis results, statistics, and business insights derived from the processed data.'
    },
    { 
      elements: ['.arrow-3'], 
      delay: 1500,
      description: 'STEP 11: OUTPUT VALIDATION - Final outputs are reviewed for accuracy and completeness. Any required adjustments are made before delivery.'
    },
    { 
      elements: ['.arrow-head-3'], 
      delay: 1500,
      description: 'STEP 12: DELIVERY PREPARATION - Results are packaged for distribution, including access control setup, format conversions, and notification preparation.'
    },
    { 
      elements: ['.final-output'], 
      delay: 2000,
      description: 'STEP 13: BUSINESS INSIGHTS DELIVERY - The final outputs are delivered to stakeholders. This includes actionable insights, recommendations, and supporting evidence for decision making.'
    },
    { 
      elements: ['reset'], 
      delay: 3000,
      description: 'Workflow completed. The system is ready to process new data or iterate on existing analysis.'
    },
  ];

  const runAnimation = () => {
    let cumulativeDelay = 0;
    setIsPlaying(true);
    
    animationSequence.forEach((step, index) => {
      cumulativeDelay += step.delay;
      
      animationRef.current = setTimeout(() => {
        if (step.elements[0] === 'reset') {
          setActiveStep(null);
          setStepDescription(step.description);
          setIsPlaying(false);
          return;
        }
        
        setActiveStep(index);
        setStepDescription(step.description);
        
        // Highlight current elements
        step.elements.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            el.classList.add('highlight');
            el.classList.add('pulse');
            
            setTimeout(() => {
              el.classList.remove('pulse');
            }, 500);
          });
        });
        
        // Remove highlight from previous elements
        if (index > 0 && animationSequence[index-1].elements[0] !== 'reset') {
          animationSequence[index-1].elements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
              el.classList.remove('highlight');
            });
          });
        }
      }, cumulativeDelay);
    });
  };

  const stopAnimation = () => {
    clearTimeout(animationRef.current);
    setActiveStep(null);
    setIsPlaying(false);
    setStepDescription('Animation stopped. Click play to restart.');
    
    // Remove all highlights
    animationSequence.forEach(step => {
      if (step.elements[0] !== 'reset') {
        step.elements.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            el.classList.remove('highlight');
            el.classList.remove('pulse');
          });
        });
      }
    });
  };

  useEffect(() => {
    return () => {
      clearTimeout(animationRef.current);
    };
  }, []);

  return (
    <div className="workflow-container">
      <h2>Data Processing Workflow</h2>
      <p className="subtitle">Visualizing the end-to-end data transformation pipeline</p>
      
      <div className="description-box">
        <p>{stepDescription}</p>
      </div>
      
      {/* Inputs (Parallel) */}
      <div className="parallel-group">
        <div className={`box input-1 ${activeStep === 0 ? 'active' : ''}`}>
          <div className="box-icon"><FaDatabase /></div>
          <div className="box-label">Raw Data</div>
          <div className="box-detail">CSV, JSON, SQL, APIs</div>
        </div>
        <div className={`box input-2 ${activeStep === 1 ? 'active' : ''}`}>
          <div className="box-icon"><FaInfoCircle /></div>
          <div className="box-label">Metadata</div>
          <div className="box-detail">Schemas, data types</div>
        </div>
        <div className={`box input-3 ${activeStep === 2 ? 'active' : ''}`}>
          <div className="box-icon"><FaSlidersH /></div>
          <div className="box-label">Parameters</div>
          <div className="box-detail">Rules, thresholds</div>
        </div>
      </div>

      {/* Arrow Down */}
      <div className="arrow-group">
        <div className="arrow-line vertical arrow-1-1"></div>
        <div className="arrow-line vertical arrow-1-2"></div>
        <div className="arrow-line vertical arrow-1-3"></div>
        <div className="arrow-head down arrow-head-1">
          <IoMdArrowRoundDown />
        </div>
        <div className="step-label" style={{ opacity: activeStep >= 3 && activeStep <= 4 ? 1 : 0 }}>
          Data Collection
        </div>
      </div>

      {/* Process (Series) */}
      <div className="series-group">
        <div className={`box process ${activeStep === 5 ? 'active' : ''}`}>
          <div className="box-icon"><FaBrain /></div>
          <div className="box-label">AI Processing</div>
          <div className="box-detail">Cleaning → Analysis → Transformation</div>
        </div>
      </div>

      {/* Arrow Down */}
      <div className="arrow-group">
        <div className="arrow-line vertical arrow-2"></div>
        <div className="arrow-head down arrow-head-2">
          <IoMdArrowRoundDown />
        </div>
        <div className="step-label" style={{ opacity: activeStep >= 6 && activeStep <= 7 ? 1 : 0 }}>
          Processing
        </div>
      </div>

      {/* Outputs (Parallel) */}
      <div className="parallel-group">
        <div className={`box output-1 ${activeStep === 8 ? 'active' : ''}`}>
          <div className="box-icon"><FaChartBar /></div>
          <div className="box-label">Visualization</div>
          <div className="box-detail">Dashboards, charts</div>
        </div>
        <div className={`box output-2 ${activeStep === 9 ? 'active' : ''}`}>
          <div className="box-icon"><FaFileAlt /></div>
          <div className="box-label">Report</div>
          <div className="box-detail">PDF, HTML, DOCX</div>
        </div>
      </div>
      
      {/* Final Arrow Down */}
      <div className="arrow-group">
        <div className="arrow-line vertical arrow-3"></div>
        <div className="arrow-head down arrow-head-3">
          <IoMdArrowRoundDown />
        </div>
        <div className="step-label" style={{ opacity: activeStep >= 10 && activeStep <= 11 ? 1 : 0 }}>
          Delivery
        </div>
      </div>
      
      {/* Final Output */}
      <div className="series-group">
        <div className={`box final-output ${activeStep === 12 ? 'active' : ''}`}>
          <div className="box-icon"><FaBullseye /></div>
          <div className="box-label">Business Insights</div>
          <div className="box-detail">Actionable intelligence</div>
        </div>
      </div>
      
      <div className="animation-controls">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: activeStep !== null ? `${(activeStep / (animationSequence.length - 2)) * 100}%` : '0%' }}
          ></div>
        </div>
        <div className="control-buttons">
          {!isPlaying ? (
            <button onClick={runAnimation} className="control-button play">
              Start Visualization
            </button>
          ) : (
            <button onClick={stopAnimation} className="control-button stop">
              Stop Animation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPortalLearning;