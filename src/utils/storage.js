/**
 * Storage utilities for Fracta app
 * Persists canonical app state under fm_progress (profiles × tracks).
 */

import {
  migrateRawToAppState,
  createDefaultProfileData,
  createDefaultTrackProgress,
  PROFILE_IDS,
  getProfile,
} from './storage/migrate';

export {
  migrateRawToAppState,
  createDefaultAppState,
  createDefaultProfileData,
  createDefaultTrackProgress,
  PROFILE_IDS,
  getProfile,
} from './storage/migrate';

export const getStorageItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

export const getStorageJSON = (key) => {
  const value = getStorageItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error(`Error parsing JSON from localStorage key "${key}":`, error);
    return null;
  }
};

export const setStorageJSON = (key, value) => {
  try {
    setStorageItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error stringifying JSON for localStorage key "${key}":`, error);
  }
};

/** Full persisted document (profiles, active player, schema). */
export const loadAppState = () => {
  const stored = getStorageJSON('fm_progress');
  return migrateRawToAppState(stored);
};

export const saveAppState = (appState) => {
  setStorageJSON('fm_progress', appState);
};

/** Active profile's fraction track (game + onboarding for fractions). */
export const loadProgress = () => {
  const app = loadAppState();
  const profile = getProfile(app, app.activeProfileId);
  if (!profile) return createDefaultTrackProgress();
  return { ...profile.fractions, completedLevels: { ...profile.fractions.completedLevels } };
};

export const saveProgress = (fractionsProgress) => {
  const app = loadAppState();
  const id = app.activeProfileId;
  const profile = getProfile(app, id) || createDefaultProfileData();
  const next = {
    ...app,
    profiles: {
      ...app.profiles,
      [id]: {
        ...profile,
        fractions: {
          ...fractionsProgress,
          completedLevels: { ...fractionsProgress.completedLevels },
        },
      },
    },
  };
  saveAppState(next);
};

export const loadArithmeticProgress = () => {
  const app = loadAppState();
  const profile = getProfile(app, app.activeProfileId);
  if (!profile) return createDefaultTrackProgress();
  return { ...profile.arithmetic, completedLevels: { ...profile.arithmetic.completedLevels } };
};

export const saveArithmeticProgress = (arithmeticProgress) => {
  const app = loadAppState();
  const id = app.activeProfileId;
  const profile = getProfile(app, id) || createDefaultProfileData();
  const next = {
    ...app,
    profiles: {
      ...app.profiles,
      [id]: {
        ...profile,
        arithmetic: {
          ...arithmeticProgress,
          completedLevels: { ...arithmeticProgress.completedLevels },
        },
      },
    },
  };
  saveAppState(next);
};

export const loadAccessibility = () => {
  const app = loadAppState();
  const profile = getProfile(app, app.activeProfileId);
  return profile?.accessibility || { dyslexiaFont: false };
};

export const saveAccessibility = (accessibility) => {
  const app = loadAppState();
  const id = app.activeProfileId;
  const profile = getProfile(app, id) || createDefaultProfileData();
  const next = {
    ...app,
    profiles: {
      ...app.profiles,
      [id]: {
        ...profile,
        accessibility: { ...profile.accessibility, ...accessibility },
      },
    },
  };
  saveAppState(next);
};

export const setActiveProfileId = (profileId) => {
  if (!PROFILE_IDS.includes(profileId)) return loadAppState();
  const app = loadAppState();
  const next = { ...app, activeProfileId: profileId };
  saveAppState(next);
  return next;
};

/** Persist active player and return the new full app state. */
export const switchToProfile = (profileId) => {
  if (!PROFILE_IDS.includes(profileId)) return null;
  const app = loadAppState();
  const next = { ...app, activeProfileId: profileId };
  saveAppState(next);
  return next;
};

/** Reset fraction + arithmetic tracks for the active profile; keeps accessibility. */
export const resetActiveProfileGameProgress = () => {
  const app = loadAppState();
  const id = app.activeProfileId;
  const profile = getProfile(app, id) || createDefaultProfileData();
  const next = {
    ...app,
    profiles: {
      ...app.profiles,
      [id]: {
        ...profile,
        fractions: createDefaultTrackProgress(),
        arithmetic: createDefaultTrackProgress(),
      },
    },
  };
  saveAppState(next);
};

export const loadLanguage = () => {
  return getStorageItem('fm_language') || 'ca';
};

export const saveLanguage = (lang) => {
  setStorageItem('fm_language', lang);
};
