import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'https://api.go2asia.space';

test.describe('Go2Asia E2E Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Go2Asia/);
  });

  test('should have health endpoint', async ({ request }) => {
    const response = await request.get(`${API_URL}/health/health`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('ok');
  });
});

