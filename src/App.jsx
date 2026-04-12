import { useState, useEffect, useCallback, useRef } from 'react';
import {
  loadLanguage,
  loadAppState,
  saveAppState,
  getProfile,
  switchToProfile,
  createDefaultProfileData,
  saveAccessibility,
} from './utils/storage';
import { generateQuestion } from './utils/questions';
import { getTrackConfig, TRACK_ARITHMETIC, TRACK_FRACTIONS } from './utils/trackConfig';
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LevelMenuScreen from './screens/LevelMenuScreen';
import GameScreen from './screens/GameScreen';
import LevelCompleteScreen from './screens/LevelCompleteScreen';
import SettingsScreen from './screens/SettingsScreen';

function App() {
  const [screen, setScreen] = useState('home');
  const [language, setLanguage] = useState('ca');
  const [appState, setAppState] = useState(null);
  const [activeTrack, setActiveTrack] = useState(TRACK_FRACTIONS);
  const [onboardingTrack, setOnboardingTrack] = useState(TRACK_FRACTIONS);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameScore, setGameScore] = useState(0);
  const [gameQuestions, setGameQuestions] = useState([]);
  const [gameQuestionIndex, setGameQuestionIndex] = useState(0);
  const activeTrackRef = useRef(TRACK_FRACTIONS);

  useEffect(() => {
    activeTrackRef.current = activeTrack;
  }, [activeTrack]);

  useEffect(() => {
    setLanguage(loadLanguage());
    setAppState(loadAppState());
    setScreen('home');
  }, []);

  const activeProfileId = appState?.activeProfileId ?? 'player_1';
  const activeProfile = appState ? getProfile(appState, activeProfileId) : null;
  const fractionsProgress = activeProfile?.fractions ?? null;
  const arithmeticProgress = activeProfile?.arithmetic ?? null;
  const dyslexiaFont = activeProfile?.accessibility?.dyslexiaFont ?? false;

  const updateFractionsProgress = useCallback((p) => {
    setAppState((prev) => {
      const id = prev.activeProfileId;
      const next = {
        ...prev,
        profiles: {
          ...prev.profiles,
          [id]: {
            ...prev.profiles[id],
            fractions: { ...p, completedLevels: { ...p.completedLevels } },
          },
        },
      };
      saveAppState(next);
      return next;
    });
  }, []);

  const updateArithmeticProgress = useCallback((p) => {
    setAppState((prev) => {
      const id = prev.activeProfileId;
      const next = {
        ...prev,
        profiles: {
          ...prev.profiles,
          [id]: {
            ...prev.profiles[id],
            arithmetic: { ...p, completedLevels: { ...p.completedLevels } },
          },
        },
      };
      saveAppState(next);
      return next;
    });
  }, []);

  const handleSwitchPlayer = useCallback(
    (profileId) => {
      const next = switchToProfile(profileId);
      if (next) {
        setAppState(next);
        setGameQuestions([]);
        setGameScore(0);
        setGameQuestionIndex(0);
        setScreen('home');
      }
    },
    []
  );

  const handleToggleDyslexiaFont = useCallback(() => {
    const acc = loadAccessibility();
    const nextVal = !acc.dyslexiaFont;
    saveAccessibility({ dyslexiaFont: nextVal });
    setAppState(loadAppState());
  }, []);

  const navigateTo = useCallback((screenName, data = {}) => {
    if (data.track) {
      setActiveTrack(data.track);
    }

    setScreen(screenName);

    if (data.level !== undefined) {
      setCurrentLevel(data.level);
    }
    if (data.score !== undefined) {
      setGameScore(data.score);
    }

    const track = data.track ?? activeTrackRef.current;

    if (screenName === 'game') {
      const lvl = data.level !== undefined ? data.level : currentLevel;
      const cfg = getTrackConfig(track);
      let questions = data.questions;
      if (!questions || questions.length === 0) {
        questions = [];
        for (let i = 0; i < cfg.questionsPerLevel; i++) {
          questions.push(generateQuestion(lvl, language, track));
        }
        data.questionIndex = 0;
      }
      setGameQuestions(questions);
      setGameQuestionIndex(data.questionIndex ?? 0);
      setActiveTrack(track);
    }

    if (data.questionIndex !== undefined && screenName === 'game') {
      setGameQuestionIndex(data.questionIndex);
    }

    if (screenName === 'onboarding' && data.track) {
      setOnboardingTrack(data.track);
    }

    if (screenName === 'levels' && data.track) {
      setActiveTrack(data.track);
    }
  }, [currentLevel, language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const trackProgress =
    activeTrack === TRACK_ARITHMETIC ? arithmeticProgress : fractionsProgress;

  const onUpdateTrackProgress =
    activeTrack === TRACK_ARITHMETIC ? updateArithmeticProgress : updateFractionsProgress;

  if (!appState || !fractionsProgress || !arithmeticProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const rootClass = `min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50${
    dyslexiaFont ? ' font-atkinson leading-relaxed' : ''
  }`;

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen
            language={language}
            fractionsProgress={fractionsProgress}
            arithmeticProgress={arithmeticProgress}
            activeProfileId={activeProfileId}
            onSwitchPlayer={handleSwitchPlayer}
            onNavigate={navigateTo}
            onChangeLanguage={changeLanguage}
          />
        );

      case 'onboarding':
        return (
          <OnboardingScreen
            language={language}
            track={onboardingTrack}
            progress={
              onboardingTrack === TRACK_ARITHMETIC ? arithmeticProgress : fractionsProgress
            }
            onNavigate={navigateTo}
            onUpdateProgress={
              onboardingTrack === TRACK_ARITHMETIC
                ? updateArithmeticProgress
                : updateFractionsProgress
            }
          />
        );

      case 'levels':
        return (
          <LevelMenuScreen
            language={language}
            track={activeTrack}
            progress={trackProgress}
            onNavigate={navigateTo}
            onUpdateProgress={onUpdateTrackProgress}
          />
        );

      case 'game':
        return (
          <GameScreen
            language={language}
            track={activeTrack}
            level={currentLevel}
            progress={trackProgress}
            questions={gameQuestions}
            questionIndex={gameQuestionIndex}
            onNavigate={navigateTo}
          />
        );

      case 'complete':
        return (
          <LevelCompleteScreen
            language={language}
            track={activeTrack}
            level={currentLevel}
            score={gameScore}
            progress={trackProgress}
            onNavigate={navigateTo}
            onUpdateProgress={onUpdateTrackProgress}
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            language={language}
            fractionsProgress={fractionsProgress}
            arithmeticProgress={arithmeticProgress}
            activeProfileId={activeProfileId}
            dyslexiaFont={dyslexiaFont}
            onToggleDyslexiaFont={handleToggleDyslexiaFont}
            onSwitchPlayer={handleSwitchPlayer}
            onNavigate={navigateTo}
            onChangeLanguage={changeLanguage}
            onResetProgress={() => {
              const id = appState.activeProfileId;
              const prevProfile = getProfile(appState, id);
              const fresh = createDefaultProfileData();
              const next = {
                ...appState,
                profiles: {
                  ...appState.profiles,
                  [id]: {
                    ...fresh,
                    accessibility: prevProfile?.accessibility ?? fresh.accessibility,
                  },
                },
              };
              saveAppState(next);
              setAppState(next);
            }}
          />
        );

      default:
        return (
          <HomeScreen
            language={language}
            fractionsProgress={fractionsProgress}
            arithmeticProgress={arithmeticProgress}
            activeProfileId={activeProfileId}
            onSwitchPlayer={handleSwitchPlayer}
            onNavigate={navigateTo}
            onChangeLanguage={changeLanguage}
          />
        );
    }
  };

  return <div className={rootClass}>{renderScreen()}</div>;
}

export default App;
