# Тестирование Go2Asia Frontend

## Быстрый старт

См. [QUICK_START_TESTING.md](./QUICK_START_TESTING.md) для быстрого начала тестирования.

## Документация

- **[API_INTEGRATION_TESTING.md](./API_INTEGRATION_TESTING.md)** - Подробное руководство по тестированию интеграции с API
- **[QUICK_START_TESTING.md](./QUICK_START_TESTING.md)** - Быстрый старт для тестирования

## Скрипты

### Тестирование API endpoints

```bash
# Из корня проекта
node scripts/test-api-integration.js

# Или из apps/go2asia-pwa-shell
pnpm test:api
```

## Что было настроено

1. ✅ **React Query Provider** - добавлен в `app/providers.tsx`
2. ✅ **Clerk Auth Setup** - настроена интеграция с SDK
3. ✅ **SDK Mutator** - настроен для работы с API
4. ✅ **Модули интегрированы** - Atlas, Pulse, Blog, Connect используют реальные API

## Следующие шаги

1. Запустите приложение: `pnpm dev`
2. Откройте модули и проверьте загрузку данных
3. Используйте React Query DevTools для отладки запросов
4. Запустите скрипт тестирования: `pnpm test:api`

