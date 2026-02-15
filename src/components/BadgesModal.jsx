import { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { getAllBadgesWithStatus } from '../utils/badges';
import { t } from '../utils/translations';

/**
 * Badges Modal Component
 * Displays all badges (point-based and level-specific) in a grid
 * Shows locked/unlocked states
 * Allows clicking badges to view them in detail
 */
const BadgesModal = ({ language, progress, onClose }) => {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const totalPoints = progress?.totalPoints || 0;
  const earnedBadgeIds = progress?.badges || [];

  const allBadges = getAllBadgesWithStatus(totalPoints, earnedBadgeIds, language);

  // Separate badges by type
  const pointBadges = allBadges.filter(b => b.type === 'point');
  const levelBadges = allBadges.filter(b => b.type === 'level');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-2xl font-bold text-gray-800">
            {t(language, 'badges')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Badge Grid */}
        <div className="p-6">
          {/* All Badges - Single Grid */}
          <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
            {allBadges.map((badge) => {
              const Icon = badge.icon;
              const isLocked = badge.isLocked;

              return (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className={`
                    relative flex flex-col items-center p-3 rounded-xl border-2 transition-all
                    ${isLocked
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 hover:border-purple-400 hover:shadow-md cursor-pointer'
                    }
                  `}
                  disabled={isLocked}
                >
                  {/* Badge Icon/Image */}
                  <div
                    className={`
                      relative w-11 h-11 flex items-center justify-center rounded-full mb-2
                      ${isLocked ? 'bg-gray-300' : 'bg-white'}
                    `}
                  >
                    {badge.imagePath && !isLocked ? (
                      <img
                        src={badge.imagePath}
                        alt={badge.name}
                        className="w-11 h-11 object-contain"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <Icon
                      className={`
                        w-6 h-6
                        ${badge.imagePath && !isLocked ? 'hidden' : 'block'}
                        ${isLocked ? 'text-gray-400' : 'text-purple-600'}
                      `}
                    />
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-400 bg-opacity-30 rounded-full">
                        <Lock className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Badge Name */}
                  <div
                    className={`
                      text-xs text-center font-medium line-clamp-2
                      ${isLocked ? 'text-gray-500' : 'text-purple-800'}
                    `}
                  >
                    {badge.name}
                  </div>

                  {/* Badge Type Indicator (small text) */}
                  {badge.type === 'level' && (
                    <div className="text-[10px] text-gray-500 mt-1">
                      {t(language, 'level')} {badge.level}
                    </div>
                  )}
                  {badge.type === 'point' && (
                    <div className="text-[10px] text-gray-500 mt-1">
                      {badge.threshold} {t(language, 'points').toLowerCase()}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Badge Count Summary */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {allBadges.filter(b => !b.isLocked).length} / {allBadges.length} {t(language, 'badges').toLowerCase()}
          </div>
        </div>
      </div>

      {/* Badge Detail View */}
      {selectedBadge && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSelectedBadge(null)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Large Badge Display */}
            <div className="flex flex-col items-center">
              {/* Badge Image/Icon - Large Size */}
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-50 to-pink-50 mb-6 shadow-lg">
                {selectedBadge.imagePath ? (
                  <img
                    src={selectedBadge.imagePath}
                    alt={selectedBadge.name}
                    className="w-28 h-28 object-contain"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`${selectedBadge.imagePath ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                  {(() => {
                    const Icon = selectedBadge.icon;
                    return <Icon className="w-16 h-16 text-purple-600" />;
                  })()}
                </div>
              </div>

              {/* Badge Name */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                {selectedBadge.name}
              </h3>

              {/* Badge Details */}
              <div className="w-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
                {selectedBadge.type === 'level' && (
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      {t(language, 'level')} {selectedBadge.level}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedBadge.requirement}
                    </div>
                  </div>
                )}
                {selectedBadge.type === 'point' && (
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      {selectedBadge.threshold === 0 ? t(language, 'firstSteps') : `${selectedBadge.threshold} ${t(language, 'points')}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedBadge.threshold === 0
                        ? 'Awarded when you start your journey'
                        : `Earn ${selectedBadge.threshold} total points to unlock`
                      }
                    </div>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className={`text-sm font-semibold ${selectedBadge.isEarned ? 'text-green-600' : 'text-gray-500'}`}>
                {selectedBadge.isEarned ? '✓ ' + t(language, 'earned') : '🔒 Locked'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgesModal;
