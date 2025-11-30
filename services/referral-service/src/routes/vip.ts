import { Hono } from 'hono';
import { z } from 'zod';
import { referrals } from '../db';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';
import type { ReferralServiceEnv } from '../types';
import { unlockReferralPoints, rewardSponsorsForVIPActivation } from '../utils/referral-rewards';

const app = new Hono<ReferralServiceEnv>();

// Валидационные схемы
const activateVIPSchema = z.object({
  userId: z.string().min(1),
});

// POST /v1/vip/activate - активировать VIP статус реферала
// Этот endpoint вызывается при активации VIP статуса пользователя
app.post('/activate', authMiddleware, async (c) => {
  const requestId = c.get('requestId');
  const authenticatedUserId = c.get('userId') as string;

  try {
    // Валидация тела запроса
    const body = await c.req.json();
    const validatedData = activateVIPSchema.safeParse(body);

    if (!validatedData.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            details: validatedData.error.errors.map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            })),
            traceId: requestId,
          },
        },
        400
      );
    }

    const { userId } = validatedData.data;

    // Проверяем, что userId соответствует аутентифицированному пользователю
    if (userId !== authenticatedUserId) {
      return c.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'Cannot activate VIP for another user',
            traceId: requestId,
          },
        },
        403
      );
    }

    const db = c.get('db');

    // Проверяем, существует ли реферальная связь
    const referralRecord = await db
      .select()
      .from(referrals)
      .where(eq(referrals.userId, userId))
      .limit(1);

    if (referralRecord.length === 0) {
      return c.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Referral not found',
            traceId: requestId,
          },
        },
        404
      );
    }

    const referral = referralRecord[0];

    // Если VIP уже активирован, возвращаем текущее состояние
    if (referral.isVIP) {
      return c.json({
        success: true,
        message: 'VIP already activated',
        sponsorId: referral.sponsorId,
        pointsUnlocked: referral.pointsUnlocked,
      });
    }

    // Разблокируем Points для спонсора
    const unlockResult = await unlockReferralPoints(db, userId);

    if (!unlockResult.success) {
      return c.json(
        {
          error: {
            code: 'UNLOCK_FAILED',
            message: unlockResult.error || 'Failed to unlock referral points',
            traceId: requestId,
          },
        },
        500
      );
    }

    // Обновляем VIP статус реферала
    await db
      .update(referrals)
      .set({
        isVIP: true,
        vipActivatedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(referrals.userId, userId));

    // Начисляем Points спонсорам через Token Service
    const env = c.env as { TOKEN_SERVICE_URL?: string };
    const tokenServiceUrl = env.TOKEN_SERVICE_URL || 'https://api.go2asia.space';

    const rewardResult = await rewardSponsorsForVIPActivation(
      db,
      userId,
      tokenServiceUrl
    );

    // Устанавливаем заголовки кэширования
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');

    return c.json({
      success: true,
      sponsorId: unlockResult.sponsorId,
      pointsUnlocked: unlockResult.pointsUnlocked,
      rewards: rewardResult.rewards,
      message: 'VIP activated and rewards distributed',
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

export const vipRoutes = app;


