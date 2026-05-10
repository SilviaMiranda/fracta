/**
 * Basic arithmetic (grade 2-ish) for the arithmetic track — Catalan-first stems, all langs supported.
 * Word problems use varied scenarios; each theme appears at most MAX_STEMS_PER_THEME times across all pools.
 */

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** @typedef {{ theme: string, ca: function, en: function, de: function, es: function }} WordStemScenario */

export const MAX_STEMS_PER_THEME = 3;

/** Addition word problems (levels 1–4). */
export const wordStemsAdd = /** @type {WordStemScenario[]} */ ([
  {
    theme: 'oranges',
    ca: (a, b) => `Tinc ${a} taronges. Me'n donen ${b}. Quantes en tinc ara?`,
    en: (a, b) => `I have ${a} oranges. I get ${b} more. How many do I have now?`,
    de: (a, b) => `Ich habe ${a} Orangen. Ich bekomme ${b} dazu. Wie viele habe ich jetzt?`,
    es: (a, b) => `Tengo ${a} naranjas. Me dan ${b} más. ¿Cuántas tengo ahora?`,
  },
  {
    theme: 'stickers',
    ca: (a, b) => `Tinc ${a} adhesius. Me'n donen ${b}. Quantes en tinc ara?`,
    en: (a, b) => `I have ${a} stickers. I get ${b} more. How many do I have now?`,
    de: (a, b) => `Ich habe ${a} Aufkleber. Ich bekomme ${b} dazu. Wie viele habe ich jetzt?`,
    es: (a, b) => `Tengo ${a} pegatinas. Me dan ${b} más. ¿Cuántas tengo ahora?`,
  },
  {
    theme: 'marbles',
    ca: (a, b) => `Tinc ${a} caniques. Me'n donen ${b}. Quantes en tinc ara?`,
    en: (a, b) => `I have ${a} marbles. I get ${b} more. How many do I have now?`,
    de: (a, b) => `Ich habe ${a} Murmeln. Ich bekomme ${b} dazu. Wie viele habe ich jetzt?`,
    es: (a, b) => `Tengo ${a} canicas. Me dan ${b} más. ¿Cuántas tengo ahora?`,
  },
  {
    theme: 'books',
    ca: (a, b) => `Tinc ${a} llibres. Me'n porten ${b}. Quants en tinc ara?`,
    en: (a, b) => `I have ${a} books. I get ${b} more. How many do I have now?`,
    de: (a, b) => `Ich habe ${a} Bücher. Ich bekomme ${b} dazu. Wie viele habe ich jetzt?`,
    es: (a, b) => `Tengo ${a} libros. Me traen ${b} más. ¿Cuántos tengo ahora?`,
  },
  {
    theme: 'blocks',
    ca: (a, b) => `Tinc ${a} blocs. Me'n donen ${b}. Quants en tinc ara?`,
    en: (a, b) => `I have ${a} blocks. I get ${b} more. How many do I have now?`,
    de: (a, b) => `Ich habe ${a} Bauklötze. Ich bekomme ${b} dazu. Wie viele habe ich jetzt?`,
    es: (a, b) => `Tengo ${a} bloques. Me dan ${b} más. ¿Cuántos tengo ahora?`,
  },
  {
    theme: 'toy_cars',
    ca: (a, b) => `Tinc ${a} cotxes de joguina. Me'n donen ${b}. Quants en tinc ara?`,
    en: (a, b) => `I have ${a} toy cars. I get ${b} more. How many do I have now?`,
    de: (a, b) => `Ich habe ${a} Spielzeugautos. Ich bekomme ${b} dazu. Wie viele habe ich jetzt?`,
    es: (a, b) => `Tengo ${a} coches de juguete. Me dan ${b} más. ¿Cuántos tengo ahora?`,
  },
]);

