/**
 * Система уровней и достижений для пользователей
 */

export interface Level {
  level: number;
  name: string;
  pointsRequired: number;
  badge?: string; // Название NFT-бейджа для этого уровня
  benefits?: string[]; // Преимущества уровня
}

/**
 * Уровни пользователей на основе накопленных Points
 */
export const LEVELS: Level[] = [
  {
    level: 1,
    name: 'Новичок',
    pointsRequired: 0,
    badge: 'newcomer',
    benefits: ['Доступ к базовым функциям'],
  },
  {
    level: 2,
    name: 'Исследователь',
    pointsRequired: 100,
    badge: 'explorer',
    benefits: ['Доступ к расширенным функциям'],
  },
  {
    level: 3,
    name: 'Путешественник',
    pointsRequired: 500,
    badge: 'traveler',
    benefits: ['Приоритетная поддержка'],
  },
  {
    level: 4,
    name: 'Эксперт',
    pointsRequired: 2000,
    badge: 'expert',
    benefits: ['Эксклюзивный контент'],
  },
  {
    level: 5,
    name: 'Мастер',
    pointsRequired: 5000,
    badge: 'master',
    benefits: ['Специальные предложения'],
  },
  {
    level: 6,
    name: 'Легенда',
    pointsRequired: 10000,
    badge: 'legend',
    benefits: ['VIP статус', 'Эксклюзивные события'],
  },
];

/**
 * Получить уровень пользователя на основе Points
 */
export function getUserLevel(points: number): Level {
  // Находим максимальный уровень, для которого у пользователя достаточно Points
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (points >= level.pointsRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
}

/**
 * Получить прогресс до следующего уровня
 */
export function getLevelProgress(points: number): {
  currentLevel: Level;
  nextLevel: Level | null;
  progress: number; // Процент прогресса (0-100)
  pointsToNext: number; // Points до следующего уровня
} {
  const currentLevel = getUserLevel(points);
  const currentIndex = LEVELS.findIndex((l) => l.level === currentLevel.level);
  const nextLevel = currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progress: 100,
      pointsToNext: 0,
    };
  }

  const pointsInCurrentLevel = points - currentLevel.pointsRequired;
  const pointsNeededForNext = nextLevel.pointsRequired - currentLevel.pointsRequired;
  const progress = Math.min(100, Math.round((pointsInCurrentLevel / pointsNeededForNext) * 100));
  const pointsToNext = nextLevel.pointsRequired - points;

  return {
    currentLevel,
    nextLevel,
    progress,
    pointsToNext,
  };
}


