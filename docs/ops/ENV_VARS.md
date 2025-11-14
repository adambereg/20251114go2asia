# Переменные окружения и секреты

**Версия:** 1.0  
**Дата:** 2025-11-09

> **См. также:** `docs/templates/env-example.md` — шаблоны `.env.example` для всех капсул

---

## Обзор

Этот документ описывает все переменные окружения, используемые в проекте Go2Asia, правила их хранения и управления секретами.

---

## Frontend (apps/go2asia-pwa-shell)

### Обязательные переменные

| Переменная | Описание | Пример | Где установить |
|------------|----------|--------|----------------|
| `NEXT_PUBLIC_API_URL` | URL API Gateway (production) | `https://api.go2asia.space` | Netlify Dashboard |
| `NEXT_PUBLIC_API_STAGING_URL` | URL API Gateway (staging) | `https://api-staging.go2asia.space` | Netlify Dashboard |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk публичный ключ | `pk_test_...` | Netlify Dashboard |
| `CLERK_SECRET_KEY` | Clerk секретный ключ | `sk_test_...` | Netlify Dashboard (Secret) |

### Опциональные переменные

| Переменная | Описание | Значение по умолчанию |
|------------|----------|----------------------|
| `NEXT_PUBLIC_ENV` | Окружение (development/staging/production) | `development` |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Включить аналитику | `false` |
| `NEXT_PUBLIC_ENABLE_DEBUG` | Включить debug режим | `true` (dev), `false` (prod) |

### Шаблон `.env.example`

См. `docs/templates/env-example.md` → раздел "Frontend"

---

## API Gateway (apps/api-gateway)

### Обязательные переменные

| Переменная | Описание | Пример | Где установить |
|------------|----------|--------|----------------|
| `AUTH_SERVICE_URL` | URL Auth Service | `https://auth-service-production.workers.dev` | Cloudflare Dashboard / wrangler.toml |
| `CONTENT_SERVICE_URL` | URL Content Service | `https://content-service-production.workers.dev` | Cloudflare Dashboard / wrangler.toml |
| `TOKEN_SERVICE_URL` | URL Token Service | `https://token-service-production.workers.dev` | Cloudflare Dashboard / wrangler.toml |
| `REFERRAL_SERVICE_URL` | URL Referral Service | `https://referral-service-production.workers.dev` | Cloudflare Dashboard / wrangler.toml |

### Секреты (Secrets)

| Секрет | Описание | Где установить |
|--------|----------|----------------|
| `CLERK_SECRET_KEY` | Clerk секретный ключ для проверки JWT | Cloudflare Dashboard → Secrets |
| `SERVICE_JWT_SECRET` | Секрет для генерации Service JWT | Cloudflare Dashboard → Secrets |

### Шаблон `.env.example`

См. `docs/templates/env-example.md` → раздел "API Gateway"

---

## Auth Service (services/auth-service)

### Обязательные переменные

| Переменная | Описание | Пример |
|------------|----------|--------|
| `NODE_ENV` | Окружение | `production` / `staging` / `development` |

### Секреты (Secrets)

| Секрет | Описание | Где установить |
|--------|----------|----------------|
| `DATABASE_URL` | Connection string для Neon PostgreSQL | Cloudflare Dashboard → Secrets |
| `CLERK_SECRET_KEY` | Clerk секретный ключ | Cloudflare Dashboard → Secrets |
| `CLERK_WEBHOOK_SECRET` | Секрет для проверки webhook от Clerk | Cloudflare Dashboard → Secrets |
| `SERVICE_JWT_SECRET` | Секрет для проверки Service JWT | Cloudflare Dashboard → Secrets |

### Шаблон `.env.example`

См. `docs/templates/env-example.md` → раздел "Auth Service"

---

## Content Service (services/content-service)

### Обязательные переменные

| Переменная | Описание | Пример |
|------------|----------|--------|
| `NODE_ENV` | Окружение | `production` / `staging` / `development` |

### Секреты (Secrets)

| Секрет | Описание | Где установить |
|--------|----------|----------------|
| `DATABASE_URL` | Connection string для Neon PostgreSQL | Cloudflare Dashboard → Secrets |
| `SERVICE_JWT_SECRET` | Секрет для проверки Service JWT | Cloudflare Dashboard → Secrets |

### Шаблон `.env.example`

См. `docs/templates/env-example.md` → раздел "Content Service"

---

## Token Service (services/token-service)

### Обязательные переменные

| Переменная | Описание | Пример |
|------------|----------|--------|
| `NODE_ENV` | Окружение | `production` / `staging` / `development` |

### Секреты (Secrets)

| Секрет | Описание | Где установить |
|--------|----------|----------------|
| `DATABASE_URL` | Connection string для Neon PostgreSQL | Cloudflare Dashboard → Secrets |
| `SERVICE_JWT_SECRET` | Секрет для проверки Service JWT | Cloudflare Dashboard → Secrets |

### Шаблон `.env.example`

См. `docs/templates/env-example.md` → раздел "Token Service"

---

## Referral Service (services/referral-service)

### Обязательные переменные

| Переменная | Описание | Пример |
|------------|----------|--------|
| `NODE_ENV` | Окружение | `production` / `staging` / `development` |

