# Руководство по ручному импорту данных

## Импорт таблицы media_files

### Способ 1: Через Neon Console (рекомендуется)

1. Откройте Neon Console для вашей staging базы данных
2. Перейдите в раздел **SQL Editor**
3. Выполните SQL для создания таблицы (если её ещё нет):

```sql
CREATE TABLE IF NOT EXISTS "media_files" (
	"id" text PRIMARY KEY NOT NULL,
	"filename" text,
	"original_filename" text,
	"url" text NOT NULL,
	"type" varchar(50),
	"mime_type" text,
	"size" integer,
	"width" integer,
	"height" integer,
	"thumbnail_url" text,
	"entity_type" varchar(50),
	"entity_id" text,
	"order_index" integer,
	"title" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
```

4. Используйте функцию **Import CSV** в Neon Console:
   - Выберите таблицу `media_files`
   - Загрузите файл `services/content-service/data/import/media_files.csv`
   - Neon автоматически определит колонки и импортирует данные

### Способ 2: Через SQL INSERT (для небольшого количества записей)

Если записей немного, можно использовать INSERT statements. Смотрите файл `manual_import_media_files.sql` для примера.

### Способ 3: Исправить автоматический импорт

Проблема может быть в том, что миграция была применена к локальной БД, а импорт подключается к staging.

**Решение:**
1. Убедитесь, что в `.env` файле указан правильный `DATABASE_URL` для staging
2. Примените миграцию к staging БД:
   ```bash
   cd services/content-service
   pnpm db:migrate:up
   ```
3. Запустите импорт снова:
   ```bash
   pnpm db:seed:import
   ```

---

## Проверка результатов

После импорта проверьте данные:

```sql
-- Проверить количество записей
SELECT COUNT(*) FROM media_files;

-- Проверить примеры записей
SELECT id, url, entity_type, entity_id FROM media_files LIMIT 10;

-- Проверить связь с другими таблицами
SELECT 
  mf.id,
  mf.url,
  mf.entity_type,
  mf.entity_id,
  c.name as country_name
FROM media_files mf
LEFT JOIN countries c ON mf.entity_id = c.id AND mf.entity_type = 'country'
WHERE mf.entity_type = 'country'
LIMIT 5;
```

