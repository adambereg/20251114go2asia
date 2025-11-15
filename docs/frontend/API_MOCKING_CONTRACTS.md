# 🔌 API Mocking & Contracts — Руководство по разработке

> **Документ описывает стратегию мокирования API и контрактного программирования для независимой разработки фронтенда и бекенда.**

---

## 1. Общая стратегия

### 1.1 Цели

- ✅ **Независимая разработка** — фронтенд и бекенд разрабатываются параллельно
- ✅ **Контрактное программирование** — OpenAPI как единый источник правды
- ✅ **Типобезопасность** — генерация TypeScript типов из OpenAPI
- ✅ **Тестирование** — проверка соответствия контрактам

### 1.2 Архитектура

```
┌─────────────────────────────────────────────────────────┐
│              OpenAPI Schemas                             │
│         (docs/openapi/*.yaml)                           │
│                                                         │
│  • auth.yaml                                            │
│  • content.yaml                                         │
│  • referral.yaml                                        │
│  • token.yaml                                           │
└─────────────────────────────────────────────────────────┘
         │
         ├─────────────────┬─────────────────┐
         ▼                 ▼                 ▼
┌─────────────────┐ ┌──────────────┐ ┌──────────────┐
│  TypeScript      │ │  MSW         │ │  Contract     │
│  Types           │ │  Handlers    │ │  Tests        │
│  (generated)     │ │  (mocks)     │ │  (validation) │
└─────────────────┘ └──────────────┘ └──────────────┘
         │                 │                 │
         └─────────────────┴─────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Frontend Dev       │
              │   (with mocks)       │
              └──────────────────────┘
```

---

## 2. OpenAPI как источник правды

### 2.1 Структура схем

**Расположение:** `docs/openapi/`

```
docs/openapi/
├── auth.yaml           # Auth Service API
├── content.yaml        # Content Service API
├── referral.yaml       # Referral Service API
├── token.yaml          # Token Service API
├── components/
│   ├── schemas.yaml    # Общие схемы
│   ├── parameters.yaml # Общие параметры
│   └── responses.yaml  # Общие ответы
└── README.md           # Документация
```

### 2.2 Пример схемы

```yaml
# docs/openapi/content.yaml
openapi: 3.0.0
info:
  title: Content API
  version: 1.0.0

paths:
  /v1/places:
    get:
      summary: Получить список мест
      parameters:
        - name: city
          in: query
          schema:
            type: string
        - name: types
          in: query
          schema:
            type: array
            items:
              type: string
      responses:
        '200':
          description: Список мест
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PlacesResponse'

components:
  schemas:
    Place:
      type: object
      properties:
        id:
          type: string
        title:
          type: string
        description:
          type: string
        location:
          $ref: '#/components/schemas/Location'
      required:
        - id
        - title

    PlacesResponse:
      type: object
      properties:
        items:
          type: array
          items:
            $ref: '#/components/schemas/Place'
        total:
          type: number
```

---

## 3. Генерация TypeScript типов

### 3.1 Использование orval

**Настройка:** `orval.config.ts`

```typescript
import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: './docs/openapi/content.yaml',
    },
    output: {
      target: './packages/api/src/generated/content.ts',
      client: 'react-query',
      mode: 'tags-split',
      tag: 'Content',
    },
  },
});
```

**Генерация:**
```bash
npm run generate:api-types
```

**Результат:**
```typescript
// packages/api/src/generated/content.ts
export interface Place {
  id: string;
  title: string;
  description?: string;
  location?: Location;
}

export interface PlacesResponse {
  items: Place[];
  total: number;
}

export function useGetPlaces(
  params: { city?: string; types?: string[] },
  options?: UseQueryOptions<PlacesResponse>
) {
  // Автоматически сгенерированный хук
}
```

### 3.2 Использование в коде

```typescript
// apps/go2asia-pwa-shell/app/atlas/page.tsx
import { useGetPlaces } from '@go2asia/api';

export default function AtlasPage() {
  const { data, isLoading } = useGetPlaces({
    city: 'Bangkok',
    types: ['cafe', 'restaurant'],
  });

  if (isLoading) return <Skeleton />;

  return (
    <div>
      {data?.items.map(place => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}
```

