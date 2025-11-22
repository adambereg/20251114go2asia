import { Hono } from 'hono';
import { z } from 'zod';
import { referrals, referralCodes } from '../db';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';
import type { ReferralServiceEnv } from '../types';

const app = new Hono<ReferralServiceEnv>();

// Генерация UUID для Cloudflare Workers
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Валидационные схемы
const registerReferralSchema = z.object({
  referralCode: z.string().min(1),
  userId: z.string().min(1),
});

// POST /v1/register - зарегистрироваться по реферальному коду
app.post('/', authMiddleware, async (c) => {
  const requestId = c.get('requestId');
  const authenticatedUserId = c.get('userId') as string;

  try {
    // Валидация тела запроса
    const body = await c.req.json();
    const validatedData = registerReferralSchema.safeParse(body);

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

    const { referralCode, userId } = validatedData.data;

    // Проверяем, что userId соответствует аутентифицированному пользователю
    if (userId !== authenticatedUserId) {
      return c.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'Cannot register referral for another user',
            traceId: requestId,
          },
        },
        403
      );
    }

    const db = c.get('db');

    // Проверяем, не зарегистрирован ли уже пользователь как реферал
    const existingReferral = await db
      .select()
      .from(referrals)
      .where(eq(referrals.userId, userId))
      .limit(1);

    if (existingReferral.length > 0) {
      return c.json(
        {
          error: {
            code: 'CONFLICT',
            message: 'User already registered as referral',
            traceId: requestId,
          },
        },
        409
      );
    }

    // Находим спонсора по реферальному коду
    const sponsorCode = await db
      .select()
      .from(referralCodes)
      .where(eq(referralCodes.code, referralCode))
      .limit(1);

    if (sponsorCode.length === 0) {
      return c.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Invalid referral code',
            traceId: requestId,
          },
        },
        404
      );
    }

    const sponsorId = sponsorCode[0].userId;

    // Проверяем, что пользователь не регистрирует сам себя
    if (sponsorId === userId) {
      return c.json(
        {
          error: {
            code: 'BAD_REQUEST',
            message: 'Cannot use own referral code',
            traceId: requestId,
          },
        },
        400
      );
    }

    // Создаём запись реферала
    const referralId = generateUUID();
    await db.insert(referrals).values({
      id: referralId,
      userId,
      sponsorId,
      referralCode,
      isActive: true,
    });

    // Создаём реферальный код для нового пользователя (если его ещё нет)
    const userCode = await db
      .select()
      .from(referralCodes)
      .where(eq(referralCodes.userId, userId))
      .limit(1);

    if (userCode.length === 0) {
      // Генерируем код из userId
      let newCode = userId.substring(0, 8).toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (newCode.length < 6) {
        newCode = newCode.padEnd(8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]);
      }
      
      await db.insert(referralCodes).values({
        userId,
        code: newCode,
      });
    }

    // TODO: Начислить бонусы спонсору через Token Service
    // Это можно сделать через HTTP запрос к Token Service или напрямую через БД
    // Пока оставляем как TODO, так как нужна интеграция между сервисами

    // Устанавливаем заголовки кэширования
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');

    return c.json({
      success: true,
      sponsorId,
      message: 'Referral registered successfully',
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

export const registerRoutes = app;
