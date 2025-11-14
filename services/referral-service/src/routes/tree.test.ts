import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import { treeRoutes } from './tree';

// Mock database
const mockDb = {
  select: vi.fn(),
};

// Mock auth middleware
const mockAuthMiddleware = async (c: any, next: any) => {
  c.set('userId', 'test-user-id');
  await next();
};

describe('Referral Tree API', () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
    app.use('*', async (c, next) => {
      c.set('db', mockDb);
      c.set('requestId', 'test-request-id');
      await next();
    });
    app.use('*', mockAuthMiddleware);
    app.route('/', treeRoutes);
    vi.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return referral tree', async () => {
      const mockReferrals = [
        {
          userId: 'ref-1',
          registeredAt: new Date(),
          isActive: true,
        },
      ];

      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockReferrals),
        }),
      });

      const res = await app.request('/?depth=2');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.sponsorId).toBe('test-user-id');
      expect(data.referrals).toBeDefined();
    });

    it('should validate depth parameter', async () => {
      const res = await app.request('/?depth=10'); // > 5
      expect(res.status).toBe(400);
    });
  });
});

