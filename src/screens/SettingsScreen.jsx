import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { t } from '../utils/translations';
import { saveLanguage, saveProgress } from '../utils/storage';
import { getEarnedBadges, BADGE_DEFINITIONS } from '../utils/badges';
import packageInfo from '../../package.json';

/**
 * Settings Screen Component
 * Language switcher and progress reset
 */
const SettingsScreen = ({ language, progress, onNavigate, onChangeLanguage, onUpdateProgress }) => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ca', name: 'Català' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
  ];

  const handleLanguageChange = (langCode) => {
    saveLanguage(langCode);
    onChangeLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  const handleResetProgress = () => {
    const defaultProgress = {
      currentLevel: 1,
      highestUnlockedLevel: 1,
      totalPoints: 0,
      completedLevels: {},
      badges: [],
      onboardingComplete: false,
    };
    
    saveProgress(defaultProgress);
    onUpdateProgress(defaultProgress);
    setShowResetConfirm(false);
    onNavigate('home');
  };

  const currentLanguageName = languages.find(l => l.code === language)?.name || 'Català';
  const earnedBadges = getEarnedBadges(progress.totalPoints || 0, language);

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

        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {t(language, 'settings')}
        </h2>

        {/* Language selector */}
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            {t(language, 'language')}
          </label>
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span>{currentLanguageName}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showLanguageDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      language === lang.code ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Badges section */}
        {earnedBadges.length > 0 && (
          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-medium mb-3">
              {t(language, 'badges')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {earnedBadges.map((badge) => {
                const Icon = badge.icon;
                const badgeData = BADGE_DEFINITIONS.find(b => b.id === badge.id);
                return (
                  <div
                    key={badge.id}
                    className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg"
                  >
                    {/* Badge Image or Icon */}
                    <div className="w-11 h-11 flex items-center justify-center flex-shrink-0">
                      {badgeData?.imagePath ? (
                        <img
                          src={badgeData.imagePath}
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
                        className={`w-8 h-8 text-purple-600 ${badgeData?.imagePath ? 'hidden' : 'block'}`}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{badge.name}</div>
                      <div className="text-xs text-gray-600">
                        {badge.threshold} {t(language, 'points')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reset progress */}
        <div className="border-t pt-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            {t(language, 'resetProgress')}
          </label>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full bg-red-50 text-red-700 font-semibold py-3 px-6 rounded-xl hover:bg-red-100 transition-colors"
            >
              {t(language, 'resetProgress')}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">
                {t(language, 'resetProgressConfirm')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  {t(language, 'cancel')}
                </button>
                <button
                  onClick={handleResetProgress}
                  className="flex-1 bg-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-600 transition-colors"
                >
                  {t(language, 'confirm')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Version Display */}
        <div className="mt-6 text-center text-xs text-gray-400">
          Fracta v{packageInfo.version}
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;

