import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { t } from '../utils/translations';
import { checkAnswer } from '../utils/questions';
import { saveProgress } from '../utils/storage';
import FractionVisualizer from '../components/FractionVisualizer';

/**
 * Game Screen Component
 * Displays questions and handles user input and scoring
 */
const GameScreen = ({ language, level, progress, questions, questionIndex, onNavigate, onUpdateProgress }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(questionIndex || 0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const questionNumber = currentQuestionIndex + 1;

  // Validate and check answer (extracted to reduce duplication)
  const validateAndCheckAnswer = (answer, question) => {
    if (question.type === 'visualRepresent') {
      if (!answer || answer === '0') return null;
      const selectedCount = parseInt(answer, 10);
      // Validate numerator/denominator exist
      if (question.numerator === undefined || question.denominator === undefined) {
        return false;
      }
      return selectedCount === question.numerator;
    } else {
      if (!answer.trim()) return null;
      return checkAnswer(answer, question.answer);
    }
  };

  const handleSubmit = () => {
    const correct = validateAndCheckAnswer(userAnswer, currentQuestion);
    
    // Return early if answer is invalid (null)
    if (correct === null) return;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestionIndex] = correct;
    setAnsweredQuestions(newAnswered);

    if (correct) {
      setScore(score + 10);
    }
  };

  // Handle answer change from FractionVisualizer
  const handleVisualAnswerChange = (answer) => {
    setUserAnswer(answer);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setShowResult(false);
    } else {
      // Level complete - navigate to completion screen
      // Score is already calculated correctly in state
      onNavigate('complete', { score });
    }
  };

  // Check if current question is visual representation
  const isVisualQuestion = currentQuestion.type === 'visualRepresent';

  const handleFinishEarly = () => {
    // Calculate score: answered questions + current question if answered correctly
    const answeredCount = answeredQuestions.filter(a => a).length;
    
    // For visual questions, check if current answer is correct
    let currentScore = 0;
    if (isVisualQuestion && userAnswer && userAnswer !== '0') {
      const correct = validateAndCheckAnswer(userAnswer, currentQuestion);
      currentScore = correct === true ? 10 : 0;
    } else if (!isVisualQuestion && userAnswer.trim()) {
      const correct = validateAndCheckAnswer(userAnswer, currentQuestion);
      currentScore = correct === true ? 10 : 0;
    } else {
      // Fallback to isCorrect state if available
      currentScore = isCorrect === true ? 10 : 0;
    }
    
    const totalScore = answeredCount * 10 + currentScore;
    onNavigate('complete', { score: totalScore });
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading question...</div>
      </div>
    );
  }

  const levelDescriptions = [
    t(language, 'level1'),
    t(language, 'level2'),
    t(language, 'level3'),
    t(language, 'level4'),
    t(language, 'level5'),
    t(language, 'level6'),
    t(language, 'level7'),
    t(language, 'level8'),
    t(language, 'level9'),
    t(language, 'level10'),
    t(language, 'level11'),
    t(language, 'level12'),
    t(language, 'level13'),
    t(language, 'level14'),
    t(language, 'level15'),
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('levels')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>{t(language, 'menu')}</span>
          </button>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              {questionNumber}/{totalQuestions}
            </div>
            <div className="text-sm text-gray-600">
              {score} {t(language, 'points')}
            </div>
          </div>
        </div>

        {/* Level info */}
        <div className="mb-4">
          <div className="text-xl font-bold text-gray-800">
            {t(language, 'level')} {level}
          </div>
          <div className="text-sm text-gray-600">
            {levelDescriptions[level - 1]}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex gap-1">
            {Array.from({ length: totalQuestions }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded ${
                  index < currentQuestionIndex
                    ? answeredQuestions[index]
                      ? 'bg-green-500'
                      : 'bg-red-500'
                    : index === currentQuestionIndex
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          {isVisualQuestion ? (
            <>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                {t(language, currentQuestion.type)}
              </div>
              
              {showResult && (
                <div className={`p-4 rounded-lg mb-4 ${
                  isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  <div className="font-semibold mb-1">
                    {isCorrect ? t(language, 'correct') : t(language, 'incorrect')}
                  </div>
                  {!isCorrect && (
                    <div className="text-sm">
                      {t(language, 'correctAnswer')}: {t(language, 'selectSegments', { n: currentQuestion.numerator })}
                    </div>
                  )}
                </div>
              )}

              <FractionVisualizer
                numerator={currentQuestion.numerator ?? 1}
                denominator={currentQuestion.denominator ?? 2}
                language={language}
                onAnswerChange={handleVisualAnswerChange}
              />
            </>
          ) : (
            <>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                {t(language, currentQuestion.type)} {currentQuestion.question} = ?
              </div>
              
              {showResult && (
                <div className={`p-4 rounded-lg mb-4 ${
                  isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  <div className="font-semibold mb-1">
                    {isCorrect ? t(language, 'correct') : t(language, 'incorrect')}
                  </div>
                  {!isCorrect && (
                    <div className="text-sm">
                      {t(language, 'correctAnswer')}: {currentQuestion.answer}
                    </div>
                  )}
                </div>
              )}

              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !showResult && handleSubmit()}
                placeholder={t(language, 'answerPlaceholder')}
                disabled={showResult}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-lg"
                autoFocus
              />
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          {!showResult ? (
            <>
              <button
                onClick={handleSubmit}
                disabled={isVisualQuestion ? (!userAnswer || userAnswer === '0') : !userAnswer.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t(language, 'submitAnswer')}
              </button>
              {currentQuestionIndex > 0 && (
                <button
                  onClick={handleFinishEarly}
                  className="px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                >
                  {t(language, 'finishLevel')}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-pink-600 transition-all"
            >
              {questionNumber < totalQuestions ? t(language, 'nextQuestion') : t(language, 'finishLevel')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;

