import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import { statsRoutes } from './stats';
import type { ReferralServiceEnv } from '../types';

// Mock database
const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
  execute: vi.fn(),
};

// Mock auth middleware
const mockAuthMiddleware = async (c: any, next: any) => {
  c.set('userId', 'test-user-id');
  await next();
};

type TestEnv = ReferralServiceEnv;

describe('Referral Stats API', () => {
  let app: Hono<TestEnv>;

  beforeEach(() => {
    app = new Hono<TestEnv>();
    app.use('*', async (c, next) => {
      c.set('db', mockDb);
      c.set('requestId', 'test-request-id');
      await next();
    });
    app.use('*', mockAuthMiddleware);
    app.route('/', statsRoutes);
    vi.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return referral stats', async () => {
      // Mock referral code
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                userId: 'test-user-id',
                code: 'TESTCODE',
              },
            ]),
          }),
        }),
      });

      // Mock direct referrals count
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            count: [{ count: 5 }],
          }),
        }),
      });

      // Mock active referrals count
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            count: [{ count: 3 }],
          }),
        }),
      });

      // Mock sub-referrals and earned points
      mockDb.execute.mockResolvedValueOnce([{ count: 10 }]);
      mockDb.execute.mockResolvedValueOnce([{ total: 500 }]);

      const res = await app.request('/');
      expect(res.status).toBe(200);
      const data = (await res.json()) as { totalReferrals: number };
      expect(data).toHaveProperty('totalReferrals');
      expect(data).toHaveProperty('activeReferrals');
      expect(data).toHaveProperty('totalSubReferrals');
      expect(data).toHaveProperty('totalEarned');
      expect(data).toHaveProperty('referralCode');
    });

    it('should create referral code if not exists', async () => {
      // Mock no referral code
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      // Mock insert referral code
      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([
            {
              userId: 'test-user-id',
              code: 'GENERATED',
            },
          ]),
        }),
      });

      // Mock other queries
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            count: [{ count: 0 }],
          }),
        }),
      });

      mockDb.execute.mockResolvedValue([{ count: 0 }, { total: 0 }]);

      const res = await app.request('/');
      expect(res.status).toBe(200);
      const data = (await res.json()) as { totalReferrals: number; referralCode: string };
      expect(data.referralCode).toBe('GENERATED');
    });
  });
});

