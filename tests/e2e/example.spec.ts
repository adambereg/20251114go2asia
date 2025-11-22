import { test, expect } from '@playwright/test';

test.describe('Go2Asia E2E Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Go2Asia/);
  });

  test('should have health endpoint', async ({ request }) => {
    // Skip health endpoint test in CI if API is not available
    const API_URL = process.env.API_URL;
    if (!API_URL) {
      test.skip();
    }
    const response = await request.get(`${API_URL}/health/health`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('ok');
  });
});

