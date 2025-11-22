import { Hono } from 'hono';
import { z } from 'zod';
import { transactions } from '../db';
import { eq, desc, lt, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';
import type { TokenServiceEnv } from '../types';

type TransactionRow = typeof transactions.$inferSelect;

const app = new Hono<TokenServiceEnv>();

// Валидационные схемы
const getTransactionsQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().min(1).max(100)),
  cursor: z.string().optional(),
});

// GET /v1/transactions - получить историю транзакций
app.get('/', authMiddleware, async (c) => {
  const requestId = c.get('requestId');
  const userId = c.get('userId') as string;

  try {
    // Валидация query параметров
    const queryParams = getTransactionsQuerySchema.safeParse({
      limit: c.req.query('limit'),
      cursor: c.req.query('cursor'),
    });

    if (!queryParams.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: queryParams.error.errors.map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            })),
            traceId: requestId,
          },
        },
        400
      );
    }

    const { limit, cursor } = queryParams.data;
    const db = c.get('db');

    // Базовый запрос
    const conditions = [eq(transactions.userId, userId)];
    
    // Cursor-based пагинация (для сортировки по убыванию используем lt)
    if (cursor) {
      conditions.push(lt(transactions.id, cursor));
    }

    // Сортировка по дате создания (сначала новые, DESC) и лимит
    const query = db
      .select()
      .from(transactions)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0])
      .orderBy(desc(transactions.createdAt), desc(transactions.id))
      .limit(limit + 1) as any;
    const result = await query;

    // Определяем, есть ли следующая страница
    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;
    const itemsTyped = items as TransactionRow[];

    // Формируем nextCursor
    const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : null;

    // Устанавливаем заголовки кэширования (приватные данные)
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');

    return c.json({
      items: itemsTyped.map((item) => ({
        id: item.id,
        userId: item.userId,
        type: item.type,
        amount: parseFloat(item.amount),
        reason: item.reason,
        metadata: item.metadata,
        createdAt: item.createdAt,
      })),
      hasMore,
      nextCursor,
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

export const transactionsRoutes = app;
