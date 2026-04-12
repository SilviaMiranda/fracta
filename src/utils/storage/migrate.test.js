import { describe, it, expect } from 'vitest';
import {
  migrateRawToAppState,
  createDefaultAppState,
  isLegacyRootFlatProgress,
  SCHEMA_VERSION,
  PROFILE_IDS,
  createDefaultTrackProgress,
} from './migrate';

describe('migrateRawToAppState', () => {
  it('returns defaults for null', () => {
    const s = migrateRawToAppState(null);
    expect(s.schemaVersion).toBe(SCHEMA_VERSION);
    expect(s.activeProfileId).toBe('player_1');
    expect(PROFILE_IDS.every((id) => s.profiles[id])).toBe(true);
    expect(s.profiles.player_1.fractions.onboardingComplete).toBe(false);
  });

  it('wraps legacy flat progress into player_1.fractions', () => {
    const legacy = {
      currentLevel: 7,
      highestUnlockedLevel: 8,
      totalPoints: 400,
      completedLevels: { 1: { stars: 3, score: 80 } },
      badges: ['first_steps'],
      onboardingComplete: true,
    };
    expect(isLegacyRootFlatProgress(legacy)).toBe(true);
    const s = migrateRawToAppState(legacy);
    expect(s.profiles.player_1.fractions).toMatchObject({
      currentLevel: 7,
      highestUnlockedLevel: 8,
      totalPoints: 400,
      onboardingComplete: true,
      badges: ['first_steps'],
    });
    expect(s.profiles.player_1.arithmetic).toEqual(createDefaultTrackProgress());
    expect(s.profiles.player_2.fractions.onboardingComplete).toBe(false);
  });

  it('is idempotent for canonical state', () => {
    const once = migrateRawToAppState(null);
    const twice = migrateRawToAppState(JSON.parse(JSON.stringify(once)));
    expect(twice).toEqual(once);
  });

  it('normalizes partial profiles map', () => {
    const raw = {
      schemaVersion: 3,
      activeProfileId: 'player_2',
      profiles: {
        player_1: { currentLevel: 2, highestUnlockedLevel: 2, totalPoints: 0, completedLevels: {}, badges: [], onboardingComplete: false },
      },
    };
    const s = migrateRawToAppState(raw);
    expect(s.profiles.player_2.fractions.onboardingComplete).toBe(false);
    expect(s.activeProfileId).toBe('player_2');
  });
});

describe('createDefaultAppState', () => {
  it('has two players with independent defaults', () => {
    const a = createDefaultAppState();
    const b = createDefaultAppState();
    expect(a.profiles.player_1).toEqual(b.profiles.player_1);
    expect(a.profiles.player_1).not.toBe(b.profiles.player_1);
  });
});
