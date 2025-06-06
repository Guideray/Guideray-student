import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './index.css';
import Editor from '@monaco-editor/react';

const GuidedRayCodingPlatform = ({ darkMode }) => {
  // State for coding environment
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fileName, setFileName] = useState('main');
  const [error, setError] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(40);
  const [isResizing, setIsResizing] = useState(false);
  const [activeTab, setActiveTab] = useState('problem');
  const editorRef = useRef(null);
  const problemSectionRef = useRef(null);
  
  // Problem data from JSON
  const problems = {
    "problems": [
      {
        "id": 1,
        "title": "Sum of Two Numbers",
        "description": "Write a program that takes two numbers as input and prints their sum.",
        "difficulty": "Easy",
        "constraints": [
          "Input numbers will be between -1000 and 1000",
          "Time limit: 1 second",
          "Memory limit: 256 MB"
        ],
        "sampleInput": "5 7",
        "sampleOutput": "12",
        "explanation": "The sum of 5 and 7 is 12.",
        "testCases": [
          { "input": "3 4", "output": "7", "isPublic": true },
          { "input": "-2 8", "output": "6", "isPublic": true },
          { "input": "0 0", "output": "0", "isPublic": false },
          { "input": "1000 1000", "output": "2000", "isPublic": false }
        ]
      },
      {
        "id": 2,
        "title": "Factorial Calculation",
        "description": "Write a program to calculate the factorial of a given number. Factorial of n is the product of all positive integers less than or equal to n.",
        "difficulty": "Medium",
        "constraints": [
          "0 ≤ n ≤ 20",
          "Time limit: 1 second",
          "Memory limit: 256 MB"
        ],
        "sampleInput": "5",
        "sampleOutput": "120",
        "explanation": "5! = 5 × 4 × 3 × 2 × 1 = 120",
        "testCases": [
          { "input": "3", "output": "6", "isPublic": true },
          { "input": "6", "output": "720", "isPublic": true },
          { "input": "1", "output": "1", "isPublic": false },
          { "input": "20", "output": "2432902008176640000", "isPublic": false }
        ]
      },
      {
        "id": 3,
        "title": "Fibonacci Sequence",
        "description": "Write a program to print the first n numbers of the Fibonacci sequence. The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, starting from 0 and 1.",
        "difficulty": "Medium",
        "constraints": [
          "1 ≤ n ≤ 20",
          "Time limit: 1 second",
          "Memory limit: 256 MB"
        ],
        "sampleInput": "5",
        "sampleOutput": "0 1 1 2 3",
        "explanation": "The first 5 Fibonacci numbers are 0, 1, 1, 2, 3.",
        "testCases": [
          { "input": "3", "output": "0 1 1", "isPublic": true },
          { "input": "7", "output": "0 1 1 2 3 5 8", "isPublic": true },
          { "input": "1", "output": "0", "isPublic": false },
          { "input": "20", "output": "0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597 2584 4181", "isPublic": false }
        ]
      }
    ]
  };
  
  const [currentProblem, setCurrentProblem] = useState(0);

  // Language-specific code templates
  const languageData = {
    python: {
      template: `# ${problems.problems[currentProblem].title}\n# Sample input: ${problems.problems[currentProblem].sampleInput}\n\n${getDefaultCode(problems.problems[currentProblem].id)}`,
      extension: 'py'
    },
    javascript: {
      template: `// ${problems.problems[currentProblem].title}\n// Sample input: ${problems.problems[currentProblem].sampleInput}\n\n${getDefaultCode(problems.problems[currentProblem].id)}`,
      extension: 'js'
    },
    java: {
      template: `public class Main {\n    public static void main(String[] args) {\n        ${getDefaultCode(problems.problems[currentProblem].id)}\n    }\n}`,
      extension: 'java'
    },
    c: {
      template: `#include <stdio.h>\n\nint main() {\n    ${getDefaultCode(problems.problems[currentProblem].id)}\n    return 0;\n}`,
      extension: 'c'
    },
    cpp: {
      template: `#include <iostream>\nusing namespace std;\n\nint main() {\n    ${getDefaultCode(problems.problems[currentProblem].id)}\n    return 0;\n}`,
      extension: 'cpp'
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
          `int a, b;\ncin >> a >> b;\ncout << a + b;`;
      
      case 2: // Factorial
        return selectedLanguage === 'python' ?
          `n = int(input())\nfact = 1\nfor i in range(1, n+1):\n    fact *= i\nprint(fact)` :
          selectedLanguage === 'javascript' ?
          `let n = parseInt(readline());\nlet fact = 1;\nfor(let i = 1; i <= n; i++) fact *= i;\nconsole.log(fact);` :
          selectedLanguage === 'java' ?
          `Scanner sc = new Scanner(System.in);\nint n = sc.nextInt();\nint fact = 1;\nfor(int i = 1; i <= n; i++) fact *= i;\nSystem.out.println(fact);` :
          selectedLanguage === 'c' ?
          `int n, fact = 1;\nscanf("%d", &n);\nfor(int i = 1; i <= n; i++) fact *= i;\nprintf("%d", fact);` :
          `int n, fact = 1;\ncin >> n;\nfor(int i = 1; i <= n; i++) fact *= i;\ncout << fact;`;
      
      case 3: // Fibonacci
        return selectedLanguage === 'python' ?
          `n = int(input())\na, b = 0, 1\nfor _ in range(n):\n    print(a, end=' ')\n    a, b = b, a + b` :
          selectedLanguage === 'javascript' ?
          `let n = parseInt(readline());\nlet a = 0, b = 1;\nlet res = [];\nfor(let i = 0; i < n; i++) {\n    res.push(a);\n    [a, b] = [b, a + b];\n}\nconsole.log(res.join(' '));` :
          selectedLanguage === 'java' ?
          `Scanner sc = new Scanner(System.in);\nint n = sc.nextInt();\nint a = 0, b = 1;\nfor(int i = 0; i < n; i++) {\n    System.out.print(a + " ");\n    int temp = a;\n    a = b;\n    b = temp + b;\n}` :
          selectedLanguage === 'c' ?
          `int n, a = 0, b = 1;\nscanf("%d", &n);\nfor(int i = 0; i < n; i++) {\n    printf("%d ", a);\n    int temp = a;\n    a = b;\n    b = temp + b;\n}` :
          `int n, a = 0, b = 1;\ncin >> n;\nfor(int i = 0; i < n; i++) {\n    cout << a << " ";\n    int temp = a;\n    a = b;\n    b = temp + b;\n}`;
      
      default:
        return selectedLanguage === 'python' ? 'print("Hello World!")' :
               selectedLanguage === 'javascript' ? 'console.log("Hello World!")' :
               selectedLanguage === 'java' ? 'System.out.println("Hello World!");' :
               selectedLanguage === 'c' ? 'printf("Hello World!\\n");' :
               'cout << "Hello World!" << endl;';
    }
  }

  // Fetch available languages and versions
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://emkc.org/api/v2/piston/runtimes');
        setLanguages(response.data || []);
        setError(null);
        
        if (response.data && response.data.length > 0) {
          const lang = response.data.find(l => l.language === selectedLanguage);
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
        'editor.lineHighlightBackground': 'rgba(108, 92, 231, 0.1)',
        'editorLineNumber.foreground': '#858585',
        'editorGutter.background': '#1E1E1E',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorCursor.foreground': '#A6A6A6',
        'editorWhitespace.foreground': '#404040'
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
        'editor.background': '#F8F9FA',
        'editor.foreground': '#333333',
        'editor.lineHighlightBackground': 'rgba(108, 92, 231, 0.05)',
        'editorLineNumber.foreground': '#B2BEC3',
        'editorGutter.background': '#F5F6FA',
        'editor.selectionBackground': '#ADD6FF',
        'editor.inactiveSelectionBackground': '#E5EBF1',
        'editorCursor.foreground': '#333333',
        'editorWhitespace.foreground': '#B3B3B3'
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
      wordWrap: 'on'
    });
  };

  // Execute code with input
  const executeCode = async () => {
    if (!selectedLanguage || !selectedVersion) {
      setOutput('Please select a language and version');
      return;
    }

    setIsLoading(true);
    setOutput('Executing...\n');
    
    try {
      const fileExtension = languageData[selectedLanguage].extension;
      const files = [{
        name: fileName + '.' + fileExtension,
        content: code
      }];

      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: selectedLanguage,
        version: selectedVersion,
        files: files,
        stdin: userInput
      });

      setOutput(response.data?.run?.output || 'No output');
      setError(null);
    } catch (err) {
      setOutput(err.response?.data?.message || 'Error executing code');
    } finally {
      setIsLoading(false);
    }
  };

  // Run test cases
  const runTestCases = async () => {
    if (!selectedLanguage || !selectedVersion) {
      setOutput('Please select a language and version');
      return;
    }

    setIsLoading(true);
    setOutput('Running test cases...\n\n');
    
    try {
      const fileExtension = languageData[selectedLanguage].extension;
      const files = [{
        name: fileName + '.' + fileExtension,
        content: code
      }];

      let allPassed = true;
      let testResults = '';

      // Run public test cases first
      testResults += '=== Public Test Cases ===\n\n';
      for (const testCase of problems.problems[currentProblem].testCases.filter(t => t.isPublic)) {
        const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
          language: selectedLanguage,
          version: selectedVersion,
          files: files,
          stdin: testCase.input
        });

        const actualOutput = (response.data?.run?.output || '').trim();
        const expectedOutput = testCase.output.trim();
        const passed = actualOutput === expectedOutput;

        testResults += `Input: ${testCase.input}\n`;
        testResults += `Expected: ${expectedOutput}\n`;
        testResults += `Received: ${actualOutput}\n`;
        testResults += `Result: ${passed ? '✅ PASSED' : '❌ FAILED'}\n\n`;

        if (!passed) allPassed = false;
      }

      testResults += '=== Private Test Cases ===\n\n';
      for (const testCase of problems.problems[currentProblem].testCases.filter(t => !t.isPublic)) {
        const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
          language: selectedLanguage,
          version: selectedVersion,
          files: files,
          stdin: testCase.input
        });

        const actualOutput = (response.data?.run?.output || '').trim();
        const expectedOutput = testCase.output.trim();
        const passed = actualOutput === expectedOutput;

        testResults += `Input: ${testCase.input}\n`;
        testResults += `Expected: ${testCase.output}\n`;
        testResults += `Received: ${actualOutput}\n`;
        testResults += `Result: ${passed ? '✅ PASSED' : '❌ FAILED'}\n\n`;

        if (!passed) allPassed = false;
      }

      testResults += allPassed ? 
        '\n🎉 All test cases passed!' : 
        '\nSome test cases failed. Please check your code.';

      setOutput(testResults);
      setError(null);
    } catch (err) {
      setOutput(err.response?.data?.message || 'Error executing test cases');
    } finally {
      setIsLoading(false);
    }
  };

  // Change problem
  const changeProblem = (index) => {
    setCurrentProblem(index);
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

  return (
    <div className={`guidedray-coding-platform-container ${darkMode ? 'dark' : ''}`}>
      <div className="guidedray-coding-platform">
        {error && (
          <div className="guidedray-coding-platform-error">
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
              {problems.problems.map((problem, index) => (
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
                <h2>{problems.problems[currentProblem].title}</h2>
                <div className="problem-meta">
                  <span className="problem-id">Problem ID: {problems.problems[currentProblem].id}</span>
                  <span className={`problem-difficulty difficulty-${problems.problems[currentProblem].difficulty.toLowerCase()}`}>
                    {problems.problems[currentProblem].difficulty}
                  </span>
                </div>
              </div>
              
              <div className="problem-tabs">
                <button 
                  className={`problem-tab ${activeTab === 'problem' ? 'active' : ''}`}
                  onClick={() => setActiveTab('problem')}
                >
                  Problem
                </button>
                <button 
                  className={`problem-tab ${activeTab === 'submissions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('submissions')}
                >
                  Submissions
                </button>
                <button 
                  className={`problem-tab ${activeTab === 'discuss' ? 'active' : ''}`}
                  onClick={() => setActiveTab('discuss')}
                >
                  Discuss
                </button>
              </div>

              {activeTab === 'problem' && (
                <div className="guidedray-coding-platform-problem-description">
                  <p>{problems.problems[currentProblem].description}</p>
                  
                  <h3>Constraints</h3>
                  <ul className="guidedray-coding-platform-constraints">
                    {problems.problems[currentProblem].constraints.map((constraint, index) => (
                      <li key={index}>{constraint}</li>
                    ))}
                  </ul>
                  
                  <div className="io-section">
                    <div className="io-block">
                      <h3>Sample Input</h3>
                      <div className="guidedray-coding-platform-code-block">
                        <pre>{problems.problems[currentProblem].sampleInput}</pre>
                      </div>
                    </div>
                    
                    <div className="io-block">
                      <h3>Sample Output</h3>
                      <div className="guidedray-coding-platform-code-block">
                        <pre>{problems.problems[currentProblem].sampleOutput}</pre>
                      </div>
                    </div>
                  </div>
                  
                  <h3>Explanation</h3>
                  <p>{problems.problems[currentProblem].explanation}</p>
                </div>
              )}

              {activeTab === 'submissions' && (
                <div className="submissions-placeholder">
                  <div className="submissions-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <h3>Your Submissions</h3>
                  <p>No submissions yet. Solve the problem to see your submissions here.</p>
                </div>
              )}

              {activeTab === 'discuss' && (
                <div className="discuss-placeholder">
                  <div className="discuss-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
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
                    {fileName}.{languageData[selectedLanguage].extension}
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
                      {languages
                        .filter((lang, index, self) => 
                          index === self.findIndex(l => l.language === lang.language)
                        )
                        .map((lang) => (
                          <option key={lang.language} value={lang.language}>
                            {lang.language.charAt(0).toUpperCase() + lang.language.slice(1)}
                          </option>
                        ))}
                    </select>
                    
                    <div className="font-size-control">
                      <button 
                        onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                        disabled={fontSize <= 12}
                        className="font-size-btn"
                      >
                        -
                      </button>
                      <span className="font-size-display">{fontSize}px</span>
                      <button 
                        onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                        disabled={fontSize >= 24}
                        className="font-size-btn"
                      >
                        +
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                          Run
                        </>
                      )}
                    </button>
                    <button 
                      onClick={runTestCases} 
                      disabled={isLoading}
                      className="guidedray-coding-platform-test-button"
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner"></span>
                          Testing...
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                          Test
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
                    formatOnType: true,
                    suggest: {
                      preview: true,
                      showWords: true,
                      showKeywords: true,
                      showSnippets: true,
                      showClasses: true,
                      showInterfaces: true,
                      showStructs: true,
                      showVariables: true,
                      showFunctions: true,
                      showMethods: true,
                      showFields: true,
                      showConstructors: true,
                      showProperties: true,
                      showEvents: true,
                      showOperators: true,
                      showModules: true,
                      showReferences: true,
                      showConstants: true,
                      showValues: true,
                      showEnums: true,
                      showEnumMembers: true,
                      showTypeParameters: true,
                      showFiles: true,
                      showFolders: true,
                      showColorKeywords: true,
                      showUnits: true,
                      showIssues: true,
                      showUsers: true,
                      showReferencesInQuickOpen: true
                    }
                  }}
                />
              </div>
            </div>

            <div className="guidedray-coding-platform-input-output-container">
              <div className="guidedray-coding-platform-input-section">
                <div className="guidedray-coding-platform-input-header">
                  <h3>Custom Input</h3>
                  <div className="input-actions">
                    <button 
                      onClick={() => setUserInput(problems.problems[currentProblem].sampleInput)}
                      className="guidedray-coding-platform-sample-input-button"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      Sample
                    </button>
                    <button 
                      onClick={() => setUserInput('')}
                      className="guidedray-coding-platform-clear-input-button"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Clear
                    </button>
                  </div>
                </div>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="guidedray-coding-platform-input"
                  placeholder="Enter input here (for manual testing)"
                  style={{ fontSize: `${fontSize - 2}px` }}
                  disabled={isLoading}
                />
              </div>

              <div className="guidedray-coding-platform-output-section">
                <div className="guidedray-coding-platform-output-header">
                  <h3>Output</h3>
                  <button 
                    onClick={() => setOutput('')}
                    className="guidedray-coding-platform-clear-output-button"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Clear
                  </button>
                </div>
                <pre 
                  className="guidedray-coding-platform-output" 
                  style={{ fontSize: `${fontSize - 2}px` }}
                >
                  {output}
                </pre>
              </div>
            </div>
          </main>
        </div>

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
            <p>© {new Date().getFullYear()} GuidedRay Coding Platform | Powered by Piston API</p>
            <div className="guidedray-coding-platform-footer-links">
              <a href="#">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Docs
              </a>
              <a href="#">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Help
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GuidedRayCodingPlatform;