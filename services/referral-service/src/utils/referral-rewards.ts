/**
 * Утилиты для начислений Points за рефералов
 */

import { eq, and } from 'drizzle-orm';
import { referrals } from '../db';
import type { ReferralServiceEnv } from '../types';

/**
 * Правила начислений за рефералов
 */
export const REFERRAL_REWARD_RULES = {
  // Начисление за регистрацию реферала (разблокируется при VIP реферала)
  SIGNUP_REWARD: 5000,
  // Начисление за активацию VIP рефералом
  VIP_ACTIVATION_REWARD: 10000,
  // Начисление за субреферала (2-й уровень) при VIP активации
  SUB_REFERRAL_VIP_REWARD: 2000,
};

/**
 * Разблокировать Points для спонсора при VIP-активации реферала
 */
export async function unlockReferralPoints(
  db: ReferralServiceEnv['Variables']['db'],
  referralUserId: string
): Promise<{
  success: boolean;
  sponsorId?: string;
  pointsUnlocked?: number;
  error?: string;
}> {
  try {
    // Находим реферальную связь
    const referralRecord = await db
      .select()
      .from(referrals)
      .where(eq(referrals.userId, referralUserId))
      .limit(1);

    if (referralRecord.length === 0) {
      return { success: false, error: 'Referral not found' };
    }

    const referral = referralRecord[0];

    // Если Points уже разблокированы, ничего не делаем
    if (referral.pointsUnlocked > 0) {
      return {
        success: true,
        sponsorId: referral.sponsorId,
        pointsUnlocked: referral.pointsUnlocked,
      };
    }

    // Разблокируем Points для спонсора
    const pointsToUnlock = referral.pointsPending;
    await db
      .update(referrals)
      .set({
        pointsUnlocked: pointsToUnlock,
        pointsPending: 0,
        vipActivatedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(referrals.userId, referralUserId));

    return {
      success: true,
      sponsorId: referral.sponsorId,
      pointsUnlocked: pointsToUnlock,
    };
  } catch (error) {
    console.error('Error unlocking referral points:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Получить список спонсоров для начисления Points за субрефералов
 * Возвращает массив спонсоров (1-й и 2-й уровень)
 */
export async function getSponsorChain(
  db: ReferralServiceEnv['Variables']['db'],
  referralUserId: string,
  maxDepth: number = 2
): Promise<Array<{ userId: string; level: number }>> {
  const chain: Array<{ userId: string; level: number }> = [];
  let currentUserId = referralUserId;
  let currentLevel = 1;

  while (currentLevel <= maxDepth) {
    const referralRecord = await db
      .select()
      .from(referrals)
      .where(eq(referrals.userId, currentUserId))
      .limit(1);

    if (referralRecord.length === 0) {
      break;
    }

    const sponsorId = referralRecord[0].sponsorId;
    chain.push({ userId: sponsorId, level: currentLevel });
    currentUserId = sponsorId;
    currentLevel++;
  }

  return chain;
}

/**
 * Начислить Points спонсорам за VIP-активацию реферала
 * Начисляет Points спонсору (1-й уровень) и спонсору спонсора (2-й уровень, если есть)
 */
export async function rewardSponsorsForVIPActivation(
  db: ReferralServiceEnv['Variables']['db'],
  referralUserId: string,
  tokenServiceUrl: string
): Promise<{
  success: boolean;
  rewards: Array<{ userId: string; level: number; points: number }>;
  error?: string;
}> {
  try {
    // Получаем цепочку спонсоров
    const sponsorChain = await getSponsorChain(db, referralUserId, 2);
    const rewards: Array<{ userId: string; level: number; points: number }> = [];

    // Начисляем Points каждому спонсору в цепочке
    for (const sponsor of sponsorChain) {
      let pointsToAward = 0;

      if (sponsor.level === 1) {
        // Спонсор 1-го уровня получает полную награду за VIP-активацию
        pointsToAward = REFERRAL_REWARD_RULES.VIP_ACTIVATION_REWARD;
      } else if (sponsor.level === 2) {
        // Спонсор 2-го уровня получает награду за субреферала
        pointsToAward = REFERRAL_REWARD_RULES.SUB_REFERRAL_VIP_REWARD;
      }

      if (pointsToAward > 0) {
        // Отправляем запрос в Token Service для начисления Points
        try {
          const response = await fetch(`${tokenServiceUrl}/v1/rewards/award`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // TODO: Добавить внутренний токен для межсервисной аутентификации
            },
            body: JSON.stringify({
              action: sponsor.level === 1 ? 'referral_vip_activate' : 'referral_sub_vip_activate',
              metadata: {
                referralUserId,
                level: sponsor.level,
              },
            }),
          });

          if (response.ok) {
            rewards.push({
              userId: sponsor.userId,
              level: sponsor.level,
              points: pointsToAward,
            });
          } else {
            console.warn(`Failed to reward sponsor ${sponsor.userId} for VIP activation`);
          }
        } catch (error) {
          console.error(`Error rewarding sponsor ${sponsor.userId}:`, error);
        }
      }
    }

    return { success: true, rewards };
  } catch (error) {
    console.error('Error rewarding sponsors:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      rewards: [],
    };
  }
}


