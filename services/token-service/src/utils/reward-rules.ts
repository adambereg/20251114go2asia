/**
 * Правила начислений Points за действия пользователей
 */

export type ActionType =
  | 'post_like'
  | 'post_create'
  | 'post_repost'
  | 'quest_complete'
  | 'referral_signup'
  | 'referral_vip_activate'
  | 'referral_sub_vip_activate'
  | 'event_attend'
  | 'review_create'
  | 'voucher_redeem';

export interface RewardRule {
  action: ActionType;
  points: number;
  description: string;
  requiresVIP?: boolean; // Требует ли VIP статус для разблокировки
  maxPerDay?: number; // Максимальное количество начислений в день
  cooldownMinutes?: number; // Кулдаун между начислениями (в минутах)
}

/**
 * Правила начислений Points
 */
export const REWARD_RULES: Record<ActionType, RewardRule> = {
  post_like: {
    action: 'post_like',
    points: 1,
    description: 'Лайк поста',
    maxPerDay: 100, // Максимум 100 лайков в день = 100 Points
  },
  post_create: {
    action: 'post_create',
    points: 100,
    description: 'Создание поста',
    maxPerDay: 10, // Максимум 10 постов в день = 1000 Points
  },
  post_repost: {
    action: 'post_repost',
    points: 10,
    description: 'Репост поста',
    maxPerDay: 20, // Максимум 20 репостов в день = 200 Points
  },
  quest_complete: {
    action: 'quest_complete',
    points: 100,
    description: 'Завершение квеста',
    maxPerDay: 5, // Максимум 5 квестов в день = 500 Points
  },
  referral_signup: {
    action: 'referral_signup',
    points: 5000,
    description: 'Приглашение реферала (разблокируется при VIP)',
    requiresVIP: true, // Разблокируется только при VIP статусе
  },
  referral_vip_activate: {
    action: 'referral_vip_activate',
    points: 10000,
    description: 'Активация VIP статуса рефералом',
    requiresVIP: true,
  },
  referral_sub_vip_activate: {
    action: 'referral_sub_vip_activate',
    points: 2000,
    description: 'Активация VIP статуса субрефералом (2-й уровень)',
    requiresVIP: true,
  },
  event_attend: {
    action: 'event_attend',
    points: 50,
    description: 'Посещение события',
    maxPerDay: 3, // Максимум 3 события в день = 150 Points
  },
  review_create: {
    action: 'review_create',
    points: 25,
    description: 'Создание отзыва',
    maxPerDay: 10, // Максимум 10 отзывов в день = 250 Points
  },
  voucher_redeem: {
    action: 'voucher_redeem',
    points: 30,
    description: 'Активация ваучера',
    maxPerDay: 5, // Максимум 5 ваучеров в день = 150 Points
  },
};

/**
 * Получить правило начисления для действия
 */
export function getRewardRule(action: ActionType): RewardRule | null {
  return REWARD_RULES[action] || null;
}

/**
 * Проверить, можно ли начислить Points за действие
 */
export function canReward(
  action: ActionType,
  isVIP: boolean,
  dailyCount: number,
  lastRewardTime?: Date
): { canReward: boolean; reason?: string } {
  const rule = getRewardRule(action);
  if (!rule) {
    return { canReward: false, reason: 'Unknown action' };
  }

  // Проверка VIP статуса
  if (rule.requiresVIP && !isVIP) {
    return {
      canReward: false,
      reason: 'VIP status required',
    };
  }

  // Проверка лимита в день
  if (rule.maxPerDay && dailyCount >= rule.maxPerDay) {
    return {
      canReward: false,
      reason: `Daily limit reached (${rule.maxPerDay} per day)`,
    };
  }

  // Проверка кулдауна
  if (rule.cooldownMinutes && lastRewardTime) {
    const cooldownMs = rule.cooldownMinutes * 60 * 1000;
    const timeSinceLastReward = Date.now() - lastRewardTime.getTime();
    if (timeSinceLastReward < cooldownMs) {
      const remainingMinutes = Math.ceil((cooldownMs - timeSinceLastReward) / 60000);
      return {
        canReward: false,
        reason: `Cooldown active (${remainingMinutes} minutes remaining)`,
      };
    }
  }

  return { canReward: true };
}

