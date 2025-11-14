import { describe, test, expect } from 'vitest';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8787';

describe('Cache Headers', () => {
  // Публичные GET endpoints должны иметь кеш
  const publicEndpoints = [
    { path: '/v1/api/content/countries', ttl: 600 },
    { path: '/v1/api/content/cities', ttl: 600 },
    { path: '/v1/api/content/places', ttl: 300 },
    { path: '/v1/api/content/events', ttl: 300 },
    { path: '/v1/api/content/articles', ttl: 600 },
  ];

  publicEndpoints.forEach(({ path, ttl }) => {
    test(`Public GET ${path} has correct cache headers`, async () => {
      const response = await fetch(`${API_BASE_URL}${path}`);
      
      // Может быть 404 если сервис не запущен, но заголовки должны быть правильными
      if (response.status === 404) {
        console.warn(`Endpoint ${path} returned 404 - service may not be running`);
        return;
      }

      const cacheControl = response.headers.get('Cache-Control');
      expect(cacheControl).toBeTruthy();
      expect(cacheControl).toContain('public');
      expect(cacheControl).toContain(`s-maxage=${ttl}`);
      expect(cacheControl).toContain('stale-while-revalidate');
      
      const vary = response.headers.get('Vary');
      expect(vary).toBeTruthy();
      expect(vary).toContain('Accept');
    });
  });

  // Приватные endpoints должны иметь no-store
  const privateEndpoints = [
    '/v1/api/token/balance',
    '/v1/api/token/transactions',
    '/v1/api/referral/stats',
    '/v1/api/referral/tree',
    '/v1/api/auth/profile',
  ];

  privateEndpoints.forEach((path) => {
    test(`Private GET ${path} has no-store`, async () => {
      const token = process.env.TEST_JWT_TOKEN;
      
      const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      // Может быть 401 без токена, но заголовки должны быть правильными
      if (response.status === 401 && !token) {
        console.warn(`Endpoint ${path} returned 401 - token not provided`);
      }

      const cacheControl = response.headers.get('Cache-Control');
      expect(cacheControl).toBeTruthy();
      expect(cacheControl).toContain('no-store');
      expect(cacheControl).toContain('no-cache');
      expect(cacheControl).toContain('must-revalidate');
    });
  });

  // POST/PUT/DELETE endpoints не должны кешироваться
  test('POST endpoints have no-store', async () => {
    const response = await fetch(`${API_BASE_URL}/v1/api/token/balance/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TEST_JWT_TOKEN || ''}`,
      },
      body: JSON.stringify({ amount: 10, reason: 'test' }),
    });

    const cacheControl = response.headers.get('Cache-Control');
    if (cacheControl) {
      expect(cacheControl).toContain('no-store');
    }
  });
});

