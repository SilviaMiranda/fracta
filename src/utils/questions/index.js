/**
 * Question router: fractions vs arithmetic track.
 */

import { TRACK_ARITHMETIC, TRACK_FRACTIONS } from '../trackConfig';
import * as fractions from './fractions';
import * as arithmetic from './arithmetic';

export const simplifyFraction = fractions.simplifyFraction;
export const formatFraction = fractions.formatFraction;
export const parseFraction = fractions.parseFraction;
export const normalizeAnswer = fractions.normalizeAnswer;
export const fractionsEqual = fractions.fractionsEqual;

/**
 * @param {number} level
 * @param {string} lang
 * @param {'fractions' | 'arithmetic'} [track]
 */
export function generateQuestion(level, lang, track = TRACK_FRACTIONS) {
  if (track === TRACK_ARITHMETIC) {
    return arithmetic.generateArithmeticQuestion(level, lang);
  }
  return fractions.generateQuestion(level, lang);
}

/**
 * @param {string} userAnswer
 * @param {string} correctAnswer
 * @param {'fractions' | 'arithmetic'} [track]
 */
export function checkAnswer(userAnswer, correctAnswer, track = TRACK_FRACTIONS) {
  if (track === TRACK_ARITHMETIC) {
    return arithmetic.checkArithmeticAnswer(userAnswer, correctAnswer);
  }
  return fractions.checkFractionAnswer(userAnswer, correctAnswer);
}

export { generateArithmeticQuestion, checkArithmeticAnswer } from './arithmetic';
