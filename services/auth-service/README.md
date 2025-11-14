# Auth Service

Сервис для работы с авторизацией и профилями пользователей через Clerk.

## Функциональность

- **Profile API** (`GET/PATCH /v1/profile`) - получение и обновление профиля пользователя
- **Webhook API** (`POST /v1/webhook`) - обработка событий от Clerk (user.created, user.updated, user.deleted)

## Зависимости

- `@clerk/backend` - интеграция с Clerk для верификации JWT токенов
- `svix` - валидация подписей webhook от Clerk
- `drizzle-orm` + `postgres` - работа с БД PostgreSQL

## Настройка

### Секреты в Cloudflare Workers

Убедитесь, что в настройках Worker настроены следующие секреты:

- `CLERK_SECRET_KEY` - секретный ключ Clerk для верификации JWT
- `CLERK_WEBHOOK_SECRET` - секрет для валидации webhook подписей (из Clerk Dashboard → Webhooks)
- `DATABASE_URL` - строка подключения к PostgreSQL (Neon)
- `SERVICE_JWT_SECRET` - секрет для service-to-service JWT (опционально)

### Миграции БД

Применить миграцию для создания таблицы `users`:

```bash
cd services/auth-service
pnpm db:migrate:up
```

Или вручную выполнить SQL из `migrations/0000_create_users_table.sql` в Neon Console.

## Структура БД

### Таблица `users`

- `id` (text, PK) - Clerk user ID
- `email` (text, NOT NULL) - email пользователя
- `first_name` (text, nullable) - имя
- `last_name` (text, nullable) - фамилия
- `avatar` (text, nullable) - URL аватара
- `role` (enum: spacer/vip/pro) - роль пользователя (по умолчанию: spacer)
- `created_at` (timestamp) - дата создания
- `updated_at` (timestamp) - дата обновления

## API Endpoints

### GET /v1/profile

Получить профиль текущего пользователя.

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Response:**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "firstName": "Иван",
  "lastName": "Иванов",
  "avatar": "https://...",
  "role": "spacer",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### PATCH /v1/profile

Обновить профиль пользователя.

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Body:**
```json
{
  "firstName": "Иван",
  "lastName": "Иванов",
  "avatar": "https://..."
}
```

**Response:** Обновлённый профиль (формат как в GET)

### POST /v1/webhook

Webhook от Clerk для синхронизации пользователей.

**Headers:**
```
svix-id: <svix_id>
svix-timestamp: <timestamp>
svix-signature: <signature>
```

**Body:** Clerk webhook event (user.created, user.updated, user.deleted)

**Response:**
```json
{
  "success": true
}
```

## Разработка

```bash
# Установка зависимостей
pnpm install

# Локальная разработка
pnpm dev

# Типовая проверка
pnpm typecheck

# Тесты
pnpm test
```

## Деплой

```bash
# Staging
pnpm deploy:staging

# Production
pnpm deploy:prod
```

