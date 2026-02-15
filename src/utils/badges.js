/**
 * Badge system for Fracta
 * Tracks achievements based on points and milestones
 * Includes both point-based badges (5) and level-specific badges (15)
 */

import { Star, Trophy, Zap, Target, Award } from 'lucide-react';

// Point-based achievement badges (5 total)
export const POINT_BADGES = [
  {
    id: 'first_steps',
    type: 'point',
    threshold: 0,
    icon: Star,
    name: {
      en: 'First Steps',
      ca: 'Primers Passos',
      de: 'Erste Schritte',
      es: 'Primeros Pasos',
    },
  },
  {
    id: 'fraction_master',
    type: 'point',
    threshold: 200,
    icon: Trophy,
    name: {
      en: 'Fraction Master',
      ca: 'Mestre de Fraccions',
      de: 'Bruchmeister',
      es: 'Maestro de Fracciones',
    },
  },
  {
    id: 'perfect_score',
    type: 'point',
    threshold: 400,
    icon: Award,
    name: {
      en: 'Perfect Score',
      ca: 'Puntuació Perfecta',
      de: 'Perfekte Punktzahl',
      es: 'Puntuación Perfecta',
    },
  },
  {
    id: 'speed_demon',
    type: 'point',
    threshold: 600,
    icon: Zap,
    name: {
      en: 'Speed Demon',
      ca: 'Dimoni de la Velocitat',
      de: 'Geschwindigkeitsdämon',
      es: 'Demonio de la Velocidad',
    },
  },
  {
    id: 'persistence',
    type: 'point',
    threshold: 800,
    icon: Target,
    name: {
      en: 'Persistence',
      ca: 'Persistència',
      de: 'Ausdauer',
      es: 'Persistencia',
    },
  },
];

// Level-specific badges (15 total - one per level)
// Note: User will provide custom 44x44px badge images
// For now, using Award icon as placeholder
export const LEVEL_BADGES = [
  {
    id: 'level_1_badge',
    type: 'level',
    level: 1,
    icon: Award,
    imagePath: '/badges/level-1.png', // Placeholder for custom badge
    requirement: 'Earn 2+ stars',
    name: {
      en: 'Fraction Explorer',
      ca: 'Explorador de Fraccions',
      de: 'Bruch-Entdecker',
      es: 'Explorador de Fracciones',
    },
  },
  {
    id: 'level_2_badge',
    type: 'level',
    level: 2,
    icon: Award,
    imagePath: '/badges/level-2.png',
    requirement: 'Earn 2+ stars',
    name: {
      en: 'Basic Operations',
      ca: 'Operacions Bàsiques',
      de: 'Grundrechenarten',
      es: 'Operaciones Básicas',
    },
  },
  {
    id: 'level_3_badge',
    type: 'level',
    level: 3,
    icon: Award,
    imagePath: '/badges/level-3.png',
    requirement: 'Earn 2+ stars',
    name: {
      en: 'Simplification Master',
      ca: 'Mestre de Simplificació',
      de: 'Vereinfachungs-Meister',
      es: 'Maestro de Simplificación',
    },
  },
  {
    id: 'level_4_badge',
    type: 'level',
    level: 4,
    icon: Award,
    imagePath: '/badges/level-4.png',
    requirement: 'Earn 2+ stars',
    name: {
      en: 'Addition Expert',
      ca: 'Expert en Suma',
      de: 'Additions-Experte',
      es: 'Experto en Suma',
    },
  },
  {
    id: 'level_5_badge',
    type: 'level',
    level: 5,
    icon: Award,
    imagePath: '/badges/level-5.png',
    requirement: 'Earn 2+ stars',
    name: {
      en: 'Comparison Champion',
      ca: 'Campió de Comparació',
      de: 'Vergleichs-Champion',
      es: 'Campeón de Comparación',
    },
  },
  {
    id: 'level_6_badge',
    type: 'level',
    level: 6,
    icon: Award,
    imagePath: '/badges/level-6.png',
    requirement: 'Earn 2+ stars',
    name: {
      en: 'Multiplication Pro',
      ca: 'Pro de Multiplicació',
      de: 'Multiplikations-Profi',
      es: 'Pro de Multiplicación',
    },
  },
  {
    id: 'level_7_badge',
    type: 'level',
    level: 7,
    icon: Award,
    imagePath: '/badges/level-7.png',
    requirement: 'Earn 2+ stars',
    name: {
      en: 'Division Master',
      ca: 'Mestre de Divisió',
      de: 'Divisions-Meister',
      es: 'Maestro de División',
    },
  },
  {
    id: 'level_8_badge',
    type: 'level',
    level: 8,
    icon: Award,
    imagePath: '/badges/level-8.png',
    requirement: 'Earn 2+ stars',
    name: {
      en: 'Mixed Operations Ace',
      ca: 'As d\'Operacions Mixtes',
      de: 'Gemischte-Operationen-Ass',
      es: 'As de Operaciones Mixtas',
    },
  },
  {
    id: 'level_9_badge',
    type: 'level',
    level: 9,
    icon: Award,
    imagePath: '/badges/level-9.png',
    requirement: 'Earn 2+ stars',
    name: {
      en: 'Decimal Converter',
      ca: 'Convertidor Decimal',
      de: 'Dezimal-Konvertierer',
      es: 'Convertidor Decimal',
    },
  },
  {
    id: 'level_10_badge',
    type: 'level',
    level: 10,
    icon: Award,
    imagePath: '/badges/level-10.png',
    requirement: 'Earn 2+ stars',
    name: {
      en: 'Advanced Simplifier',
      ca: 'Simplificador Avançat',
      de: 'Fortgeschrittener Vereinfacher',
      es: 'Simplificador Avanzado',
    },
  },
  {
    id: 'level_11_badge',
    type: 'level',
    level: 11,
    icon: Award,
    imagePath: '/badges/level-11.png',
    requirement: 'Earn 2+ stars',
    name: {
      en: 'Complex Addition Hero',
      ca: 'Heroi de Suma Complexa',
      de: 'Komplexe-Addition-Held',
      es: 'Héroe de Suma Compleja',
    },
  },
  {
    id: 'level_12_badge',
    type: 'level',
    level: 12,
    icon: Award,
    imagePath: '/badges/level-12.png',
    requirement: 'Earn 2+ stars',
    name: {
      en: 'Subtraction Genius',
      ca: 'Geni de Resta',
      de: 'Subtraktions-Genie',
      es: 'Genio de Resta',
    },
  },
  {
    id: 'level_13_badge',
    type: 'level',
    level: 13,
    icon: Award,
    imagePath: '/badges/level-13.png',
    requirement: 'Earn 2+ stars',
    name: {
      en: 'Multiplication Wizard',
      ca: 'Mag de Multiplicació',
      de: 'Multiplikations-Zauberer',
      es: 'Mago de Multiplicación',
    },
  },
  {
    id: 'level_14_badge',
    type: 'level',
    level: 14,
    icon: Award,
    imagePath: '/badges/level-14.png',
    requirement: 'Earn 2+ stars',
    name: {
      en: 'Division Legend',
      ca: 'Llegenda de Divisió',
      de: 'Divisions-Legende',
      es: 'Leyenda de División',
    },
  },
  {
    id: 'level_15_badge',
    type: 'level',
    level: 15,
    icon: Award,
    imagePath: '/badges/level-15.png',
    requirement: 'Earn 2+ stars',
    name: {
      en: 'Grand Master',
      ca: 'Gran Mestre',
      de: 'Großmeister',
      es: 'Gran Maestro',
    },
  },
];

