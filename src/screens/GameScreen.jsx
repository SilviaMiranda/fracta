import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { t } from '../utils/translations';
import { checkAnswer } from '../utils/questions';
import { getTrackConfig, TRACK_ARITHMETIC } from '../utils/trackConfig';
import FractionVisualizer from '../components/FractionVisualizer';

const GameScreen = ({
  language,
  track,
  level,
  progress,
  questions,
  questionIndex,
  onNavigate,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(questionIndex || 0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const cfg = getTrackConfig(track);
  const pts = cfg.pointsPerCorrect;

  useEffect(() => {
    setCurrentQuestionIndex(questionIndex || 0);
    setUserAnswer('');
    setIsCorrect(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
  }, [questions, questionIndex, level, track]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const questionNumber = currentQuestionIndex + 1;

  const validateAndCheckAnswer = (answer, question) => {
    if (question.type === 'visualRepresent') {
      if (!answer || answer === '0') return null;
      const selectedCount = parseInt(answer, 10);
      if (question.numerator === undefined || question.denominator === undefined) {
        return false;
      }
      return selectedCount === question.numerator;
    }
    if (!answer.trim()) return null;
    return checkAnswer(answer, question.answer, track);
  };

  const handleSubmit = () => {
    const correct = validateAndCheckAnswer(userAnswer, currentQuestion);

    if (correct === null) return;

    setIsCorrect(correct);
    setShowResult(true);

    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestionIndex] = correct;
    setAnsweredQuestions(newAnswered);

    if (correct) {
      setScore((s) => s + pts);
    }
  };

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
      onNavigate('complete', { score, track });
    }
  };

  const isVisualQuestion = currentQuestion.type === 'visualRepresent';

  const handleFinishEarly = () => {
    const answeredCount = answeredQuestions.filter((a) => a).length;

    let currentScore = 0;
    if (isVisualQuestion && userAnswer && userAnswer !== '0') {
      const correct = validateAndCheckAnswer(userAnswer, currentQuestion);
      currentScore = correct === true ? pts : 0;
    } else if (!isVisualQuestion && userAnswer.trim()) {
      const correct = validateAndCheckAnswer(userAnswer, currentQuestion);
      currentScore = correct === true ? pts : 0;
    } else {
      currentScore = isCorrect === true ? pts : 0;
    }

    const totalScore = answeredCount * pts + currentScore;
    onNavigate('complete', { score: totalScore, track });
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading question...</div>
      </div>
    );
  }

  const fractionLevelDescriptions = [
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

  const arithmeticLevelDescriptions = Array.from({ length: 12 }, (_, i) =>
    t(language, `arithLevel${i + 1}`)
  );

  const levelDescriptions =
    track === TRACK_ARITHMETIC ? arithmeticLevelDescriptions : fractionLevelDescriptions;

  const promptBlock =
    track === TRACK_ARITHMETIC ? (
      <div className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center leading-snug">
        {currentQuestion.question}
      </div>
    ) : (
      <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        {t(language, currentQuestion.type)} {currentQuestion.question} = ?
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => onNavigate('levels', { track })}
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

        <div className="mb-4">
          <div className="text-xl font-bold text-gray-800">
            {t(language, 'level')} {level}
          </div>
          <div className="text-sm text-gray-600">{levelDescriptions[level - 1]}</div>
        </div>

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

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          {isVisualQuestion ? (
            <>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                {t(language, currentQuestion.type)}
              </div>

              {showResult && (
                <div
                  className={`p-4 rounded-lg mb-4 ${
                    isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  <div className="font-semibold mb-1">
                    {isCorrect ? t(language, 'correct') : t(language, 'incorrect')}
                  </div>
                  {!isCorrect && (
                    <div className="text-sm">
                      {t(language, 'correctAnswer')}:{' '}
                      {t(language, 'selectSegments', { n: currentQuestion.numerator })}
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
              {promptBlock}

              {showResult && (
                <div
                  className={`p-4 rounded-lg mb-4 ${
                    isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
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
                placeholder={
                  track === TRACK_ARITHMETIC
                    ? t(language, 'answerPlaceholderArithmetic')
                    : t(language, 'answerPlaceholder')
                }
                disabled={showResult}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-lg"
                autoFocus
              />
            </>
          )}
        </div>

        <div className="flex gap-4">
          {!showResult ? (
            <>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  isVisualQuestion ? !userAnswer || userAnswer === '0' : !userAnswer.trim()
                }
                className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t(language, 'submitAnswer')}
              </button>
              {currentQuestionIndex > 0 && (
                <button
                  type="button"
                  onClick={handleFinishEarly}
                  className="px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                >
                  {t(language, 'finishLevel')}
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-pink-600 transition-all"
            >
              {questionNumber < totalQuestions
                ? t(language, 'nextQuestion')
                : t(language, 'finishLevel')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
