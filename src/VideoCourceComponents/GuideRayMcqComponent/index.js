import React, { useState } from 'react';

const GuideRayMcqComponent = ({ mcqData }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="guideraymcqcomponent-container">
      <h2 className="guideraymcqcomponent-title">Practice MCQ</h2>
      {mcqData.questions.map((question, qIndex) => (
        <div key={qIndex} className="guideraymcqcomponent-questioncard">
          <h3 className="guideraymcqcomponent-question">{question.question}</h3>
          <div className="guideraymcqcomponent-optionscontainer">
            {question.options.map((option, oIndex) => (
              <div 
                key={oIndex} 
                className={`guideraymcqcomponent-option 
                  ${selectedAnswers[qIndex] === oIndex ? 'guideraymcqcomponent-selected' : ''} 
                  ${submitted && oIndex === question.answer ? 'guideraymcqcomponent-correct' : ''}
                  ${submitted && selectedAnswers[qIndex] === oIndex && oIndex !== question.answer ? 'guideraymcqcomponent-incorrect' : ''}`}
                onClick={() => !submitted && handleOptionSelect(qIndex, oIndex)}
              >
                {option}
              </div>
            ))}
          </div>
          {submitted && (
            <div className="guideraymcqcomponent-feedback">
              {selectedAnswers[qIndex] === question.answer 
                ? "Correct!" 
                : `Incorrect. The correct answer is: ${question.options[question.answer]}`}
            </div>
          )}
        </div>
      ))}
      {!submitted && mcqData.questions.length > 0 && (
        <button className="guideraymcqcomponent-submitbtn" onClick={handleSubmit}>Submit Answers</button>
      )}
    </div>
  );
};

export default GuideRayMcqComponent;