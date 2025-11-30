# Политика ролей в Auth Service

## Обзор

Auth Service реализует систему ролей для контроля доступа к различным функциям экосистемы Go2Asia.

## Роли пользователей

### 1. Spacer (базовая роль)
- **Уровень:** 0
- **Описание:** Базовая роль, присваивается автоматически при регистрации
- **Права:** Публикация постов, участие в группах, просмотр контента, получение Points и NFT

### 2. VIP
- **Уровень:** 1
- **Описание:** Платный подписчик (1000 ₽/мес)
- **Права:** Все права Spacer + доступ к премиальным функциям, кэшбэк с трат рефералов, 2-й уровень реферальной схемы

### 3. PRO (куратор)
- **Уровень:** 2
- **Описание:** Лидер сообщества, назначаемый платформой
- **Права:** Все права VIP + модерация контента, создание квестов, организация событий, работа с партнёрами

### 4. Partner (бизнес-партнёр)
- **Уровень:** 2
- **Описание:** Локальные заведения ЮВА, предоставляющие сервисы русскоязычным туристам
- **Права:** Создание профиля, выпуск ваучеров, получение аналитики, участие в квестах

### 5. Admin (администратор)
- **Уровень:** 3
- **Описание:** Администратор платформы
- **Права:** Полный доступ ко всем функциям, управление пользователями и ролями

## Использование

### Middleware для проверки ролей

```typescript
import { authMiddleware } from './middleware/auth';
import { requireRole, requireAdmin, requirePROOrAdmin, requireVIPOrAbove } from './middleware/role-check';

// Требовать конкретную роль
app.get('/v1/protected', authMiddleware, requireRole('vip'), async (c) => {
  // Доступно только для VIP и выше
});

// Требовать роль админа
app.get('/v1/admin/users', authMiddleware, requireAdmin(), async (c) => {
  // Доступно только для админов
});

// Требовать роль PRO или админа
app.get('/v1/pro/content', authMiddleware, requirePROOrAdmin(), async (c) => {
  // Доступно для PRO, Partner и Admin
});

// Требовать VIP или выше
app.get('/v1/premium', authMiddleware, requireVIPOrAbove(), async (c) => {
  // Доступно для VIP, PRO, Partner и Admin
});
```

### Проверка роли в коде

```typescript
import { hasRole, isAdmin, isPROOrAdmin } from './utils/roles';

// В обработчике маршрута
app.get('/v1/some-route', authMiddleware, async (c) => {
  const userRole = c.get('userRole');
  
  if (hasRole(userRole, 'vip')) {
    // Пользователь VIP или выше
  }
  
  if (isAdmin(userRole)) {
    // Пользователь админ
  }
  
  if (isPROOrAdmin(userRole)) {
    // Пользователь PRO или админ
  }
});
```

## Синхронизация с Clerk

Роли синхронизируются с Clerk через webhook:

1. **При создании пользователя:** Роль извлекается из `publicMetadata.role` в Clerk
2. **При обновлении пользователя:** Роль обновляется из `publicMetadata.role` в Clerk
3. **В **JWT токене:** Роль извлекается из `publicMetadata` в payload токена

### Настройка роли в Clerk

Роль должна быть установлена в `publicMetadata.role` пользователя в Clerk:

```json
{
  "publicMetadata": {
    "role": "vip"
  }
}
```

## API Endpoints

### Admin Endpoints (требуют роль admin)

- `GET /v1/admin/users` - Получить список всех пользователей
- `PATCH /v1/admin/users/:userId/role` - Изменить роль пользователя

### Примеры запросов

```bash
# Получить список пользователей (требует admin)
curl -X GET https://api.go2asia.space/v1/admin/users \
  -H "Authorization: Bearer <admin_token>"

# Изменить роль пользователя (требует admin)
curl -X PATCH https://api.go2asia.space/v1/admin/users/user_123/role \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"role": "vip"}'
```

## Миграция базы данных

Для добавления новых ролей выполните миграцию:

```bash
cd services/auth-service
psql $DATABASE_URL < migrations/0001_add_partner_admin_roles.sql
```

Или используйте Drizzle:

```bash
pnpm drizzle-kit push
```

## Тестирование

Для тестирования ролей можно использовать следующие тестовые пользователи:

- **Spacer:** Роль по умолчанию
- **VIP:** Установите `publicMetadata.role = "vip"` в Clerk
- **PRO:** Установите `publicMetadata.role = "pro"` в Clerk
- **Partner:** Установите `publicMetadata.role = "partner"` в Clerk
- **Admin:** Установите `publicMetadata.role = "admin"` в Clerk