### Секреты (Secrets)

| Секрет | Описание | Где установить |
|--------|----------|----------------|
| `DATABASE_URL` | Connection string для Neon PostgreSQL | Cloudflare Dashboard → Secrets |
| `SERVICE_JWT_SECRET` | Секрет для проверки Service JWT | Cloudflare Dashboard → Secrets |

### Шаблон `.env.example`

См. `docs/templates/env-example.md` → раздел "Referral Service"

---

## Правила хранения секретов

### Netlify (Frontend)

1. **Netlify Dashboard** → Site settings → Environment variables
2. Добавить переменные для каждого окружения:
   - **Production:** `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Deploy previews:** Автоматически наследуют из production или можно переопределить
3. **Секреты** (например, `CLERK_SECRET_KEY`) добавляются как "Secret" (скрыты в UI)

### Cloudflare (Backend)

#### Через Wrangler CLI

```bash
# Установить секрет для production
wrangler secret put SECRET_NAME --env production

# Установить секрет для staging
wrangler secret put SECRET_NAME --env staging

# Примеры:
wrangler secret put DATABASE_URL --env production
wrangler secret put CLERK_SECRET_KEY --env production
wrangler secret put SERVICE_JWT_SECRET --env production
```

#### Через Cloudflare Dashboard

1. **Cloudflare Dashboard** → Workers & Pages → Выбрать Worker
2. **Settings** → **Variables and Secrets**
3. **Add Secret** → Ввести имя и значение
4. Выбрать окружение (Production / Staging)

### Neon (Database)

1. **Neon Dashboard** → Project → Settings → Connection String
2. Скопировать connection string (формат: `postgresql://user:password@host/dbname?sslmode=require`)
3. Добавить как Secret в Cloudflare:
   ```bash
   wrangler secret put DATABASE_URL --env production
   ```

---

## Проверка секретов перед деплоем

### Скрипт проверки

Создать `scripts/check-secrets.sh`:

```bash
#!/bin/bash

# Проверка секретов для production
echo "Checking production secrets..."

# Проверка через wrangler
wrangler secret list --env production

# Проверка через Cloudflare API (если нужно)
# curl -X GET "https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/{script_name}/secrets" \
#   -H "Authorization: Bearer {api_token}"
```

### Чек-лист перед деплоем

- [ ] Все обязательные секреты установлены в Cloudflare
- [ ] `DATABASE_URL` проверен и работает
- [ ] `CLERK_SECRET_KEY` совпадает с Clerk Dashboard
- [ ] `SERVICE_JWT_SECRET` одинаковый во всех сервисах
- [ ] Переменные окружения проверены через `wrangler secret list`

---

## Ротация секретов

### План ротации

| Тип секрета | Период ротации | Процесс |
|-------------|----------------|---------|
| JWT секреты (`SERVICE_JWT_SECRET`) | Каждые 90 дней | См. ниже |
| Database пароли (`DATABASE_URL`) | Каждые 180 дней | Через Neon Dashboard |
| Clerk секреты (`CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`) | По необходимости | При компрометации или по требованию |

### Процесс ротации JWT секретов

1. **Сгенерировать новый секрет:**
   ```bash
   openssl rand -base64 32
   ```

2. **Добавить в staging:**
   ```bash
   wrangler secret put SERVICE_JWT_SECRET --env staging
   # Ввести новый секрет
   ```

3. **Протестировать:**
   - Проверить работу всех сервисов в staging
   - Убедиться, что Service JWT работает

4. **Добавить в production:**
   ```bash
   wrangler secret put SERVICE_JWT_SECRET --env production
   # Ввести новый секрет
   ```

5. **Grace period (7 дней):**
   - Старый секрет остаётся активным
   - Все сервисы обновлены на новый секрет
   - После 7 дней — удалить старый секрет

---

## Безопасность

### Правила

1. **Никогда не коммитить секреты в Git**
   - Использовать `.env.example` без реальных значений
   - Добавить `.env` в `.gitignore`

2. **Использовать разные секреты для разных окружений**
   - Production и Staging должны иметь разные секреты
   - Development может использовать тестовые секреты

3. **Регулярно ротировать секреты**
   - Следовать плану ротации
   - Ротировать при подозрении на компрометацию

4. **Ограничить доступ к секретам**
   - Только необходимые люди имеют доступ
   - Использовать принцип наименьших привилегий

---

## Troubleshooting

### Проблема: Секрет не подхватывается

**Решение:**
1. Проверить, что секрет установлен: `wrangler secret list --env production`
2. Проверить имя секрета (чувствительно к регистру)
3. Перезапустить Worker после установки секрета

### Проблема: DATABASE_URL не работает

**Решение:**
1. Проверить connection string в Neon Dashboard
2. Убедиться, что `sslmode=require` присутствует
3. Проверить, что IP не заблокирован в Neon

### Проблема: SERVICE_JWT_SECRET не совпадает

**Решение:**
1. Убедиться, что один и тот же секрет установлен во всех сервисах
2. Проверить через `wrangler secret list` в каждом сервисе
3. При необходимости — переустановить секрет

---

**Последнее обновление:** 2025-11-09


