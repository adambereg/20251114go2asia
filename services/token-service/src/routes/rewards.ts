import { Hono } from 'hono';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import type { TokenServiceEnv } from '../types';
import { rewardUser, getUserLevelInfo } from '../utils/rewards';
import { ActionType } from '../utils/reward-rules';

const app = new Hono<TokenServiceEnv>();

// Валидационные схемы
const rewardActionSchema = z.object({
  action: z.enum([
    'post_like',
    'post_create',
    'post_repost',
    'quest_complete',
    'referral_signup',
    'referral_vip_activate',
    'referral_sub_vip_activate',
    'event_attend',
    'review_create',
    'voucher_redeem',
  ]),
  metadata: z.record(z.unknown()).nullable().optional(),
});

// POST /v1/rewards/award - начислить Points за действие
app.post('/award', authMiddleware, async (c) => {
  const requestId = c.get('requestId');
  const userId = c.get('userId') as string;

  try {
    // Валидация тела запроса
    const body = await c.req.json();
    const validatedData = rewardActionSchema.safeParse(body);

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

    const { action, metadata } = validatedData.data;
    const db = c.get('db');

    // TODO: Получить VIP статус пользователя из Auth Service
    // Пока используем false как значение по умолчанию
    const isVIP = false;

    // Начисляем Points
    const result = await rewardUser(db, userId, action as ActionType, isVIP, metadata || undefined);

    if (!result.success) {
      return c.json(
        {
          error: {
            code: 'REWARD_FAILED',
            message: result.error || 'Failed to reward user',
            traceId: requestId,
          },
        },
        400
      );
    }

    return c.json({
      success: true,
      pointsAwarded: result.pointsAwarded,
      newLevel: result.newLevel,
      badgeAwarded: result.badgeAwarded,
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

// GET /v1/rewards/level - получить информацию об уровне пользователя
app.get('/level', authMiddleware, async (c) => {
  const requestId = c.get('requestId');
  const userId = c.get('userId') as string;

  try {
    const db = c.get('db');
    const levelInfo = await getUserLevelInfo(db, userId);

    return c.json(levelInfo);
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

export const rewardsRoutes = app;

