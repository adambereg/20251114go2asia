# Инструкция по импорту данных из CSV

## Подготовка

1. **Применить миграции для новых полей:**
   ```bash
   cd services/content-service
   pnpm db:migrate:up
   ```
   
   Это применит миграцию `0001_add_missing_fields.sql`, которая добавит недостающие поля в таблицы.

2. **Убедиться, что CSV файлы находятся в папке:**
   ```
   services/content-service/data/import/
   ├── countries.csv
   ├── cities.csv
   ├── places.csv
   ├── events.csv
   ├── articles.csv
   └── media_files.csv
   ```

## Запуск импорта

### Локально

```bash
cd services/content-service
pnpm db:seed:import
```

Скрипт автоматически:
- Загрузит `DATABASE_URL` из `.env` файла в корне проекта
- Прочитает все CSV файлы
- Преобразует данные под новую схему
- Импортирует данные в БД с обработкой конфликтов (обновление существующих записей)

### Что делает скрипт

1. **Countries:**
   - Импортирует все поля, включая новые (`capital`, `population`, `currency`, и т.д.)
   - Преобразует `gallery` из JSON в массив

2. **Cities:**
   - Преобразует `coordinates` JSONB в `latitude` и `longitude`
   - Маппит изображения из `media_files` по `entity_type='city'` и `entity_id`
   - Использует первое изображение как `image`

3. **Places:**
   - Преобразует `coordinates` JSONB в `latitude` и `longitude`
   - Преобразует `category` → `type`
   - Преобразует `tags` JSONB → `categories[]`
   - Преобразует `images` JSONB → `photos[]`
   - Маппит изображения из `media_files`
   - Добавляет `address` и `rating`

4. **Events:**
   - Преобразует `start_date` → `start_time`, `end_date` → `end_time`
   - Автоматически определяет `city_id` по адресу или координатам
   - Преобразует `organizer` → `organizer_id`
   - Добавляет `address` и `contact` (JSONB)

5. **Articles:**
   - Использует первое изображение из `images[]` как `cover_image`
   - Маппит изображения из `media_files`
   - Преобразует `tags` JSONB → `tags[]`
   - Добавляет `featured` и `views`

## Обработка ошибок

- Скрипт пропускает записи без обязательных полей (например, places без coordinates или city_id)
- При конфликтах существующие записи обновляются
- Все ошибки логируются в консоль

## Проверка результатов

После импорта проверьте данные:

```sql
-- Проверить количество записей
SELECT COUNT(*) FROM countries;
SELECT COUNT(*) FROM cities;
SELECT COUNT(*) FROM places;
SELECT COUNT(*) FROM events;
SELECT COUNT(*) FROM articles;

-- Проверить наличие изображений
SELECT id, name, image FROM cities WHERE image IS NOT NULL;
SELECT id, name, cover_image FROM articles WHERE cover_image IS NOT NULL;
```

## Повторный запуск

Скрипт идемпотентен - можно запускать несколько раз:
- Существующие записи будут обновлены
- Новые записи будут добавлены
- Конфликты обрабатываются автоматически

