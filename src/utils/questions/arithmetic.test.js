import { describe, it, expect } from 'vitest';
import {
  checkArithmeticAnswer,
  normalizeArithmeticAnswer,
  arithmeticStartingLevel,
  generateArithmeticQuestion,
} from './arithmetic';

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
});