/** Subtraction word problems (levels 5–8). */
export const wordStemsSubtract = /** @type {WordStemScenario[]} */ ([
  {
    theme: 'cookies',
    ca: (a, b) => `Tinc ${a} galetes. Menjo ${b}. Quantes em queden?`,
    en: (a, b) => `I have ${a} cookies. I eat ${b}. How many are left?`,
    de: (a, b) => `Ich habe ${a} Kekse. Ich esse ${b}. Wie viele bleiben übrig?`,
    es: (a, b) => `Tengo ${a} galletas. Como ${b}. ¿Cuántas quedan?`,
  },
  {
    theme: 'crackers',
    ca: (a, b) => `Tinc ${a} galetes salades. Menjo ${b}. Quantes em queden?`,
    en: (a, b) => `I have ${a} crackers. I eat ${b}. How many are left?`,
    de: (a, b) => `Ich habe ${a} Cracker. Ich esse ${b}. Wie viele bleiben übrig?`,
    es: (a, b) => `Tengo ${a} galletas saladas. Como ${b}. ¿Cuántas quedan?`,
  },
  {
    theme: 'figs',
    ca: (a, b) => `Tinc ${a} figues. Menjo ${b}. Quantes em queden?`,
    en: (a, b) => `I have ${a} figs. I eat ${b}. How many are left?`,
    de: (a, b) => `Ich habe ${a} Feigen. Ich esse ${b}. Wie viele bleiben übrig?`,
    es: (a, b) => `Tengo ${a} higos. Como ${b}. ¿Cuántos quedan?`,
  },
  {
    theme: 'bananas',
    ca: (a, b) => `Tinc ${a} plàtans. Menjo ${b}. Quantes em queden?`,
    en: (a, b) => `I have ${a} bananas. I eat ${b}. How many are left?`,
    de: (a, b) => `Ich habe ${a} Bananen. Ich esse ${b}. Wie viele bleiben übrig?`,
    es: (a, b) => `Tengo ${a} plátanos. Como ${b}. ¿Cuántos quedan?`,
  },
  {
    theme: 'muffins',
    ca: (a, b) => `Tinc ${a} magdalenes. Menjo ${b}. Quantes em queden?`,
    en: (a, b) => `I have ${a} muffins. I eat ${b}. How many are left?`,
    de: (a, b) => `Ich habe ${a} Muffins. Ich esse ${b}. Wie viele bleiben übrig?`,
    es: (a, b) => `Tengo ${a} magdalenas. Como ${b}. ¿Cuántas quedan?`,
  },
  {
    theme: 'cheese_cubes',
    ca: (a, b) => `Tinc ${a} daus de formatge. Menjo ${b}. Quants em queden?`,
    en: (a, b) => `I have ${a} cheese cubes. I eat ${b}. How many are left?`,
    de: (a, b) => `Ich habe ${a} Käsewürfel. Ich esse ${b}. Wie viele bleiben übrig?`,
    es: (a, b) => `Tengo ${a} cubitos de queso. Como ${b}. ¿Cuántos quedan?`,
  },
]);

