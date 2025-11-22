import { Hono } from 'hono';
import { z } from 'zod';
import { referrals } from '../db';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';
import type { ReferralServiceEnv } from '../types';

const app = new Hono<ReferralServiceEnv>();

// Валидационные схемы
const getTreeQuerySchema = z.object({
  depth: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 2))
    .pipe(z.number().int().min(1).max(5)),
});

// Тип для узла дерева
interface ReferralNode {
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  registeredAt: Date;
  isActive: boolean;
  subReferrals: ReferralNode[];
}

// Рекурсивная функция для построения дерева
async function buildTree(
  db: any,
  sponsorId: string,
  currentDepth: number,
  maxDepth: number
): Promise<ReferralNode[]> {
  if (currentDepth > maxDepth) {
    return [];
  }

  // Получаем прямых рефералов спонсора
  const directReferrals = await db
    .select()
    .from(referrals)
    .where(eq(referrals.sponsorId, sponsorId));

  const nodes: ReferralNode[] = [];

  for (const referral of directReferrals) {
    // Рекурсивно получаем под-рефералов
    const subReferrals = await buildTree(db, referral.userId, currentDepth + 1, maxDepth);

    nodes.push({
      userId: referral.userId,
      registeredAt: referral.registeredAt,
      isActive: referral.isActive,
      subReferrals,
    });
  }

  return nodes;
}

// GET /v1/tree - получить реферальное дерево
app.get('/', authMiddleware, async (c) => {
  const requestId = c.get('requestId');
  const userId = c.get('userId') as string;

  try {
    // Валидация query параметров
    const queryParams = getTreeQuerySchema.safeParse({
      depth: c.req.query('depth'),
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

    const { depth } = queryParams.data;
    const db = c.get('db');

    // Строим дерево рефералов
    const referralsTree = await buildTree(db, userId, 1, depth);

    // Устанавливаем заголовки кэширования (приватные данные)
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');

    return c.json({
      sponsorId: userId,
      referrals: referralsTree,
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

export const treeRoutes = app;
