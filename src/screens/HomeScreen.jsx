import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { t } from '../utils/translations';
import { saveLanguage } from '../utils/storage';
import { getTotalBadgeCount } from '../utils/badges';
import { TRACK_ARITHMETIC, TRACK_FRACTIONS } from '../utils/trackConfig';
import Logo from '../components/Logo';
import BadgesModal from '../components/BadgesModal';

const HomeScreen = ({
  language,
  fractionsProgress,
  arithmeticProgress,
  activeProfileId,
  onSwitchPlayer,
  onNavigate,
  onChangeLanguage,
}) => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [badgesModal, setBadgesModal] = useState(null);

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

  const goFractions = (toOnboarding) => {
    if (toOnboarding) {
      onNavigate('onboarding', { track: TRACK_FRACTIONS });
    } else {
      onNavigate('levels', { track: TRACK_FRACTIONS });
    }
  };

  const goArithmetic = (toOnboarding) => {
    if (toOnboarding) {
      onNavigate('onboarding', { track: TRACK_ARITHMETIC });
    } else {
      onNavigate('levels', { track: TRACK_ARITHMETIC });
    }
  };

  const currentLanguageName = languages.find((l) => l.code === language)?.name || 'Català';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full">
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

        <div className="flex justify-center mb-4">
          <Logo size="large" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {t(language, 'appTitle')}
        </h1>
        <p className="text-gray-600 text-center mb-6">{t(language, 'appSubtitle')}</p>

        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-2">{t(language, 'playingAs')}</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onSwitchPlayer('player_1')}
              className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-colors ${
                activeProfileId === 'player_1'
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t(language, 'player1')}
            </button>
            <button
              type="button"
              onClick={() => onSwitchPlayer('player_2')}
              className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-colors ${
                activeProfileId === 'player_2'
                  ? 'border-pink-500 bg-pink-50 text-pink-800'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t(language, 'player2')}
            </button>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div className="border border-blue-100 rounded-2xl p-4 bg-blue-50/50">
            <h2 className="font-bold text-gray-800 mb-2">{t(language, 'sectionFractions')}</h2>
            {fractionsProgress.onboardingComplete && (
              <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                <div className="bg-white rounded-lg p-2">
                  <div className="text-blue-600 font-medium">{t(language, 'points')}</div>
                  <div className="font-bold text-blue-900">{fractionsProgress.totalPoints || 0}</div>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <div className="text-pink-600 font-medium">{t(language, 'level')}</div>
                  <div className="font-bold text-pink-900">{fractionsProgress.currentLevel || 1}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setBadgesModal(TRACK_FRACTIONS)}
                  className="bg-white rounded-lg p-2 hover:bg-purple-50"
                >
                  <div className="text-purple-600 font-medium">{t(language, 'badges')}</div>
                  <div className="font-bold text-purple-900">
                    {getTotalBadgeCount(
                      fractionsProgress.totalPoints || 0,
                      fractionsProgress.badges || [],
                      TRACK_FRACTIONS
                    )}
                  </div>
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() =>
                goFractions(!fractionsProgress.onboardingComplete)
              }
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow"
            >
              {fractionsProgress.onboardingComplete
                ? t(language, 'continueFractions')
                : t(language, 'startFractions')}
            </button>
          </div>

          <div className="border border-pink-100 rounded-2xl p-4 bg-pink-50/50">
            <h2 className="font-bold text-gray-800 mb-2">{t(language, 'sectionArithmetic')}</h2>
            {arithmeticProgress.onboardingComplete && (
              <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                <div className="bg-white rounded-lg p-2">
                  <div className="text-blue-600 font-medium">{t(language, 'points')}</div>
                  <div className="font-bold text-blue-900">{arithmeticProgress.totalPoints || 0}</div>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <div className="text-pink-600 font-medium">{t(language, 'level')}</div>
                  <div className="font-bold text-pink-900">{arithmeticProgress.currentLevel || 1}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setBadgesModal(TRACK_ARITHMETIC)}
                  className="bg-white rounded-lg p-2 hover:bg-purple-50"
                >
                  <div className="text-purple-600 font-medium">{t(language, 'badges')}</div>
                  <div className="font-bold text-purple-900">
                    {getTotalBadgeCount(
                      arithmeticProgress.totalPoints || 0,
                      arithmeticProgress.badges || [],
                      TRACK_ARITHMETIC
                    )}
                  </div>
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() =>
                goArithmetic(!arithmeticProgress.onboardingComplete)
              }
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow"
            >
              {arithmeticProgress.onboardingComplete
                ? t(language, 'continueArithmetic')
                : t(language, 'startArithmetic')}
            </button>
          </div>
        </div>

        <div className="relative">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            {t(language, 'language')}
          </label>
          <button
            type="button"
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span>{currentLanguageName}</span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}
            />
          </button>

          {showLanguageDropdown && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
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

      {badgesModal && (
        <BadgesModal
          language={language}
          track={badgesModal}
          progress={
            badgesModal === TRACK_ARITHMETIC ? arithmeticProgress : fractionsProgress
          }
          onClose={() => setBadgesModal(null)}
        />
      )}
    </div>
  );
};

export default HomeScreen;
