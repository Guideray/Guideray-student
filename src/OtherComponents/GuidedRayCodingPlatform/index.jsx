import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './index.css';
import Editor from '@monaco-editor/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiAlertCircle, 
  FiCheckCircle, 
  FiXCircle, 
  FiPlay, 
  FiBook, 
  FiMessageSquare,
  FiFile,
  FiEdit2,
  FiHelpCircle,
  FiMail,
  FiTerminal,
  FiEyeOff,
  FiPlus,
  FiMinus,
  FiX,
  FiAward,
  FiBarChart2,
  FiTrendingUp
} from 'react-icons/fi';

const GuidedRayCodingPlatform = ({ darkMode }) => {
  const location = useLocation();
  const problems = location.state || {};
  
  const {
    topicIndex,
    courseId,
    studentId,
    studentName,
    topic,
    concept
  } = problems;
  const navigate = useNavigate();

  // State for coding environment
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [fileName, setFileName] = useState('main');
  const [error, setError] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(40);
  const [isResizing, setIsResizing] = useState(false);
  const [activeTab, setActiveTab] = useState('problem');
  const [inputMode, setInputMode] = useState('auto');
  const [testResults, setTestResults] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOutputPopup, setShowOutputPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [userProgress, setUserProgress] = useState(null);
  
  const editorRef = useRef(null);
  const problemSectionRef = useRef(null);
  const outputPopupRef = useRef(null);
  const statusModalRef = useRef(null);
  
  const [currentProblem, setCurrentProblem] = useState(0);

  // Supported languages with templates
  const languageData = {
    python: {
      template: `# ${problems.problems?.[currentProblem]?.title || 'Problem'}\n# Sample input: ${problems.problems?.[currentProblem]?.sampleInput || ''}`,
      extension: 'py'
    },
    javascript: {
      template: `// ${problems.problems?.[currentProblem]?.title || 'Problem'}\n// Sample input: ${problems.problems?.[currentProblem]?.sampleInput || ''}`,
      extension: 'js'
    },
    java: {
      template: `public class Main {\n    public static void main(String[] args) {\n        // ${problems.problems?.[currentProblem]?.title || 'Problem'}\n        // Sample input: ${problems.problems?.[currentProblem]?.sampleInput || ''}\n    }\n}`,
      extension: 'java'
    },
    c: {
      template: `#include <stdio.h>\n\nint main() {\n    // ${problems.problems?.[currentProblem]?.title || 'Problem'}\n    // Sample input: ${problems.problems?.[currentProblem]?.sampleInput || ''}\n    return 0;\n}`,
      extension: 'c'
    },
    cpp: {
      template: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // ${problems.problems?.[currentProblem]?.title || 'Problem'}\n    // Sample input: ${problems.problems?.[currentProblem]?.sampleInput || ''}\n    return 0;\n}`,
      extension: 'cpp'
    },
    kotlin: {
      template: `fun main() {\n    // ${problems.problems?.[currentProblem]?.title || 'Problem'}\n    // Sample input: ${problems.problems?.[currentProblem]?.sampleInput || ''}\n}`,
      extension: 'kt'
    },
    sqlite3: {
      template: `-- ${problems.problems?.[currentProblem]?.title || 'Problem'}\n-- Sample input: ${problems.problems?.[currentProblem]?.sampleInput || ''}`,
      extension: 'sql'
    }
  };

  function getDefaultCode(problemId) {
    switch(problemId) {
      case 1: // Sum of Two Numbers
        return selectedLanguage === 'python' ? 
          `num1, num2 = map(int, input().split())\nprint(num1 + num2)` :
          selectedLanguage === 'javascript' ?
          `const [a, b] = readline().split(' ').map(Number);\nconsole.log(a + b);` :
          selectedLanguage === 'java' ?
          `Scanner sc = new Scanner(System.in);\nint a = sc.nextInt();\nint b = sc.nextInt();\nSystem.out.println(a + b);` :
          selectedLanguage === 'c' ?
          `int a, b;\nscanf("%d %d", &a, &b);\nprintf("%d", a + b);` :
          selectedLanguage === 'cpp' ?
          `int a, b;\ncin >> a >> b;\ncout << a + b;` :
          selectedLanguage === 'kotlin' ?
          `val (a, b) = readLine()!!.split(" ").map { it.toInt() }\nprintln(a + b)` :
          `-- SQLite doesn't support standard input like this\n-- This problem requires an imperative language`;
      
      case 2: // Factorial
        return selectedLanguage === 'python' ?
          `n = int(input())\nfact = 1\nfor i in range(1, n+1):\n    fact *= i\nprint(fact)` :
          selectedLanguage === 'javascript' ?
          `let n = parseInt(readline());\nlet fact = 1;\nfor(let i = 1; i <= n; i++) fact *= i;\nconsole.log(fact);` :
          selectedLanguage === 'java' ?
          `Scanner sc = new Scanner(System.in);\nint n = sc.nextInt();\nint fact = 1;\nfor(int i = 1; i <= n; i++) fact *= i;\nSystem.out.println(fact);` :
          selectedLanguage === 'c' ?
          `int n, fact = 1;\nscanf("%d", &n);\nfor(int i = 1; i <= n; i++) fact *= i;\nprintf("%d", fact);` :
          selectedLanguage === 'cpp' ?
          `int n, fact = 1;\ncin >> n;\nfor(int i = 1; i <= n; i++) fact *= i;\ncout << fact;` :
          selectedLanguage === 'kotlin' ?
          `val n = readLine()!!.toInt()\nvar fact = 1\nfor (i in 1..n) fact *= i\nprintln(fact)` :
          `-- SQLite doesn't support loops like this\n-- This problem requires an imperative language`;
      
      case 3: // Fibonacci
        return selectedLanguage === 'python' ?
          `n = int(input())\na, b = 0, 1\nfor _ in range(n):\n    print(a, end=' ')\n    a, b = b, a + b` :
          selectedLanguage === 'javascript' ?
          `let n = parseInt(readline());\nlet a = 0, b = 1;\nlet res = [];\nfor(let i = 0; i < n; i++) {\n    res.push(a);\n    [a, b] = [b, a + b];\n}\nconsole.log(res.join(' '));` :
          selectedLanguage === 'java' ?
          `Scanner sc = new Scanner(System.in);\nint n = sc.nextInt();\nint a = 0, b = 1;\nfor(int i = 0; i < n; i++) {\n    System.out.print(a + " ");\n    int temp = a;\n    a = b;\n    b = temp + b;\n}` :
          selectedLanguage === 'c' ?
          `int n, a = 0, b = 1;\nscanf("%d", &n);\nfor(int i = 0; i < n; i++) {\n    printf("%d ", a);\n    int temp = a;\n    a = b;\n    b = temp + b;\n}` :
          selectedLanguage === 'cpp' ?
          `int n, a = 0, b = 1;\ncin >> n;\nfor(int i = 0; i < n; i++) {\n    cout << a << " ";\n    int temp = a;\n    a = b;\n    b = temp + b;\n}` :
          selectedLanguage === 'kotlin' ?
          `val n = readLine()!!.toInt()\nvar a = 0\nvar b = 1\nfor (i in 1..n) {\n    print("$a ")\n    val temp = a\n    a = b\n    b += temp\n}` :
          `-- SQLite doesn't support loops like this\n-- This problem requires an imperative language`;
      
      default:
        return selectedLanguage === 'python' ? 'print("Hello World!")' :
               selectedLanguage === 'javascript' ? 'console.log("Hello World!")' :
               selectedLanguage === 'java' ? 'System.out.println("Hello World!");' :
               selectedLanguage === 'c' ? 'printf("Hello World!\\n");' :
               selectedLanguage === 'cpp' ? 'cout << "Hello World!" << endl;' :
               selectedLanguage === 'kotlin' ? 'println("Hello World!")' :
               'SELECT "Hello World!";';
    }
  }

  // Fetch available languages and versions
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://emkc.org/api/v2/piston/runtimes');
        
        // Filter to only include our supported languages
        const supportedLanguages = ['python', 'javascript', 'java', 'c', 'cpp', 'kotlin', 'sqlite'];
        const filteredLanguages = response.data.filter(lang => supportedLanguages.includes(lang.language));
        
        setLanguages(filteredLanguages || []);
        setError(null);
        
        if (filteredLanguages && filteredLanguages.length > 0) {
          const lang = filteredLanguages.find(l => l.language === selectedLanguage);
          if (lang) setSelectedVersion(lang.version);
        }
      } catch (err) {
        setError('Failed to load languages. Please try again later.');
        setLanguages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  // Fetch user progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const response = await axios.get(`https://webservice.guideray.in/api/consistancy/progress/${studentId}/${courseId}`);
        setUserProgress(response.data.data);
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };
    
    if (studentId && courseId) {
      fetchUserProgress();
    }
  }, [studentId, courseId]);

  // Update code template when language or problem changes
  useEffect(() => {
    if (selectedLanguage && languageData[selectedLanguage]) {
      setCode(languageData[selectedLanguage].template);
      
      const lang = languages.find(l => l.language === selectedLanguage);
      if (lang) setSelectedVersion(lang.version);
      
      setFileName(selectedLanguage === 'java' ? 'Main' : 'main');
    }
  }, [selectedLanguage, languages, currentProblem]);

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Define custom themes
    monaco.editor.defineTheme('guidedray-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '#569CD6', fontStyle: 'bold' },
        { token: 'type', foreground: '#4EC9B0' },
        { token: 'string', foreground: '#CE9178' },
        { token: 'number', foreground: '#B5CEA8' },
        { token: 'comment', foreground: '#6A9955' },
        { token: 'identifier', foreground: '#9CDCFE' },
        { token: 'delimiter', foreground: '#D4D4D4' },
        { token: 'operator', foreground: '#D4D4D4' }
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': 'rgba(108, 92, 231, 0.15)',
        'editorLineNumber.foreground': '#1E1E1E',
        'editorGutter.background': '#1E1E1E',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorCursor.foreground': '#A6A6A6',
        'editorWhitespace.foreground': '#404040',
        'editor.lineHighlightBorder': 'rgba(108, 92, 231, 0.3)'
      }
    });
    
    monaco.editor.defineTheme('guidedray-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '#0000FF', fontStyle: 'bold' },
        { token: 'type', foreground: '#267F99' },
        { token: 'string', foreground: '#A31515' },
        { token: 'number', foreground: '#098658' },
        { token: 'comment', foreground: '#008000' },
        { token: 'identifier', foreground: '#001080' },
        { token: 'delimiter', foreground: '#000000' },
        { token: 'operator', foreground: '#000000' }
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#333333',
        'editor.lineHighlightBackground': 'rgba(108, 92, 231, 0.1)',
        'editorLineNumber.foreground': '#F5F6FA',
        'editorGutter.background': '#F5F6FA',
        'editor.selectionBackground': '#ADD6FF',
        'editor.inactiveSelectionBackground': '#E5EBF1',
        'editorCursor.foreground': '#333333',
        'editorWhitespace.foreground': '#B3B3B3',
        'editor.lineHighlightBorder': 'rgba(108, 92, 231, 0.2)'
      }
    });
    
    // Set the theme based on current mode
    monaco.editor.setTheme(darkMode ? 'guidedray-dark' : 'guidedray-light');
    
    // Configure editor settings
    editor.updateOptions({
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoIndent: 'full',
      automaticLayout: true,
      codeLens: true,
      colorDecorators: true,
      contextmenu: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: true,
      cursorStyle: 'line',
      dragAndDrop: true,
      folding: true,
      fontLigatures: false,
      formatOnPaste: true,
      formatOnType: true,
      highlightActiveIndentGuide: true,
      links: true,
      minimap: { enabled: true },
      mouseWheelZoom: true,
      multiCursorModifier: 'alt',
      quickSuggestions: true,
      renderWhitespace: 'selection',
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      suggestOnTriggerCharacters: true,
      wordBasedSuggestions: true,
      wordWrap: 'on',
      fontSize: fontSize,
      lineNumbersMinChars: 3,
      renderLineHighlight: 'all',
      overviewRulerBorder: false
    });
  };

  // Execute code with input
  const executeCode = async () => {
    if (!selectedLanguage || !selectedVersion) {
      setOutput('Please select a language and version');
      setPopupTitle('Run Output');
      setShowOutputPopup(true);
      return;
    }

    setIsLoading(true);
    setOutput('Executing...\n');
    setTestResults([]);
    setPopupTitle('Run Output');
    
    try {
      const fileExtension = languageData[selectedLanguage].extension;
      const files = [{
        name: fileName + '.' + fileExtension,
        content: code
      }];

      // Determine the input to use
      const inputToUse = inputMode === 'custom' ? userInput : problems.problems[currentProblem].sampleInput;

      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: selectedLanguage,
        version: selectedVersion,
        files: files,
        stdin: inputToUse
      });

      // Handle compilation errors and runtime errors
      if (response.data.compile && response.data.compile.stderr) {
        setOutput(`Compilation Error:\n${response.data.compile.stderr}`);
      } else if (response.data.run && response.data.run.stderr) {
        setOutput(`Runtime Error:\n${response.data.run.stderr}`);
      } else {
        setOutput(response.data?.run?.output || 'No output');
      }
      
      setError(null);
      setShowOutputPopup(true);
    } catch (err) {
      setOutput(`Error: ${err.response?.data?.message || 'Failed to execute code'}`);
      setShowOutputPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Run test cases (only public ones)
  const runTestCases = async () => {
    if (!selectedLanguage || !selectedVersion) {
      setOutput('Please select a language and version');
      setPopupTitle('Test Results');
      setShowOutputPopup(true);
      return;
    }

    setIsRunningTests(true);
    setOutput('Running test cases...\n');
    setTestResults([]);
    setPopupTitle('Test Results');
    
    try {
      const fileExtension = languageData[selectedLanguage].extension;
      const files = [{
        name: fileName + '.' + fileExtension,
        content: code
      }];

      let allPassed = true;
      const results = [];

      // Run public test cases only
      for (const testCase of problems.problems[currentProblem].testCases.filter(t => t.isPublic)) {
        const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
          language: selectedLanguage,
          version: selectedVersion,
          files: files,
          stdin: testCase.input
        });

        // Handle errors
        if (response.data.compile && response.data.compile.stderr) {
          results.push({
            status: 'error',
            message: 'Compilation Error',
            error: response.data.compile.stderr
          });
          allPassed = false;
          continue;
        } else if (response.data.run && response.data.run.stderr) {
          results.push({
            status: 'error',
            message: 'Runtime Error',
            error: response.data.run.stderr
          });
          allPassed = false;
          continue;
        }

        const actualOutput = (response.data?.run?.output || '').trim();
        const expectedOutput = testCase.output.trim();
        const passed = actualOutput === expectedOutput;

        results.push({
          status: passed ? 'passed' : 'failed',
          testCase: testCase,
          actualOutput: actualOutput,
          expectedOutput: expectedOutput
        });

        if (!passed) allPassed = false;
      }

      setTestResults(results);
      setOutput(allPassed ? 
        '🎉 All public test cases passed!' : 
        'Some test cases failed. Please check your code.');
      
      setError(null);
      setShowOutputPopup(true);
    } catch (err) {
      setOutput(`Error: ${err.response?.data?.message || 'Failed to execute test cases'}`);
      setShowOutputPopup(true);
    } finally {
      setIsRunningTests(false);
    }
  };

  // Submit code (run all test cases including private ones)
  const submitCode = async () => {
    if (!selectedLanguage || !selectedVersion) {
      setOutput('Please select a language and version');
      setPopupTitle('Submission Results');
      setShowOutputPopup(true);
      return;
    }

    setIsSubmitting(true);
    setOutput('Running all test cases...\n');
    setTestResults([]);
    setPopupTitle('Submission Results');
    
    try {
      const fileExtension = languageData[selectedLanguage].extension;
      const files = [{
        name: fileName + '.' + fileExtension,
        content: code
      }];

      let passedCount = 0;
      const results = [];
      const totalTests = problems.problems[currentProblem].testCases.length;

      // Run all test cases
      for (const testCase of problems.problems[currentProblem].testCases) {
        const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
          language: selectedLanguage,
          version: selectedVersion,
          files: files,
          stdin: testCase.input
        });

        // Handle errors
        if (response.data.compile && response.data.compile.stderr) {
          results.push({
            status: 'error',
            message: 'Compilation Error',
            error: response.data.compile.stderr,
            isPublic: testCase.isPublic
          });
          continue;
        } else if (response.data.run && response.data.run.stderr) {
          results.push({
            status: 'error',
            message: 'Runtime Error',
            error: response.data.run.stderr,
            isPublic: testCase.isPublic
          });
          continue;
        }

        const actualOutput = (response.data?.run?.output || '').trim();
        const expectedOutput = testCase.output.trim();
        const passed = actualOutput === expectedOutput;

        results.push({
          status: passed ? 'passed' : 'failed',
          testCase: testCase,
          actualOutput: actualOutput,
          expectedOutput: expectedOutput,
          isPublic: testCase.isPublic
        });

        if (passed) passedCount++;
      }

      setTestResults(results);
      
      const percentage = Math.round((passedCount / totalTests) * 100);
      setCompletionPercentage(percentage);
      const allPassed = percentage === 100;
      
      setOutput(allPassed ? 
        '🎉 All test cases passed! Your solution is correct!' : 
        percentage >= 70 ?
        `Good job! You passed ${percentage}% of test cases. Keep practicing to reach 100%!` :
        `Your answer didn't meet the requirements (${percentage}% passed). Please try again.`);
      
      setError(null);
      setShowOutputPopup(true);
      
      // Show status modal based on results
      if (percentage >= 70) {
        if (percentage === 100) {
          setStatusMessage('Perfect! All test cases passed!');
          setStatusType('success');
        } else {
          setStatusMessage(`Good job! You passed ${percentage}% of test cases. Keep practicing to reach 100%!`);
          setStatusType('partial');
        }
        setShowStatusModal(true);
        
        // Update progress if needed
        await updateProgress(percentage);
      } else {
        setStatusMessage(`Your answer didn't meet the requirements (${percentage}% passed). Please try again or review the course material.`);
        setStatusType('fail');
        setShowStatusModal(true);
      }
    } catch (err) {
      setOutput(`Error: ${err.response?.data?.message || 'Failed to submit code'}`);
      setShowOutputPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update user progress with correct problem ID
  const updateProgress = async (percentage) => {
    if (!studentId || !courseId) return;
    
    try {
      const questionId = problems.problems[currentProblem].id; // Use the actual problem ID
      
      // Check if we need to update based on existing progress
      let shouldUpdate = true;
      
      if (userProgress && userProgress.cp && userProgress.cp.length > 0) {
        const courseProgress = userProgress.cp.find(cp => cp.n === courseId);
        if (courseProgress && courseProgress.t && courseProgress.t.length > topicIndex) {
          const topicProgress = courseProgress.t[topicIndex];
          if (topicProgress.cq) {
            const existingQuestion = topicProgress.cq.find(q => q.q === questionId);
            if (existingQuestion && existingQuestion.p >= percentage) {
              shouldUpdate = false;
            }
          }
        }
      }
      
      if (shouldUpdate) {
        const payload = {
          courseName: courseId,
          topicIndex: topicIndex,
          completionType: "coding",
          codingQuestion: {
            q: questionId, // Use the actual problem ID
            p: percentage
          }
        };
        
        await axios.post(`https://webservice.guideray.in/api/consistancy/progress/${studentId}`, payload);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Change problem
  const changeProblem = (index) => {
    setCurrentProblem(index);
    setTestResults([]);
    setOutput('');
    if (problemSectionRef.current) {
      problemSectionRef.current.scrollTo(0, 0);
    }
  };

  // Resize handlers
  const startResizing = (e) => {
    setIsResizing(true);
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResizing);
  };

  const handleResize = (e) => {
    const containerWidth = document.querySelector('.guidedray-coding-platform-container').offsetWidth;
    const newWidth = (e.clientX / containerWidth) * 100;
    setSidebarWidth(Math.min(Math.max(30, newWidth), 60)); // Limit between 30% and 60%
  };

  const stopResizing = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResizing);
  };

  // Handle editor theme change when darkMode changes
  useEffect(() => {
    if (editorRef.current) {
      const theme = darkMode ? 'guidedray-dark' : 'guidedray-light';
      editorRef.current.updateOptions({ theme });
    }
  }, [darkMode]);

  // Handle font size change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: fontSize });
    }
  }, [fontSize]);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (outputPopupRef.current && !outputPopupRef.current.contains(event.target)) {
        setShowOutputPopup(false);
      }
      if (statusModalRef.current && !statusModalRef.current.contains(event.target)) {
        setShowStatusModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`guidedray-coding-platform-container ${darkMode ? 'dark' : ''}`}>
      <div className="guidedray-coding-platform">
        {error && (
          <div className="guidedray-coding-platform-error">
            <FiAlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="guidedray-coding-platform-main">
          {/* Problem Section */}
          <aside 
            className="guidedray-coding-platform-problem-section"
            style={{ width: `${sidebarWidth}%` }}
            ref={problemSectionRef}
          >
            <div className="guidedray-coding-platform-problem-selector">
              {problems.problems?.map((problem, index) => (
                <button
                  key={problem.id}
                  className={`guidedray-coding-platform-problem-tab ${currentProblem === index ? 'active' : ''}`}
                  onClick={() => changeProblem(index)}
                >
                  <span className="problem-title">{problem.title}</span>
                  <span className={`difficulty-badge difficulty-${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>
                </button>
              ))}
            </div>

            <div className="guidedray-coding-platform-problem-content">
              <div className="problem-header">
                <h2>{problems.problems?.[currentProblem]?.title}</h2>
                <div className="problem-meta">
                  <span className="problem-id">Problem ID: {problems.problems?.[currentProblem]?.id}</span>
                  {problems.problems?.[currentProblem]?.difficulty && (
                    <span className={`problem-difficulty difficulty-${problems.problems[currentProblem].difficulty.toLowerCase()}`}>
                      {problems.problems[currentProblem].difficulty}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="problem-tabs">
                <button 
                  className={`problem-tab ${activeTab === 'problem' ? 'active' : ''}`}
                  onClick={() => setActiveTab('problem')}
                >
                  <FiBook size={16} />
                  Problem
                </button>
                <button 
                  className={`problem-tab ${activeTab === 'submissions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('submissions')}
                >
                  <FiFile size={16} />
                  Submissions
                </button>
                <button 
                  className={`problem-tab ${activeTab === 'discuss' ? 'active' : ''}`}
                  onClick={() => setActiveTab('discuss')}
                >
                  <FiMessageSquare size={16} />
                  Discuss
                </button>
              </div>

              {activeTab === 'problem' && (
                <div className="guidedray-coding-platform-problem-description">
                  <p>{problems.problems?.[currentProblem]?.description}</p>
                  
                  <h3>Constraints</h3>
                  <ul className="guidedray-coding-platform-constraints">
                    {problems.problems?.[currentProblem]?.constraints?.map((constraint, index) => (
                      <li key={index}>
                        <FiAlertCircle size={14} />
                        {constraint}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="io-section">
                    <div className="io-block">
                      <h3>Sample Input</h3>
                      <div className="guidedray-coding-platform-code-block">
                        <pre>{problems.problems?.[currentProblem]?.sampleInput}</pre>
                      </div>
                    </div>
                    
                    <div className="io-block">
                      <h3>Sample Output</h3>
                      <div className="guidedray-coding-platform-code-block">
                        <pre>{problems.problems?.[currentProblem]?.sampleOutput}</pre>
                      </div>
                    </div>
                  </div>
                  
                  <h3>Explanation</h3>
                  <p>{problems.problems?.[currentProblem]?.explanation}</p>
                </div>
              )}

              {activeTab === 'submissions' && (
                <div className="submissions-placeholder">
                  <div className="submissions-icon">
                    <FiFile size={64} />
                  </div>
                  <h3>Your Submissions</h3>
                  <p>No submissions yet. Solve the problem to see your submissions here.</p>
                </div>
              )}

              {activeTab === 'discuss' && (
                <div className="discuss-placeholder">
                  <div className="discuss-icon">
                    <FiMessageSquare size={64} />
                  </div>
                  <h3>Discussion</h3>
                  <p>Join the discussion to ask questions or share your approach.</p>
                </div>
              )}
            </div>
          </aside>

          {/* Resize handle */}
          <div 
            className="guidedray-coding-platform-resize-handle"
            onMouseDown={startResizing}
          ></div>

          {/* Coding Section */}
          <main 
            className="guidedray-coding-platform-coding-section"
            style={{ width: `${100 - sidebarWidth}%` }}
          >
            <div className="guidedray-coding-platform-editor-wrapper">
              <div className="guidedray-coding-platform-editor-header">
                <div className="file-info">
                  <span className="guidedray-coding-platform-file-name">
                    {fileName}.{languageData[selectedLanguage]?.extension}
                  </span>
                  <span className="language-version">
                    {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} {selectedVersion}
                  </span>
                </div>
                
                <div className="guidedray-coding-platform-action-buttons">
                  <div className="guidedray-coding-platform-controls">
                    <select 
                      value={selectedLanguage} 
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="guidedray-coding-platform-language-selector"
                      disabled={isLoading}
                    >
                      {['python', 'javascript', 'java', 'c', 'cpp', 'kotlin', 'sqlite'].map((lang) => (
                        <option key={lang} value={lang}>
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </option>
                      ))}
                    </select>
                    
                    <div className="font-size-control">
                      <button 
                        onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                        disabled={fontSize <= 12}
                        className="font-size-btn"
                      >
                        <FiMinus size={12} />
                      </button>
                      <span className="font-size-display">{fontSize}px</span>
                      <button 
                        onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                        disabled={fontSize >= 24}
                        className="font-size-btn"
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="action-buttons">
                    <button 
                      onClick={executeCode} 
                      disabled={isLoading}
                      className="guidedray-coding-platform-run-button"
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner"></span>
                          Running...
                        </>
                      ) : (
                        <>
                          <FiPlay size={16} />
                          Run
                        </>
                      )}
                    </button>
                    <button 
                      onClick={runTestCases} 
                      disabled={isLoading || isRunningTests}
                      className="guidedray-coding-platform-test-button"
                    >
                      {isRunningTests ? (
                        <>
                          <span className="spinner"></span>
                          Testing...
                        </>
                      ) : (
                        <>
                          <FiCheckCircle size={16} />
                          Test
                        </>
                      )}
                    </button>
                    <button 
                      onClick={submitCode} 
                      disabled={isLoading || isSubmitting}
                      className="guidedray-coding-platform-submit-button"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FiTerminal size={16} />
                          Submit
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="guidedray-coding-platform-editor-container">
                <Editor
                  height="100%"
                  language={selectedLanguage}
                  value={code}
                  onChange={(value) => setCode(value)}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize: fontSize,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    lineNumbers: 'on',
                    roundedSelection: true,
                    scrollbar: {
                      vertical: 'auto',
                      horizontal: 'auto',
                    },
                    theme: darkMode ? 'guidedray-dark' : 'guidedray-light',
                    wordWrap: 'on',
                    renderWhitespace: 'selection',
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    formatOnPaste: true,
                    formatOnType: true
                  }}
                />
              </div>
            </div>

            <div className="guidedray-coding-platform-input-section">
              <div className="guidedray-coding-platform-input-header">
                <h3>Input Mode</h3>
                <div className="input-mode-selector">
                  <button
                    className={`input-mode-btn ${inputMode === 'auto' ? 'active' : ''}`}
                    onClick={() => setInputMode('auto')}
                  >
                    <FiCheckCircle size={14} />
                    Auto (Sample Input)
                  </button>
                  <button
                    className={`input-mode-btn ${inputMode === 'custom' ? 'active' : ''}`}
                    onClick={() => setInputMode('custom')}
                  >
                    <FiEdit2 size={14} />
                    Custom Input
                  </button>
                </div>
              </div>
              {inputMode === 'custom' && (
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="guidedray-coding-platform-input"
                  placeholder="Enter custom input here"
                  style={{ fontSize: `${fontSize - 2}px` }}
                  disabled={isLoading}
                />
              )}
            </div>
          </main>
        </div>

        {/* Output Popup */}
        {showOutputPopup && (
          <div className="guidedray-coding-platform-output-popup-overlay">
            <div 
              className="guidedray-coding-platform-output-popup"
              ref={outputPopupRef}
            >
              <div className="guidedray-coding-platform-output-popup-header">
                <h3>{popupTitle}</h3>
                <button 
                  onClick={() => setShowOutputPopup(false)}
                  className="guidedray-coding-platform-output-popup-close"
                >
                  <FiX size={16} />
                </button>
              </div>
              <div className="guidedray-coding-platform-output-popup-content">
                {/* Completion Percentage Meter - Only shown for submissions */}
                {popupTitle === 'Submission Results' && (
                  <div className="completion-meter-container">
                    <div className="completion-meter-header">
                      <FiBarChart2 size={20} />
                      <h4>Completion Percentage</h4>
                    </div>
                    <div className="completion-meter">
                      <div 
                        className="completion-meter-fill"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                      <div className="completion-meter-label">
                        {completionPercentage}%
                      </div>
                    </div>
                    <div className="completion-message">
                      {completionPercentage === 100 ? (
                        <div className="perfect-score">
                          <FiAward size={18} />
                          <span>Perfect score! All test cases passed!</span>
                        </div>
                      ) : completionPercentage >= 70 ? (
                        <div className="good-score">
                          <FiTrendingUp size={18} />
                          <span>Good job! Keep practicing to reach 100%!</span>
                        </div>
                      ) : (
                        <div className="improve-score">
                          <FiAlertCircle size={18} />
                          <span>Keep trying! Review the problem and try again.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {output && (
                  <pre 
                    className="guidedray-coding-platform-output" 
                    style={{ fontSize: `${fontSize - 2}px` }}
                  >
                    {output}
                  </pre>
                )}
                
                {testResults.length > 0 && (
                  <div className="test-results">
                    <div className="test-results-summary">
                      {testResults.filter(r => r.status === 'passed').length} passed,{' '}
                      {testResults.filter(r => r.status === 'failed').length} failed,{' '}
                      {testResults.filter(r => r.status === 'error').length} errors
                    </div>
                    
                    <div className="test-cases">
                      {testResults.map((result, index) => (
                        <div key={index} className={`test-case ${result.status}`}>
                          <div className="test-case-header">
                            <div className="test-case-status">
                              {result.status === 'passed' ? (
                                <FiCheckCircle size={16} />
                              ) : result.status === 'failed' ? (
                                <FiXCircle size={16} />
                              ) : (
                                <FiAlertCircle size={16} />
                              )}
                              Test Case {index + 1}
                            </div>
                            {!result.isPublic && (
                              <span className="test-case-visibility">
                                <FiEyeOff size={14} />
                                Hidden
                              </span>
                            )}
                          </div>
                          
                          <div className="test-case-details">
                            {result.status === 'error' ? (
                              <div className="test-case-error">
                                <div className="error-message">{result.message}</div>
                                <pre className="error-details">{result.error}</pre>
                              </div>
                            ) : (
                              <>
                                <div className="test-case-io">
                                  <div className="io-block">
                                    <div className="io-label">Input</div>
                                    <pre>{result.testCase.input}</pre>
                                  </div>
                                  <div className="io-block">
                                    <div className="io-label">Expected</div>
                                    <pre>{result.testCase.output}</pre>
                                  </div>
                                  <div className="io-block">
                                    <div className="io-label">Output</div>
                                    <pre>{result.actualOutput}</pre>
                                  </div>
                                </div>
                                {result.status === 'failed' && (
                                  <div className="test-case-failure">
                                    <FiAlertCircle size={16} />
                                    Output does not match expected result
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Status Modal */}
        {showStatusModal && (
          <div className="guidedray-coding-platform-status-modal-overlay">
            <div 
              className={`guidedray-coding-platform-status-modal ${statusType}`}
              ref={statusModalRef}
            >
              <div className="status-modal-header">
                {statusType === 'success' ? (
                  <FiCheckCircle size={24} className="status-icon" />
                ) : statusType === 'partial' ? (
                  <FiAlertCircle size={24} className="status-icon" />
                ) : (
                  <FiXCircle size={24} className="status-icon" />
                )}
                <h3>
                  {statusType === 'success' ? 'Success!' : 
                   statusType === 'partial' ? 'Almost There!' : 'Try Again'}
                </h3>
              </div>
              <div className="status-modal-content">
                <p>{statusMessage}</p>
                {statusType === 'fail' && (
                  <div className="status-modal-actions">
                    <button 
                      className="try-again-button"
                      onClick={() => setShowStatusModal(false)}
                    >
                      Try Again
                    </button>
                    <button 
                      className="review-button"
                      onClick={() => navigate(`/video-courses/${courseId}`)}
                    >
                      Review Course
                    </button>
                  </div>
                )}
                {(statusType === 'success' || statusType === 'partial') && (
                  <button 
                    className="continue-button"
                    onClick={() => setShowStatusModal(false)}
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <footer className="guidedray-coding-platform-footer">
          <div className="footer-left">
            <div className="status-indicator">
              <span className="indicator-dot"></span>
              <span>Connected</span>
            </div>
            <span className="language-indicator">
              {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} {selectedVersion}
            </span>
          </div>
          <div className="footer-right">
            <p>© {new Date().getFullYear()} GuideRay Coding Platform | Powered by Piston API</p>
            <div className="guidedray-coding-platform-footer-links">
              <a href="#">
                <FiBook size={14} />
                Docs
              </a>
              <a href="#">
                <FiHelpCircle size={14} />
                Help
              </a>
              <a href="#">
                <FiMail size={14} />
                Feedback
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default GuidedRayCodingPlatform;