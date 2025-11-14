# Процесс деплоя

**Версия:** 1.0  
**Дата:** 2025-11-09

---

## Обзор процесса

```
PR → Preview Deploy → Merge → Staging Deploy → Smoke Tests → Promote → Production Deploy → Smoke Tests
```

---

## Deploy Preview (автоматически для каждого PR)

### Триггер
- Создание Pull Request
- Push в PR ветку

### Процесс

1. **GitHub Actions запускает:**
   ```yaml
   # .github/workflows/deploy-preview.yml
   - name: Deploy Preview
     run: |
       # Frontend
       netlify deploy --build --dir=apps/go2asia-pwa-shell/.next
       
       # Backend (если есть изменения)
       wrangler deploy --env preview
   ```

2. **Результат:**
   - Preview URL для фронтенда: `https://deploy-preview-{pr-number}--go2asia.netlify.app`
   - Preview URL для API: `https://api-preview-{pr-number}.go2asia.space`

3. **Автоматические проверки:**
   - Contract тесты (Schemathesis)
   - E2E тесты (Playwright)
   - Smoke тесты

---

## Deploy Staging (автоматически при merge в main)

### Триггер
- Merge Pull Request в `main` ветку

### Процесс

1. **GitHub Actions запускает:**
   ```yaml
   # .github/workflows/deploy-staging.yml
   - name: Deploy to Staging
     run: |
       # Применить миграции БД
       pnpm db:migrate:up --env staging
       
       # Деплой сервисов
       pnpm deploy:staging
       
       # Smoke тесты
       pnpm test:smoke:staging
   ```

2. **Проверки:**
   - Миграции применены успешно
   - Все сервисы задеплоены
   - Smoke тесты пройдены

3. **Результат:**
   - Staging Frontend: `https://staging.go2asia.space`
   - Staging API: `https://api-staging.go2asia.space`

---

## Deploy Production (вручную)

### Триггер
- Ручной запуск workflow через GitHub Actions UI
- Или команда: `/deploy production` в PR комментарии

### Чек-лист перед деплоем

- [ ] Все тесты пройдены (unit, contract, E2E)
- [ ] Code review завершён
- [ ] Миграции протестированы на staging
- [ ] Секреты проверены (`wrangler secret list`)
- [ ] Дашборды доступны (правило "No Dashboards — No Prod")
- [ ] Rollback план готов

### Процесс

1. **Запустить деплой:**
   ```bash
   # Через GitHub Actions UI
   # Workflows → Deploy to Production → Run workflow
   ```

2. **Применить миграции:**
   ```bash
   pnpm db:migrate:up --env production
   ```

3. **Деплой сервисов:**
   ```bash
   # API Gateway
   cd apps/api-gateway
   wrangler deploy --env production
   
   # Сервисы
   cd services/auth-service
   wrangler deploy --env production
   # ... и так далее для всех сервисов
   ```

4. **Smoke тесты:**
   ```bash
   pnpm test:smoke:prod
   ```

5. **Проверка:**
   - Health endpoints: `/health`, `/ready`
   - Основные endpoints работают
   - Метрики в норме

---

## Smoke Tests

### Что проверять

**Frontend:**
```bash
# Проверить загрузку главной страницы
curl -I https://go2asia.space

# Проверить SSR работает
curl https://go2asia.space/atlas/countries | grep "Вьетнам"
```

**Backend:**
```bash
# Health check
curl https://api.go2asia.space/health

# Ready check
curl https://api.go2asia.space/ready

# Основные endpoints
curl https://api.go2asia.space/v1/api/content/countries
```

### Скрипт smoke тестов

```bash
#!/bin/bash
# scripts/smoke-tests.sh

set -e

API_URL="${API_URL:-https://api.go2asia.space}"

echo "Running smoke tests..."

# Health check
echo "Testing /health..."
curl -f "$API_URL/health" || exit 1

# Ready check
echo "Testing /ready..."
curl -f "$API_URL/ready" || exit 1

# Content endpoints
echo "Testing /v1/api/content/countries..."
curl -f "$API_URL/v1/api/content/countries" || exit 1

echo "✅ All smoke tests passed"
```

---

## Rollback процесс

### Автоматический rollback

Если smoke тесты не проходят после деплоя:

```yaml
# .github/workflows/deploy-production.yml
- name: Smoke Tests
  run: pnpm test:smoke:prod
  continue-on-error: false

- name: Rollback on Failure
  if: failure()
  run: |
    pnpm db:migrate:down --env production
    pnpm deploy:rollback:prod
```

### Ручной rollback

1. **Определить проблемную версию**
   ```bash
   # Проверить последний деплой
   wrangler deployments list --env production
   ```

2. **Откатить миграции (если нужно)**
   ```bash
   pnpm db:migrate:down --env production
   ```

3. **Откатить код**
   ```bash
   # Откатить к предыдущей версии
   git revert HEAD
   git push
   
   # Или использовать wrangler rollback
   wrangler rollback --env production
   ```

4. **Проверить восстановление**
   ```bash
   pnpm test:smoke:prod
   ```

---

## Деплой каждого сервиса

### API Gateway

```bash
cd apps/api-gateway
wrangler deploy --env production
```

**Проверка:**
```bash
curl https://api.go2asia.space/health
```

### Auth Service

```bash
cd services/auth-service
wrangler deploy --env production
```

**Проверка:**
```bash
curl https://auth.go2asia.space/health
curl https://auth.go2asia.space/ready
```

### Content Service

```bash
cd services/content-service
wrangler deploy --env production
```

**Проверка:**
```bash
curl https://content.go2asia.space/health
curl https://content.go2asia.space/ready
```

### Token Service

```bash
cd services/token-service
wrangler deploy --env production
```

**Проверка:**
```bash
curl https://token.go2asia.space/health
curl https://token.go2asia.space/ready
```

### Referral Service

```bash
cd services/referral-service
wrangler deploy --env production
```

**Проверка:**
```bash
curl https://referral.go2asia.space/health
curl https://referral.go2asia.space/ready
```

---

## Правила для rollback

### Когда делать rollback

- Error rate > 5% в течение 5 минут после деплоя
- Availability < 95% в течение 10 минут
- Smoke тесты не проходят
- Критичные ошибки в логах

### Процесс rollback

1. Остановить деплой (если ещё идёт)
2. Откатить миграции (если применялись)
3. Откатить код к предыдущей версии
4. Проверить восстановление
5. Проанализировать проблему

---

## Secrets Checklist

Перед каждым деплоем проверить:

- [ ] `DATABASE_URL` установлен для всех сервисов
- [ ] `CLERK_SECRET_KEY` установлен (Auth Service, API Gateway)
- [ ] `CLERK_WEBHOOK_SECRET` установлен (Auth Service)
- [ ] `SERVICE_JWT_SECRET` установлен (все сервисы, одинаковый)
- [ ] Все секреты проверены через `wrangler secret list`

---

## Мониторинг после деплоя

### Первые 15 минут

- Проверить метрики в Cloudflare Dashboard
- Проверить логи на ошибки
- Проверить алерты

### Первый час

- Проверить error rate
- Проверить latency
- Проверить availability

---

**Последнее обновление:** 2025-11-09


