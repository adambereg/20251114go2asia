# Политика SSR/SSG для PWA Shell

## Дата создания: 14 января 2025

## Общая стратегия

**Правило по умолчанию: ВСЕ страницы PWA-shell динамические (`force-dynamic`)**

### Обоснование

1. **Архитектура проекта**: API-first архитектура с микросервисами
   - Данные живут в микросервисах (Cloudflare Workers)
   - Frontend получает данные через API
   - Статическая генерация не даёт преимуществ

2. **Платформа деплоя**: Netlify
   - Netlify НЕ поддерживает корректную работу с ISR
   - Netlify НЕ поддерживает SSG для маршрутов с Client hooks
   - Динамический рендеринг работает стабильно

3. **Использование Clerk**: Все страницы с аутентификацией требуют динамического рендеринга
   - Clerk hooks (`useAuth`, `useUser`, `useSession`) работают только в клиентских компонентах
   - Попытка SSG страниц с Clerk hooks приводит к ошибкам prerendering

4. **Использование SDK**: React Query hooks требуют клиентского рендеринга
   - Все API вызовы через `@go2asia/sdk` используют React Query
   - React Query hooks работают только в клиентских компонентах

## Исключения (страницы, которые МОГУТ быть статическими)

### ✅ Модуль Atlas (`/atlas/*`)

**Условия для SSG:**
- Страницы без клиентских компонентов
- Страницы без Clerk hooks
- Страницы без SDK hooks
- Страницы с предзагруженными данными

**Примеры:**
- `/atlas/countries/[id]` - если данные генерируются статически
- `/atlas/cities/[id]` - если данные генерируются статически
- `/atlas/places/[id]` - если данные генерируются статически

**Как настроить:**
```typescript
// В page.tsx
export const dynamic = 'force-static'; // Явно указать
export const revalidate = 3600; // ISR каждые 60 минут
```

### ✅ Модуль Blog (`/blog/*`)

**Условия для SSG:**
- Статьи могут быть статически сгенерированы
- Нет интерактивных элементов с Clerk
- Нет комментариев с аутентификацией

**Как настроить:**
```typescript
// В page.tsx
export const dynamic = 'force-static';
export const revalidate = 3600; // ISR каждые 60 минут
```

### ✅ Модуль Pulse (`/pulse/*`)

**Условия для SSG:**
- Только если календарь событий генерируется статически
- Без фильтров и интерактивных элементов

**Примечание:** Текущая реализация использует клиентские компоненты и требует `force-dynamic`.

## Правила для разработчиков

### ✅ ОБЯЗАТЕЛЬНО: Добавлять `force-dynamic` к страницам с:

1. **Clerk hooks:**
   ```typescript
   // ❌ НЕПРАВИЛЬНО
   'use client';
   import { useAuth } from '@clerk/nextjs';
   
   // ✅ ПРАВИЛЬНО
   // page.tsx (server)
   export const dynamic = 'force-dynamic';
   
   // PageClient.tsx (client)
   'use client';
   import { useAuth } from '@clerk/nextjs';
   ```

2. **SDK hooks (React Query):**
   ```typescript
   // ❌ НЕПРАВИЛЬНО
   'use client';
   import { useGetCountries } from '@go2asia/sdk/atlas';
   
   // ✅ ПРАВИЛЬНО
   // page.tsx (server)
   export const dynamic = 'force-dynamic';
   
   // PageClient.tsx (client)
   'use client';
   import { useGetCountries } from '@go2asia/sdk/atlas';
   ```

3. **Client-side state:**
   ```typescript
   // ❌ НЕПРАВИЛЬНО
   'use client';
   const [state, setState] = useState();
   
   // ✅ ПРАВИЛЬНО
   // page.tsx (server)
   export const dynamic = 'force-dynamic';
   
   // PageClient.tsx (client)
   'use client';
   const [state, setState] = useState();
   ```

### ✅ ОБЯЗАТЕЛЬНО: Разделять серверные и клиентские компоненты

**Паттерн для страниц с Clerk/SDK:**

```typescript
// page.tsx (Server Component)
import type { Metadata } from 'next';
import { PageClient } from './PageClient';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

export default function Page() {
  return <PageClient />;
}
```

