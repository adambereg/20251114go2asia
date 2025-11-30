# Token Service - Система начислений и вознаграждений

## Обзор

Token Service реализует бизнес-логику начислений Points за действия пользователей, систему уровней и NFT-бейджей (off-chain).

## Правила начислений Points

### Действия и награды

| Действие | Points | Описание | Лимит в день | Требует VIP |
|----------|--------|----------|--------------|-------------|
| `post_like` | +1 | Лайк поста | 100 | Нет |
| `post_create` | +100 | Создание поста | 10 | Нет |
| `post_repost` | +10 | Репост поста | 20 | Нет |
| `quest_complete` | +100 | Завершение квеста | 5 | Нет |
| `referral_signup` | +5000 | Приглашение реферала | - | Да |
| `referral_vip_activate` | +10000 | Активация VIP рефералом | - | Да |
| `event_attend` | +50 | Посещение события | 3 | Нет |
| `review_create` | +25 | Создание отзыва | 10 | Нет |
| `voucher_redeem` | +30 | Активация ваучера | 5 | Нет |

### Особенности

- **Дневные лимиты:** Большинство действий имеют ограничение на количество начислений в день
- **VIP требования:** Некоторые действия (реферальные) требуют VIP статус для разблокировки
- **Кулдауны:** Можно настроить кулдаун между начислениями (в будущем)

## Система уровней

Пользователи получают уровни на основе накопленных Points:

| Уровень | Название | Points требуется | Бейдж |
|---------|----------|------------------|-------|
| 1 | Новичок | 0 | `newcomer` |
| 2 | Исследователь | 100 | `explorer` |
| 3 | Путешественник | 500 | `traveler` |
| 4 | Эксперт | 2000 | `expert` |
| 5 | Мастер | 5000 | `master` |
| 6 | Легенда | 10000 | `legend` |

При достижении нового уровня пользователь автоматически получает NFT-бейдж (off-chain).

## API Endpoints

### POST /v1/rewards/award

Начислить Points пользователю за действие.

**Требует авторизации:** Да

**Тело запроса:**
```json
{
  "action": "post_like",
  "metadata": {
    "postId": "post_123",
    "targetUserId": "user_456"
  }
}
```

**Пример ответа:**
```json
{
  "success": true,
  "pointsAwarded": 1,
  "newLevel": 2,
  "badgeAwarded": "explorer"
}
```

### GET /v1/rewards/level

Получить информацию об уровне пользователя, прогрессе и бейджах.

**Требует авторизации:** Да

**Пример ответа:**
```json
{
  "level": 3,
  "levelName": "Путешественник",
  "points": 750,
  "progress": 50,
  "pointsToNext": 1250,
  "nextLevelName": "Эксперт",
  "badges": [
    {
      "id": "badge_123",
      "badgeId": "traveler",
      "badgeName": "Путешественник",
      "badgeDescription": "Достигнут уровень 3: Путешественник",
      "badgeImage": null,
      "source": "level_up",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST /v1/webhook

Webhook для автоматических начислений от других сервисов.

**Требует авторизации:** Нет (использует внутреннюю аутентификацию)

**Поддерживаемые события:**

#### reaction.created
Событие от Reactions Service при создании реакции.

```json
{
  "event": "reaction.created",
  "data": {
    "userId": "user_123",
    "reactionType": "like",
    "targetType": "post",
    "targetId": "post_456",
    "metadata": {}
  }
}
```

#### post.created
Событие от Space Service при создании поста.

```json
{
  "event": "post.created",
  "data": {
    "userId": "user_123",
    "metadata": {}
  }
}
```

#### quest.completed
Событие от Quest Service при завершении квеста.

```json
{
  "event": "quest.completed",
  "data": {
    "userId": "user_123",
    "questId": "quest_456",
    "metadata": {}
  }
}
```

#### referral.signup
Событие от Referral Service при регистрации по реферальной ссылке.

```json
{
  "event": "referral.signup",
  "data": {
    "referrerId": "user_123",
    "referralId": "user_456",
    "isVIP": true,
    "metadata": {}
  }
}
```

## Интеграция с другими сервисами

### Reactions Service

Reactions Service отправляет события в Token Service при создании реакций:

```typescript
// Пример отправки события из Reactions Service
await fetch('https://api.go2asia.space/v1/webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'reaction.created',
    data: {
      userId: 'user_123',
      reactionType: 'like',
      targetType: 'post',
      targetId: 'post_456',
    },
  }),
});
```

### Space Service

Space Service отправляет события при создании постов:

```typescript
await fetch('https://api.go2asia.space/v1/webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'post.created',
    data: {
      userId: 'user_123',
    },
  }),
});
```

### Quest Service

Quest Service отправляет события при завершении квестов:

```typescript
await fetch('https://api.go2asia.space/v1/webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'quest.completed',
    data: {
      userId: 'user_123',
      questId: 'quest_456',
    },
  }),
});
```

## NFT-бейджи (off-chain)

NFT-бейджи хранятся в базе данных как логические сущности (off-chain). В будущем они могут быть минтированы в блокчейн TON через Blockchain Gateway.

### Источники получения бейджей

- `level_up` - достижение нового уровня
- `quest_complete` - завершение специального квеста
- `achievement` - достижение особого достижения
- `event` - участие в специальном событии

## Примеры использования

### Начислить Points за лайк

```bash
curl -X POST https://api.go2asia.space/v1/rewards/award \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "post_like",
    "metadata": {
      "postId": "post_123"
    }
  }'
```

### Получить информацию об уровне

```bash
curl https://api.go2asia.space/v1/rewards/level \
  -H "Authorization: Bearer <token>"
```

### Отправить событие от Reactions Service

```bash
curl -X POST https://api.go2asia.space/v1/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "reaction.created",
    "data": {
      "userId": "user_123",
      "reactionType": "like",
      "targetType": "post",
      "targetId": "post_456"
    }
  }'
```


