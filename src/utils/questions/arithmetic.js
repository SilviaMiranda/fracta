/**
 * Basic arithmetic (grade 2-ish) for the arithmetic track — Catalan-first stems, all langs supported.
 */

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const stems = {
  applesAdd: {
    ca: (a, b) => `Tinc ${a} pomes. Me'n donen ${b}. Quantes en tinc ara?`,
    en: (a, b) => `I have ${a} apples. I get ${b} more. How many do I have now?`,
    de: (a, b) => `Ich habe ${a} Äpfel. Ich bekomme ${b} dazu. Wie viele habe ich jetzt?`,
    es: (a, b) => `Tengo ${a} manzanas. Me dan ${b} más. ¿Cuántas tengo ahora?`,
  },
  applesTake: {
    ca: (a, b) => `Tinc ${a} galetes. Menjo ${b}. Quantes em queden?`,
    en: (a, b) => `I have ${a} cookies. I eat ${b}. How many are left?`,
    de: (a, b) => `Ich habe ${a} Kekse. Ich esse ${b}. Wie viele bleiben übrig?`,
    es: (a, b) => `Tengo ${a} galletas. Como ${b}. ¿Cuántas quedan?`,
  },
  pencils: {
    ca: (a, b) => `A l'estoig hi ha ${a} llapis. Hi afegeixo ${b}. Quants hi ha en total?`,
    en: (a, b) => `There are ${a} pencils in the case. I add ${b}. How many in total?`,
    de: (a, b) => `Es sind ${a} Stifte im Etui. Ich lege ${b} hinzu. Wie viele sind es zusammen?`,
    es: (a, b) => `Hay ${a} lápices en el estuche. Añado ${b}. ¿Cuántos hay en total?`,
  },
};

function pickLang(lang) {
  return stems.applesAdd[lang] ? lang : 'ca';
}

export function normalizeArithmeticAnswer(str) {
  if (str == null || typeof str !== 'string') return '';
  const t = str.trim().replace(/\s+/g, '');
  const n = parseInt(t, 10);
  return Number.isNaN(n) ? t : String(n);
}

export function checkArithmeticAnswer(userAnswer, correctAnswer) {
  const u = normalizeArithmeticAnswer(userAnswer);
  const c = normalizeArithmeticAnswer(String(correctAnswer));
  if (u === '' || c === '') return false;
  const ui = parseInt(u, 10);
  const ci = parseInt(c, 10);
  if (!Number.isNaN(ui) && !Number.isNaN(ci)) return ui === ci;
  return u.toLowerCase() === c.toLowerCase();
}

function makeFact(type, lang, maxSum = 20) {
  const L = pickLang(lang);
  if (type === 'add') {
    const a = randomInt(1, Math.min(9, maxSum - 2));
    const b = randomInt(1, Math.min(9, maxSum - a));
    return {
      question: `${a} + ${b} = ?`,
      answer: String(a + b),
      type: 'arithAdd',
    };
  }
  if (type === 'subtract') {
    const a = randomInt(5, maxSum);
    const b = randomInt(1, a - 1);
    return {
      question: `${a} − ${b} = ?`,
      answer: String(a - b),
      type: 'arithSubtract',
    };
  }
  if (type === 'multiply') {
    const a = randomInt(2, 5);
    const b = randomInt(2, 9);
    return {
      question: `${a} × ${b} = ?`,
      answer: String(a * b),
      type: 'arithMultiply',
    };
  }
  const a = randomInt(2, 5);
  const b = randomInt(2, 9);
  const product = a * b;
  return {
    question: `${product} ÷ ${a} = ?`,
    answer: String(b),
    type: 'arithDivide',
  };
}

function makeWord(level, lang) {
  const L = pickLang(lang);
  if (level <= 4) {
    const a = randomInt(3, 12);
    const b = randomInt(2, Math.min(8, 18 - a));
    const stem = stems.applesAdd[L](a, b);
    return { question: stem, answer: String(a + b), type: 'arithWord' };
  }
  if (level <= 8) {
    const a = randomInt(5, 16);
    const b = randomInt(1, Math.min(a - 1, 8));
    const stem = stems.applesTake[L](a, b);
    return { question: stem, answer: String(a - b), type: 'arithWord' };
  }
  const a = randomInt(4, 10);
  const b = randomInt(2, 8);
  const stem = stems.pencils[L](a, b);
  return { question: stem, answer: String(a + b), type: 'arithWord' };
}

/**
 * @param {number} level 1–12
 * @param {string} lang
 */
export function generateArithmeticQuestion(level, lang) {
  const useWord = Math.random() < 0.35 && level <= 9;
  if (useWord) {
    return makeWord(level, lang);
  }

  if (level <= 3) return makeFact('add', lang, 18);
  if (level <= 6) {
    return Math.random() < 0.55 ? makeFact('subtract', lang, 20) : makeFact('add', lang, 20);
  }
  if (level <= 8) {
    const a = randomInt(10, 35);
    const b = randomInt(2, 15);
    if (Math.random() < 0.5) {
      return { question: `${a} + ${b} = ?`, answer: String(a + b), type: 'arithAdd' };
    }
    const x = randomInt(15, 40);
    const y = randomInt(3, Math.min(12, x - 5));
    return { question: `${x} − ${y} = ?`, answer: String(x - y), type: 'arithSubtract' };
  }
  if (level <= 10) return makeFact('multiply', lang);
  return makeFact('divide', lang);
}

export function arithmeticStartingLevel(score, totalQuestions) {
  const pct = totalQuestions ? (score / totalQuestions) * 100 : 0;
  if (pct >= 85) return 10;
  if (pct >= 70) return 8;
  if (pct >= 55) return 6;
  if (pct >= 40) return 4;
  return 1;
}
