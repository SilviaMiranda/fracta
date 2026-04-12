export const TRACK_FRACTIONS = 'fractions';
export const TRACK_ARITHMETIC = 'arithmetic';

/**
 * @param {'fractions' | 'arithmetic'} track
 */
export function getTrackConfig(track) {
  if (track === TRACK_ARITHMETIC) {
    return {
      track,
      levelCount: 12,
      questionsPerLevel: 5,
      pointsPerCorrect: 10,
      onboardingQuestionCount: 7,
    };
  }
  return {
    track: TRACK_FRACTIONS,
    levelCount: 15,
    questionsPerLevel: 8,
    pointsPerCorrect: 10,
    onboardingQuestionCount: 10,
  };
}

export function maxPointsForTrack(track) {
  const c = getTrackConfig(track);
  return c.questionsPerLevel * c.pointsPerCorrect;
}