// Combined badge definitions (20 total)
export const BADGE_DEFINITIONS = [...POINT_BADGES, ...LEVEL_BADGES];

/**
 * Check which point-based badges should be awarded
 * @param {number} totalPoints - Total points earned
 * @param {Array} currentBadges - Currently earned badge IDs
 * @returns {Array} - Array of newly earned badge IDs
 */
export const checkNewPointBadges = (totalPoints, currentBadges = []) => {
  const earnedBadgeIds = currentBadges.map(b => b.id || b);
  const newBadges = [];

  POINT_BADGES.forEach(badge => {
    if (totalPoints >= badge.threshold && !earnedBadgeIds.includes(badge.id)) {
      newBadges.push(badge.id);
    }
  });

  return newBadges;
};

/**
 * Check if a level badge should be awarded (requires 2+ stars)
 * @param {number} level - Level number
 * @param {number} stars - Stars earned (0-3)
 * @param {Array} currentBadges - Currently earned badge IDs
 * @returns {string|null} - Badge ID if earned, null otherwise
 */
export const checkLevelBadge = (level, stars, currentBadges = []) => {
  if (stars < 2) return null; // Requires 2+ stars

  const levelBadge = LEVEL_BADGES.find(b => b.level === level);
  if (!levelBadge) return null;

  const earnedBadgeIds = currentBadges.map(b => b.id || b);
  if (earnedBadgeIds.includes(levelBadge.id)) return null; // Already earned

  return levelBadge.id;
};

/**
 * Legacy function - check all new badges (point-based only for backwards compatibility)
 * @param {number} totalPoints - Total points earned
 * @param {Array} currentBadges - Currently earned badge IDs
 * @returns {Array} - Array of newly earned badge IDs
 */
export const checkNewBadges = (totalPoints, currentBadges = []) => {
  return checkNewPointBadges(totalPoints, currentBadges);
};

/**
 * Get all earned badges with full badge data
 * @param {number} totalPoints - Total points earned
 * @param {string} lang - Language code
 * @returns {Array} - Array of badge objects with full data
 */
export const getEarnedBadges = (totalPoints, lang = 'en') => {
  return POINT_BADGES
    .filter(badge => totalPoints >= badge.threshold)
    .map(badge => ({
      ...badge,
      name: badge.name[lang] || badge.name.en,
    }));
};

/**
 * Get all badges (both point and level) with earned/locked status
 * @param {number} totalPoints - Total points earned
 * @param {Array} earnedBadgeIds - Array of earned badge IDs
 * @param {string} lang - Language code
 * @returns {Array} - Array of all badge objects with status
 */
export const getAllBadgesWithStatus = (totalPoints, earnedBadgeIds = [], lang = 'en') => {
  const earnedIds = earnedBadgeIds.map(b => b.id || b);

  return BADGE_DEFINITIONS.map(badge => {
    let isEarned = false;

    if (badge.type === 'point') {
      isEarned = totalPoints >= badge.threshold;
    } else if (badge.type === 'level') {
      isEarned = earnedIds.includes(badge.id);
    }

    return {
      ...badge,
      name: badge.name[lang] || badge.name.en,
      isEarned,
      isLocked: !isEarned,
    };
  });
};

/**
 * Count total earned badges
 * @param {number} totalPoints - Total points earned
 * @param {Array} earnedBadgeIds - Array of earned badge IDs (includes level badges)
 * @returns {number} - Total number of earned badges
 */
export const getTotalBadgeCount = (totalPoints, earnedBadgeIds = []) => {
  const pointBadgesEarned = POINT_BADGES.filter(b => totalPoints >= b.threshold).length;
  const levelBadgesEarned = earnedBadgeIds.filter(id =>
    LEVEL_BADGES.some(lb => lb.id === id)
  ).length;

  return pointBadgesEarned + levelBadgesEarned;
};