---

## 4. MSW (Mock Service Worker)

### 4.1 Настройка MSW

**Установка:**
```bash
pnpm add -D msw
```

**Структура:**
```
packages/api/
├── src/
│   ├── mocks/
│   │   ├── handlers/
│   │   │   ├── content.handlers.ts
│   │   │   ├── auth.handlers.ts
│   │   │   └── index.ts
│   │   ├── browser.ts          # Для браузера
│   │   └── server.ts           # Для Node.js (тесты)
│   └── ...
```

### 4.2 Создание handlers

**Пример handler:**
```typescript
// packages/api/src/mocks/handlers/content.handlers.ts
import { http, HttpResponse } from 'msw';
import type { Place, PlacesResponse } from '../../generated/content';

export const contentHandlers = [
  // GET /v1/places
  http.get('/api/v1/places', ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get('city');
    const types = url.searchParams.get('types')?.split(',');

    const mockPlaces: Place[] = [
      {
        id: '1',
        title: 'Кафе "Кофе и Код"',
        description: 'Уютное кафе для работы',
        location: {
          lat: 13.7563,
          lng: 100.5018,
          city: 'Bangkok',
        },
      },
      {
        id: '2',
        title: 'Ресторан "Вкусно"',
        description: 'Русская кухня',
        location: {
          lat: 13.7500,
          lng: 100.5000,
          city: 'Bangkok',
        },
      },
    ];

    // Фильтрация по параметрам
    let filtered = mockPlaces;
    if (city) {
      filtered = filtered.filter(p => p.location?.city === city);
    }
    if (types && types.length > 0) {
      // Логика фильтрации по типам
    }

    const response: PlacesResponse = {
      items: filtered,
      total: filtered.length,
    };

    return HttpResponse.json(response);
  }),

  // GET /v1/places/:id
  http.get('/api/v1/places/:id', ({ params }) => {
    const { id } = params;

    const place: Place = {
      id: id as string,
      title: 'Кафе "Кофе и Код"',
      description: 'Уютное кафе для работы',
      // ... полные данные
    };

    return HttpResponse.json(place);
  }),
];
```

### 4.3 Регистрация handlers

