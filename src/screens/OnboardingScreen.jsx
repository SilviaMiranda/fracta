import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { t } from '../utils/translations';
import { generateQuestion, checkAnswer, parseFraction, formatFraction } from '../utils/questions';
import { saveProgress } from '../utils/storage';

/**
 * Onboarding Screen Component
 * 10-question assessment to determine starting level
 */
const OnboardingScreen = ({ language, progress, onNavigate, onUpdateProgress }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Generate 10 questions of varying difficulty
  useEffect(() => {
    const generatedQuestions = [];
    for (let i = 0; i < 10; i++) {
      // Mix difficulty levels 1-6 for assessment
      const level = Math.floor(i / 2) + 1;
      generatedQuestions.push(generateQuestion(Math.min(level, 6), language));
    }
    setQuestions(generatedQuestions);
  }, [language]);

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    const correct = checkAnswer(userAnswer, currentQuestion.answer);
    
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setShowResult(false);
    } else {
      // Assessment complete - determine starting level
      const percentage = (score / questions.length) * 100;
      let startingLevel = 1;
      
      if (percentage >= 90) startingLevel = 6;
      else if (percentage >= 80) startingLevel = 5;
      else if (percentage >= 70) startingLevel = 4;
      else if (percentage >= 60) startingLevel = 3;
      else if (percentage >= 50) startingLevel = 2;
      else startingLevel = 1;

      // Update progress
      const newProgress = {
        ...progress,
        currentLevel: startingLevel,
        highestUnlockedLevel: startingLevel,
        onboardingComplete: true,
      };
      
      saveProgress(newProgress);
      onUpdateProgress(newProgress);
      onNavigate('levels');
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading questions...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>{t(language, 'home')}</span>
          </button>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {t(language, 'onboardingTitle')}
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {t(language, 'onboardingDescription')}
        </p>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{t(language, 'questionNumber', { n: questionNumber })}</span>
            <span>{questionNumber}/{totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="text-lg text-gray-700 mb-4">
            {t(language, currentQuestion.type)} {currentQuestion.question}
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t(language, 'submitAnswer')}
            </button>
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

export default OnboardingScreen;

