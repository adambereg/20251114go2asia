# Referral Service - Бизнес-логика рефералов

## Обзор

Referral Service реализует двухуровневую реферальную программу с логикой разблокировки Points при VIP-активации рефералов.

## Реферальная модель

### Уровни рефералов

1. **Прямые рефералы (1-й уровень):** Пользователи, зарегистрировавшиеся по вашему реферальному коду
2. **Субрефералы (2-й уровень):** Рефералы ваших рефералов

### Правила начислений Points

| Событие | Points | Условие | Описание |
|---------|--------|---------|----------|
| Регистрация реферала | 5000 | Разблокируется при VIP-активации реферала | Points блокируются до VIP-активации |
| VIP-активация реферала (1-й уровень) | 10000 | Требует VIP статус спонсора | Дополнительная награда за VIP-активацию |
| VIP-активация субреферала (2-й уровень) | 2000 | Требует VIP статус спонсора | Награда за субреферала |

### Логика разблокировки Points

1. **При регистрации реферала:**
   - Создаётся запись в таблице `referrals`
   - `pointsPending` = 5000 (ожидающие разблокировки)
   - `pointsUnlocked` = 0
   - `isVIP` = false
   - Событие отправляется в Token Service, но Points не начисляются (требуется VIP)

2. **При VIP-активации реферала:**
   - `pointsPending` → `pointsUnlocked` (5000 Points разблокируются)
   - `isVIP` = true
   - `vipActivatedAt` = текущая дата
   - Начисляется 10000 Points спонсору (1-й уровень)
   - Начисляется 2000 Points спонсору спонсора (2-й уровень, если есть)

## API Endpoints

### POST /v1/register

Зарегистрироваться по реферальному коду.

**Требует авторизации:** Да

**Тело запроса:**
```json
{
  "referralCode": "ABC12345",
  "userId": "user_123"
}
```

**Пример ответа:**
```json
{
  "success": true,
  "sponsorId": "user_456",
  "message": "Referral registered successfully"
}
```

### POST /v1/vip/activate

Активировать VIP статус реферала и разблокировать Points для спонсора.

**Требует авторизации:** Да

**Тело запроса:**
```json
{
  "userId": "user_123"
}
```

**Пример ответа:**
```json
{
  "success": true,
  "sponsorId": "user_456",
  "pointsUnlocked": 5000,
  "rewards": [
    {
      "userId": "user_456",
      "level": 1,
      "points": 10000
    },
    {
      "userId": "user_789",
      "level": 2,
      "points": 2000
    }
  ],
  "message": "VIP activated and rewards distributed"
}
```

### GET /v1/stats

Получить статистику рефералов.

**Требует авторизации:** Да

**Пример ответа:**
```json
{
  "totalReferrals": 15,
  "activeReferrals": 12,
  "totalSubReferrals": 8,
  "totalEarned": 75000,
  "totalPending": 15000,
  "referralCode": "ABC12345"
}
```

### GET /v1/tree

Получить реферальное дерево.

**Требует авторизации:** Да

**Query параметры:**
- `depth` (опционально, по умолчанию: 2) - глубина дерева (1-5)

**Пример ответа:**
```json
{
  "sponsorId": "user_456",
  "referrals": [
    {
      "userId": "user_123",
      "registeredAt": "2024-01-15T10:30:00Z",
      "isActive": true,
      "subReferrals": [
        {
          "userId": "user_789",
          "registeredAt": "2024-01-20T14:20:00Z",
          "isActive": true,
          "subReferrals": []
        }
      ]
    }
  ]
}
```

## Интеграция с Token Service

Referral Service интегрируется с Token Service через webhook:

### Событие: referral.signup

Отправляется при регистрации реферала:

```json
{
  "event": "referral.signup",
  "data": {
    "referrerId": "user_456",
    "referralId": "user_123",
    "isVIP": false,
    "metadata": {
      "referralCode": "ABC12345"
    }
  }
}
```

**Обработка в Token Service:**
- Если `isVIP: false` - Points не начисляются (ожидают разблокировки)
- Если `isVIP: true` - начисляется 5000 Points спонсору

### Событие: referral.vip_activate

Отправляется при VIP-активации реферала (через прямой вызов Token Service):

```typescript
// В Referral Service при VIP-активации
await fetch(`${tokenServiceUrl}/v1/rewards/award`, {
  method: 'POST',
  body: JSON.stringify({
    action: 'referral_vip_activate',
    metadata: {
      referralUserId: 'user_123',
      level: 1,
    },
  }),
});
```

## Примеры использования

### Зарегистрироваться по реферальному коду

```bash
curl -X POST https://api.go2asia.space/v1/register \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "referralCode": "ABC12345",
    "userId": "user_123"
  }'
```

### Активировать VIP статус реферала

```bash
curl -X POST https://api.go2asia.space/v1/vip/activate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123"
  }'
```

### Получить статистику рефералов

```bash
curl https://api.go2asia.space/v1/stats \
  -H "Authorization: Bearer <token>"
```

### Получить реферальное дерево

```bash
curl "https://api.go2asia.space/v1/tree?depth=2" \
  -H "Authorization: Bearer <token>"
```

## Переменные окружения

Добавьте в `.env` или `wrangler.toml`:

```env
TOKEN_SERVICE_URL=https://api.go2asia.space
```

## Миграция базы данных

Для применения изменений выполните миграцию:

```bash
cd services/referral-service
psql $DATABASE_URL < migrations/0001_add_vip_tracking.sql
```

Или используйте Drizzle:

```bash
pnpm drizzle-kit push
```


