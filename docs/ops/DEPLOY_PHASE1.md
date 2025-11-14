# Phase 1 Deployment Guide

## Шаг 1: Создание таблиц в БД

### Token Service

1. Откройте Neon Console → SQL Editor
2. Скопируйте и выполните SQL из `services/token-service/migrations/0000_create_token_tables.sql`

Или через командную строку:
```bash
# Убедитесь, что DATABASE_URL установлен
export DATABASE_URL="postgresql://..."

cd services/token-service
pnpm install
pnpm tsx src/db/apply-migration.ts migrations/0000_create_token_tables.sql
```

### Referral Service

1. Откройте Neon Console → SQL Editor
2. Скопируйте и выполните SQL из `services/referral-service/migrations/0000_create_referral_tables.sql`

Или через командную строку:
```bash
cd services/referral-service
pnpm install
pnpm tsx src/db/apply-migration.ts migrations/0000_create_referral_tables.sql
```

## Шаг 2: Настройка секретов в Cloudflare Workers

### Token Service

1. Откройте Cloudflare Dashboard → Workers & Pages → `go2asia-token-service-staging`
2. Перейдите в Settings → Variables and Secrets
3. Добавьте следующие секреты:
   - `CLERK_SECRET_KEY` - Secret Key из Clerk Dashboard
   - `DATABASE_URL` - Connection string из Neon Console

### Referral Service

1. Откройте Cloudflare Dashboard → Workers & Pages → `go2asia-referral-service-staging`
2. Перейдите в Settings → Variables and Secrets
3. Добавьте следующие секреты:
   - `CLERK_SECRET_KEY` - Secret Key из Clerk Dashboard
   - `DATABASE_URL` - Connection string из Neon Console

## Шаг 3: Деплой сервисов

### Token Service

```bash
cd services/token-service
pnpm install
pnpm deploy:staging
```

### Referral Service

```bash
cd services/referral-service
pnpm install
pnpm deploy:staging
```

## Шаг 4: Проверка деплоя

### Token Service

```bash
# Health check
curl https://go2asia-token-service-staging.fred89059599296.workers.dev/health

# Ready check (проверяет БД)
curl https://go2asia-token-service-staging.fred89059599296.workers.dev/health/ready
```

### Referral Service

```bash
# Health check
curl https://go2asia-referral-service-staging.fred89059599296.workers.dev/health

# Ready check (проверяет БД)
curl https://go2asia-referral-service-staging.fred89059599296.workers.dev/health/ready
```

## Troubleshooting

### Ошибка подключения к БД

1. Проверьте, что `DATABASE_URL` правильно настроен в секретах Worker
2. Убедитесь, что таблицы созданы в БД
3. Проверьте логи Worker в Cloudflare Dashboard

### Ошибка аутентификации

1. Проверьте, что `CLERK_SECRET_KEY` правильно настроен
2. Убедитесь, что используется правильный Secret Key (не Publishable Key)

### Ошибка 501 Not Implemented

1. Убедитесь, что код задеплоен с последними изменениями
2. Проверьте логи Worker на наличие ошибок компиляции

