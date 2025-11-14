# Настройка Cloudflare Workers после успешного деплоя

**Дата:** 2025-11-14  
**Статус:** Workers созданы ✅

---

## ✅ Созданные Workers

Все Workers успешно созданы в staging окружении:

- ✅ `go2asia-api-gateway-staging`
- ✅ `go2asia-auth-service-staging`
- ✅ `go2asia-content-service-staging`
- ✅ `go2asia-token-service-staging`
- ✅ `go2asia-referral-service-staging`

**URLs Workers:**
- API Gateway: `https://go2asia-api-gateway-staging.fred89059599296.workers.dev`
- Auth Service: `https://go2asia-auth-service-staging.fred89059599296.workers.dev`
- Content Service: `https://go2asia-content-service-staging.fred89059599296.workers.dev`
- Token Service: `https://go2asia-token-service-staging.fred89059599296.workers.dev`
- Referral Service: `https://go2asia-referral-service-staging.fred89059599296.workers.dev`

---

## 🔐 Настройка секретов в Cloudflare Dashboard

### Шаг 1: Генерация SERVICE_JWT_SECRET

Сгенерируйте общий секрет для всех сервисов:

```bash
openssl rand -base64 32
```

**Важно:** Сохраните этот секрет — он должен быть одинаковым во всех сервисах!

---

### Шаг 2: Настройка секретов для Content Service

1. Перейдите в **Cloudflare Dashboard** → **Workers & Pages** → **go2asia-content-service-staging**
2. Откройте вкладку **Settings** → **Variables and Secrets**
3. Нажмите **"+ Add"** → **"Secret"**
4. Добавьте секреты:

   | Имя | Значение | Источник |
   |-----|----------|----------|
   | `DATABASE_URL` | Connection string из Neon | Neon Dashboard → Connection String (с `-pooler`) |
   | `SERVICE_JWT_SECRET` | Сгенерированный секрет | `openssl rand -base64 32` |

---

### Шаг 3: Настройка секретов для Auth Service

1. Перейдите в **go2asia-auth-service-staging** → **Settings** → **Variables and Secrets**
2. Добавьте секреты:

   | Имя | Значение | Источник |
   |-----|----------|----------|
   | `DATABASE_URL` | Connection string из Neon | Neon Dashboard → Connection String |
   | `CLERK_SECRET_KEY` | Secret Key из Clerk | Clerk Dashboard → API keys → Secret keys |
   | `CLERK_WEBHOOK_SECRET` | Signing Secret из Clerk | Clerk Dashboard → Webhooks → Signing Secret |
   | `SERVICE_JWT_SECRET` | **Тот же секрет** | Тот же, что и в Content Service |

---

### Шаг 4: Настройка секретов для Token Service

1. Перейдите в **go2asia-token-service-staging** → **Settings** → **Variables and Secrets**
2. Добавьте секреты:

   | Имя | Значение | Источник |
   |-----|----------|----------|
   | `DATABASE_URL` | Connection string из Neon | Neon Dashboard → Connection String |
   | `SERVICE_JWT_SECRET` | **Тот же секрет** | Тот же, что и в Content Service |

---

### Шаг 5: Настройка секретов для Referral Service

1. Перейдите в **go2asia-referral-service-staging** → **Settings** → **Variables and Secrets**
2. Добавьте секреты:

   | Имя | Значение | Источник |
   |-----|----------|----------|
   | `DATABASE_URL` | Connection string из Neon | Neon Dashboard → Connection String |
   | `SERVICE_JWT_SECRET` | **Тот же секрет** | Тот же, что и в Content Service |

---

### Шаг 6: Настройка секретов для API Gateway

1. Перейдите в **go2asia-api-gateway-staging** → **Settings** → **Variables and Secrets**
2. Добавьте секреты:

   | Имя | Значение | Источник |
   |-----|----------|----------|
   | `CLERK_SECRET_KEY` | Secret Key из Clerk | Clerk Dashboard → API keys → Secret keys |
   | `SERVICE_JWT_SECRET` | **Тот же секрет** | Тот же, что и в Content Service |

3. Добавьте переменные окружения (Variables, не Secrets):

   | Имя | Значение |
   |-----|----------|
   | `AUTH_SERVICE_URL` | `https://go2asia-auth-service-staging.fred89059599296.workers.dev` |
   | `CONTENT_SERVICE_URL` | `https://go2asia-content-service-staging.fred89059599296.workers.dev` |
   | `TOKEN_SERVICE_URL` | `https://go2asia-token-service-staging.fred89059599296.workers.dev` |
   | `REFERRAL_SERVICE_URL` | `https://go2asia-referral-service-staging.fred89059599296.workers.dev` |

---

## 🧪 Проверка работы Workers

После настройки секретов проверьте health endpoints:

```bash
# API Gateway
curl https://go2asia-api-gateway-staging.fred89059599296.workers.dev/health/health

# Content Service
curl https://go2asia-content-service-staging.fred89059599296.workers.dev/health/health

# Auth Service
curl https://go2asia-auth-service-staging.fred89059599296.workers.dev/health/health

# Token Service
curl https://go2asia-token-service-staging.fred89059599296.workers.dev/health/health

# Referral Service
curl https://go2asia-referral-service-staging.fred89059599296.workers.dev/health/health
```

Ожидаемый ответ:
```json
{
  "status": "ok",
  "timestamp": "2025-11-14T...",
  "service": "content-service"
}
```

---

## 📝 Чек-лист настройки

- [ ] SERVICE_JWT_SECRET сгенерирован и сохранён
- [ ] DATABASE_URL добавлен в Content Service (с `-pooler`)
- [ ] DATABASE_URL добавлен в Auth Service
- [ ] DATABASE_URL добавлен в Token Service
- [ ] DATABASE_URL добавлен в Referral Service
- [ ] CLERK_SECRET_KEY добавлен в Auth Service
- [ ] CLERK_SECRET_KEY добавлен в API Gateway
- [ ] CLERK_WEBHOOK_SECRET добавлен в Auth Service
- [ ] SERVICE_JWT_SECRET добавлен во все сервисы (одинаковый!)
- [ ] Service URLs добавлены в API Gateway как Variables
- [ ] Health endpoints отвечают 200 OK

---

## 🚀 Следующие шаги

1. **Проверить health endpoints** всех сервисов
2. **Применить миграции БД** (когда будет настроен DATABASE_URL)
3. **Протестировать API Gateway** с реальными сервисами
4. **Настроить кастомные домены** (опционально)

---

**Последнее обновление:** 2025-11-14

