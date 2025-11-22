import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import { balanceRoutes } from './balance';
import type { TokenServiceEnv } from '../types';

// Mock database
const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
};

// Mock auth middleware
const mockAuthMiddleware = async (c: any, next: any) => {
  c.set('userId', 'test-user-id');
  await next();
};

type TestEnv = TokenServiceEnv;

describe('Balance API', () => {
  let app: Hono<TestEnv>;

  beforeEach(() => {
    app = new Hono<TestEnv>();
    app.use('*', async (c, next) => {
      c.set('db', mockDb);
      c.set('requestId', 'test-request-id');
      await next();
    });
    app.use('*', mockAuthMiddleware);
    app.route('/', balanceRoutes);
    vi.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return balance for existing user', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                userId: 'test-user-id',
                points: 100,
                g2a: '50.00',
                updatedAt: new Date(),
              },
            ]),
          }),
        }),
      });

      const res = await app.request('/');
      expect(res.status).toBe(200);
      const data = (await res.json()) as { points: number; g2a: number };
      expect(data).toEqual({
        points: 100,
        g2a: 50.0,
      });
    });

    it('should create balance for new user', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValueOnce([]).mockResolvedValueOnce([
              {
                userId: 'test-user-id',
                points: 0,
                g2a: '0',
                updatedAt: new Date(),
              },
            ]),
          }),
        }),
      });

      mockDb.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([
            {
              userId: 'test-user-id',
              points: 0,
              g2a: '0',
            },
          ]),
        }),
      });

      const res = await app.request('/');
      expect(res.status).toBe(200);
      const data = (await res.json()) as { points: number; g2a: number };
      expect(data).toEqual({
        points: 0,
        g2a: 0,
      });
    });
  });

  describe('POST /add', () => {
    it('should add points successfully', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                userId: 'test-user-id',
                points: 100,
                g2a: '0',
              },
            ]),
          }),
        }),
      });

      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([
              {
                userId: 'test-user-id',
                points: 200,
                g2a: '0',
              },
            ]),
          }),
        }),
      });

      mockDb.insert.mockReturnValue({
        values: vi.fn().mockResolvedValue(undefined),
      });

      const res = await app.request('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 100,
          reason: 'test_reason',
        }),
      });

      expect(res.status).toBe(200);
      const data = (await res.json()) as { type: string; amount: number };
      expect(data.type).toBe('points_add');
      expect(data.amount).toBe(100);
    });

    it('should validate request body', async () => {
      const res = await app.request('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: -10, // Invalid: negative
          reason: 'test',
        }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /subtract', () => {
    it('should subtract points successfully', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                userId: 'test-user-id',
                points: 100,
                g2a: '0',
              },
            ]),
          }),
        }),
      });

      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([
              {
                userId: 'test-user-id',
                points: 50,
                g2a: '0',
              },
            ]),
          }),
        }),
      });

      mockDb.insert.mockReturnValue({
        values: vi.fn().mockResolvedValue(undefined),
      });

      const res = await app.request('/subtract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 50,
          reason: 'test_reason',
        }),
      });

      expect(res.status).toBe(200);
      const data = (await res.json()) as { type: string; amount: number };
      expect(data.type).toBe('points_subtract');
      expect(data.amount).toBe(50);
    });

    it('should reject insufficient balance', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                userId: 'test-user-id',
                points: 10,
                g2a: '0',
              },
            ]),
          }),
        }),
      });

      const res = await app.request('/subtract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 100, // More than balance
          reason: 'test_reason',
        }),
      });

      expect(res.status).toBe(409);
      const data = (await res.json()) as { error: { code: string } };
      expect(data.error.code).toBe('CONFLICT');
    });
  });
});