**Для браузера:**
```typescript
// packages/api/src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

**Инициализация в App Shell:**
```typescript
// apps/go2asia-pwa-shell/app/layout.tsx
if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
  if (typeof window !== 'undefined') {
    const { worker } = await import('@go2asia/api/mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
}
```

**Для тестов (Node.js):**
```typescript
// packages/api/src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### 4.4 Использование в разработке

**Environment variable:**
```bash
# .env.local
NEXT_PUBLIC_USE_MOCKS=true
```

**Скрипт:**
```json
// package.json
{
  "scripts": {
    "dev:mock": "NEXT_PUBLIC_USE_MOCKS=true next dev"
  }
}
```

---

## 5. Соответствие OpenAPI контрактам

### 5.1 Валидация handlers

**Проверка соответствия схеме:**
```typescript
// packages/api/src/mocks/validate.ts
import { validate } from 'openapi-validator';
import openApiSchema from '../../../docs/openapi/content.yaml';

export async function validateMockResponse(
  path: string,
  method: string,
  response: unknown
) {
  const result = await validate({
    spec: openApiSchema,
    path,
    method,
    response,
  });

  if (!result.valid) {
    console.error('Mock response не соответствует OpenAPI:', result.errors);
  }

  return result.valid;
}
```

### 5.2 Contract Testing

**Тесты соответствия:**
```typescript
// packages/api/src/mocks/__tests__/contract.test.ts
import { describe, it, expect } from 'vitest';
import { contentHandlers } from '../handlers/content.handlers';
import openApiSchema from '../../../../docs/openapi/content.yaml';

describe('MSW Handlers соответствуют OpenAPI', () => {
  it('GET /v1/places возвращает валидный ответ', async () => {
    const handler = contentHandlers.find(
      h => h.info.path === '/api/v1/places' && h.info.method === 'GET'
    );

    const response = await handler.run({
      request: new Request('http://localhost/api/v1/places'),
    });

    const data = await response.json();

    // Проверка структуры ответа
    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('total');
    expect(Array.isArray(data.items)).toBe(true);

    // Проверка типов элементов
    data.items.forEach((place: Place) => {
      expect(place).toHaveProperty('id');
      expect(place).toHaveProperty('title');
    });
  });
});
```

---

## 6. Расширенные сценарии

### 6.1 Обработка ошибок

**Mock ошибок:**
```typescript
// packages/api/src/mocks/handlers/content.handlers.ts
export const contentHandlers = [
  // Успешный ответ
  http.get('/api/v1/places/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, ... });
  }),

  // Ошибка 404
  http.get('/api/v1/places/not-found', () => {
    return HttpResponse.json(
      { error: 'Place not found' },
      { status: 404 }
    );
  }),

  // Ошибка 500
  http.get('/api/v1/places/server-error', () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }),
];
```

### 6.2 Задержки и загрузка

**Имитация задержки:**
```typescript
http.get('/api/v1/places', async () => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 1000));

  return HttpResponse.json({ items: [], total: 0 });
});
```

### 6.3 Динамические данные

**Генерация данных:**
```typescript
import { faker } from '@faker-js/faker';

function generateMockPlace(): Place {
  return {
    id: faker.string.uuid(),
    title: faker.company.name(),
    description: faker.lorem.paragraph(),
    location: {
      lat: parseFloat(faker.location.latitude()),
      lng: parseFloat(faker.location.longitude()),
      city: faker.location.city(),
    },
  };
}

http.get('/api/v1/places', () => {
  const items = Array.from({ length: 10 }, generateMockPlace);
  return HttpResponse.json({ items, total: items.length });
});
```

---

## 7. Интеграция с CI/CD

### 7.1 Проверка контрактов

**GitHub Actions workflow:**
```yaml
# .github/workflows/contract-tests.yml
name: Contract Tests

on: [pull_request]

jobs:
  validate-contracts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm run generate:api-types
      - run: pnpm run test:contracts
```

### 7.2 Автоматическая генерация

**При изменении OpenAPI:**
```yaml
# .github/workflows/generate-types.yml
on:
  push:
    paths:
      - 'docs/openapi/**'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm run generate:api-types
      - run: |
          git add packages/api/src/generated
          git commit -m "chore: regenerate API types"
          git push
```

---

## 8. Best Practices

### 8.1 Организация моков

- ✅ **Группировка по сервисам** — отдельные handlers для каждого API
- ✅ **Переиспользование** — общие моки для общих сущностей
- ✅ **Реалистичные данные** — моки должны быть похожи на реальные
- ✅ **Документация** — комментарии в handlers объясняют сценарии

### 8.2 Версионирование

- ✅ **Версии OpenAPI** — семантическое версионирование схем
- ✅ **Обратная совместимость** — старые моки работают с новыми версиями
- ✅ **Миграция** — плавный переход между версиями

### 8.3 Тестирование

- ✅ **Unit тесты** — проверка handlers изолированно
- ✅ **Integration тесты** — проверка работы с моками
- ✅ **Contract тесты** — проверка соответствия OpenAPI

---

## 9. Чеклист настройки

- [ ] OpenAPI схемы созданы для всех API
- [ ] orval настроен для генерации типов
- [ ] TypeScript типы сгенерированы
- [ ] MSW установлен и настроен
- [ ] Handlers созданы для всех endpoints
- [ ] Handlers соответствуют OpenAPI схемам
- [ ] Contract тесты написаны
- [ ] CI/CD проверяет контракты
- [ ] Документация обновлена
- [ ] Команда обучена работе с моками

---

**Версия:** 1.0  
**Дата:** 2024-11-14  
**Статус:** Technical Guide — готов к реализации

