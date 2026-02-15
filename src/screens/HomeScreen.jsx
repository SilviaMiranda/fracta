import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { t } from '../utils/translations';
import { loadLanguage, saveLanguage } from '../utils/storage';
import { getTotalBadgeCount } from '../utils/badges';
import Logo from '../components/Logo';
import BadgesModal from '../components/BadgesModal';

/**
 * Home Screen Component
 * Landing page with logo, language selector, and start/continue button
 */
const HomeScreen = ({ language, progress, onNavigate, onChangeLanguage }) => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  
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

  const handleContinue = () => {
    if (progress.onboardingComplete) {
      onNavigate('levels');
    } else {
      onNavigate('onboarding');
    }
  };

  const currentLanguageName = languages.find(l => l.code === language)?.name || 'Català';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full">
        {/* Settings icon */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => onNavigate('settings')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            aria-label={t(language, 'settings')}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size="large" />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {t(language, 'appTitle')}
        </h1>
        <p className="text-gray-600 text-center mb-8">
          {t(language, 'appSubtitle')}
        </p>

        {/* Progress stats */}
        {progress.onboardingComplete && (
          <div className="grid grid-cols-3 gap-4 mb-8">
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
            <button
              onClick={() => setShowBadgesModal(true)}
              className="bg-purple-50 rounded-xl p-4 text-center hover:bg-purple-100 transition-colors cursor-pointer"
            >
              <div className="text-purple-600 font-semibold text-sm mb-1">
                {t(language, 'badges')}
              </div>
              <div className="text-purple-800 text-2xl font-bold">
                {getTotalBadgeCount(progress.totalPoints || 0, progress.badges || [])}
              </div>
            </button>
          </div>
        )}

        {/* Continue/Start button */}
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl mb-6"
        >
          {progress.onboardingComplete
            ? t(language, 'continuePlaying')
            : t(language, 'startJourney')}
        </button>

        {/* Language selector */}
        <div className="relative">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            {t(language, 'language')}
          </label>
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

      {/* Badges Modal */}
      {showBadgesModal && (
        <BadgesModal
          language={language}
          progress={progress}
          onClose={() => setShowBadgesModal(false)}
        />
      )}
    </div>
  );
};

export default HomeScreen;

