# Тестирование интеграции Frontend с API

**Дата создания:** 30 ноября 2025  
**Версия:** 1.0

## Обзор

Этот документ описывает процесс тестирования интеграции Frontend приложения с реальными API endpoints.

---

## Предварительные требования

### 1. Переменные окружения

Убедитесь, что в `.env.local` установлены следующие переменные:

```bash
# API URL
NEXT_PUBLIC_API_URL=https://api-staging.go2asia.space

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 2. Доступность API

Проверьте, что API endpoints доступны:

```bash
# Health check для Content Service
curl https://api-staging.go2asia.space/v1/health

# Health check для Token Service
curl https://api-staging.go2asia.space/v1/balance/health

# Health check для Referral Service
curl https://api-staging.go2asia.space/v1/referrals/health
```

---

## Тестирование модулей

### 1. Atlas Module

**Тестируемые endpoints:**
- `GET /v1/countries` - список стран
- `GET /v1/cities` - список городов
- `GET /v1/places` - список мест

**Шаги тестирования:**

1. Откройте `http://localhost:3000/atlas`
2. Проверьте загрузку списка стран
3. Проверьте отображение популярных мест
4. Откройте консоль браузера (F12) → Network
5. Убедитесь, что запросы отправляются на правильный URL:
   - `GET https://api-staging.go2asia.space/v1/countries?limit=20`
   - `GET https://api-staging.go2asia.space/v1/places?limit=3&sort=-rating`

**Ожидаемый результат:**
- Страны загружаются из API
- Популярные места отображаются корректно
- Нет ошибок в консоли
- Индикатор загрузки показывается во время запроса

**Проверка в DevTools:**

```javascript
// В консоли браузера
// Проверить, что данные загружены
window.__REACT_QUERY_STATE__ // Если доступен

// Или проверить через Network tab:
// 1. Открыть Network tab
// 2. Фильтр: XHR
// 3. Найти запросы к /v1/countries и /v1/places
// 4. Проверить Response и Status Code (200)
```

---

### 2. Pulse Module

**Тестируемые endpoints:**
- `GET /v1/events` - список событий

**Шаги тестирования:**

1. Откройте `http://localhost:3000/pulse`
2. Проверьте загрузку событий в календаре
3. Проверьте работу фильтров (город, дата, категория)
4. Откройте консоль браузера → Network
5. Убедитесь, что запросы отправляются:
   - `GET https://api-staging.go2asia.space/v1/events?limit=100`

**Ожидаемый результат:**
- События загружаются из API
- Календарь отображает события корректно
- Фильтры работают и обновляют URL
- Нет ошибок в консоли

**Проверка фильтров:**

```javascript
// В консоли браузера после применения фильтров
// Проверить URL параметры
window.location.search
// Должны быть параметры: ?city=...&date=...&category=...
```

---

### 3. Blog Module

**Тестируемые endpoints:**
- `GET /v1/articles` - список статей

**Шаги тестирования:**

1. Откройте `http://localhost:3000/blog`
2. Проверьте загрузку featured статьи
3. Проверьте загрузку редакционных статей
4. Проверьте загрузку UGC статей
5. Откройте консоль браузера → Network
6. Убедитесь, что запросы отправляются:
   - `GET https://api-staging.go2asia.space/v1/articles?limit=20&featured=true`

**Ожидаемый результат:**
- Featured статья отображается в Hero блоке
- Редакционные статьи отображаются в секции "Главные сегодня"
- UGC статьи отображаются в секции "Выбор сообщества"
- Нет ошибок в консоли

---

### 4. Connect Module

**Тестируемые endpoints:**
- `GET /v1/balance` - баланс пользователя
- `GET /v1/transactions` - история транзакций
- `GET /v1/referrals/stats` - статистика рефералов

**Шаги тестирования:**

1. **Войдите в систему** через Clerk (если не авторизованы)
2. Откройте `http://localhost:3000/connect`
3. Проверьте загрузку баланса Points и G2A
4. Проверьте загрузку последних транзакций
5. Проверьте загрузку статистики рефералов
6. Откройте консоль браузера → Network
7. Убедитесь, что запросы отправляются с токеном авторизации:
   - `GET https://api-staging.go2asia.space/v1/balance`
   - `GET https://api-staging.go2asia.space/v1/transactions?limit=10`
   - `GET https://api-staging.go2asia.space/v1/referrals/stats`

**Ожидаемый результат:**
- Баланс Points и G2A отображается корректно
- Последние транзакции загружаются
- Статистика рефералов отображается (если есть рефералы)
- Запросы содержат заголовок `Authorization: Bearer <token>`

**Проверка авторизации:**

```javascript
// В консоли браузера
// Проверить, что токен установлен
localStorage.getItem('clerk_token') // Для dev режима
// Или проверить через window.__clerkGetToken
```

---

## Тестирование аутентификации

### Проверка Clerk интеграции

