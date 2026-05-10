import { describe, it, expect } from 'vitest';
import {
  checkArithmeticAnswer,
  normalizeArithmeticAnswer,
  arithmeticStartingLevel,
  generateArithmeticQuestion,
  assertThemeStemCap,
  wordStemsAdd,
  wordStemsSubtract,
  wordStemsCombine,
  MAX_STEMS_PER_THEME,
  sampleAllWordStemQuestions,
} from './arithmetic';

/** Apple / apple-fruit vocabulary must not appear in word stems (per curriculum policy). */
const APPLE_FORBIDDEN =
  /apples?|äpfel|apfel|manzanas?|pomes|poma\b/i;

function themeCountsFromPools(pools) {
  const counts = Object.create(null);
  for (const pool of pools) {
    for (const { theme } of pool) {
      counts[theme] = (counts[theme] ?? 0) + 1;
    }
  }
  return counts;
}

describe('arithmetic', () => {
  it('checkArithmeticAnswer accepts integer strings with spaces', () => {
    expect(checkArithmeticAnswer('  12  ', '12')).toBe(true);
    expect(checkArithmeticAnswer('7', '8')).toBe(false);
  });

  it('normalizeArithmeticAnswer strips spaces', () => {
    expect(normalizeArithmeticAnswer('  3  ')).toBe('3');
  });

  it('arithmeticStartingLevel maps score bands', () => {
    expect(arithmeticStartingLevel(0, 7)).toBe(1);
    expect(arithmeticStartingLevel(6, 7)).toBeGreaterThanOrEqual(4);
  });

  it('generateArithmeticQuestion returns shape', () => {
    const q = generateArithmeticQuestion(2, 'ca');
    expect(q).toHaveProperty('question');
    expect(q).toHaveProperty('answer');
    expect(q).toHaveProperty('type');
  });

  it('each theme appears at most MAX_STEMS_PER_THEME times across word stem pools', () => {
    const pools = [wordStemsAdd, wordStemsSubtract, wordStemsCombine];
    expect(() => assertThemeStemCap(pools, MAX_STEMS_PER_THEME)).not.toThrow();
    const counts = themeCountsFromPools(pools);
    for (const [theme, n] of Object.entries(counts)) {
      expect(n, `theme "${theme}"`).toBeLessThanOrEqual(MAX_STEMS_PER_THEME);
    }
  });

  it('word stem samples contain no apple vocabulary (all locales)', () => {
    const texts = sampleAllWordStemQuestions(5, 3);
    expect(texts.length).toBeGreaterThan(0);
    for (const t of texts) {
      expect(t).not.toMatch(APPLE_FORBIDDEN);
    }
  });
});
