# OpenAPI Guide: Правила и процессы

**Версия:** 1.0  
**Дата:** 2025-11-09

---

## Версионирование API

### Правила версионирования

- **`/v1/*`** — стабильная версия API
- **Breaking changes** → новая мажорная версия `/v2/*`
- **Non-breaking changes** → остаются в `/v1/*`

### Что считается breaking change

- Удаление endpoint
- Изменение обязательных полей в запросе
- Изменение структуры ответа (удаление полей)
- Изменение типов данных (string → number)

### Что НЕ считается breaking change

- Добавление новых endpoints
- Добавление новых полей в ответ
- Добавление опциональных полей в запрос
- Расширение enum значений

---

## Процесс обновления API

### Шаг 1: Изменить OpenAPI спецификацию

1. Создать PR с изменениями в `docs/openapi/{service}.yaml`
2. Обновить версию в `info.version` (если breaking change)
3. Добавить описание изменений в `info.description` или CHANGELOG

### Шаг 2: Генерировать типы и SDK

```bash
# После merge PR
pnpm gen:all
```

### Шаг 3: Обновить код сервиса

1. Использовать новые типы из `packages/types`
2. Обновить реализацию endpoints
3. Обновить тесты

### Шаг 4: Contract тесты

```bash
# Запустить contract тесты
pnpm test:contract
```

### Шаг 5: Деплой

1. Деплой в staging
2. Проверка contract тестов на staging
3. Деплой в production

---

## Структура OpenAPI файлов

### Расположение

```
docs/openapi/
├── content.yaml      # Content Service API
├── auth.yaml         # Auth Service API
├── token.yaml        # Token Service API
└── referral.yaml     # Referral Service API
```

### Обязательные компоненты

Каждый OpenAPI файл должен содержать:

1. **info** — информация о API
   ```yaml
   info:
     title: Go2Asia Content API
     version: 1.0.0
     description: API для работы с контентом
   ```

2. **servers** — список серверов
   ```yaml
   servers:
     - url: https://api.go2asia.space/v1/api/content
       description: Production
   ```

3. **tags** — теги для группировки endpoints
   ```yaml
   tags:
     - name: Atlas
       description: Страны, города, места
   ```

4. **paths** — определения endpoints
5. **components** — переиспользуемые компоненты
   - `schemas` — схемы данных
   - `responses` — стандартные ответы
   - `parameters` — параметры запросов

---

## Примеры спецификаций

### Content Service

См. `docs/templates/openapi-content-example.yaml` — полный пример с:
- Схемами данных (Country, CountriesResponse)
- Единым форматом ошибок (ErrorResponse)
- Пагинацией (cursor-based)
- Примеры всех типов ответов

### Auth Service

См. `docs/templates/openapi-auth-example.yaml` (создать по аналогии)

### Token Service

См. `docs/templates/openapi-token-example.yaml` (создать по аналогии)

### Referral Service

См. `docs/templates/openapi-referral-example.yaml` (создать по аналогии)

---

## Единый формат ошибок

Все ошибки должны использовать схему `ErrorResponse`:

```yaml
components:
  schemas:
    ErrorResponse:
      type: object
      required: [error]
      properties:
        error:
          type: object
          required: [code, message]
          properties:
            code:
              type: string
              description: Код ошибки
            message:
              type: string
              description: Сообщение об ошибке
            key:
              type: string
              nullable: true
              description: Ключ поля с ошибкой
            traceId:
              type: string
              format: uuid
              description: ID запроса для трейсинга
```

См. `docs/ops/API_ERROR_POLICY.md` для полного списка кодов ошибок.

---

## Пагинация

### Cursor-based (рекомендуется)

```yaml
parameters:
  - name: limit
    in: query
    schema:
      type: integer
      minimum: 1
      maximum: 100
      default: 20
  - name: cursor
    in: query
    schema:
      type: string
      description: Курсор для следующей страницы

responses:
  '200':
    content:
      application/json:
        schema:
          type: object
          properties:
            items:
              type: array
            nextCursor:
              type: string
              nullable: true
            hasMore:
              type: boolean
```

---

## Генерация документации

### Swagger UI

```bash
# Использовать swagger-ui-express или redoc
npm install -g @redocly/cli
redocly preview-docs docs/openapi/content.yaml
```

### Redoc

```bash
# Генерация статического HTML
redocly bundle docs/openapi/content.yaml -o docs/api-docs/content.html
```

---

## Валидация OpenAPI

### Spectral

```bash
# Установить
npm install -g @stoplight/spectral-cli

# Валидировать
spectral lint docs/openapi/**/*.yaml
```

См. `docs/templates/spectral.yaml` для правил валидации.

---

## Best Practices

1. **Всегда описывать примеры**
   ```yaml
   schema:
     type: object
     example:
       id: "123e4567-e89b-12d3-a456-426614174000"
       name: "Вьетнам"
   ```

2. **Использовать переиспользуемые компоненты**
   ```yaml
   responses:
     '200':
       content:
         application/json:
           schema:
             $ref: '#/components/schemas/Country'
   ```

3. **Добавлять описания**
   ```yaml
   summary: Получить список стран
   description: Возвращает список всех стран с пагинацией
   ```

4. **Версионировать изменения**
   - Breaking changes → новая мажорная версия
   - Non-breaking → остаются в текущей версии

---

**Последнее обновление:** 2025-11-09