1. **Откройте DevTools → Application → Local Storage**
2. Проверьте наличие токена (если используется localStorage fallback)
3. **Откройте DevTools → Network**
4. Проверьте, что запросы к защищённым endpoints содержат заголовок:
   ```
   Authorization: Bearer <clerk_jwt_token>
   ```

### Тестирование защищённых endpoints

1. **Без авторизации:**
   - Откройте `http://localhost:3000/connect` без входа
   - Должно произойти перенаправление на `/sign-in`
   - Или должен вернуться 401 Unauthorized

2. **С авторизацией:**
   - Войдите через Clerk
   - Откройте `http://localhost:3000/connect`
   - Данные должны загрузиться успешно

---

## Проверка ошибок

### Типичные ошибки и решения

#### 1. CORS ошибки

**Симптомы:**
```
Access to fetch at 'https://api-staging.go2asia.space/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Решение:**
- Проверьте настройки CORS в API Gateway
- Убедитесь, что `http://localhost:3000` добавлен в список разрешённых origins

#### 2. 401 Unauthorized

**Симптомы:**
- Запросы возвращают 401
- Данные не загружаются

**Решение:**
- Проверьте, что Clerk токен генерируется корректно
- Проверьте, что токен передаётся в заголовке Authorization
- Проверьте настройки Clerk в API Gateway

#### 3. 404 Not Found

**Симптомы:**
- Endpoint не найден
- 404 ошибка

**Решение:**
- Проверьте правильность URL в SDK mutator
- Проверьте, что API Gateway правильно маршрутизирует запросы
- Убедитесь, что сервисы развёрнуты и доступны

#### 4. Неправильный формат данных

**Симптомы:**
- Данные не отображаются
- Ошибки в консоли о неправильном формате

**Решение:**
- Проверьте соответствие схем данных API и компонентов
- Проверьте преобразование данных в wrapper компонентах
- Убедитесь, что API возвращает данные в ожидаемом формате

---

## Автоматизированное тестирование

### Использование Playwright для E2E тестов

```typescript
// tests/e2e/api-integration.spec.ts
import { test, expect } from '@playwright/test';

test('Atlas module loads countries from API', async ({ page }) => {
  // Перехватываем запросы к API
  await page.route('**/v1/countries**', async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    expect(json.data).toBeDefined();
    await route.fulfill({ response, json });
  });

  await page.goto('http://localhost:3000/atlas');
  
  // Проверяем, что данные загружены
  await expect(page.locator('[data-testid="country-card"]')).toBeVisible();
});
```

---

## Чеклист тестирования

- [ ] **Atlas Module**
  - [ ] Страны загружаются из API
  - [ ] Популярные места отображаются
  - [ ] Нет ошибок в консоли
  - [ ] Индикатор загрузки работает

- [ ] **Pulse Module**
  - [ ] События загружаются из API
  - [ ] Календарь отображает события
  - [ ] Фильтры работают корректно
  - [ ] URL параметры обновляются

- [ ] **Blog Module**
  - [ ] Featured статья загружается
  - [ ] Редакционные статьи отображаются
  - [ ] UGC статьи отображаются
  - [ ] Нет ошибок в консоли

- [ ] **Connect Module**
  - [ ] Баланс загружается (требует авторизации)
  - [ ] Транзакции загружаются
  - [ ] Статистика рефералов загружается
  - [ ] Авторизация работает корректно

- [ ] **Общие проверки**
  - [ ] Все запросы отправляются на правильный URL
  - [ ] Токены авторизации передаются корректно
  - [ ] Ошибки обрабатываются правильно
  - [ ] Состояния загрузки отображаются

---

## Отладка

### Включение debug режима

В `.env.local`:

```bash
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### Логирование запросов

В `packages/sdk/src/mutator.ts` можно добавить логирование:

```typescript
export const customInstance = async <T>(
  config: RequestConfig,
  options: RequestOptions = {}
): Promise<T> => {
  // ... existing code ...
  
  if (process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true') {
    console.log('[API Request]', {
      method,
      url: finalURL,
      headers: { ...headers, Authorization: 'Bearer ***' },
    });
  }
  
  // ... rest of the code ...
};
```

### Проверка React Query кэша

```javascript
// В консоли браузера
// Если React Query DevTools установлен
window.__REACT_QUERY_STATE__
```

---

## Следующие шаги

После успешного тестирования:

1. **Оптимизация запросов:**
   - Добавить prefetching для критичных данных
   - Настроить staleTime и cacheTime для React Query
   - Реализовать optimistic updates

2. **Обработка ошибок:**
   - Добавить retry логику
   - Реализовать fallback UI для ошибок
   - Добавить уведомления об ошибках

3. **Производительность:**
   - Оптимизировать количество запросов
   - Реализовать pagination для больших списков
   - Добавить skeleton screens вместо индикаторов загрузки

---

## Полезные ссылки

- [React Query Documentation](https://tanstack.com/query/latest)
- [Clerk Authentication](https://clerk.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

