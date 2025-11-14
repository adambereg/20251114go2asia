# Referral Service - Database Migrations

## Применение миграций

### Вариант 1: Через Neon Console (рекомендуется)

1. Откройте Neon Console → SQL Editor
2. Скопируйте содержимое файла `migrations/0000_create_referral_tables.sql`
3. Вставьте в SQL Editor и выполните

### Вариант 2: Через скрипт (локально)

```bash
cd services/referral-service

# Убедитесь, что DATABASE_URL установлен в .env или переменных окружения
export DATABASE_URL="postgresql://..."

# Установите зависимости (если еще не установлены)
pnpm install

# Примените миграцию
pnpm tsx src/db/apply-migration.ts migrations/0000_create_referral_tables.sql
```

### Вариант 3: Прямое выполнение SQL

Выполните SQL из `migrations/0000_create_referral_tables.sql` напрямую в вашей БД через любой PostgreSQL клиент.

## Проверка миграций

После применения миграций проверьте, что таблицы созданы:

```sql
-- Проверка таблицы referrals
SELECT * FROM referrals LIMIT 1;

-- Проверка таблицы referral_codes
SELECT * FROM referral_codes LIMIT 1;
```

## Откат миграций (если нужно)

```sql
DROP TABLE IF EXISTS referrals;
DROP TABLE IF EXISTS referral_codes;
```

