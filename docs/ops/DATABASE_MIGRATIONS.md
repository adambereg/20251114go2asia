# Правила и процессы миграций БД

**Версия:** 1.0  
**Дата:** 2025-11-09

---

## Формат имён миграций

### Правило именования

```
{номер}_{краткое_описание}.sql
```

**Примеры:**
- `001_initial_schema.sql`
- `002_add_countries_table.sql`
- `003_add_cities_table.sql`
- `004_add_indexes.sql`

### Нумерация

- Начинать с `001`
- Увеличивать последовательно
- Не пропускать номера
- При конфликте — использовать следующий доступный номер

---

## Schema.ts vs Raw SQL

### Когда использовать schema.ts (Drizzle)

**Использовать для:**
- Определения структуры таблиц
- Типобезопасности в TypeScript
- Автоматической генерации миграций

**Пример:**
```typescript
// services/content-service/src/db/schema.ts
export const countries = pgTable('countries', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: varchar('code', { length: 3 }).notNull().unique(),
});
```

### Когда использовать Raw SQL

**Использовать для:**
- Сложных миграций (ALTER TABLE с данными)
- Миграций данных (не структуры)
- Оптимизаций (индексы, constraints)
- Когда Drizzle не поддерживает нужную операцию

**Пример:**
```sql
-- services/content-service/migrations/005_migrate_old_data.sql
UPDATE countries 
SET description = COALESCE(description, 'No description')
WHERE description IS NULL;
```

---

## Процесс создания миграции

### Шаг 1: Изменить schema.ts

```typescript
// services/content-service/src/db/schema.ts
export const countries = pgTable('countries', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  // Добавить новое поле
  flag: text('flag').nullable(),
});
```

### Шаг 2: Сгенерировать миграцию

```bash
cd services/content-service
pnpm db:migrate:generate
```

Это создаст файл в `drizzle/` директории.

### Шаг 3: Проверить сгенерированную миграцию

```bash
# Открыть файл миграции
cat drizzle/0005_add_flag_to_countries.sql
```

**Проверить:**
- SQL корректен
- Нет потери данных
- Индексы созданы правильно

### Шаг 4: Переместить в migrations/

```bash
# Скопировать в migrations/ с правильным именем
cp drizzle/0005_add_flag_to_countries.sql migrations/005_add_flag_to_countries.sql
```

### Шаг 5: Создать rollback миграцию

```sql
-- migrations/005_add_flag_to_countries.rollback.sql
ALTER TABLE countries DROP COLUMN IF EXISTS flag;
```

---

## Code Review миграций

### Чек-лист для ревьюера

- [ ] Миграция имеет понятное имя
- [ ] Миграция обратима (есть rollback)
- [ ] Нет потери данных
- [ ] Индексы созданы для часто используемых полей
- [ ] Foreign keys проверены
- [ ] Миграция протестирована на staging

### Типичные проблемы

**Проблема 1: Миграция необратима**
```sql
-- ❌ Плохо
DROP TABLE countries;

-- ✅ Хорошо
-- Сначала создать backup
CREATE TABLE countries_backup AS SELECT * FROM countries;
-- Затем удалить
DROP TABLE countries;
```

**Проблема 2: Потеря данных**
```sql
-- ❌ Плохо
ALTER TABLE countries ALTER COLUMN description TYPE text;

-- ✅ Хорошо
ALTER TABLE countries ALTER COLUMN description TYPE text USING description::text;
```

**Проблема 3: Отсутствие индексов**
```sql
-- ❌ Плохо
CREATE TABLE cities (
  country_id text NOT NULL
);

-- ✅ Хорошо
CREATE TABLE cities (
  country_id text NOT NULL
);
CREATE INDEX idx_cities_country_id ON cities(country_id);
```

---

## Стратегия отката миграций

### Автоматический откат

Если миграция падает, автоматически откатить:

```bash
# В CI/CD pipeline
pnpm db:migrate:up || pnpm db:migrate:down
```

### Ручной откат

1. **Определить проблемную миграцию**
   ```bash
   pnpm db:migrate:status
   ```

2. **Откатить последнюю миграцию**
   ```bash
   pnpm db:migrate:down
   ```

3. **Проверить состояние БД**
   ```bash
   pnpm db:migrate:status
   ```

### Откат нескольких миграций

```bash
# Откатить последние 3 миграции
pnpm db:migrate:down --count 3
```

---

