# Кэш-матрица API Gateway

**Дата:** 2025-11-14  
**Версия:** 1.0

## Таблица TTL для эндпоинтов

| Эндпоинт | Метод | Тип | TTL Edge | SWR | Инвалидация |
|----------|-------|-----|----------|-----|-------------|
| `/v1/api/content/countries` | GET | Публичный | 600 с | 600 с | Ручная (админ-панель) |
| `/v1/api/content/cities` | GET | Публичный | 600 с | 600 с | Ручная (админ-панель) |
| `/v1/api/content/places` | GET | Публичный | 300 с | 300 с | На изменение/публикацию |
| `/v1/api/content/events` | GET | Публичный | 300 с | 300 с | На изменение/публикацию |
| `/v1/api/content/articles` | GET | Публичный | 600 с | 600 с | На публикацию/редактирование |
| `/v1/api/token/balance` | GET | Приватный | 0 | 0 | `no-store` |
| `/v1/api/token/transactions` | GET | Приватный | 0 | 0 | `no-store` |
| `/v1/api/referral/stats` | GET | Приватный | 0 | 0 | `no-store` |
| `/v1/api/referral/tree` | GET | Приватный | 0 | 0 | `no-store` |
| `/v1/api/auth/profile` | GET | Приватный | 0 | 0 | `no-store` |
| Все POST/PUT/DELETE | - | - | 0 | 0 | `no-store` |

## Заголовки

### Публичные эндпоинты
```
Cache-Control: public, s-maxage={ttl}, stale-while-revalidate={swr}
Vary: Accept, Accept-Encoding
```

### Приватные эндпоинты
```
Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
Pragma: no-cache
Expires: 0
```

## Реализация

Кэш-политика реализована в:
- `services/api-gateway/src/utils/cache.ts` - утилиты кэширования
- `services/api-gateway/src/middleware/cache.ts` - middleware для установки заголовков

## Тестирование

Тесты для проверки заголовков:
- `tests/cache-headers.test.ts` - интеграционные тесты
- `services/api-gateway/src/__tests__/cache.test.ts` - unit тесты

