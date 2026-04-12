/**
 * Fraction question generation and answer checking
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

export const simplifyFraction = (numerator, denominator) => {
  if (denominator === 0) return { numerator: 0, denominator: 1 };
  if (numerator === 0) return { numerator: 0, denominator: 1 };

  const divisor = gcd(numerator, denominator);
  const simplifiedNum = numerator / divisor;
  const simplifiedDen = denominator / divisor;

  if (simplifiedDen < 0) {
    return { numerator: -simplifiedNum, denominator: -simplifiedDen };
  }

  return { numerator: simplifiedNum, denominator: simplifiedDen };
};

export const formatFraction = (numerator, denominator) => {
  if (denominator === 1) return numerator.toString();
  if (numerator === 0) return '0';
  return `${numerator}/${denominator}`;
};

export const parseFraction = (fractionStr) => {
  if (!fractionStr) return null;

  const cleaned = fractionStr.trim().toLowerCase().replace(/\s+/g, '');

  if (cleaned.includes('.') && !cleaned.includes('/')) {
    const decimal = parseFloat(cleaned);
    if (isNaN(decimal)) return null;

    const denominator = 100;
    const numerator = Math.round(decimal * denominator);
    return simplifyFraction(numerator, denominator);
  }

  const parts = cleaned.split('/');
  if (parts.length === 2) {
    const numerator = parseInt(parts[0], 10);
    const denominator = parseInt(parts[1], 10);

    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
      return null;
    }

    return simplifyFraction(numerator, denominator);
  }

  const integer = parseInt(cleaned, 10);
  if (!isNaN(integer)) {
    return { numerator: integer, denominator: 1 };
  }

  return null;
};

export const normalizeAnswer = (answer) => {
  return answer.trim().toLowerCase().replace(/\s+/g, '');
};

export const fractionsEqual = (frac1, frac2) => {
  const simplified1 = simplifyFraction(frac1.numerator, frac1.denominator);
  const simplified2 = simplifyFraction(frac2.numerator, frac2.denominator);

  return (
    simplified1.numerator === simplified2.numerator &&
    simplified1.denominator === simplified2.denominator
  );
};

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateQuestion = (level, lang) => {
  const questionTypes = [];

  if (level >= 1) {
    questionTypes.push('simplify');
    if (level <= 3) questionTypes.push('visualRepresent');
  }
  if (level >= 2) {
    questionTypes.push('compare');
    if (level <= 3) questionTypes.push('visualRepresent');
  }
  if (level >= 3) {
    questionTypes.push('simplify');
    if (level <= 3) questionTypes.push('visualRepresent');
  }
  if (level >= 4) {
    questionTypes.push('add');
    questionTypes.push('subtract');
  }
  if (level >= 6) questionTypes.push('multiply');
  if (level >= 7) questionTypes.push('divide');
  if (level >= 9) questionTypes.push('decimal');

  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  let question;
  let answer;
  let questionText;

  switch (type) {
    case 'simplify': {
      const maxDenominator = Math.min(12 + level * 2, 20);
      const denominator = randomInt(2, maxDenominator);
      const numerator = randomInt(1, denominator * 2 - 1);

      const simplified = simplifyFraction(numerator, denominator);
      question = `${numerator}/${denominator}`;
      answer = formatFraction(simplified.numerator, simplified.denominator);
      questionText = 'simplify';
      break;
    }

    case 'compare': {
      const den1 = randomInt(2, 8);
      const num1 = randomInt(1, den1 - 1);
      const den2 = randomInt(2, 8);
      const num2 = randomInt(1, den2 - 1);

      const val1 = num1 / den1;
      const val2 = num2 / den2;
      const larger = val1 > val2 ? `${num1}/${den1}` : `${num2}/${den2}`;

      question = `${num1}/${den1} vs ${num2}/${den2}`;
      answer = larger;
      questionText = 'whichLarger';
      break;
    }

    case 'add': {
      const den1 = randomInt(2, Math.min(8 + level, 12));
      const num1 = randomInt(1, den1 - 1);
      const den2 = randomInt(2, Math.min(8 + level, 12));
      const num2 = randomInt(1, den2 - 1);

      const sumNum = num1 * den2 + num2 * den1;
      const sumDen = den1 * den2;
      const simplified = simplifyFraction(sumNum, sumDen);

      question = `${num1}/${den1} + ${num2}/${den2}`;
      answer = formatFraction(simplified.numerator, simplified.denominator);
      questionText = 'add';
      break;
    }

    case 'subtract': {
      const den1 = randomInt(2, Math.min(8 + level, 12));
      const num1 = randomInt(2, den1 - 1);
      const den2 = randomInt(2, Math.min(8 + level, 12));
      const num2 = randomInt(1, Math.min(Math.floor((num1 * den2) / den1), den2 - 1));

      const diffNum = num1 * den2 - num2 * den1;
      const diffDen = den1 * den2;
      const simplified = simplifyFraction(diffNum, diffDen);

      question = `${num1}/${den1} - ${num2}/${den2}`;
      answer = formatFraction(simplified.numerator, simplified.denominator);
      questionText = 'subtract';
      break;
    }

    case 'multiply': {
      const den1 = randomInt(2, Math.min(8 + level, 12));
      const num1 = randomInt(1, den1 - 1);
      const den2 = randomInt(2, Math.min(8 + level, 12));
      const num2 = randomInt(1, den2 - 1);

      const prodNum = num1 * num2;
      const prodDen = den1 * den2;
      const simplified = simplifyFraction(prodNum, prodDen);

      question = `${num1}/${den1} × ${num2}/${den2}`;
      answer = formatFraction(simplified.numerator, simplified.denominator);
      questionText = 'multiply';
      break;
    }

    case 'divide': {
      const den1 = randomInt(2, Math.min(8 + level, 12));
      const num1 = randomInt(1, den1 - 1);
      const den2 = randomInt(2, Math.min(8 + level, 12));
      const num2 = randomInt(1, den2 - 1);

      const quotNum = num1 * den2;
      const quotDen = den1 * num2;
      const simplified = simplifyFraction(quotNum, quotDen);

      question = `${num1}/${den1} ÷ ${num2}/${den2}`;
      answer = formatFraction(simplified.numerator, simplified.denominator);
      questionText = 'divide';
      break;
    }

    case 'decimal': {
      const denominator = randomInt(2, Math.min(8 + level, 12));
      const numerator = randomInt(1, denominator - 1);
      const decimal = (numerator / denominator).toFixed(2);

      question = `${numerator}/${denominator}`;
      answer = decimal;
      questionText = 'convertToDecimal';
      break;
    }

    case 'visualRepresent': {
      const denominator = randomInt(2, 8);
      const numerator = randomInt(1, denominator - 1);

      question = `${numerator}/${denominator}`;
      answer = numerator.toString();
      questionText = 'visualRepresent';
      break;
    }

    default: {
      const den = randomInt(2, 8);
      const num = randomInt(1, den - 1);
      const simplified = simplifyFraction(num, den);
      question = `${num}/${den}`;
      answer = formatFraction(simplified.numerator, simplified.denominator);
      questionText = 'simplify';
    }
  }

  const result = {
    question,
    answer,
    type: questionText,
    rawAnswer: answer,
  };

  if (questionText === 'visualRepresent') {
    const parts = question.split('/');
    result.numerator = parseInt(parts[0], 10);
    result.denominator = parseInt(parts[1], 10);
  }

  return result;
};

export const checkFractionAnswer = (userAnswer, correctAnswer) => {
  const userParsed = parseFraction(userAnswer);
  const correctParsed = parseFraction(correctAnswer);

  if (!userParsed || !correctParsed) {
    return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
  }

  return fractionsEqual(userParsed, correctParsed);
};
