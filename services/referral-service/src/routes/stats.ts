import { Hono } from 'hono';
import { referrals, referralCodes } from '../db';
import { eq, sql, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';
import type { ReferralServiceEnv } from '../types';

const app = new Hono<ReferralServiceEnv>();

// GET /v1/stats - получить статистику рефералов
app.get('/', authMiddleware, async (c) => {
  const requestId = c.get('requestId');
  const userId = c.get('userId') as string;

  try {
    const db = c.get('db');

    // Получаем или создаём реферальный код пользователя
    let referralCodeRecord = await db
      .select()
      .from(referralCodes)
      .where(eq(referralCodes.userId, userId))
      .limit(1);

    let referralCode = '';
    if (referralCodeRecord.length === 0) {
      // Генерируем код из userId (первые 8 символов в верхнем регистре)
      referralCode = userId.substring(0, 8).toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (referralCode.length < 6) {
        // Если userId слишком короткий, дополняем случайными символами
        referralCode = referralCode.padEnd(8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]);
      }
      
      // Проверяем уникальность и создаём код
      const [newCode] = await db
        .insert(referralCodes)
        .values({
          userId,
          code: referralCode,
        })
        .returning();
      referralCode = newCode.code;
    } else {
      referralCode = referralCodeRecord[0].code;
    }

    // Подсчитываем прямые рефералы (1-й уровень)
    const directReferrals = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(referrals)
      .where(eq(referrals.sponsorId, userId));

    const totalReferrals = Number(directReferrals[0]?.count || 0);

    // Подсчитываем активные рефералы
    const activeReferrals = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(referrals)
      .where(and(eq(referrals.sponsorId, userId), eq(referrals.isActive, true)));

    const activeCount = Number(activeReferrals[0]?.count || 0);

    // Подсчитываем рефералов рефералов (2-й уровень) через подзапрос
    const subReferrals = await db.execute(sql`
      SELECT COUNT(*)::int as count
      FROM ${referrals} r2
      WHERE r2.sponsor_id IN (
        SELECT r1.user_id
        FROM ${referrals} r1
        WHERE r1.sponsor_id = ${userId}
      )
    `);

    const totalSubReferrals = Number((subReferrals[0] as any)?.count || 0);

    // Подсчитываем заработанные токены из транзакций
    // Ищем транзакции с reason, содержащим referral или реферальный код
    // Примечание: таблица transactions находится в Token Service, поэтому используем прямое SQL
    // В продакшене лучше использовать API Token Service или общую БД
    const earnedPoints = await db.execute(sql`
      SELECT COALESCE(SUM(amount::numeric)::int, 0) as total
      FROM transactions
      WHERE user_id = ${userId}
        AND type = 'points_add'
        AND (reason LIKE '%referral%' OR reason LIKE ${`%${referralCode}%`})
    `);

    const totalEarned = Number((earnedPoints[0] as any)?.total || 0);

    // Устанавливаем заголовки кэширования (приватные данные)
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');

    return c.json({
      totalReferrals,
      activeReferrals: activeCount,
      totalSubReferrals,
      totalEarned,
      referralCode,
    });
  } catch (error) {
    return c.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          traceId: requestId,
        },
      },
      500
    );
  }
});

export const statsRoutes = app;
