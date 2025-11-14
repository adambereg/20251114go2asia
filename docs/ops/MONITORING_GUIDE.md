# Руководство по мониторингу

**Версия:** 1.0  
**Дата:** 2025-11-09

---

## Метрики по сервисам

### API Gateway

**Ключевые метрики:**
- **Latency:** p50, p95, p99 по маршрутам
- **Throughput:** requests/min, requests/sec
- **Error rate:** 4xx, 5xx по маршрутам
- **Cache hit ratio:** % запросов из кеша

**Целевые значения:**
- p95 latency: <200ms (GET), <500ms (POST)
- Error rate: <0.1%
- Cache hit ratio: >80% для публичных GET

**Cloudflare Dashboard:**
- Analytics → Workers → `api-gateway-production`
- Метрики: Requests, Errors, Duration

---

### Content Service

**Ключевые метрики:**
- **Latency:** p50, p95, p99 по endpoints
- **Database queries:** количество, duration, slow queries
- **Error rate:** 5xx ошибки
- **Cache hit ratio:** если используется кеш

**Целевые значения:**
- p95 latency: <300ms
- Error rate: <0.2%
- Database query time: <100ms (p95)

**Cloudflare Dashboard:**
- Analytics → Workers → `content-service-production`

**Neon Dashboard:**
- Monitoring → Query Performance
- Проверить slow queries

---

### Auth Service

**Ключевые метрики:**
- **Latency:** p50, p95, p99
- **Webhook success rate:** % успешных webhook от Clerk
- **Error rate:** 5xx ошибки
- **Database connection pool:** usage, wait time

**Целевые значения:**
- p95 latency: <150ms
- Error rate: <0.05%
- Webhook success rate: >99%

**Cloudflare Dashboard:**
- Analytics → Workers → `auth-service-production`

**Clerk Dashboard:**
- Webhooks → Endpoints → Error Rate

---

### Token Service

**Ключевые метрики:**
- **Latency:** p50, p95, p99
- **Transaction success rate:** % успешных транзакций
- **Error rate:** 5xx ошибки
- **Database transaction time:** duration транзакций

**Целевые значения:**
- p95 latency: <200ms
- Error rate: <0.1%
- Transaction success rate: 100% (критично!)

**Cloudflare Dashboard:**
- Analytics → Workers → `token-service-production`

---

### Referral Service

**Ключевые метрики:**
- **Latency:** p50, p95, p99
- **Error rate:** 5xx ошибки
- **Database query time:** duration запросов

**Целевые значения:**
- p95 latency: <200ms
- Error rate: <0.1%

**Cloudflare Dashboard:**
- Analytics → Workers → `referral-service-production`

---

## Настройка дашбордов

### Cloudflare Analytics Dashboard

**Доступ:**
- Cloudflare Dashboard → Analytics → Workers

**Метрики для отслеживания:**
- Requests (total, per endpoint)
- Errors (4xx, 5xx)
- Duration (p50, p95, p99)
- Cache hit ratio

**Пример виджета:**
```
┌─────────────────────────────────────┐
│ API Gateway - Last 24h               │
├─────────────────────────────────────┤
│ Requests: 125,000                    │
│ Errors: 125 (0.1%)                  │
│ p95 Latency: 180ms                  │
│ Cache Hit: 85%                      │
└─────────────────────────────────────┘
```

---

## Алерты

### Критические алерты (P0)

**Настроить в Cloudflare:**
- Error rate > 1% в течение 5 минут
- Availability < 99% в течение 10 минут
- Latency p95 > 1000ms в течение 5 минут
- Token Service: ошибки транзакций > 0.1%
- Auth Service: ошибки webhook от Clerk > 5%

**Каналы уведомлений:**
- Email
- Slack (если настроен)
- PagerDuty (для критичных)

### Предупреждающие алерты (P1)

- Error rate > 0.5% в течение 15 минут
- Latency p95 > 500ms в течение 15 минут
- Error budget исчерпан на 50%
- Необычный всплеск трафика (>200% от среднего)

---

## Интеграция с внешними системами

### Grafana (опционально)

Если нужен более детальный дашборд:

**Настройка:**
1. Создать Cloudflare API token
2. Настроить Cloudflare Data Source в Grafana
3. Создать дашборды с метриками

**Пример дашборда:**
```yaml
# grafana-dashboard.yaml
dashboard:
  title: "Go2Asia API SLO Dashboard"
  panels:
    - title: "Availability"
      targets:
        - expr: 'sum(rate(http_requests_total{status=~"2.."}[5m])) / sum(rate(http_requests_total[5m]))'
    
    - title: "Latency p95"
      targets:
        - expr: 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))'
    
    - title: "Error Rate"
      targets:
        - expr: 'sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))'
```

### Sentry (опционально)

Для отслеживания ошибок:

**Настройка:**
1. Создать проект в Sentry
2. Добавить SDK в каждый сервис
3. Настроить фильтрацию ошибок

---

## Логирование

### Формат логов

Все логи должны содержать:
- `requestId` (UUID)
- `timestamp` (ISO 8601)
- `level` (info, warn, error)
- `service` (название сервиса)
- `message` (описание события)

**Пример:**
```json
{
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "timestamp": "2025-11-09T10:00:00Z",
  "level": "info",
  "service": "content-service",
  "message": "Request completed",
  "method": "GET",
  "path": "/v1/api/content/countries",
  "duration": 120,
  "status": 200
}
```

### Просмотр логов

**Cloudflare Workers:**
```bash
cd services/content-service
wrangler tail --env production
```

**Cloudflare Dashboard:**
- Workers & Pages → Выбрать Worker → Logs

---

## SLO/SLI и Error Budgets

См. `docs/ops/RUNBOOKS.md` → раздел "SLO Dashboard" для деталей.

---

**Последнее обновление:** 2025-11-09


