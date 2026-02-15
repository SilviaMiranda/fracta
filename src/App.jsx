import { useState, useEffect } from 'react';
import { loadLanguage, loadProgress } from './utils/storage';
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LevelMenuScreen from './screens/LevelMenuScreen';
import GameScreen from './screens/GameScreen';
import LevelCompleteScreen from './screens/LevelCompleteScreen';
import SettingsScreen from './screens/SettingsScreen';

/**
 * Main App Component
 * Manages routing and global state
 */
function App() {
  const [screen, setScreen] = useState('home');
  const [language, setLanguage] = useState('ca');
  const [progress, setProgress] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameScore, setGameScore] = useState(0);
  const [gameQuestions, setGameQuestions] = useState([]);
  const [gameQuestionIndex, setGameQuestionIndex] = useState(0);

  // Load initial state from localStorage
  useEffect(() => {
    const savedLanguage = loadLanguage();
    const savedProgress = loadProgress();
    
    setLanguage(savedLanguage);
    setProgress(savedProgress);
    
    // Navigate to onboarding if not completed
    if (!savedProgress.onboardingComplete) {
      setScreen('onboarding');
    }
  }, []);

  // Update progress when it changes
  const updateProgress = (newProgress) => {
    setProgress(newProgress);
  };

  // Navigate to a screen
  const navigateTo = (screenName, data = {}) => {
    setScreen(screenName);
    
    // Handle navigation data
    if (data.level !== undefined) {
      setCurrentLevel(data.level);
    }
    if (data.score !== undefined) {
      setGameScore(data.score);
    }
    if (data.questions !== undefined) {
      setGameQuestions(data.questions);
    }
    if (data.questionIndex !== undefined) {
      setGameQuestionIndex(data.questionIndex);
    }
  };

  // Change language
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  // Render current screen
  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen
            language={language}
            progress={progress}
            onNavigate={navigateTo}
            onChangeLanguage={changeLanguage}
          />
        );
      
      case 'onboarding':
        return (
          <OnboardingScreen
            language={language}
            progress={progress}
            onNavigate={navigateTo}
            onUpdateProgress={updateProgress}
          />
        );
      
      case 'levels':
        return (
          <LevelMenuScreen
            language={language}
            progress={progress}
            onNavigate={navigateTo}
            onUpdateProgress={updateProgress}
          />
        );
      
      case 'game':
        return (
          <GameScreen
            language={language}
            level={currentLevel}
            progress={progress}
            questions={gameQuestions}
            questionIndex={gameQuestionIndex}
            onNavigate={navigateTo}
            onUpdateProgress={updateProgress}
          />
        );
      
      case 'complete':
        return (
          <LevelCompleteScreen
            language={language}
            level={currentLevel}
            score={gameScore}
            progress={progress}
            onNavigate={navigateTo}
            onUpdateProgress={updateProgress}
          />
        );
      
      case 'settings':
        return (
          <SettingsScreen
            language={language}
            progress={progress}
            onNavigate={navigateTo}
            onChangeLanguage={changeLanguage}
            onUpdateProgress={updateProgress}
          />
        );
      
      default:
        return (
          <HomeScreen
            language={language}
            progress={progress}
            onNavigate={navigateTo}
            onChangeLanguage={changeLanguage}
          />
        );
    }
  };

  if (!progress) {
    // Loading state
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {renderScreen()}
    </div>
  );
}

export default App;

