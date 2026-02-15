/**
 * Storage utilities for Fracta app
 * Uses browser localStorage (synchronous) instead of Claude.ai storage API
 */

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @returns {string|null} - Stored value or null
 */
export const getStorageItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
};

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

/**
 * Get JSON object from localStorage
 * @param {string} key - Storage key
 * @returns {object|null} - Parsed object or null
 */
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

/**
 * Set JSON object in localStorage
 * @param {string} key - Storage key
 * @param {object} value - Object to store
 */
export const setStorageJSON = (key, value) => {
  try {
    setStorageItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error stringifying JSON for localStorage key "${key}":`, error);
  }
};

/**
 * Load progress data from localStorage
 * @returns {object} - Progress object with defaults
 */
export const loadProgress = () => {
  const defaultProgress = {
    currentLevel: 1,
    highestUnlockedLevel: 1,
    totalPoints: 0,
    completedLevels: {},
    badges: [],
    onboardingComplete: false,
  };
  
  const stored = getStorageJSON('fm_progress');
  return stored || defaultProgress;
};

/**
 * Save progress data to localStorage
 * @param {object} progress - Progress object to save
 */
export const saveProgress = (progress) => {
  setStorageJSON('fm_progress', progress);
};

/**
 * Load language preference from localStorage
 * @returns {string} - Language code (default: 'ca')
 */
export const loadLanguage = () => {
  return getStorageItem('fm_language') || 'ca';
};

/**
 * Save language preference to localStorage
 * @param {string} lang - Language code
 */
export const saveLanguage = (lang) => {
  setStorageItem('fm_language', lang);
};

