import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateQuestion,
  checkAnswer,
  simplifyFraction,
  formatFraction,
  parseFraction,
  fractionsEqual,
} from './questions';

describe('questions.js', () => {
  describe('generateQuestion - visualRepresent', () => {
    beforeEach(() => {
      // Reset Math.random for predictable tests
      vi.spyOn(Math, 'random').mockRestore();
    });

    it('should generate visualRepresent questions for levels 1-3', () => {
      for (let level = 1; level <= 3; level++) {
        const questions = [];
        // Generate multiple questions to ensure visualRepresent appears
        for (let i = 0; i < 20; i++) {
          const question = generateQuestion(level, 'en');
          if (question.type === 'visualRepresent') {
            questions.push(question);
          }
        }
        expect(questions.length).toBeGreaterThan(0);
      }
    });

    it('should not generate visualRepresent questions for levels 4+', () => {
      for (let level = 4; level <= 15; level++) {
        const questions = [];
        for (let i = 0; i < 50; i++) {
          const question = generateQuestion(level, 'en');
          if (question.type === 'visualRepresent') {
            questions.push(question);
          }
        }
        expect(questions.length).toBe(0);
      }
    });

    it('should generate proper fractions with correct structure', () => {
      // Mock Math.random to generate a proper fraction
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.5) // isProper = true (0.5 > 0.3)
        .mockReturnValueOnce(0.2); // denominator = 4, numerator = 2

      const question = generateQuestion(1, 'en');
      
      if (question.type === 'visualRepresent') {
        expect(question.numerator).toBeGreaterThan(0);
        expect(question.denominator).toBeGreaterThanOrEqual(2);
        expect(question.denominator).toBeLessThanOrEqual(8);
        expect(question.numerator).toBeLessThan(question.denominator);
        expect(question.answer).toBe(question.numerator.toString());
        expect(question.question).toBe(`${question.numerator}/${question.denominator}`);
      }
    });

    it('should generate improper fractions with correct structure', () => {
      // Mock to generate improper fraction
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.1) // isProper = false (0.1 < 0.3)
        .mockReturnValueOnce(0.5); // denominator = 4, numerator = 6

      const question = generateQuestion(1, 'en');
      
      if (question.type === 'visualRepresent') {
        expect(question.numerator).toBeGreaterThanOrEqual(question.denominator);
        expect(question.denominator).toBeGreaterThanOrEqual(2);
        expect(question.denominator).toBeLessThanOrEqual(8);
        expect(question.answer).toBe(question.numerator.toString());
      }
    });

    it('should include numerator and denominator in result', () => {
      const question = generateQuestion(1, 'en');
      
      if (question.type === 'visualRepresent') {
        expect(question).toHaveProperty('numerator');
        expect(question).toHaveProperty('denominator');
        expect(typeof question.numerator).toBe('number');
        expect(typeof question.denominator).toBe('number');
        expect(question.numerator).toBeGreaterThan(0);
        expect(question.denominator).toBeGreaterThan(1);
      }
    });

    it('should limit denominators to 2-8 for visual questions', () => {
      const denominators = new Set();
      
      for (let i = 0; i < 100; i++) {
        const question = generateQuestion(1, 'en');
        if (question.type === 'visualRepresent') {
          denominators.add(question.denominator);
          expect(question.denominator).toBeGreaterThanOrEqual(2);
          expect(question.denominator).toBeLessThanOrEqual(8);
        }
      }
    });
  });

  describe('checkAnswer - visual representation validation', () => {
    it('should validate visual representation answers correctly', () => {
      // For visual questions, answer is segment count (string)
      expect(checkAnswer('2', '2')).toBe(true);
      expect(checkAnswer('5', '5')).toBe(true);
      expect(checkAnswer('7', '7')).toBe(true);
      expect(checkAnswer('2', '3')).toBe(false);
      expect(checkAnswer('0', '1')).toBe(false);
    });

    it('should handle edge cases for visual answers', () => {
      expect(checkAnswer('1', '1')).toBe(true);
      expect(checkAnswer('8', '8')).toBe(true);
      expect(checkAnswer('', '1')).toBe(false);
    });
  });

  describe('simplifyFraction', () => {
    it('should simplify fractions correctly', () => {
      expect(simplifyFraction(2, 4)).toEqual({ numerator: 1, denominator: 2 });
      expect(simplifyFraction(4, 8)).toEqual({ numerator: 1, denominator: 2 });
      expect(simplifyFraction(6, 9)).toEqual({ numerator: 2, denominator: 3 });
      expect(simplifyFraction(8, 12)).toEqual({ numerator: 2, denominator: 3 });
    });

    it('should handle already simplified fractions', () => {
      expect(simplifyFraction(1, 2)).toEqual({ numerator: 1, denominator: 2 });
      expect(simplifyFraction(3, 4)).toEqual({ numerator: 3, denominator: 4 });
    });

    it('should handle zero and edge cases', () => {
      expect(simplifyFraction(0, 5)).toEqual({ numerator: 0, denominator: 1 });
      expect(simplifyFraction(5, 0)).toEqual({ numerator: 0, denominator: 1 });
    });
  });

  describe('formatFraction', () => {
    it('should format fractions correctly', () => {
      expect(formatFraction(1, 2)).toBe('1/2');
      expect(formatFraction(3, 4)).toBe('3/4');
      expect(formatFraction(5, 1)).toBe('5');
      expect(formatFraction(0, 5)).toBe('0');
    });
  });

  describe('parseFraction', () => {
    it('should parse fraction strings', () => {
      expect(parseFraction('1/2')).toEqual({ numerator: 1, denominator: 2 });
      expect(parseFraction('3/4')).toEqual({ numerator: 3, denominator: 4 });
      expect(parseFraction('5/8')).toEqual({ numerator: 5, denominator: 8 });
    });

    it('should parse decimal strings', () => {
      const result = parseFraction('0.5');
      expect(result).not.toBeNull();
      expect(result.denominator).toBeGreaterThan(0);
    });

    it('should handle invalid inputs', () => {
      expect(parseFraction('')).toBeNull();
      expect(parseFraction('invalid')).toBeNull();
      expect(parseFraction('1/0')).toBeNull();
    });
  });

  describe('fractionsEqual', () => {
    it('should compare fractions correctly', () => {
      expect(fractionsEqual({ numerator: 1, denominator: 2 }, { numerator: 2, denominator: 4 })).toBe(true);
      expect(fractionsEqual({ numerator: 3, denominator: 4 }, { numerator: 6, denominator: 8 })).toBe(true);
      expect(fractionsEqual({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 })).toBe(false);
    });
  });
});