```typescript
// PageClient.tsx (Client Component)
'use client';

import { useAuth } from '@clerk/nextjs';
import { useGetData } from '@go2asia/sdk/module';

export function PageClient() {
  const { userId } = useAuth();
  const { data } = useGetData();
  
  return <div>...</div>;
}
```

### ❌ ЗАПРЕЩЕНО: Использовать Clerk hooks в Server Components

```typescript
// ❌ НЕПРАВИЛЬНО
import { useAuth } from '@clerk/nextjs';

export default function Page() {
  const { userId } = useAuth(); // ОШИБКА!
  return <div>...</div>;
}
```

### ❌ ЗАПРЕЩЕНО: Использовать Clerk hooks в Layouts

```typescript
// ❌ НЕПРАВИЛЬНО
// layout.tsx
import { useAuth } from '@clerk/nextjs';

export default function Layout({ children }) {
  const { userId } = useAuth(); // ОШИБКА!
  return <>{children}</>;
}
```

**Правильное место для Clerk:**
```typescript
// layout.tsx (Server Component)
import { ClerkProvider } from '@clerk/nextjs';

export default function Layout({ children }) {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}
```

### ❌ ЗАПРЕЩЕНО: Использовать `generateMetadata()` с Clerk

```typescript
// ❌ НЕПРАВИЛЬНО
export async function generateMetadata() {
  const { userId } = useAuth(); // ОШИБКА!
  return { title: '...' };
}
```

**Правильно:**
```typescript
// ✅ ПРАВИЛЬНО
export const metadata: Metadata = {
  title: 'Static title',
  description: 'Static description',
};

// Или убрать metadata вообще, если нужны динамические данные
```

## Глобальные настройки

### Layouts уровня маршрутов

Все глобальные layouts (`(public)/layout.tsx`, `(authenticated)/layout.tsx`) должны иметь:

```typescript
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
```

Это предотвращает попытки SSG для всех дочерних страниц.

### Root Layout

Root layout (`app/layout.tsx`) должен:
- Быть Server Component
- Использовать `<ClerkProvider>` только как обёртку
- НЕ использовать Clerk hooks напрямую

## Чеклист для новых страниц

- [ ] Страница использует Clerk hooks? → Добавить `force-dynamic`
- [ ] Страница использует SDK hooks? → Добавить `force-dynamic`
- [ ] Страница использует `useState`/`useEffect`? → Добавить `force-dynamic`
- [ ] Страница должна быть статической? → Проверить исключения выше
- [ ] Создан Client Component для интерактивных элементов?
- [ ] Layout не использует Clerk hooks?
- [ ] Metadata не использует Clerk hooks?

## Миграция существующих страниц

При миграции существующих страниц на полноценную реализацию:

1. **Оставить `force-dynamic`** - это не проблема для API-first архитектуры
2. **Вернуть UI и функциональность** - заменить заглушки на реальные компоненты
3. **Перенести Clerk-логику в Client.tsx** - использовать паттерн разделения компонентов

## Мониторинг и отладка

### Проверка на ошибки prerendering

```bash
# Локальная проверка
pnpm turbo build --filter=@go2asia/pwa-shell

# Проверка конкретной страницы
pnpm next build 2>&1 | grep "prerendering"
```

### Типичные ошибки

1. **`useAuth can only be used within <ClerkProvider />`**
   - Причина: Clerk hook используется в Server Component
   - Решение: Перенести в Client Component, добавить `force-dynamic`

2. **`Cannot read property 'userId' of undefined`**
   - Причина: Попытка доступа к Clerk данным на сервере
   - Решение: Использовать `auth()` из `@clerk/nextjs/server` для сервера

3. **`Module not found: Can't resolve '@go2asia/sdk/...'`**
   - Причина: SDK hook используется в Server Component
   - Решение: Перенести в Client Component, добавить `force-dynamic`

## Заключение

**Правило по умолчанию: `force-dynamic` для всех страниц PWA-shell**

Исключения должны быть явно обоснованы и задокументированы. Это гарантирует стабильную работу на Netlify и предотвращает ошибки prerendering.

