import { useState } from 'react';
import { ArrowLeft, Lock, Star, Settings } from 'lucide-react';
import { t } from '../utils/translations';
import { saveProgress } from '../utils/storage';
import { checkNewBadges } from '../utils/badges';
import { generateQuestion } from '../utils/questions';

/**
 * Level Menu Screen Component
 * Shows all 15 levels with unlock status, stars, and descriptions
 */
const LevelMenuScreen = ({ language, progress, onNavigate, onUpdateProgress }) => {
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

  const handleLevelClick = (levelNumber) => {
    // Check if level is unlocked
    if (levelNumber > progress.highestUnlockedLevel) {
      return; // Level is locked
    }

    // Generate questions for this level
    const questions = [];
    for (let i = 0; i < 8; i++) {
      questions.push(generateQuestion(levelNumber, language));
    }

    onNavigate('game', {
      level: levelNumber,
      questions,
      questionIndex: 0,
    });
  };

  const handleSkipLevel = (levelNumber, e) => {
    e.stopPropagation();
    
    if (levelNumber > progress.highestUnlockedLevel + 1) {
      return; // Can only skip to next level
    }

    // Unlock next level
    const newProgress = {
      ...progress,
      highestUnlockedLevel: Math.max(progress.highestUnlockedLevel, levelNumber),
      currentLevel: levelNumber,
    };
    
    saveProgress(newProgress);
    onUpdateProgress(newProgress);
  };

  const handleRepeatLevel = (levelNumber, e) => {
    e.stopPropagation();
    handleLevelClick(levelNumber);
  };

  const getLevelStars = (levelNumber) => {
    const completed = progress.completedLevels[levelNumber];
    return completed?.stars || 0;
  };

  const isLevelCompleted = (levelNumber) => {
    return progress.completedLevels[levelNumber] !== undefined;
  };

  const isLevelLocked = (levelNumber) => {
    return levelNumber > progress.highestUnlockedLevel;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>{t(language, 'home')}</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t(language, 'appTitle')}
            </h1>
            <button
              onClick={() => onNavigate('settings')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
              aria-label={t(language, 'settings')}
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>

          {/* Progress stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-blue-600 font-semibold text-sm mb-1">
                {t(language, 'points')}
              </div>
              <div className="text-blue-800 text-2xl font-bold">
                {progress.totalPoints || 0}
              </div>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 text-center">
              <div className="text-pink-600 font-semibold text-sm mb-1">
                {t(language, 'level')}
              </div>
              <div className="text-pink-800 text-2xl font-bold">
                {progress.currentLevel || 1}
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-purple-600 font-semibold text-sm mb-1">
                {t(language, 'badges')}
              </div>
              <div className="text-purple-800 text-2xl font-bold">
                {progress.badges?.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Levels grid */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t(language, 'levels')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {levelDescriptions.map((description, index) => {
              const levelNumber = index + 1;
              const locked = isLevelLocked(levelNumber);
              const completed = isLevelCompleted(levelNumber);
              const stars = getLevelStars(levelNumber);
              const canSkip = levelNumber === progress.highestUnlockedLevel + 1;

              return (
                <div
                  key={levelNumber}
                  onClick={() => !locked && handleLevelClick(levelNumber)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    locked
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : completed
                      ? 'border-blue-300 bg-blue-50 cursor-pointer hover:bg-blue-100'
                      : 'border-blue-200 bg-white cursor-pointer hover:bg-gray-50'
                  }`}
                >
                  {locked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-lg text-gray-800">
                        {t(language, 'level')} {levelNumber}
                      </div>
                      <div className="text-sm text-gray-600">{description}</div>
                    </div>
                  </div>

                  {/* Stars */}
                  {completed && (
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= stars
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  {!locked && (
                    <div className="flex gap-2 mt-3">
                      {canSkip && (
                        <button
                          onClick={(e) => handleSkipLevel(levelNumber, e)}
                          className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                        >
                          {t(language, 'skipLevel')}
                        </button>
                      )}
                      <button
                        onClick={(e) => handleRepeatLevel(levelNumber, e)}
                        className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        {t(language, 'repeatLevel')}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelMenuScreen;

