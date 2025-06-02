import React, { useState, useRef, useEffect } from 'react';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiArrowUp,
  FiChevronDown,
  FiChevronUp,
  FiBook,
  FiMoon,
  FiSun
} from 'react-icons/fi';
import { 
  MdOutlineMenuBook,
  MdOutlineLightbulb,
  MdOutlineDesignServices,
  MdOutlineIntegrationInstructions,
  MdOutlineScience,
  MdOutlineQuiz,
  MdOutlineTipsAndUpdates,
  MdOutlineInfo
} from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import GuideRayConceptOverview from '../GuideRayConceptOverview';
import GuideRayIntroduction from '../GuideRayIntroduction';
import GuideRayUseCases from '../GuideRayUseCases';
import GuideRayApplications from '../GuideRayApplications';
import GuideRayWorkflowModel from '../GuideRayWorkflowModel';
import GuideRayExample from '../GuideRayExample';
import GuideRayPractice from '../GuideRayPractice';
import GuideRayTips from '../GuideRayTips';
import PythonData from '../../CourceData/python_data.json';
import './index.css';

const GuideRayTopicIntroPage = ({ darkMode, toggleTheme }) => {
  const location = useLocation();
  const coursePath = location.state?.path;
  const courseDataMap = {
    PythonData
  };

  const data = courseDataMap[coursePath];
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMainTopic, setActiveMainTopic] = useState(null);
  const [activeSubTopic, setActiveSubTopic] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [subMenuOpen, setSubMenuOpen] = useState(null);
  const [error, setError] = useState(null);

  // Refs for scrolling
  const sectionRefs = {
    conceptOverview: useRef(null),
    introduction: useRef(null),
    useCases: useRef(null),
    applications: useRef(null),
    workflowModel: useRef(null),
    example: useRef(null),
    practice: useRef(null),
    additionalTips: useRef(null)
  };

  // Set initial content when component mounts
  useEffect(() => {
    try {
      const mainTopics = Object.keys(data);
      if (mainTopics.length > 0) {
        const firstMainTopic = mainTopics[0];
        const subTopics = Object.keys(data[firstMainTopic]);
        if (subTopics.length > 0) {
          const firstSubTopic = subTopics[0];
          const sections = Object.keys(data[firstMainTopic][firstSubTopic]);
          if (sections.length > 0) {
            setActiveMainTopic(firstMainTopic);
            setActiveSubTopic(firstSubTopic);
            setActiveSection(sections[0]);
            setSubMenuOpen(firstMainTopic);
            
            // Scroll to top of the page initially
            window.scrollTo(0, 0);
          }
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }, [data]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (subMenuOpen && !sidebarOpen) setSubMenuOpen(null);
  };

  const toggleSubMenu = (topic) => {
    setSubMenuOpen(subMenuOpen === topic ? null : topic);
  };

  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const mainTopicKeys = Object.keys(data);
  const subTopicKeys = activeMainTopic ? Object.keys(data[activeMainTopic]) : [];

  const sectionIcons = {
    conceptOverview: <MdOutlineMenuBook className="guideray-topic-intro-icon-concept" />,
    introduction: <MdOutlineInfo className="guideray-topic-intro-icon-intro" />,
    useCases: <MdOutlineLightbulb className="guideray-topic-intro-icon-usecase" />,
    applications: <MdOutlineDesignServices className="guideray-topic-intro-icon-app" />,
    workflowModel: <MdOutlineIntegrationInstructions className="guideray-topic-intro-icon-workflow" />,
    example: <MdOutlineScience className="guideray-topic-intro-icon-example" />,
    practice: <MdOutlineQuiz className="guideray-topic-intro-icon-practice" />,
    additionalTips: <MdOutlineTipsAndUpdates className="guideray-topic-intro-icon-tips" />
  };

  const formatSectionName = (section) => {
    return section
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace('Additional Tips', 'Tips & Tricks');
  };

  const renderSection = (sectionKey) => {
    if (!activeSubTopic) return null;
    
    const currentTopicData = data[activeMainTopic][activeSubTopic];
    if (!currentTopicData || !currentTopicData[sectionKey]) return null;

    const components = {
      conceptOverview: <GuideRayConceptOverview data={currentTopicData.conceptOverview} darkMode={darkMode} />,
      introduction: <GuideRayIntroduction data={currentTopicData.introduction} darkMode={darkMode} />,
      useCases: <GuideRayUseCases data={currentTopicData.useCases} darkMode={darkMode} />,
      applications: <GuideRayApplications data={currentTopicData.applications} darkMode={darkMode} />,
      workflowModel: <GuideRayWorkflowModel data={currentTopicData.workflowModel} darkMode={darkMode} />,
      example: <GuideRayExample data={currentTopicData.example} darkMode={darkMode} />,
      practice: <GuideRayPractice data={currentTopicData.practice} darkMode={darkMode} />,
      additionalTips: <GuideRayTips data={currentTopicData.additionalTips} darkMode={darkMode} />
    };

    return (
      <div ref={sectionRefs[sectionKey]} className="guideray-topic-intro-content-section">
        {components[sectionKey]}
      </div>
    );
  };

  const handleMainTopicClick = (topic) => {
    setActiveMainTopic(topic);
    const subTopics = Object.keys(data[topic]);
    if (subTopics.length > 0) {
      setActiveSubTopic(subTopics[0]);
      const sections = Object.keys(data[topic][subTopics[0]]);
      if (sections.length > 0) {
        setActiveSection(sections[0]);
        setTimeout(() => {
          scrollToRef(sectionRefs[sections[0]]);
        }, 100);
      }
    } else {
      setActiveSubTopic(null);
      setActiveSection(null);
    }
    setSubMenuOpen(subMenuOpen === topic ? null : topic);
  };

  const handleSubTopicClick = (subTopic) => {
    setActiveSubTopic(subTopic);
    const sections = Object.keys(data[activeMainTopic][subTopic]);
    if (sections.length > 0) {
      setActiveSection(sections[0]);
      setTimeout(() => {
        scrollToRef(sectionRefs[sections[0]]);
      }, 100);
    } else {
      setActiveSection(null);
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setTimeout(() => {
      scrollToRef(sectionRefs[section]);
    }, 100);
  };

  const getSectionsForSubTopic = (subTopic) => {
    if (!activeMainTopic || !subTopic) return [];
    return Object.keys(data[activeMainTopic][subTopic]);
  };

  return (
    <div className={`guideray-topic-intro-container ${darkMode ? 'guideray-topic-intro-dark-mode' : 'guideray-topic-intro-light-mode'}`}>
      <button 
        className={`guideray-topic-intro-sidebar-toggle ${darkMode ? 'guideray-topic-intro-dark' : 'guideray-topic-intro-light'}`}
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
      </button>

      <div className={`guideray-topic-intro-sidebar ${sidebarOpen ? 'guideray-topic-intro-open' : 'guideray-topic-intro-closed'} ${darkMode ? 'guideray-topic-intro-dark' : 'guideray-topic-intro-light'}`}>
        <div className="guideray-topic-intro-sidebar-header">
          <div className="guideray-topic-intro-sidebar-header-content">
            <h3>Learning Topics</h3>
          </div>
        </div>
        <div className="guideray-topic-intro-sidebar-scroll-container">
          <ul className="guideray-topic-intro-sidebar-list">
            {mainTopicKeys.map((topicKey) => (
              <React.Fragment key={topicKey}>
                <li 
                  className={`guideray-topic-intro-sidebar-item ${activeMainTopic === topicKey ? 'guideray-topic-intro-active' : ''} ${darkMode ? 'guideray-topic-intro-dark' : 'guideray-topic-intro-light'}`}
                  onClick={() => handleMainTopicClick(topicKey)}
                >
                  <div className="guideray-topic-intro-sidebar-item-content">
                    <span className="guideray-topic-intro-topic-name">{topicKey}</span>
                    <span className="guideray-topic-intro-chevron-icon">
                      {subMenuOpen === topicKey ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </span>
                  </div>
                </li>
                
                {activeMainTopic === topicKey && (
                  <div 
                    className={`guideray-topic-intro-submenu-container ${darkMode ? 'guideray-topic-intro-dark' : 'guideray-topic-intro-light'} ${subMenuOpen === topicKey ? 'guideray-topic-intro-open' : ''}`}
                  >
                    {subTopicKeys.map((subTopic) => (
                      <React.Fragment key={subTopic}>
                        <li 
                          className={`guideray-topic-intro-submenu-item ${activeSubTopic === subTopic ? 'guideray-topic-intro-active-sub' : ''} ${darkMode ? 'guideray-topic-intro-dark' : 'guideray-topic-intro-light'}`}
                          onClick={() => handleSubTopicClick(subTopic)}
                        >
                          <div className="guideray-topic-intro-submenu-item-content">
                            <span className="guideray-topic-intro-submenu-text">{subTopic}</span>
                            {activeSubTopic === subTopic && (
                              <span className="guideray-topic-intro-chevron-icon">
                                <FiChevronDown size={16} />
                              </span>
                            )}
                          </div>
                        </li>
                        
                        {activeSubTopic === subTopic && (
                          <div className={`guideray-topic-intro-section-container ${darkMode ? 'guideray-topic-intro-dark' : 'guideray-topic-intro-light'} guideray-topic-intro-open`}>
                            {getSectionsForSubTopic(subTopic).map((section) => (
                              <li
                                key={section}
                                className={`guideray-topic-intro-section-item ${activeSection === section ? 'guideray-topic-intro-active-section' : ''} ${darkMode ? 'guideray-topic-intro-dark' : 'guideray-topic-intro-light'}`}
                                onClick={() => handleSectionClick(section)}
                              >
                                <div className="guideray-topic-intro-section-item-content">
                                  {sectionIcons[section]}
                                  <span className="guideray-topic-intro-section-text">{formatSectionName(section)}</span>
                                </div>
                              </li>
                            ))}
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>

      <div className={`guideray-topic-intro-content ${sidebarOpen ? 'guideray-topic-intro-with-sidebar' : 'guideray-topic-intro-full-width'} ${darkMode ? 'guideray-topic-intro-dark' : 'guideray-topic-intro-light'}`}>
        {error ? (
          <div className="guideray-topic-intro-error-message">
            <p>Error loading course data: {error}</p>
            <p>Showing default content instead.</p>
          </div>
        ) : (
          <>
            {activeMainTopic && activeSubTopic && data[activeMainTopic][activeSubTopic] && (
              <>
                <div className="guideray-topic-intro-content-header">
                  <h2>{activeMainTopic}</h2>
                  <h3>{activeSubTopic}</h3>
                </div>
                
                <div className="guideray-topic-intro-section-nav">
                  {Object.keys(data[activeMainTopic][activeSubTopic]).map((section) => (
                    <button
                      key={section}
                      className={`guideray-topic-intro-section-nav-btn ${activeSection === section ? 'guideray-topic-intro-active-nav-btn' : ''} ${darkMode ? 'guideray-topic-intro-dark' : 'guideray-topic-intro-light'}`}
                      onClick={() => handleSectionClick(section)}
                    >
                      {sectionIcons[section]}
                      {formatSectionName(section)}
                    </button>
                  ))}
                </div>

                <div className="guideray-topic-intro-content-scroll-container">
                  {renderSection('conceptOverview')}
                  {renderSection('introduction')}
                  {renderSection('useCases')}
                  {renderSection('applications')}
                  {renderSection('workflowModel')}
                  {renderSection('example')}
                  {renderSection('practice')}
                  {renderSection('additionalTips')}
                </div>
              </>
            )}
          </>
        )}
        
        <button 
          className={`guideray-topic-intro-scroll-to-top-btn ${darkMode ? 'guideray-topic-intro-dark' : 'guideray-topic-intro-light'}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <FiArrowUp size={20} />
        </button>
      </div>
    </div>
  );
};

export default GuideRayTopicIntroPage;