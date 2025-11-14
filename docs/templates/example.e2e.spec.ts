// Пример E2E теста с Playwright
// Разместить в: tests/e2e/example.e2e.spec.ts

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://go2asia.space';
const API_URL = process.env.API_URL || 'https://api.go2asia.space';

test.describe('Go2Asia E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Перейти на главную страницу перед каждым тестом
    await page.goto(BASE_URL);
  });

  test('should load homepage', async ({ page }) => {
    // Проверить, что страница загрузилась
    await expect(page).toHaveTitle(/Go2Asia/);
    
    // Проверить наличие основных элементов
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should navigate to Atlas module', async ({ page }) => {
    // Кликнуть на ссылку Atlas
    await page.click('text=Atlas');
    
    // Проверить URL
    await expect(page).toHaveURL(/.*\/atlas/);
    
    // Проверить загрузку данных
    await expect(page.locator('[data-testid="countries-list"]')).toBeVisible({ timeout: 10000 });
  });

  test('should display countries from API', async ({ page }) => {
    // Перехватить API запрос
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/v1/api/content/countries') && response.status() === 200
    );

    // Перейти на страницу стран
    await page.goto(`${BASE_URL}/atlas/countries`);

    // Дождаться ответа API
    const response = await responsePromise;
    const data = await response.json();

    // Проверить данные
    expect(data.items).toBeDefined();
    expect(Array.isArray(data.items)).toBe(true);
    
    // Проверить отображение на странице
    await expect(page.locator('[data-testid="country-card"]').first()).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Перехватить запрос и вернуть ошибку
    await page.route(`${API_URL}/v1/api/content/countries`, (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Internal server error',
            traceId: 'test-trace-id',
          },
        }),
      });
    });

    // Перейти на страницу
    await page.goto(`${BASE_URL}/atlas/countries`);

    // Проверить, что ошибка отображается
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should authenticate user', async ({ page }) => {
    // Кликнуть на кнопку входа
    await page.click('text=Sign In');

    // Дождаться модального окна Clerk
    await expect(page.locator('[data-clerk-element="modal"]')).toBeVisible({ timeout: 10000 });

    // Ввести тестовые данные (если есть тестовый аккаунт)
    // await page.fill('input[type="email"]', 'test@example.com');
    // await page.fill('input[type="password"]', 'password');
    // await page.click('button[type="submit"]');

    // Проверить успешный вход
    // await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should display user balance after login', async ({ page, context }) => {
    // Установить cookie для авторизации (если есть тестовый токен)
    // await context.addCookies([{
    //   name: '__clerk_db_jwt',
    //   value: 'test-token',
    //   domain: 'go2asia.space',
    //   path: '/',
    // }]);

    // Перейти на страницу
    await page.goto(BASE_URL);

    // Проверить отображение баланса
    // await expect(page.locator('[data-testid="balance-widget"]')).toBeVisible();
  });
});

test.describe('API Integration Tests', () => {
  test('should return countries list', async ({ request }) => {
    const response = await request.get(`${API_URL}/v1/api/content/countries`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.items).toBeDefined();
    expect(Array.isArray(data.items)).toBe(true);
  });

  test('should return 401 for protected endpoint without auth', async ({ request }) => {
    const response = await request.get(`${API_URL}/v1/api/token/balance`);
    
    expect(response.status()).toBe(401);
    
    const data = await response.json();
    expect(data.error.code).toBe('UNAUTHORIZED');
  });

  test('should return 200 for protected endpoint with auth', async ({ request }) => {
    // Получить тестовый токен (если есть)
    const token = process.env.TEST_JWT_TOKEN;
    if (!token) {
      test.skip();
      return;
    }

    const response = await request.get(`${API_URL}/v1/api/token/balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.points).toBeDefined();
  });
});


