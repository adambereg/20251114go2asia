# Настройка секретов в Cloudflare Workers

## Требуемые секреты

Для работы сервисов необходимо настроить следующие секреты в Cloudflare Workers:

### Общие секреты (для всех сервисов)

1. **CLERK_SECRET_KEY**
   - Где взять: Clerk Dashboard → API Keys → Secret Key
   - Формат: начинается с `sk_live_` или `sk_test_`
   - Вставьте значение из Clerk Dashboard

2. **DATABASE_URL**
   - Где взять: Neon Console → Connection Details → Connection String
   - Формат: `postgresql://user:password@host/database?sslmode=require`
   - Вставьте connection string из Neon Console

### Специфичные секреты

#### Auth Service
- **CLERK_WEBHOOK_SECRET** (уже настроен)
  - Где взять: Clerk Dashboard → Webhooks → Signing Secret

## Инструкция по настройке

### Через Cloudflare Dashboard

1. Откройте [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Перейдите в **Workers & Pages**
3. Выберите нужный Worker (например, `go2asia-token-service-staging`)
4. Перейдите в **Settings** → **Variables and Secrets**
5. В разделе **Encrypted Variables** нажмите **Add variable**
6. Добавьте каждый секрет:
   - **Name**: `CLERK_SECRET_KEY`
   - **Value**: вставьте значение из Clerk Dashboard
   - Нажмите **Save**
7. Повторите для `DATABASE_URL`

### Через Wrangler CLI

```bash
# Token Service
cd services/token-service
wrangler secret put CLERK_SECRET_KEY --env staging
wrangler secret put DATABASE_URL --env staging

# Referral Service
cd services/referral-service
wrangler secret put CLERK_SECRET_KEY --env staging
wrangler secret put DATABASE_URL --env staging
```

## Проверка секретов

После настройки секретов проверьте их наличие:

```bash
# Проверить список секретов (без значений)
wrangler secret list --env staging
```

## Важные замечания

1. **Не коммитьте секреты в Git** - они должны быть только в Cloudflare Workers
2. **Используйте разные секреты для staging и production**
3. **Регулярно ротируйте секреты** для безопасности
4. **Проверяйте логи** после настройки секретов на наличие ошибок

## Troubleshooting

### Ошибка "Secret not found"

1. Убедитесь, что секрет добавлен в правильный environment (staging/production)
2. Проверьте правильность имени секрета (чувствительно к регистру)
3. Убедитесь, что Worker имеет доступ к секретам

### Ошибка подключения к БД

1. Проверьте формат `DATABASE_URL`
2. Убедитесь, что БД доступна из Cloudflare Workers
3. Проверьте SSL режим в connection string

### Ошибка аутентификации Clerk

1. Проверьте, что используется правильный Secret Key (не Publishable Key)
2. Убедитесь, что ключ соответствует правильному environment (test/live)

