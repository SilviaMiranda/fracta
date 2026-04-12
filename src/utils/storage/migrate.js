/**
 * Canonical persisted app shape: profiles × (fractions + arithmetic tracks) + accessibility.
 */

export const SCHEMA_VERSION = 4;

export const PROFILE_IDS = ['player_1', 'player_2'];

export function createDefaultTrackProgress() {
  return {
    currentLevel: 1,
    highestUnlockedLevel: 1,
    totalPoints: 0,
    completedLevels: {},
    badges: [],
    onboardingComplete: false,
  };
}

export function createDefaultAccessibility() {
  return { dyslexiaFont: false };
}

export function createDefaultProfileData() {
  return {
    fractions: createDefaultTrackProgress(),
    arithmetic: createDefaultTrackProgress(),
    accessibility: createDefaultAccessibility(),
  };
}

export function createDefaultAppState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    activeProfileId: 'player_1',
    profiles: {
      player_1: createDefaultProfileData(),
      player_2: createDefaultProfileData(),
    },
  };
}

/**
 * Legacy root object (pre-profiles): flat fraction progress only.
 * @param {unknown} raw
 * @returns {boolean}
 */
export function isLegacyRootFlatProgress(raw) {
  if (!raw || typeof raw !== 'object') return false;
  const o = /** @type {Record<string, unknown>} */ (raw);
  if ('profiles' in o) return false;
  if ('schemaVersion' in o && o.schemaVersion === SCHEMA_VERSION) return false;
  return (
    'currentLevel' in o ||
    'highestUnlockedLevel' in o ||
    'onboardingComplete' in o ||
    'totalPoints' in o
  );
}

const TRACK_FIELDS = [
  'currentLevel',
  'highestUnlockedLevel',
  'totalPoints',
  'completedLevels',
  'badges',
  'onboardingComplete',
];

export function trackProgressFromUnknown(src) {
  const d = createDefaultTrackProgress();
  if (!src || typeof src !== 'object') return d;
  const o = /** @type {Record<string, unknown>} */ (src);
  return {
    currentLevel: typeof o.currentLevel === 'number' ? o.currentLevel : d.currentLevel,
    highestUnlockedLevel:
      typeof o.highestUnlockedLevel === 'number' ? o.highestUnlockedLevel : d.highestUnlockedLevel,
    totalPoints: typeof o.totalPoints === 'number' ? o.totalPoints : d.totalPoints,
    completedLevels:
      o.completedLevels && typeof o.completedLevels === 'object'
        ? /** @type {Record<string, unknown>} */ (o.completedLevels)
        : d.completedLevels,
    badges: Array.isArray(o.badges) ? o.badges : d.badges,
    onboardingComplete:
      typeof o.onboardingComplete === 'boolean' ? o.onboardingComplete : d.onboardingComplete,
  };
}

export function normalizeProfileData(raw) {
  if (!raw || typeof raw !== 'object') return createDefaultProfileData();
  const o = /** @type {Record<string, unknown>} */ (raw);
  if (o.fractions && o.arithmetic) {
    return {
      fractions: trackProgressFromUnknown(o.fractions),
      arithmetic: trackProgressFromUnknown(o.arithmetic),
      accessibility: {
        dyslexiaFont:
          o.accessibility &&
          typeof o.accessibility === 'object' &&
          /** @type {Record<string, unknown>} */ (o.accessibility).dyslexiaFont === true,
      },
    };
  }
  const flat = trackProgressFromUnknown(raw);
  const hasOnlyTrackKeys = Object.keys(o).every((k) => TRACK_FIELDS.includes(k));
  if (hasOnlyTrackKeys || 'currentLevel' in o) {
    return {
      fractions: flat,
      arithmetic: createDefaultTrackProgress(),
      accessibility: createDefaultAccessibility(),
    };
  }
  return createDefaultProfileData();
}

/** Idempotent migration from any prior stored shape to SCHEMA_VERSION. */
export function migrateRawToAppState(raw) {
  if (!raw || typeof raw !== 'object') {
    return createDefaultAppState();
  }

  if (isLegacyRootFlatProgress(raw)) {
    const flat = trackProgressFromUnknown(raw);
    return {
      schemaVersion: SCHEMA_VERSION,
      activeProfileId: 'player_1',
      profiles: {
        player_1: {
          fractions: flat,
          arithmetic: createDefaultTrackProgress(),
          accessibility: createDefaultAccessibility(),
        },
        player_2: createDefaultProfileData(),
      },
    };
  }

  const o = /** @type {Record<string, unknown>} */ (raw);
  if (!o.profiles || typeof o.profiles !== 'object') {
    return createDefaultAppState();
  }

  const profilesRaw = /** @type {Record<string, unknown>} */ (o.profiles);
  /** @type {Record<string, ProfileData>} */
  const profiles = {};
  for (const id of PROFILE_IDS) {
    profiles[id] = normalizeProfileData(profilesRaw[id]);
  }

  const active = PROFILE_IDS.includes(/** @type {string} */ (o.activeProfileId))
    ? /** @type {'player_1' | 'player_2'} */ (o.activeProfileId)
    : 'player_1';

  return {
    schemaVersion: SCHEMA_VERSION,
    activeProfileId: active,
    profiles,
  };
}

export function getProfile(state, profileId) {
  const p = state.profiles[profileId];
  return p || null;
}
