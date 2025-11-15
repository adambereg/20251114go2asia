# 🔐 Auth Flow: Clerk SSO — Детальное руководство

> **Документ описывает полный flow аутентификации через Clerk SSO для всех модулей Go2Asia.**

---

## 1. Архитектура аутентификации

### 1.1 Общая схема

```
┌─────────────────────────────────────────────────────────┐
│                    go2asia.space                        │
│  (Единый домен для всех модулей)                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  App Shell (PWA)                                       │
│  ├── Clerk SDK (@clerk/nextjs)                         │
│  ├── Cookie: __clerk_db_jwt (httpOnly)                 │
│  └── Session: shared across all modules                │
│                                                         │
│  Модули:                                                │
│  ├── /atlas    → использует Clerk session              │
│  ├── /pulse    → использует Clerk session              │
│  ├── /blog     → использует Clerk session              │
│  ├── /space    → использует Clerk session              │
│  └── ...       → все модули видят одну сессию          │
│                                                         │
└─────────────────────────────────────────────────────────┘
         │
         │ API запросы с JWT Bearer token
         ▼
┌─────────────────────────────────────────────────────────┐
│              api.go2asia.space                          │
│  (API Gateway + микросервисы)                          │
│                                                         │
│  Валидация JWT через Clerk публичный ключ              │
│  Извлечение user_id, role из claims                    │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Ключевые принципы

- ✅ **Единый домен** — все модули на `go2asia.space` (shared cookies)
- ✅ **Clerk SSO** — один вход для всех модулей
- ✅ **httpOnly cookies** — безопасное хранение сессии
- ✅ **JWT Bearer** — для API запросов
- ✅ **Гостевой режим** — большая часть контента доступна без логина

---

## 2. Flow авторизации

### 2.1 Первый вход (новый пользователь)

```
1. Пользователь нажимает "Войти" на любом модуле
   ↓
2. App Shell вызывает Clerk.signIn()
   ↓
3. Clerk показывает OAuth провайдеры или email форму
   ↓
4. Пользователь выбирает провайдер (Google/GitHub/Email)
   ↓
5. Clerk обрабатывает OAuth callback
   ↓
6. Clerk создаёт пользователя (если новый)
   ↓
7. Clerk устанавливает cookie: __clerk_db_jwt (httpOnly)
   ↓
8. App Shell получает событие user.updated
   ↓
9. Все модули видят авторизованного пользователя
   ↓
10. Редирект на исходную страницу (или /)
```

**Код реализации:**
```typescript
// apps/go2asia-pwa-shell/components/AuthButton.tsx
import { SignInButton, useUser } from '@clerk/nextjs';

export function AuthButton() {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return <UserMenu user={user} />;
  }

  return (
    <SignInButton mode="modal">
      <button className="btn-primary">Войти</button>
    </SignInButton>
  );
}
```

### 2.2 Повторный вход (существующий пользователь)

```
1. Пользователь открывает go2asia.space
   ↓
2. Браузер отправляет cookie __clerk_db_jwt
   ↓
3. Clerk SDK проверяет cookie
   ↓
4. Если cookie валидна → пользователь авторизован
   ↓
5. Если cookie истекла → показываем "Войти"
```

### 2.3 Выход (logout)

```
1. Пользователь нажимает "Выйти"
   ↓
2. App Shell вызывает Clerk.signOut()
   ↓
3. Clerk очищает cookie
   ↓
4. Редирект на / (главная страница)
```

**Код:**
```typescript
import { SignOutButton } from '@clerk/nextjs';

<SignOutButton>
  <button>Выйти</button>
</SignOutButton>
```

---

## 3. Cookie vs JWT

### 3.1 Cookie (httpOnly)

**Назначение:** Хранение сессии на фронтенде

**Характеристики:**
- Имя: `__clerk_db_jwt`
- Тип: httpOnly (недоступна через JavaScript)
- Домен: `.go2asia.space` (доступна всем поддоменам)
- Secure: true (только HTTPS)
- SameSite: Lax

**Использование:**
- Автоматически отправляется браузером при запросах к `go2asia.space`
- Clerk SDK читает cookie для проверки сессии
- Не используется напрямую в коде (только через Clerk SDK)

### 3.2 JWT (Bearer Token)

**Назначение:** Авторизация API запросов

**Извлечение из cookie:**
```typescript
// В @go2asia/api SDK
import { getAuth } from '@clerk/nextjs/server';

