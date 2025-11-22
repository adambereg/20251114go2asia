import { Hono } from 'hono';
import { z } from 'zod';
import { balances, transactions } from '../db';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';
import type { TokenServiceEnv } from '../types';

// Генерация UUID для Cloudflare Workers
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const app = new Hono<TokenServiceEnv>();

// Валидационные схемы
const addPointsSchema = z.object({
  amount: z.number().int().min(1).max(100),
  reason: z.string().min(1),
  metadata: z.record(z.unknown()).nullable().optional(),
});

const subtractPointsSchema = z.object({
  amount: z.number().int().min(1),
  reason: z.string().min(1),
  metadata: z.record(z.unknown()).nullable().optional(),
});

// GET /v1/balance - получить баланс пользователя
app.get('/', authMiddleware, async (c) => {
  const requestId = c.get('requestId');
  const userId = c.get('userId') as string;

  try {
    const db = c.get('db');

    // Получаем баланс из БД или создаём новый (0, 0)
    let balance = await db
      .select()
      .from(balances)
      .where(eq(balances.userId, userId))
      .limit(1);

    // Если баланса нет, создаём запись с нулевыми значениями
    if (balance.length === 0) {
      const [newBalance] = await db
        .insert(balances)
        .values({
          userId,
          points: 0,
          g2a: '0',
        })
        .returning();

      balance = [newBalance];
    }

    const userBalance = balance[0];

    // Устанавливаем заголовки кэширования (приватные данные)
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');

    return c.json({
      points: userBalance.points,
      g2a: parseFloat(userBalance.g2a),
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

// POST /v1/balance/add - добавить поинты
app.post('/add', authMiddleware, async (c) => {
  const requestId = c.get('requestId');
  const userId = c.get('userId') as string;

  try {
    // Валидация тела запроса
    const body = await c.req.json();
    const validatedData = addPointsSchema.safeParse(body);

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

    const { amount, reason, metadata } = validatedData.data;
    const db = c.get('db');

    // Используем транзакцию для атомарности
    // В Cloudflare Workers с postgres можно использовать BEGIN/COMMIT
    // Но для простоты используем UPSERT и отдельную вставку транзакции

    // Получаем или создаём баланс
    let balance = await db
      .select()
      .from(balances)
      .where(eq(balances.userId, userId))
      .limit(1);

    if (balance.length === 0) {
      // Создаём баланс
      const [newBalance] = await db
        .insert(balances)
        .values({
          userId,
          points: amount,
          g2a: '0',
        })
        .returning();
      balance = [newBalance];
    } else {
      // Обновляем баланс
      const [updatedBalance] = await db
        .update(balances)
        .set({
          points: balance[0].points + amount,
          updatedAt: new Date(),
        })
        .where(eq(balances.userId, userId))
        .returning();
      balance = [updatedBalance];
    }

    // Создаём запись транзакции
    const transactionId = generateUUID();
    await db.insert(transactions).values({
      id: transactionId,
      userId,
      type: 'points_add',
      amount: amount.toString(),
      reason,
      metadata: metadata || null,
    });

    // Устанавливаем заголовки кэширования
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');

    return c.json({
      id: transactionId,
      userId,
      type: 'points_add',
      amount,
      reason,
      metadata: metadata || null,
      createdAt: new Date().toISOString(),
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

// POST /v1/balance/subtract - списать поинты
app.post('/subtract', authMiddleware, async (c) => {
  const requestId = c.get('requestId');
  const userId = c.get('userId') as string;

  try {
    // Валидация тела запроса
    const body = await c.req.json();
    const validatedData = subtractPointsSchema.safeParse(body);

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

    const { amount, reason, metadata } = validatedData.data;
    const db = c.get('db');

    // Получаем баланс
    let balance = await db
      .select()
      .from(balances)
      .where(eq(balances.userId, userId))
      .limit(1);

    // Если баланса нет или недостаточно поинтов
    if (balance.length === 0 || balance[0].points < amount) {
      return c.json(
        {
          error: {
            code: 'CONFLICT',
            message: 'Insufficient balance',
            traceId: requestId,
          },
        },
        409
      );
    }

    // Обновляем баланс
    const [updatedBalance] = await db
      .update(balances)
      .set({
        points: balance[0].points - amount,
        updatedAt: new Date(),
      })
      .where(eq(balances.userId, userId))
      .returning();

    // Создаём запись транзакции
    const transactionId = generateUUID();
    await db.insert(transactions).values({
      id: transactionId,
      userId,
      type: 'points_subtract',
      amount: amount.toString(),
      reason,
      metadata: metadata || null,
    });

    // Устанавливаем заголовки кэширования
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');

    return c.json({
      id: transactionId,
      userId,
      type: 'points_subtract',
      amount,
      reason,
      metadata: metadata || null,
      createdAt: new Date().toISOString(),
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

export const balanceRoutes = app;
