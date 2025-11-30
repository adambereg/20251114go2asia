/**
 * Утилиты для автоматического начисления Points
 */

import { eq, and, sql } from 'drizzle-orm';
import { balances, transactions, dailyLimits, nftBadges } from '../db';
import type { TokenServiceEnv } from '../types';
import { getRewardRule, canReward, type ActionType } from './reward-rules';
import { getUserLevel, getLevelProgress, LEVELS } from './levels';

/**
 * Начислить Points пользователю за действие
 */
export async function rewardUser(
  db: TokenServiceEnv['Variables']['db'],
  userId: string,
  action: ActionType,
  isVIP: boolean,
  metadata?: Record<string, unknown>
): Promise<{
  success: boolean;
  pointsAwarded?: number;
  newLevel?: number;
  badgeAwarded?: string;
  error?: string;
}> {
  const rule = getRewardRule(action);
  if (!rule) {
    return { success: false, error: 'Unknown action' };
  }

  try {
    // Получаем текущую дату (только дата, без времени)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Проверяем дневной лимит
    const dailyLimitRecord = await db
      .select()
      .from(dailyLimits)
      .where(
        and(
          eq(dailyLimits.userId, userId),
          eq(dailyLimits.action, action),
          eq(dailyLimits.date, today)
        )
      )
      .limit(1);

    const dailyCount = dailyLimitRecord.length > 0 ? dailyLimitRecord[0].count : 0;
    const lastRewardTime = dailyLimitRecord.length > 0 ? dailyLimitRecord[0].lastRewardTime : undefined;

    // Проверяем, можно ли начислить
    const checkResult = canReward(action, isVIP, dailyCount, lastRewardTime);
    if (!checkResult.canReward) {
      return { success: false, error: checkResult.reason };
    }

    // Получаем текущий баланс
    let balance = await db
      .select()
      .from(balances)
      .where(eq(balances.userId, userId))
      .limit(1);

    const currentPoints = balance.length > 0 ? balance[0].points : 0;
    const currentLevel = getUserLevel(currentPoints);

    // Обновляем или создаём баланс
    if (balance.length === 0) {
      await db.insert(balances).values({
        userId,
        points: rule.points,
        g2a: '0',
      });
    } else {
      await db
        .update(balances)
        .set({
          points: balance[0].points + rule.points,
          updatedAt: new Date(),
        })
        .where(eq(balances.userId, userId));
    }

    // Создаём транзакцию
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.insert(transactions).values({
      id: transactionId,
      userId,
      type: 'points_add',
      amount: rule.points.toString(),
      reason: rule.description,
      metadata: metadata || null,
    });

    // Обновляем дневной лимит
    const newPoints = currentPoints + rule.points;
    if (dailyLimitRecord.length > 0) {
      await db
        .update(dailyLimits)
        .set({
          count: dailyLimitRecord[0].count + 1,
          lastRewardTime: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(dailyLimits.userId, userId),
            eq(dailyLimits.action, action),
            eq(dailyLimits.date, today)
          )
        );
    } else {
      await db.insert(dailyLimits).values({
        userId,
        action,
        date: today,
        count: 1,
        lastRewardTime: new Date(),
      });
    }

    // Проверяем, достиг ли пользователь нового уровня
    const newLevel = getUserLevel(newPoints);
    let badgeAwarded: string | undefined;

    if (newLevel.level > currentLevel.level) {
      // Пользователь достиг нового уровня - награждаем бейджем
      if (newLevel.badge) {
        const badgeId = `badge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await db.insert(nftBadges).values({
          id: badgeId,
          userId,
          badgeId: newLevel.badge,
          badgeName: newLevel.name,
          badgeDescription: `Достигнут уровень ${newLevel.level}: ${newLevel.name}`,
          source: 'level_up',
          metadata: {
            level: newLevel.level,
            pointsRequired: newLevel.pointsRequired,
            pointsAtAward: newPoints,
          },
        });
        badgeAwarded = newLevel.badge;
      }
    }

    return {
      success: true,
      pointsAwarded: rule.points,
      newLevel: newLevel.level > currentLevel.level ? newLevel.level : undefined,
      badgeAwarded,
    };
  } catch (error) {
    console.error('Error rewarding user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Получить информацию об уровнях пользователя
 */
export async function getUserLevelInfo(
  db: TokenServiceEnv['Variables']['db'],
  userId: string
): Promise<{
  level: number;
  levelName: string;
  points: number;
  progress: number;
  pointsToNext: number;
  nextLevelName: string | null;
  badges: Array<{
    id: string;
    badgeId: string;
    badgeName: string;
    badgeDescription: string | null;
    badgeImage: string | null;
    source: string;
    createdAt: Date;
  }>;
}> {
  // Получаем баланс
  const balance = await db
    .select()
    .from(balances)
    .where(eq(balances.userId, userId))
    .limit(1);

  const points = balance.length > 0 ? balance[0].points : 0;
  const levelInfo = getLevelProgress(points);

  // Получаем все бейджи пользователя
  const badges = await db
    .select()
    .from(nftBadges)
    .where(eq(nftBadges.userId, userId))
    .orderBy(sql`${nftBadges.createdAt} DESC`);

  return {
    level: levelInfo.currentLevel.level,
    levelName: levelInfo.currentLevel.name,
    points,
    progress: levelInfo.progress,
    pointsToNext: levelInfo.pointsToNext,
    nextLevelName: levelInfo.nextLevel?.name || null,
    badges: badges.map((badge) => ({
      id: badge.id,
      badgeId: badge.badgeId,
      badgeName: badge.badgeName,
      badgeDescription: badge.badgeDescription,
      badgeImage: badge.badgeImage,
      source: badge.source,
      createdAt: badge.createdAt,
    })),
  };
}


