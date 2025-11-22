import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import { registerRoutes } from './register';
import type { ReferralServiceEnv } from '../types';

// Mock database
const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
};

// Mock auth middleware
const mockAuthMiddleware = async (c: any, next: any) => {
  c.set('userId', 'test-user-id');
  await next();
};

type TestEnv = ReferralServiceEnv;

describe('Register Referral API', () => {
  let app: Hono<TestEnv>;

  beforeEach(() => {
    app = new Hono<TestEnv>();
    app.use('*', async (c, next) => {
      c.set('db', mockDb);
      c.set('requestId', 'test-request-id');
      await next();
    });
    app.use('*', mockAuthMiddleware);
    app.route('/', registerRoutes);
    vi.clearAllMocks();
  });

  describe('POST /', () => {
    it('should register referral successfully', async () => {
      // Mock no existing referral
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      // Mock sponsor code found
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                userId: 'sponsor-id',
                code: 'SPONSOR123',
              },
            ]),
          }),
        }),
      });

      // Mock referral code creation
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      mockDb.insert.mockResolvedValue(undefined);

      const res = await app.request('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode: 'SPONSOR123',
          userId: 'test-user-id',
        }),
      });

      expect(res.status).toBe(200);
      const data = (await res.json()) as { success: boolean; sponsorId: string };
      expect(data.success).toBe(true);
      expect(data.sponsorId).toBe('sponsor-id');
    });

    it('should reject invalid referral code', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const res = await app.request('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode: 'INVALID',
          userId: 'test-user-id',
        }),
      });

      expect(res.status).toBe(404);
      const data = (await res.json()) as { error: { code: string } };
      expect(data.error.code).toBe('NOT_FOUND');
    });

    it('should reject duplicate registration', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: 'existing-ref',
                userId: 'test-user-id',
              },
            ]),
          }),
        }),
      });

      const res = await app.request('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode: 'SPONSOR123',
          userId: 'test-user-id',
        }),
      });

      expect(res.status).toBe(409);
      const data = (await res.json()) as { error: { code: string } };
      expect(data.error.code).toBe('CONFLICT');
    });

    it('should reject self-referral', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                userId: 'test-user-id', // Same as authenticated user
                code: 'MYCODE',
              },
            ]),
          }),
        }),
      });

      const res = await app.request('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode: 'MYCODE',
          userId: 'test-user-id',
        }),
      });

      expect(res.status).toBe(400);
      const data = (await res.json()) as { error: { code: string } };
      expect(data.error.code).toBe('BAD_REQUEST');
    });
  });
});

