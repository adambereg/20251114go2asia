import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';
import { requireAdmin } from '../middleware/role-check';
import { users } from '../db';
import type { AuthServiceEnv } from '../types';

const app = new Hono<AuthServiceEnv>();

/**
 * Пример использования middleware для проверки ролей
 * Все маршруты в этом файле требуют роль 'admin'
 */

// GET /v1/admin/users - получить список всех пользователей (только для админов)
app.get('/users', authMiddleware, requireAdmin(), async (c) => {
  const requestId = c.get('requestId');
  const userId = c.get('userId') as string;

  try {
    const db = c.get('db');

    // Получаем список всех пользователей
    const allUsers = await db.select().from(users);

    return c.json({
      users: allUsers.map((user) => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
      })),
      total: allUsers.length,
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

// PATCH /v1/admin/users/:userId/role - изменить роль пользователя (только для админов)
app.patch('/users/:userId/role', authMiddleware, requireAdmin(), async (c) => {
  const requestId = c.get('requestId');
  const targetUserId = c.req.param('userId');

  try {
    const body = await c.req.json();
    const { role } = body;

    if (!role || !['spacer', 'vip', 'pro', 'partner', 'admin'].includes(role)) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid role. Must be one of: spacer, vip, pro, partner, admin',
            traceId: requestId,
          },
        },
        400
      );
    }

    const db = c.get('db');

    const [updatedUser] = await db
      .update(users)
      .set({
        role: role as 'spacer' | 'vip' | 'pro' | 'partner' | 'admin',
        updatedAt: new Date(),
      })
      .where(eq(users.id, targetUserId))
      .returning();

    if (!updatedUser) {
      return c.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
            traceId: requestId,
          },
        },
        404
      );
    }

    return c.json({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
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

export const adminRoutes = app;

