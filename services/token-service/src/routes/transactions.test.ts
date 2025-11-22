import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import { transactionsRoutes } from './transactions';
import type { TokenServiceEnv } from '../types';

// Mock database
const mockDb = {
  select: vi.fn(),
};

// Mock auth middleware
const mockAuthMiddleware = async (c: any, next: any) => {
  c.set('userId', 'test-user-id');
  await next();
};

type TestEnv = TokenServiceEnv;

describe('Transactions API', () => {
  let app: Hono<TestEnv>;

  beforeEach(() => {
    app = new Hono<TestEnv>();
    app.use('*', async (c, next) => {
      c.set('db', mockDb);
      c.set('requestId', 'test-request-id');
      await next();
    });
    app.use('*', mockAuthMiddleware);
    app.route('/', transactionsRoutes);
    vi.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return transactions with pagination', async () => {
      const mockTransactions = [
        {
          id: 'tx-1',
          userId: 'test-user-id',
          type: 'points_add',
          amount: '100',
          reason: 'test',
          metadata: null,
          createdAt: new Date(),
        },
        {
          id: 'tx-2',
          userId: 'test-user-id',
          type: 'points_subtract',
          amount: '50',
          reason: 'test',
          metadata: null,
          createdAt: new Date(),
        },
      ];

      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue(mockTransactions),
            }),
          }),
        }),
      });

      const res = await app.request('/?limit=20');
      expect(res.status).toBe(200);
      const data = (await res.json()) as { items: unknown[]; hasMore: boolean; nextCursor: string | null };
      expect(data.items).toHaveLength(2);
      expect(data.hasMore).toBe(false);
    });

    it('should handle cursor pagination', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([]),
            }),
          }),
        }),
      });

      const res = await app.request('/?limit=20&cursor=tx-1');
      expect(res.status).toBe(200);
      const data = (await res.json()) as { items: unknown[]; hasMore: boolean; nextCursor: string | null };
      expect(data.items).toHaveLength(0);
    });

    it('should validate limit parameter', async () => {
      const res = await app.request('/?limit=200'); // > 100
      expect(res.status).toBe(400);
    });
  });
});