/** “Add more to a set” word problems (levels 9+). */
export const wordStemsCombine = /** @type {WordStemScenario[]} */ ([
  {
    theme: 'pencils',
    ca: (a, b) => `A l'estoig hi ha ${a} llapis. Hi afegeixo ${b}. Quants hi ha en total?`,
    en: (a, b) => `There are ${a} pencils in the case. I add ${b}. How many in total?`,
    de: (a, b) => `Es sind ${a} Stifte im Etui. Ich lege ${b} hinzu. Wie viele sind es zusammen?`,
    es: (a, b) => `Hay ${a} lápices en el estuche. Añado ${b}. ¿Cuántos hay en total?`,
  },
  {
    theme: 'rulers',
    ca: (a, b) => `A l'estoig hi ha ${a} regles. Hi afegeixo ${b}. Quants hi ha en total?`,
    en: (a, b) => `There are ${a} rulers in the case. I add ${b}. How many in total?`,
    de: (a, b) => `Es sind ${a} Lineale im Etui. Ich lege ${b} hinzu. Wie viele sind es zusammen?`,
    es: (a, b) => `Hay ${a} reglas en el estuche. Añado ${b}. ¿Cuántas hay en total?`,
  },
  {
    theme: 'crayons',
    ca: (a, b) => `A la capsa hi ha ${a} colors de cera. Hi afegeixo ${b}. Quants n'hi ha en total?`,
    en: (a, b) => `There are ${a} crayons in the box. I add ${b}. How many in total?`,
    de: (a, b) => `Es sind ${a} Wachsmalkreiden in der Schachtel. Ich lege ${b} hinzu. Wie viele sind es zusammen?`,
    es: (a, b) => `Hay ${a} ceras en la caja. Añado ${b}. ¿Cuántas hay en total?`,
  },
  {
    theme: 'markers',
    ca: (a, b) => `A l'estoig hi ha ${a} retoladors. Hi afegeixo ${b}. Quants hi ha en total?`,
    en: (a, b) => `There are ${a} markers in the case. I add ${b}. How many in total?`,
    de: (a, b) => `Es sind ${a} Filzstifte im Etui. Ich lege ${b} hinzu. Wie viele sind es zusammen?`,
    es: (a, b) => `Hay ${a} rotuladores en el estuche. Añado ${b}. ¿Cuántos hay en total?`,
  },
  {
    theme: 'paper_clips',
    ca: (a, b) => `A la capsa hi ha ${a} clips. Hi afegeixo ${b}. Quants n'hi ha en total?`,
    en: (a, b) => `There are ${a} paper clips in the box. I add ${b}. How many in total?`,
    de: (a, b) => `Es sind ${a} Büroklammern in der Schachtel. Ich lege ${b} hinzu. Wie viele sind es zusammen?`,
    es: (a, b) => `Hay ${a} clips en la caja. Añado ${b}. ¿Cuántos hay en total?`,
  },
]);

/**
 * @param {WordStemScenario[][]} pools
 * @param {number} maxPerTheme
 */
export function assertThemeStemCap(pools, maxPerTheme = MAX_STEMS_PER_THEME) {
  const counts = Object.create(null);
  for (const pool of pools) {
    for (const { theme } of pool) {
      counts[theme] = (counts[theme] ?? 0) + 1;
      if (counts[theme] > maxPerTheme) {
        throw new Error(
          `Arithmetic word stem theme "${theme}" appears ${counts[theme]} times (max ${maxPerTheme}).`,
        );
      }
    }
  }
}

assertThemeStemCap([wordStemsAdd, wordStemsSubtract, wordStemsCombine]);

const SUPPORTED_LANGS = ['ca', 'en', 'de', 'es'];

function pickLang(lang) {
  const probe = wordStemsAdd[0];
  return probe[lang] ? lang : 'ca';
}

function pickRandomStem(pool, lang, a, b) {
  const L = pickLang(lang);
  const scenario = pool[randomInt(0, pool.length - 1)];
  return scenario[L](a, b);
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
  if (level <= 4) {
    const a = randomInt(3, 12);
    const b = randomInt(2, Math.min(8, 18 - a));
    const stem = pickRandomStem(wordStemsAdd, lang, a, b);
    return { question: stem, answer: String(a + b), type: 'arithWord' };
  }
  if (level <= 8) {
    const a = randomInt(5, 16);
    const b = randomInt(1, Math.min(a - 1, 8));
    const stem = pickRandomStem(wordStemsSubtract, lang, a, b);
    return { question: stem, answer: String(a - b), type: 'arithWord' };
  }
  const a = randomInt(4, 10);
  const b = randomInt(2, 8);
  const stem = pickRandomStem(wordStemsCombine, lang, a, b);
  return { question: stem, answer: String(a + b), type: 'arithWord' };
}

/**
 * Sample every word stem in each locale for tests (no apple vocabulary).
 * @param {number} a
 * @param {number} b
 */
export function sampleAllWordStemQuestions(a, b) {
  const out = [];
  const pools = [wordStemsAdd, wordStemsSubtract, wordStemsCombine];
  for (const pool of pools) {
    for (const scenario of pool) {
      for (const lang of SUPPORTED_LANGS) {
        const fn = scenario[lang];
        if (typeof fn === 'function') out.push(fn(a, b));
      }
    }
  }
  return out;
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
