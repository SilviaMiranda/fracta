/**
 * Badge system for Fracta
 * Tracks achievements based on points and milestones
 */

import { Star, Trophy, Zap, Target, Award } from 'lucide-react';

export const BADGE_DEFINITIONS = [
  {
    id: 'first_steps',
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

/**
 * Check which badges should be awarded based on total points
 * @param {number} totalPoints - Total points earned
 * @param {Array} currentBadges - Currently earned badge IDs
 * @returns {Array} - Array of newly earned badge IDs
 */
export const checkNewBadges = (totalPoints, currentBadges = []) => {
  const earnedBadgeIds = currentBadges.map(b => b.id || b);
  const newBadges = [];
  
  BADGE_DEFINITIONS.forEach(badge => {
    if (totalPoints >= badge.threshold && !earnedBadgeIds.includes(badge.id)) {
      newBadges.push(badge.id);
    }
  });
  
  return newBadges;
};

/**
 * Get all earned badges with full badge data
 * @param {number} totalPoints - Total points earned
 * @param {string} lang - Language code
 * @returns {Array} - Array of badge objects with full data
 */
export const getEarnedBadges = (totalPoints, lang = 'en') => {
  return BADGE_DEFINITIONS
    .filter(badge => totalPoints >= badge.threshold)
    .map(badge => ({
      ...badge,
      name: badge.name[lang] || badge.name.en,
    }));
};

