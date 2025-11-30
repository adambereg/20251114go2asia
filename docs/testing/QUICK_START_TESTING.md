# Быстрый старт: Тестирование API интеграции

## Шаг 1: Установка зависимостей

Убедитесь, что установлены все зависимости:

```bash
cd apps/go2asia-pwa-shell
pnpm install
```

## Шаг 2: Настройка переменных окружения

Создайте файл `.env.local`:

```bash
# API URL
NEXT_PUBLIC_API_URL=https://api-staging.go2asia.space

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Шаг 3: Запуск приложения

```bash
pnpm dev
```

Приложение будет доступно на `http://localhost:3000`

## Шаг 4: Тестирование API endpoints

### Автоматическое тестирование (скрипт)

```bash
# Из корня проекта
node scripts/test-api-integration.js

# Или с указанием окружения
NEXT_PUBLIC_API_URL=https://api-staging.go2asia.space node scripts/test-api-integration.js
```

### Ручное тестирование модулей

1. **Atlas Module:**
   - Откройте `http://localhost:3000/atlas`
   - Проверьте загрузку стран и мест
   - Откройте DevTools → Network → проверьте запросы к `/v1/countries` и `/v1/places`

2. **Pulse Module:**
   - Откройте `http://localhost:3000/pulse`
   - Проверьте загрузку событий
   - Проверьте работу фильтров

3. **Blog Module:**
   - Откройте `http://localhost:3000/blog`
   - Проверьте загрузку статей
   - Проверьте отображение featured статьи

4. **Connect Module (требует авторизации):**
   - Войдите через Clerk
   - Откройте `http://localhost:3000/connect`
   - Проверьте загрузку баланса, транзакций и статистики рефералов

## Шаг 5: Проверка React Query DevTools

В development режиме React Query DevTools автоматически доступен:
- Откройте приложение
- В правом нижнем углу появится иконка React Query
- Кликните для просмотра кэша и запросов

## Типичные проблемы

### Проблема: CORS ошибки

**Решение:** Проверьте настройки CORS в API Gateway. Убедитесь, что `http://localhost:3000` добавлен в список разрешённых origins.

### Проблема: 401 Unauthorized

**Решение:** 
- Проверьте, что Clerk токен генерируется корректно
- Проверьте настройки Clerk в API Gateway
- Убедитесь, что `ClerkAuthSetup` компонент работает

### Проблема: Данные не загружаются

**Решение:**
- Проверьте консоль браузера на наличие ошибок
- Проверьте Network tab в DevTools
- Убедитесь, что API endpoints доступны

## Дополнительная информация

Подробная документация: [API_INTEGRATION_TESTING.md](./API_INTEGRATION_TESTING.md)

