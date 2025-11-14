# Инструкция по деплою Auth Service

## Проблема: 501 Not Implemented

Если вы получаете ошибку `501 Not Implemented`, это означает, что:
1. Сервис не задеплоен с новым кодом
2. Или используется старая версия кода

## Решение: Задеплоить сервис

### Вариант 1: Через командную строку (рекомендуется)

```bash
cd services/auth-service

# Установить зависимости (если еще не установлены)
pnpm install

# Задеплоить в staging
pnpm deploy:staging
```

### Вариант 2: Через Cloudflare Dashboard

1. Откройте Cloudflare Dashboard → Workers & Pages → `go2asia-auth-service-staging`
2. Нажмите **"Edit code"**
3. Вставьте код из `services/auth-service/src/index.ts` и других файлов
4. Нажмите **"Save and deploy"**

### Вариант 3: Через GitHub Actions

Если у вас настроен CI/CD, просто сделайте commit и push в `main`:

```bash
git add .
git commit -m "feat: implement Auth Service endpoints"
git push origin main
```

GitHub Actions автоматически задеплоит сервис.

## Проверка после деплоя

1. **Проверьте health endpoint:**
   ```bash
   curl https://go2asia-auth-service-staging.fred89059599296.workers.dev/health
   ```

2. **Проверьте ready endpoint:**
   ```bash
   curl https://go2asia-auth-service-staging.fred89059599296.workers.dev/health/ready
   ```

3. **Протестируйте webhook в Clerk:**
   - Откройте Clerk Dashboard → Webhooks → Testing
   - Отправьте тестовое событие `user.created`
   - Должен вернуться `200 OK` с `{"success": true}`

## Проверка логов

После деплоя проверьте логи в Cloudflare Dashboard:
1. Workers & Pages → `go2asia-auth-service-staging` → **Logs**
2. Ищите сообщения типа `User created: user_xxx`

## Устранение проблем

### Если все еще получаете 501:

1. Убедитесь, что задеплоили правильный environment (`--env staging`)
2. Проверьте, что код в `src/index.ts` экспортирует `default app`
3. Проверьте логи в Cloudflare Dashboard на наличие ошибок

### Если получаете ошибку валидации подписи:

1. Убедитесь, что `CLERK_WEBHOOK_SECRET` настроен в секретах Worker
2. Проверьте, что секрет соответствует Signing Secret из Clerk Dashboard → Webhooks

### Если получаете ошибку подключения к БД:

1. Убедитесь, что `DATABASE_URL` настроен в секретах Worker
2. Проверьте, что таблица `users` создана в БД
3. Проверьте `/health/ready` endpoint - он должен вернуть `ready` если БД доступна

