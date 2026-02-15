/**
 * Question generation utilities for Fracta
 * Generates fraction problems with increasing difficulty
 */

/**
 * Calculate GCD (Greatest Common Divisor) using Euclidean algorithm
 */
const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

/**
 * Simplify a fraction to lowest terms
 * @param {number} numerator
 * @param {number} denominator
 * @returns {object} - {numerator, denominator}
 */
export const simplifyFraction = (numerator, denominator) => {
  if (denominator === 0) return { numerator: 0, denominator: 1 };
  if (numerator === 0) return { numerator: 0, denominator: 1 };
  
  const divisor = gcd(numerator, denominator);
  const simplifiedNum = numerator / divisor;
  const simplifiedDen = denominator / divisor;
  
  // Handle negative signs
  if (simplifiedDen < 0) {
    return { numerator: -simplifiedNum, denominator: -simplifiedDen };
  }
  
  return { numerator: simplifiedNum, denominator: simplifiedDen };
};

/**
 * Format fraction as string
 * @param {number} numerator
 * @param {number} denominator
 * @returns {string} - Formatted fraction (e.g., "1/2")
 */
export const formatFraction = (numerator, denominator) => {
  if (denominator === 1) return numerator.toString();
  if (numerator === 0) return "0";
  return `${numerator}/${denominator}`;
};

/**
 * Parse fraction string to numbers
 * @param {string} fractionStr - Fraction string (e.g., "1/2", "3/4", "0.5")
 * @returns {object|null} - {numerator, denominator} or null if invalid
 */
export const parseFraction = (fractionStr) => {
  if (!fractionStr) return null;
  
  // Remove spaces and convert to lowercase
  const cleaned = fractionStr.trim().toLowerCase().replace(/\s+/g, '');
  
  // Try decimal format (e.g., "0.5")
  if (cleaned.includes('.') && !cleaned.includes('/')) {
    const decimal = parseFloat(cleaned);
    if (isNaN(decimal)) return null;
    
    // Convert decimal to fraction
    const denominator = 100;
    const numerator = Math.round(decimal * denominator);
    return simplifyFraction(numerator, denominator);
  }
  
  // Try fraction format (e.g., "1/2", "3/4")
  const parts = cleaned.split('/');
  if (parts.length === 2) {
    const numerator = parseInt(parts[0], 10);
    const denominator = parseInt(parts[1], 10);
    
    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
      return null;
    }
    
    return simplifyFraction(numerator, denominator);
  }
  
  // Try integer format
  const integer = parseInt(cleaned, 10);
  if (!isNaN(integer)) {
    return { numerator: integer, denominator: 1 };
  }
  
  return null;
};

/**
 * Normalize answer string for comparison
 * @param {string} answer - Answer string
 * @returns {string} - Normalized answer
 */
export const normalizeAnswer = (answer) => {
  return answer.trim().toLowerCase().replace(/\s+/g, '');
};

/**
 * Check if two fractions are equal
 * @param {object} frac1 - {numerator, denominator}
 * @param {object} frac2 - {numerator, denominator}
 * @returns {boolean}
 */
export const fractionsEqual = (frac1, frac2) => {
  const simplified1 = simplifyFraction(frac1.numerator, frac1.denominator);
  const simplified2 = simplifyFraction(frac2.numerator, frac2.denominator);
  
  return simplified1.numerator === simplified2.numerator &&
         simplified1.denominator === simplified2.denominator;
};

/**
 * Generate a random integer between min and max (inclusive)
 */
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate a question based on level
 * @param {number} level - Level number (1-15)
 * @param {string} lang - Language code for question type
 * @returns {object} - Question object with question, answer, type
 */
