# Инструкция по настройке окружений

**Дата:** 2025-11-14  
**Версия:** 1.0

---

## ✅ Текущий статус

### Выполнено:

- [x] Neon проект `go2asia-staging` создан
- [x] Cloudflare API Token получен (`20251114 Edit Cloudflare Workers`)
- [x] Cloudflare Account ID получен
- [x] GitHub Secrets настроены:
  - [x] `DATABASE_URL` (staging)
  - [x] `CLOUDFLARE_API_TOKEN`
  - [x] `CLOUDFLARE_ACCOUNT_ID`
- [x] Clerk секреты получены:
  - [x] `CLERK_WEBHOOK_SECRET` (Signing Secret)
  - [x] `CLERK_SECRET_KEY` (Secret Key)

### Осталось:

- [ ] Создать Cloudflare Workers (API Gateway, Content Service)
- [ ] Настроить секреты в Cloudflare Workers
- [ ] Настроить Netlify (после готовности фронтенда)

---

## 📋 Пошаговая инструкция

### Шаг 1: Создание Cloudflare Workers

#### 1.1. API Gateway

1. Перейти в **Cloudflare Dashboard** → **Workers & Pages** → **Create**
2. Выбрать **"Import a repository"** или **"Start with Hello World!"**
3. Если через Git:
   - Подключить репозиторий `adambereg/20251114go2asia`
   - Выбрать директорию: `services/api-gateway`
   - Имя Worker: `api-gateway-staging`
4. Если через Hello World:
   - Имя: `api-gateway-staging`
   - После создания заменить код на код из `services/api-gateway/src/index.ts`

#### 1.2. Content Service

Повторить шаги для Content Service:
- Имя: `content-service-staging`
- Директория: `services/content-service`

---

### Шаг 2: Настройка секретов в Cloudflare Workers

#### 2.1. API Gateway Secrets

Перейти в **Workers & Pages** → **api-gateway-staging** → **Settings** → **Variables and Secrets**

Добавить секреты для **staging** окружения:

```bash
# Через Wrangler CLI (рекомендуется)
cd services/api-gateway

# Установить секреты
wrangler secret put CLERK_SECRET_KEY --env staging
# Ввести значение из Clerk Dashboard → API keys → Secret keys

wrangler secret put SERVICE_JWT_SECRET --env staging
# Сгенерировать: openssl rand -base64 32
```

**Или через Dashboard:**
1. **Settings** → **Variables and Secrets**
2. **Add Secret** → Ввести имя и значение
3. Выбрать окружение: **Staging**

#### 2.2. Content Service Secrets

```bash
cd services/content-service

# DATABASE_URL из Neon
wrangler secret put DATABASE_URL --env staging
# Скопировать из Neon Dashboard → Project → Connection String

# SERVICE_JWT_SECRET (должен совпадать с API Gateway!)
wrangler secret put SERVICE_JWT_SECRET --env staging
# Использовать тот же секрет, что и в API Gateway
```

**Важно:** `SERVICE_JWT_SECRET` должен быть **одинаковым** во всех сервисах!

---

### Шаг 3: Настройка переменных окружения

#### 3.1. API Gateway Environment Variables

В **wrangler.toml** или через Dashboard:

```toml
[env.staging]
name = "api-gateway-staging"
vars = {
  NODE_ENV = "staging",
  AUTH_SERVICE_URL = "https://auth-service-staging.YOUR_ACCOUNT.workers.dev",
  CONTENT_SERVICE_URL = "https://content-service-staging.YOUR_ACCOUNT.workers.dev",
  TOKEN_SERVICE_URL = "https://token-service-staging.YOUR_ACCOUNT.workers.dev",
  REFERRAL_SERVICE_URL = "https://referral-service-staging.YOUR_ACCOUNT.workers.dev",
}
```

**Примечание:** URLs сервисов будут известны после их создания.

#### 3.2. Content Service Environment Variables

```toml
[env.staging]
name = "content-service-staging"
vars = {
  NODE_ENV = "staging",
}
```

---

### Шаг 4: Получение DATABASE_URL из Neon

