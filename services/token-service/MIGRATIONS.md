# Token Service - Database Migrations

## Применение миграций

### Вариант 1: Через Neon Console (рекомендуется)

1. Откройте Neon Console → SQL Editor
2. Скопируйте содержимое файла `migrations/0000_create_token_tables.sql`
3. Вставьте в SQL Editor и выполните

### Вариант 2: Через скрипт (локально)

```bash
cd services/token-service

# Убедитесь, что DATABASE_URL установлен в .env или переменных окружения
export DATABASE_URL="postgresql://..."

# Установите зависимости (если еще не установлены)
pnpm install

# Примените миграцию
pnpm tsx src/db/apply-migration.ts migrations/0000_create_token_tables.sql
```

### Вариант 3: Прямое выполнение SQL

Выполните SQL из `migrations/0000_create_token_tables.sql` напрямую в вашей БД через любой PostgreSQL клиент.

## Проверка миграций

После применения миграций проверьте, что таблицы созданы:

```sql
-- Проверка таблицы balances
SELECT * FROM balances LIMIT 1;

-- Проверка таблицы transactions
SELECT * FROM transactions LIMIT 1;

-- Проверка типа transaction_type
SELECT typname FROM pg_type WHERE typname = 'transaction_type';
```

## Откат миграций (если нужно)

```sql
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS balances;
DROP TYPE IF EXISTS transaction_type;
```

