# Quick Start - Phase 1 Deployment

## Быстрое применение миграций

### 1. Token Service - Создание таблиц

**Способ 1: Через Neon Console (самый простой)**

1. Откройте [Neon Console](https://console.neon.tech)
2. Выберите проект `go2asia-staging`
3. Перейдите в **SQL Editor**
4. Скопируйте содержимое файла `services/token-service/migrations/apply.sql`
5. Вставьте и выполните (кнопка **Run**)

**Способ 2: Через psql (если установлен)**

```bash
psql $DATABASE_URL -f services/token-service/migrations/apply.sql
```

### 2. Referral Service - Создание таблиц

**Способ 1: Через Neon Console**

1. Откройте [Neon Console](https://console.neon.tech)
2. Выберите проект `go2asia-staging`
3. Перейдите в **SQL Editor**
4. Скопируйте содержимое файла `services/referral-service/migrations/apply.sql`
5. Вставьте и выполните (кнопка **Run**)

**Способ 2: Через psql**

```bash
psql $DATABASE_URL -f services/referral-service/migrations/apply.sql
```

## Настройка секретов в Cloudflare Workers

### Token Service

1. Откройте [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Workers & Pages → `go2asia-token-service-staging`
3. Settings → **Variables and Secrets**
4. Добавьте секреты:
   - **CLERK_SECRET_KEY**: `sk_live_...` (из Clerk Dashboard → API Keys)
   - **DATABASE_URL**: `postgresql://...` (из Neon Console → Connection Details)

### Referral Service

1. Workers & Pages → `go2asia-referral-service-staging`
2. Settings → **Variables and Secrets**
3. Добавьте те же секреты:
   - **CLERK_SECRET_KEY**
   - **DATABASE_URL**

## Деплой сервисов

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

## Проверка

### Token Service

```bash
# Health
curl https://go2asia-token-service-staging.fred89059599296.workers.dev/health

# Ready (проверяет БД)
curl https://go2asia-token-service-staging.fred89059599296.workers.dev/health/ready
```

### Referral Service

```bash
# Health
curl https://go2asia-referral-service-staging.fred89059599296.workers.dev/health

# Ready (проверяет БД)
curl https://go2asia-referral-service-staging.fred89059599296.workers.dev/health/ready
```

## Что дальше?

После успешного деплоя:
1. ✅ Таблицы созданы в БД
2. ✅ Секреты настроены
3. ✅ Сервисы задеплоены
4. 🔄 Frontend Integration (следующий шаг)
5. 🔄 Testing (следующий шаг)

