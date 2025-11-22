import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import { profileRoutes } from './profile';
import type { AuthServiceEnv } from '../types';

// Mock database
const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
};

// Mock auth middleware
const mockAuthMiddleware = async (c: any, next: any) => {
  c.set('userId', 'test-user-id');
  c.set('userEmail', 'test@example.com');
  await next();
};

type TestEnv = AuthServiceEnv;

describe('Profile API', () => {
  let app: Hono<TestEnv>;

  beforeEach(() => {
    app = new Hono<TestEnv>();
    app.use('*', async (c, next) => {
      c.set('db', mockDb);
      c.set('requestId', 'test-request-id');
      await next();
    });
    app.use('*', mockAuthMiddleware);
    app.route('/', profileRoutes);
    vi.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return existing user profile', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://example.com/avatar.jpg',
        role: 'spacer',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockUser]),
          }),
        }),
      });

      const res = await app.request('/');
      expect(res.status).toBe(200);
      const data = (await res.json()) as { id: string; email: string };
      expect(data.id).toBe('test-user-id');
      expect(data.email).toBe('test@example.com');
    });

    it('should create profile if not exists', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      mockDb.insert.mockReturnValue({
        values: vi.fn().mockResolvedValue(undefined),
      });

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: 'test-user-id',
                email: 'test@example.com',
                firstName: null,
                lastName: null,
                avatar: null,
                role: 'spacer',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ]),
          }),
        }),
      });

      const res = await app.request('/');
      expect(res.status).toBe(200);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('PATCH /', () => {
    it('should update profile successfully', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: 'test-user-id',
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                avatar: null,
                role: 'spacer',
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
                id: 'test-user-id',
                firstName: 'Jane',
                lastName: 'Smith',
                avatar: 'https://example.com/new-avatar.jpg',
              },
            ]),
          }),
        }),
      });

      const res = await app.request('/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Jane',
          lastName: 'Smith',
          avatar: 'https://example.com/new-avatar.jpg',
        }),
      });

      expect(res.status).toBe(200);
      const data = (await res.json()) as { firstName: string | null; lastName: string | null };
      expect(data.firstName).toBe('Jane');
      expect(data.lastName).toBe('Smith');
    });

    it('should validate avatar URL', async () => {
      const res = await app.request('/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatar: 'not-a-url',
        }),
      });

      expect(res.status).toBe(400);
    });
  });
});

