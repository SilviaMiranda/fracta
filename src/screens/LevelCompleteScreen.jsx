import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Trophy } from 'lucide-react';
import { t } from '../utils/translations';
import { saveProgress } from '../utils/storage';
import { checkNewBadges, checkLevelBadge, getEarnedBadges, BADGE_DEFINITIONS } from '../utils/badges';

/**
 * Level Complete Screen Component
 * Shows score, stars earned, badges, and recommendations
 */
const LevelCompleteScreen = ({ language, level, score, progress, onNavigate, onUpdateProgress }) => {
  const [stars, setStars] = useState(0);
  const [newBadges, setNewBadges] = useState([]);
  const [hasUpdatedProgress, setHasUpdatedProgress] = useState(false);

  useEffect(() => {
    // Calculate stars based on score (out of 80 possible points)
    const percentage = (score / 80) * 100;
    let earnedStars = 0;
    
    if (percentage >= 80) earnedStars = 3;
    else if (percentage >= 60) earnedStars = 2;
    else if (percentage >= 40) earnedStars = 1;

    setStars(earnedStars);

    // Update progress
    if (!hasUpdatedProgress) {
      const newTotalPoints = (progress.totalPoints || 0) + score;
      const newCompletedLevels = {
        ...progress.completedLevels,
        [level]: {
          stars: earnedStars,
          score: score,
        },
      };

      // Unlock next level
      const newHighestUnlocked = Math.max(
        progress.highestUnlockedLevel,
        level + 1
      );

      // Check for new point-based badges
      const currentBadgeIds = (progress.badges || []).map(b => b.id || b);
      const newPointBadges = checkNewBadges(newTotalPoints, currentBadgeIds);

      // Check for level badge (requires 2+ stars)
      const levelBadgeId = checkLevelBadge(level, earnedStars, currentBadgeIds);

      // Combine all newly earned badges
      const newlyEarned = [...newPointBadges];
      if (levelBadgeId) {
        newlyEarned.push(levelBadgeId);
      }

      // Get all point-based badges
      const allPointBadges = getEarnedBadges(newTotalPoints, language);

      // Combine point badges with existing level badges and new level badge
      const allBadgeIds = [
        ...allPointBadges.map(b => b.id),
        ...currentBadgeIds.filter(id => id.startsWith('level_')),
        ...(levelBadgeId ? [levelBadgeId] : [])
      ];

      // Remove duplicates
      const uniqueBadgeIds = [...new Set(allBadgeIds)];

      const newProgress = {
        ...progress,
        currentLevel: newHighestUnlocked,
        highestUnlockedLevel: newHighestUnlocked,
        totalPoints: newTotalPoints,
        completedLevels: newCompletedLevels,
        badges: uniqueBadgeIds,
      };

      saveProgress(newProgress);
      onUpdateProgress(newProgress);

      if (newlyEarned.length > 0) {
        setNewBadges(newlyEarned);
      }
      
      setHasUpdatedProgress(true);
    }
  }, [score, level, progress, language, hasUpdatedProgress]);

  const handleContinue = () => {
    onNavigate('levels');
  };

  const handleRepeat = () => {
    onNavigate('game', { level });
  };

  const handleNextLevel = () => {
    const nextLevel = level + 1;
    if (nextLevel <= progress.highestUnlockedLevel) {
      onNavigate('game', { level: nextLevel });
    } else {
      onNavigate('levels');
    }
  };

  const percentage = (score / 80) * 100;
  const recommendation = percentage < 40 ? 'tryAgain' : 'nextLevel';

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
        <div className="flex items-center mb-6">
          <button
            onClick={() => onNavigate('levels')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>{t(language, 'menu')}</span>
          </button>
        </div>

        {/* Success message */}
        <div className="text-center mb-6">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {t(language, 'levelComplete')}!
          </h2>
          <div className="text-lg text-gray-600">
            {t(language, 'level')} {level}: {levelDescriptions[level - 1]}
          </div>
        </div>

        {/* Score */}
        <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-xl p-6 mb-6 text-center">
          <div className="text-sm text-gray-600 mb-2">{t(language, 'score')}</div>
          <div className="text-4xl font-bold text-gray-800 mb-2">{score}/80</div>
          <div className="text-sm text-gray-600">{percentage.toFixed(0)}%</div>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((starNum) => (
            <Star
              key={starNum}
              className={`w-12 h-12 ${
                starNum <= stars
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        {/* New badges */}
        {newBadges.length > 0 && (
          <div className="bg-purple-50 rounded-xl p-4 mb-6">
            <div className="text-center font-semibold text-purple-800 mb-2">
              {t(language, newBadges.length === 1 ? 'badgeEarned' : 'badgesEarned')}!
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {newBadges.map((badgeId) => {
                const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
                if (!badge) return null;
                const Icon = badge.icon;
                return (
                  <div
                    key={badgeId}
                    className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg"
                  >
                    <Icon className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">
                      {badge.name[language] || badge.name.en}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommendation */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="text-sm font-semibold text-gray-700 mb-2">
            {t(language, 'recommendation')}:
          </div>
          <div className="text-gray-600">
            {recommendation === 'tryAgain'
              ? t(language, 'tryAgain')
              : t(language, 'nextLevel')}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleRepeat}
            className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors"
          >
            {t(language, 'repeatLevel')}
          </button>
          {recommendation === 'nextLevel' && level < 15 && (
            <button
              onClick={handleNextLevel}
              className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-pink-600 transition-all"
            >
              {t(language, 'nextLevel')}
            </button>
          )}
          <button
            onClick={handleContinue}
            className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-pink-600 transition-all"
          >
            {t(language, 'continuePlaying')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelCompleteScreen;