export async function getApiToken() {
  const { getToken } = getAuth();
  const token = await getToken();
  return token; // JWT строка
}
```

**Добавление в API запросы:**
```typescript
// packages/api/src/client.ts
export async function apiRequest(url: string, options?: RequestInit) {
  const token = await getApiToken();
  
  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
```

**Валидация на бекенде:**
```typescript
// services/api-gateway/src/middleware/auth.ts
import { verifyToken } from '@clerk/backend';

export async function validateJWT(token: string) {
  const payload = await verifyToken(token, {
    secretKey: process.env.CLERK_SECRET_KEY,
  });
  
  return {
    userId: payload.sub,
    role: payload.publicMetadata?.role,
  };
}
```

---

## 4. Redirects и навигация

### 4.1 После логина

**Сценарий:** Пользователь пытался открыть защищённую страницу

```typescript
// apps/go2asia-pwa-shell/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/space/me',
  '/connect',
  '/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    
    if (!userId) {
      const signInUrl = new URL('/auth/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});
```

**После успешного логина:**
```typescript
// Clerk автоматически редиректит на redirect_url
// Если redirect_url не указан → редирект на /
```

### 4.2 После логаута

```typescript
// Всегда редирект на главную
<SignOutButton redirectUrl="/">
  <button>Выйти</button>
</SignOutButton>
```

### 4.3 При 401 от API

```typescript
// packages/api/src/client.ts
export async function apiRequest(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    // Токен истёк или невалиден
    const signInUrl = new URL('/auth/sign-in', window.location.origin);
    signInUrl.searchParams.set('redirect_url', window.location.pathname);
    window.location.href = signInUrl.toString();
    throw new Error('Unauthorized');
  }

  return response;
}
```

---

## 5. Session expiry handling

### 5.1 Проверка истечения сессии

**На фронтенде:**
```typescript
import { useUser } from '@clerk/nextjs';

export function ProtectedComponent() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <Skeleton />;
  }

  if (!isSignedIn) {
    return <GuestPrompt />;
  }

  return <ProtectedContent />;
}
```

**Автоматическое обновление токена:**
- Clerk SDK автоматически обновляет токен при истечении
- Если refresh не удался → пользователь разлогинивается

### 5.2 Обработка истечения на API

```typescript
// packages/api/src/client.ts
let retryCount = 0;

export async function apiRequest(url: string, options?: RequestInit) {
  const response = await fetch(url, options);

  if (response.status === 401 && retryCount < 1) {
    retryCount++;
    
    // Попытка обновить токен
    const newToken = await refreshToken();
    
    if (newToken) {
      // Повтор запроса с новым токеном
      return apiRequest(url, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    }
  }

  retryCount = 0;
  return response;
}
```

---

## 6. Роли пользователей

### 6.1 Структура ролей

**Роли в Clerk metadata:**
```typescript
// Устанавливается при создании/обновлении пользователя
user.publicMetadata = {
  role: 'spacer' | 'vip' | 'pro' | 'partner' | 'admin',
  // другие метаданные
};
```

**Проверка роли:**
```typescript
import { useUser } from '@clerk/nextjs';

export function PROOnlyComponent() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  if (role !== 'pro' && role !== 'admin') {
    return <AccessDenied />;
  }

  return <PROContent />;
}
```

### 6.2 Защита роутов

**Middleware для защиты роутов:**
```typescript
// apps/go2asia-pwa-shell/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isPRORoute = createRouteMatcher(['/quest/pro', '/rf/pro']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  if (isAdminRoute(req)) {
    const role = sessionClaims?.metadata?.role;
    if (role !== 'admin') {
      return NextResponse.redirect('/');
    }
  }

  if (isPRORoute(req)) {
    const role = sessionClaims?.metadata?.role;
    if (role !== 'pro' && role !== 'admin') {
      return NextResponse.redirect('/');
    }
  }
});
```

---

## 7. Гостевой режим

### 7.1 Доступный контент без авторизации

**Публичный доступ:**
- ✅ Просмотр мест (Atlas)
- ✅ Просмотр событий (Pulse)
- ✅ Чтение статей (Blog)
- ✅ Просмотр профилей (Space)
- ✅ Просмотр квестов (Quest)
- ✅ Каталог партнёров (RF)
- ✅ Объявления жилья (Rielt)

**Требует авторизации:**
- ❌ Создание постов
- ❌ Лайки и комментарии
- ❌ Участие в событиях
- ❌ Прохождение квестов
- ❌ Получение ваучеров
- ❌ Доступ к Connect (кошелёк)

### 7.2 UI для гостей

**Компонент GuestPrompt:**
```typescript
export function GuestPrompt({ action }: { action: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-6 text-center">
      <h3>Войдите, чтобы {action}</h3>
      <p className="text-slate-600 mb-4">
        Создайте аккаунт, чтобы получить доступ ко всем возможностям
      </p>
      <SignInButton mode="modal">
        <button className="btn-primary">Войти</button>
      </SignInButton>
    </div>
  );
}
```

**Использование:**
```typescript
export function LikeButton({ postId }: { postId: string }) {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <GuestPrompt action="лайкнуть пост" />;
  }

  return <LikeButtonAuthenticated postId={postId} />;
}
```

---

## 8. Интеграция с модулями

### 8.1 App Shell

**Проверка авторизации:**
```typescript
// apps/go2asia-pwa-shell/components/TopAppBar.tsx
import { useUser } from '@clerk/nextjs';

