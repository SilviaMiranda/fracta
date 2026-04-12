import { useState } from 'react';
import { ArrowLeft, Lock, Star, Settings } from 'lucide-react';
import { t } from '../utils/translations';
import { getTotalBadgeCount } from '../utils/badges';
import { generateQuestion } from '../utils/questions';
import { getTrackConfig, TRACK_ARITHMETIC } from '../utils/trackConfig';
import BadgesModal from '../components/BadgesModal';

const LevelMenuScreen = ({ language, track, progress, onNavigate, onUpdateProgress }) => {
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const cfg = getTrackConfig(track);

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

  const handleLevelClick = (levelNumber) => {
    if (levelNumber > progress.highestUnlockedLevel) {
      return;
    }

    const questions = [];
    for (let i = 0; i < cfg.questionsPerLevel; i++) {
      questions.push(generateQuestion(levelNumber, language, track));
    }

    onNavigate('game', {
      level: levelNumber,
      questions,
      questionIndex: 0,
      track,
    });
  };

  const handleSkipLevel = (levelNumber, e) => {
    e.stopPropagation();

    if (levelNumber > progress.highestUnlockedLevel + 1) {
      return;
    }

    const newProgress = {
      ...progress,
      highestUnlockedLevel: Math.max(progress.highestUnlockedLevel, levelNumber),
      currentLevel: levelNumber,
    };

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
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
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
              type="button"
              onClick={() => onNavigate('settings')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
              aria-label={t(language, 'settings')}
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-blue-600 font-semibold text-sm mb-1">
                {t(language, 'points')}
              </div>
              <div className="text-blue-800 text-2xl font-bold">{progress.totalPoints || 0}</div>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 text-center">
              <div className="text-pink-600 font-semibold text-sm mb-1">
                {t(language, 'level')}
              </div>
              <div className="text-pink-800 text-2xl font-bold">{progress.currentLevel || 1}</div>
            </div>
            <button
              type="button"
              onClick={() => setShowBadgesModal(true)}
              className="bg-purple-50 rounded-xl p-4 text-center hover:bg-purple-100 transition-colors cursor-pointer"
            >
              <div className="text-purple-600 font-semibold text-sm mb-1">
                {t(language, 'badges')}
              </div>
              <div className="text-purple-800 text-2xl font-bold">
                {getTotalBadgeCount(progress.totalPoints || 0, progress.badges || [], track)}
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t(language, 'levels')}</h2>
          <p className="text-sm text-gray-500 mb-6">
            {track === TRACK_ARITHMETIC
              ? t(language, 'sectionArithmetic')
              : t(language, 'sectionFractions')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {levelDescriptions.slice(0, cfg.levelCount).map((description, index) => {
              const levelNumber = index + 1;
              const locked = isLevelLocked(levelNumber);
              const completed = isLevelCompleted(levelNumber);
              const stars = getLevelStars(levelNumber);
              const canSkip = levelNumber === progress.highestUnlockedLevel + 1;

              return (
                <div
                  key={levelNumber}
                  role="button"
                  tabIndex={0}
                  onClick={() => !locked && handleLevelClick(levelNumber)}
                  onKeyDown={(e) => {
                    if (!locked && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleLevelClick(levelNumber);
                    }
                  }}
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

                  {completed && (
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {!locked && (
                    <div className="flex gap-2 mt-3">
                      {canSkip && (
                        <button
                          type="button"
                          onClick={(e) => handleSkipLevel(levelNumber, e)}
                          className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                        >
                          {t(language, 'skipLevel')}
                        </button>
                      )}
                      <button
                        type="button"
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

      {showBadgesModal && (
        <BadgesModal
          language={language}
          track={track}
          progress={progress}
          onClose={() => setShowBadgesModal(false)}
        />
      )}
    </div>
  );
};

export default LevelMenuScreen;
