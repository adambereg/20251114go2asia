import { Hono } from 'hono';
import { z } from 'zod';
import { users } from '../db';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';
import type { AuthServiceEnv } from '../types';

const app = new Hono<AuthServiceEnv>();

// Валидационные схемы
const updateProfileSchema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  avatar: z.string().url().nullable().optional(),
});

// GET /v1/profile - получить профиль пользователя
app.get('/', authMiddleware, async (c) => {
  const requestId = c.get('requestId');
  const userId = c.get('userId') as string;
  const userEmail = c.get('userEmail') as string;

  try {
    const db = c.get('db');

    // Получаем профиль из БД или создаём новый
    let user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // Если пользователя нет в БД, создаём запись
    if (user.length === 0) {
      const [newUser] = await db
        .insert(users)
        .values({
          id: userId,
          email: userEmail || '',
          role: 'spacer',
        })
        .returning();

      user = [newUser];
    }

    const profile = user[0];

    // Устанавливаем заголовки кэширования (приватные данные)
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');

    return c.json({
      id: profile.id,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatar: profile.avatar,
      role: profile.role,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
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

// PATCH /v1/profile - обновить профиль пользователя
app.patch('/', authMiddleware, async (c) => {
  const requestId = c.get('requestId');
  const userId = c.get('userId') as string;

  try {
    // Валидация тела запроса
    const body = await c.req.json();
    const validatedData = updateProfileSchema.safeParse(body);

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

    const db = c.get('db');

    // Обновляем профиль
    const [updatedUser] = await db
      .update(users)
      .set({
        firstName: validatedData.data.firstName ?? undefined,
        lastName: validatedData.data.lastName ?? undefined,
        avatar: validatedData.data.avatar ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return c.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'User profile not found',
            traceId: requestId,
          },
        },
        404
      );
    }

    // Устанавливаем заголовки кэширования
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');

    return c.json({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
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

export const profileRoutes = app;