export const generateQuestion = (level, lang) => {
  const questionTypes = [];
  
  // Determine available question types based on level
  if (level >= 1) {
    questionTypes.push('simplify');
    questionTypes.push('visualRepresent');
  }
  if (level >= 2) {
    questionTypes.push('compare');
    questionTypes.push('visualRepresent');
  }
  if (level >= 3) {
    questionTypes.push('simplify');
    questionTypes.push('visualRepresent');
  }
  if (level >= 4) {
    questionTypes.push('add');
    questionTypes.push('subtract');
  }
  if (level >= 6) questionTypes.push('multiply');
  if (level >= 7) questionTypes.push('divide');
  if (level >= 9) questionTypes.push('decimal');
  
  // Select random question type
  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  
  // Generate question based on type and level
  let question, answer, questionText;
  
  switch (type) {
    case 'simplify': {
      // Generate fraction to simplify
      const maxDenominator = Math.min(12 + level * 2, 20);
      const denominator = randomInt(2, maxDenominator);
      const numerator = randomInt(1, denominator * 2 - 1);
      
      const simplified = simplifyFraction(numerator, denominator);
      question = `${numerator}/${denominator}`;
      answer = formatFraction(simplified.numerator, simplified.denominator);
      questionText = `simplify`;
      break;
    }
    
    case 'compare': {
      // Generate two fractions to compare
      const den1 = randomInt(2, 8);
      const num1 = randomInt(1, den1 - 1);
      const den2 = randomInt(2, 8);
      const num2 = randomInt(1, den2 - 1);
      
      const val1 = num1 / den1;
      const val2 = num2 / den2;
      const larger = val1 > val2 ? `${num1}/${den1}` : `${num2}/${den2}`;
      
      question = `${num1}/${den1} vs ${num2}/${den2}`;
      answer = larger;
      questionText = `whichLarger`;
      break;
    }
    
    case 'add': {
      // Generate two fractions to add
      const den1 = randomInt(2, Math.min(8 + level, 12));
      const num1 = randomInt(1, den1 - 1);
      const den2 = randomInt(2, Math.min(8 + level, 12));
      const num2 = randomInt(1, den2 - 1);
      
      // Calculate sum: (num1/den1) + (num2/den2) = (num1*den2 + num2*den1) / (den1*den2)
      const sumNum = num1 * den2 + num2 * den1;
      const sumDen = den1 * den2;
      const simplified = simplifyFraction(sumNum, sumDen);
      
      question = `${num1}/${den1} + ${num2}/${den2}`;
      answer = formatFraction(simplified.numerator, simplified.denominator);
      questionText = `add`;
      break;
    }
    
    case 'subtract': {
      // Generate two fractions to subtract (ensure positive result)
      const den1 = randomInt(2, Math.min(8 + level, 12));
      const num1 = randomInt(2, den1 - 1);
      const den2 = randomInt(2, Math.min(8 + level, 12));
      const num2 = randomInt(1, Math.min(num1 * den2 / den1, den2 - 1));
      
      // Calculate difference: (num1/den1) - (num2/den2)
      const diffNum = num1 * den2 - num2 * den1;
      const diffDen = den1 * den2;
      const simplified = simplifyFraction(diffNum, diffDen);
      
      question = `${num1}/${den1} - ${num2}/${den2}`;
      answer = formatFraction(simplified.numerator, simplified.denominator);
      questionText = `subtract`;
      break;
    }
    
    case 'multiply': {
      // Generate two fractions to multiply
      const den1 = randomInt(2, Math.min(8 + level, 12));
      const num1 = randomInt(1, den1 - 1);
      const den2 = randomInt(2, Math.min(8 + level, 12));
      const num2 = randomInt(1, den2 - 1);
      
      // Calculate product: (num1/den1) * (num2/den2) = (num1*num2) / (den1*den2)
      const prodNum = num1 * num2;
      const prodDen = den1 * den2;
      const simplified = simplifyFraction(prodNum, prodDen);
      
      question = `${num1}/${den1} × ${num2}/${den2}`;
      answer = formatFraction(simplified.numerator, simplified.denominator);
      questionText = `multiply`;
      break;
    }
    
    case 'divide': {
      // Generate two fractions to divide
      const den1 = randomInt(2, Math.min(8 + level, 12));
      const num1 = randomInt(1, den1 - 1);
      const den2 = randomInt(2, Math.min(8 + level, 12));
      const num2 = randomInt(1, den2 - 1);
      
      // Calculate quotient: (num1/den1) / (num2/den2) = (num1*den2) / (den1*num2)
      const quotNum = num1 * den2;
      const quotDen = den1 * num2;
      const simplified = simplifyFraction(quotNum, quotDen);
      
      question = `${num1}/${den1} ÷ ${num2}/${den2}`;
      answer = formatFraction(simplified.numerator, simplified.denominator);
      questionText = `divide`;
      break;
    }
    
    case 'decimal': {
      // Convert fraction to decimal
      const denominator = randomInt(2, Math.min(8 + level, 12));
      const numerator = randomInt(1, denominator - 1);
      const decimal = (numerator / denominator).toFixed(2);
      
      question = `${numerator}/${denominator}`;
      answer = decimal;
      questionText = `convertToDecimal`;
      break;
    }
    
    case 'visualRepresent': {
      // Generate fraction for visual representation (levels 1-3)
      // Limit denominators to 2-8 for early levels
      const denominator = randomInt(2, 8);
      // Allow both proper and improper fractions (70% proper, 30% improper)
      const IMPROPER_FRACTION_PROBABILITY = 0.3;
      const isProper = Math.random() > IMPROPER_FRACTION_PROBABILITY;
      const numerator = isProper
        ? randomInt(1, denominator - 1)
        : randomInt(denominator, denominator * 2);
      
      question = `${numerator}/${denominator}`;
      answer = numerator.toString(); // Answer is the number of segments to select
      questionText = `visualRepresent`;
      break;
    }
    
    default:
      // Fallback to simplify
      const den = randomInt(2, 8);
      const num = randomInt(1, den - 1);
      const simplified = simplifyFraction(num, den);
      question = `${num}/${den}`;
      answer = formatFraction(simplified.numerator, simplified.denominator);
      questionText = `simplify`;
  }
  
  const result = {
    question,
    answer,
    type: questionText,
    rawAnswer: answer, // Store original answer format
  };
  
  // For visual representation, include numerator and denominator directly
  // (avoid parsing since we already have these values)
  if (questionText === 'visualRepresent') {
    // Extract from the case where we generated them
    const parts = question.split('/');
    result.numerator = parseInt(parts[0], 10);
    result.denominator = parseInt(parts[1], 10);
  }
  
  return result;
};

/**
 * Check if user answer is correct
 * @param {string} userAnswer - User's answer string
 * @param {string} correctAnswer - Correct answer string
 * @returns {boolean}
 */
export const checkAnswer = (userAnswer, correctAnswer) => {
  const userParsed = parseFraction(userAnswer);
  const correctParsed = parseFraction(correctAnswer);
  
  if (!userParsed || !correctParsed) {
    // Fallback to string comparison (normalized)
    return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
  }
  
  return fractionsEqual(userParsed, correctParsed);
};