1. Перейти в **Neon Console** → **go2asia-staging** проект
2. Выбрать branch: **production** (или создать staging branch)
3. Открыть модальное окно **"Connect to your database"**
4. Скопировать connection string:
   ```
   postgresql://neondb_owner:****@ep-xxx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
5. Добавить как секрет в Cloudflare:
   ```bash
   wrangler secret put DATABASE_URL --env staging
   # Вставить connection string
   ```

**Важно:** Использовать connection string с `-pooler` для Cloudflare Workers!

---

### Шаг 5: Настройка GitHub Secrets (дополнительно)

Если нужно добавить Clerk секреты в GitHub для CI/CD:

1. Перейти в **GitHub** → **Settings** → **Secrets and variables** → **Actions**
2. Добавить:
   - `CLERK_SECRET_KEY` (для тестов)
   - `CLERK_WEBHOOK_SECRET` (для тестов webhook)

**Примечание:** Эти секреты нужны только для тестов в CI/CD, не для production деплоя.

---

### Шаг 6: Проверка настройки

#### 6.1. Проверить секреты через Wrangler

```bash
# API Gateway
cd services/api-gateway
wrangler secret list --env staging

# Content Service
cd services/content-service
wrangler secret list --env staging
```

Должны быть видны:
- `DATABASE_URL` (только в Content Service)
- `CLERK_SECRET_KEY` (только в API Gateway)
- `SERVICE_JWT_SECRET` (в обоих, одинаковый!)

#### 6.2. Проверить health endpoints

После деплоя:

```bash
# API Gateway
curl https://api-gateway-staging.YOUR_ACCOUNT.workers.dev/health/health

# Content Service
curl https://content-service-staging.YOUR_ACCOUNT.workers.dev/health/health
```

Ожидаемый ответ:
```json
{
  "status": "ok",
  "timestamp": "2025-11-14T...",
  "service": "api-gateway"
}
```

---

## 🔐 Секреты и их источники

| Секрет | Источник | Где используется |
|--------|----------|------------------|
| `DATABASE_URL` | Neon Dashboard → Connection String | Content Service, Auth Service, Token Service, Referral Service |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API keys → Secret keys | API Gateway, Auth Service |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard → Webhooks → Signing Secret | Auth Service (webhook verification) |
| `SERVICE_JWT_SECRET` | Генерируется: `openssl rand -base64 32` | Все сервисы (должен быть одинаковым!) |
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → API Tokens | GitHub Actions (CI/CD) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → Account ID | GitHub Actions (CI/CD) |

---

## 📝 Чек-лист перед деплоем

- [ ] Cloudflare Workers созданы (API Gateway, Content Service)
- [ ] Все секреты установлены через `wrangler secret put`
- [ ] `SERVICE_JWT_SECRET` одинаковый во всех сервисах
- [ ] `DATABASE_URL` использует connection string с `-pooler`
- [ ] Environment variables настроены в `wrangler.toml`
- [ ] Health endpoints отвечают 200 OK
- [ ] GitHub Secrets настроены для CI/CD

---

## 🚀 Следующие шаги

После настройки окружений:

1. **Применить миграции БД:**
   ```bash
   cd services/content-service
   pnpm db:migrate:generate
   pnpm db:migrate:up
   ```

2. **Протестировать деплой:**
   ```bash
   # API Gateway
   cd services/api-gateway
   pnpm deploy:staging

   # Content Service
   cd services/content-service
   pnpm deploy:staging
   ```

3. **Настроить Netlify** (после готовности фронтенда):
   - Создать сайт в Netlify
   - Подключить репозиторий
   - Настроить переменные окружения
   - Настроить деплой из `apps/go2asia-pwa-shell`

---

## ❓ FAQ

### Q: Можно ли использовать один DATABASE_URL для всех сервисов?

**A:** Да, все сервисы могут использовать один и тот же Neon проект. Рекомендуется использовать разные базы данных (`neondb`, `auth_db`, `token_db`) или разные схемы в одной БД.

### Q: Нужно ли создавать отдельные Workers для staging и production?

**A:** Да, рекомендуется использовать разные Workers с разными именами:
- `api-gateway-staging`
- `api-gateway-production`

Или использовать environments в одном Worker (через `wrangler.toml`).

### Q: Когда настраивать Netlify?

**A:** Netlify можно настроить после того, как:
- Фронтенд готов к деплою
- API Gateway работает и доступен
- Есть публичный URL для `NEXT_PUBLIC_API_URL`

---

**Последнее обновление:** 2025-11-14