export function TopAppBar() {
  const { isSignedIn, user } = useUser();

  return (
    <header>
      {/* ... */}
      {isSignedIn ? (
        <UserMenu user={user} />
      ) : (
        <SignInButton>
          <button>Войти</button>
        </SignInButton>
      )}
    </header>
  );
}
```

### 8.2 Модули

**Все модули используют единый Clerk SDK:**
```typescript
// apps/go2asia-pwa-shell/app/atlas/page.tsx
import { useUser } from '@clerk/nextjs';

export default function AtlasPage() {
  const { isSignedIn } = useUser();
  
  // Модуль автоматически видит статус авторизации
  return <AtlasContent isAuthenticated={isSignedIn} />;
}
```

---

## 9. Безопасность

### 9.1 Best Practices

- ✅ **httpOnly cookies** — защита от XSS
- ✅ **Secure flag** — только HTTPS
- ✅ **SameSite: Lax** — защита от CSRF
- ✅ **JWT с коротким TTL** — минимизация риска утечки
- ✅ **Refresh tokens** — автоматическое обновление

### 9.2 Защита от атак

**XSS:**
- Cookie недоступна через JavaScript (httpOnly)
- React автоматически экранирует данные

**CSRF:**
- SameSite: Lax предотвращает межсайтовые запросы
- Дополнительная проверка origin на бекенде

**Session hijacking:**
- Короткий TTL токенов
- Автоматическое обновление
- Логирование подозрительной активности

---

## 10. Troubleshooting

### 10.1 Проблемы с сессией

**Симптом:** Пользователь видит "Войти", хотя залогинен

**Решение:**
1. Проверить cookie в DevTools (Application → Cookies)
2. Проверить домен cookie (должен быть `.go2asia.space`)
3. Проверить Clerk dashboard (активна ли сессия)

**Симптом:** 401 ошибки от API

**Решение:**
1. Проверить, что JWT токен добавляется в заголовки
2. Проверить валидность токена на бекенде
3. Проверить, что Clerk публичный ключ правильный

### 10.2 Отладка

**Включить debug режим Clerk:**
```typescript
// apps/go2asia-pwa-shell/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      // Включить debug в dev режиме
      {...(process.env.NODE_ENV === 'development' && {
        debug: true,
      })}
    >
      {children}
    </ClerkProvider>
  );
}
```

---

## 11. Чеклист интеграции

- [ ] Clerk приложение создано и настроено
- [ ] Домен `go2asia.space` добавлен в Clerk
- [ ] Environment variables настроены
- [ ] ClerkProvider обёрнут вокруг App Shell
- [ ] Middleware настроен для защиты роутов
- [ ] API SDK добавляет JWT в заголовки
- [ ] Бекенд валидирует JWT через Clerk
- [ ] Роли пользователей настроены в Clerk metadata
- [ ] Гостевой режим реализован для публичного контента
- [ ] Redirects работают корректно
- [ ] Session expiry handling реализован
- [ ] Тесты написаны для auth flow

---

**Версия:** 1.0  
**Дата:** 2024-11-14  
**Статус:** Technical Guide — готов к реализации