## Тестирование миграций

### На staging перед production

1. **Применить миграцию на staging**
   ```bash
   pnpm db:migrate:up --env staging
   ```

2. **Проверить работоспособность**
   ```bash
   # Smoke тесты
   curl https://api-staging.go2asia.space/health
   curl https://api-staging.go2asia.space/ready
   ```

3. **Проверить данные**
   ```sql
   -- Подключиться к staging БД
   SELECT COUNT(*) FROM countries;
   SELECT * FROM countries LIMIT 5;
   ```

4. **Откатить миграцию (тест rollback)**
   ```bash
   pnpm db:migrate:down --env staging
   ```

5. **Повторно применить**
   ```bash
   pnpm db:migrate:up --env staging
   ```

### Локальное тестирование

```bash
# Запустить локальную БД (Docker)
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15

# Применить миграции
DATABASE_URL=postgresql://postgres:password@localhost:5432/test pnpm db:migrate:up

# Проверить
DATABASE_URL=postgresql://postgres:password@localhost:5432/test pnpm db:migrate:status
```

---

## Команды миграций

### Локальный запуск

**Требования:**
- Файл `.env` в корне проекта с переменной `DATABASE_URL`
- Установленные зависимости (`pnpm install`)

**Генерация миграций:**
```bash
# Из корня проекта
pnpm db:migrate:generate

# Или из директории сервиса
cd services/content-service
pnpm db:migrate:generate
```

**Применение миграций:**
```bash
# Из корня проекта (использует DATABASE_URL из .env)
pnpm db:migrate:up

# Или из директории сервиса
cd services/content-service
pnpm db:migrate:up
```

**Проверка статуса:**
```bash
pnpm db:migrate:status
```

**Откат миграций:**
```bash
# Откатить последнюю миграцию
pnpm db:migrate:down

# Откатить несколько миграций
pnpm db:migrate:down --count 3
```

### Запуск через CI/CD

**GitHub Actions:**

Миграции должны применяться автоматически при деплое в staging/production через GitHub Actions workflow.

**Пример шага в workflow:**
```yaml
- name: Run database migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: |
    cd services/content-service
    pnpm db:migrate:up
```

**Важно:**
- Миграции применяются **до** деплоя сервисов
- При ошибке миграции деплой должен быть остановлен
- Всегда тестировать миграции на staging перед production

### Drizzle Kit команды (низкоуровневые)

```bash
# Генерировать миграцию из schema.ts
drizzle-kit generate:pg

# Применить миграции (push схему в БД)
drizzle-kit push:pg

# Откатить последнюю миграцию
drizzle-kit drop

# Статус миграций (интроспекция БД)
drizzle-kit introspect:pg
```

### Настройка в package.json

```json
{
  "scripts": {
    "db:migrate:generate": "drizzle-kit generate:pg",
    "db:migrate:up": "drizzle-kit push:pg",
    "db:migrate:down": "drizzle-kit drop",
    "db:migrate:status": "drizzle-kit introspect:pg"
  }
}
```

---

## Правила безопасности

### Никогда не делать

1. ❌ **DROP TABLE** без backup
2. ❌ **TRUNCATE** без проверки зависимостей
3. ❌ **ALTER COLUMN** без проверки данных
4. ❌ Миграции, которые могут занять >5 минут

### Всегда делать

1. ✅ Создавать backup перед опасными операциями
2. ✅ Тестировать миграцию на staging
3. ✅ Иметь rollback миграцию
4. ✅ Проверять foreign keys после миграции

---

## Примеры миграций

### Добавление таблицы

```sql
-- migrations/001_create_countries.sql
CREATE TABLE countries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code VARCHAR(3) NOT NULL UNIQUE,
  flag TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_countries_code ON countries(code);
```

### Добавление колонки

```sql
-- migrations/002_add_flag_to_countries.sql
ALTER TABLE countries ADD COLUMN flag TEXT;

-- Rollback
-- migrations/002_add_flag_to_countries.rollback.sql
ALTER TABLE countries DROP COLUMN IF EXISTS flag;
```

### Добавление индекса

```sql
-- migrations/003_add_cities_country_index.sql
CREATE INDEX idx_cities_country_id ON cities(country_id);

-- Rollback
-- migrations/003_add_cities_country_index.rollback.sql
DROP INDEX IF EXISTS idx_cities_country_id;
```

---

**Последнее обновление:** 2025-11-09


