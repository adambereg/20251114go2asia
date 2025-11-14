# Интеграция Clerk в Frontend

## Обзор

Этот документ описывает, как интегрировать Clerk аутентификацию с Go2Asia API через SDK.

## Установка зависимостей

```bash
cd apps/go2asia-pwa-shell
pnpm add @clerk/nextjs
```

## Настройка Clerk Provider

### 1. Обновить `app/layout.tsx`

```tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ru">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 2. Создать middleware для защищённых роутов

Создайте `middleware.ts` в корне `apps/go2asia-pwa-shell`:

```tsx
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  // Публичные роуты (не требуют аутентификации)
  publicRoutes: [
    '/',
    '/atlas(.*)',
    '/blog(.*)',
    '/pulse(.*)',
  ],
  // Приватные роуты (требуют аутентификации)
  ignoredRoutes: [
    '/api(.*)',
  ],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

## Интеграция SDK с Clerk

### 1. Настроить SDK в корневом layout

Обновите `app/layout.tsx`:

```tsx
'use client';

import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { setupClerkAuth } from '@go2asia/sdk/clerk-integration';
import { useEffect } from 'react';

function ClerkAuthSetup() {
  const { getToken } = useAuth();
  
  useEffect(() => {
    if (getToken) {
      setupClerkAuth(getToken);
    }
  }, [getToken]);
  
  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ClerkAuthSetup />
      <html lang="ru">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 2. Использовать SDK hooks в компонентах

```tsx
'use client';

import { useGetBalance } from '@go2asia/sdk';
import { useAuth } from '@clerk/nextjs';

export function BalanceWidget() {
  const { isSignedIn } = useAuth();
  const { data, isLoading, error } = useGetBalance({
    query: {
      enabled: isSignedIn, // Запрос выполнится только если пользователь авторизован
    },
  });

  if (!isSignedIn) {
    return <div>Please sign in to view balance</div>;
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3>Your Balance</h3>
      <p>Points: {data?.points}</p>
      <p>G2A: {data?.g2a}</p>
    </div>
  );
}
```

## Примеры использования

### Получение профиля пользователя

```tsx
'use client';

import { useGetProfile } from '@go2asia/sdk';
import { useAuth } from '@clerk/nextjs';

export function ProfilePage() {
  const { isSignedIn } = useAuth();
  const { data: profile, isLoading } = useGetProfile({
    query: {
      enabled: isSignedIn,
    },
  });

  if (!isSignedIn) return <div>Please sign in</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {profile?.email}</p>
      <p>Name: {profile?.firstName} {profile?.lastName}</p>
    </div>
  );
}
```

### Обновление профиля

```tsx
'use client';

import { useGetProfile, usePatchProfile } from '@go2asia/sdk';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';

export function EditProfileForm() {
  const { isSignedIn } = useAuth();
  const { data: profile } = useGetProfile({
    query: { enabled: isSignedIn },
  });
  
  const { mutate: updateProfile, isPending } = usePatchProfile();
  const [firstName, setFirstName] = useState(profile?.firstName || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      data: {
        firstName,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

### Работа с балансом и транзакциями

```tsx
'use client';

import { useGetBalance, useGetTransactions, usePostBalanceAdd } from '@go2asia/sdk';
import { useAuth } from '@clerk/nextjs';

export function TokenDashboard() {
  const { isSignedIn } = useAuth();
  const { data: balance } = useGetBalance({
    query: { enabled: isSignedIn },
  });
  const { data: transactions } = useGetTransactions({
    query: { enabled: isSignedIn },
  });
  const { mutate: addPoints } = usePostBalanceAdd();

  const handleAddPoints = () => {
    addPoints({
      data: {
        amount: 100,
        reason: 'quest_completed',
      },
    });
  };

  return (
    <div>
      <h2>Token Dashboard</h2>
      <div>
        <p>Balance: {balance?.points} points</p>
        <button onClick={handleAddPoints}>Add 100 Points</button>
      </div>
      <div>
        <h3>Recent Transactions</h3>
        {transactions?.items?.map((tx) => (
          <div key={tx.id}>
            {tx.type}: {tx.amount} - {tx.reason}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Реферальная система

```tsx
'use client';

import { useGetReferralStats, useGetReferralTree, usePostRegisterReferral } from '@go2asia/sdk';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';

export function ReferralPage() {
  const { isSignedIn, userId } = useAuth();
  const { data: stats } = useGetReferralStats({
    query: { enabled: isSignedIn },
  });
  const { data: tree } = useGetReferralTree({
    query: { enabled: isSignedIn },
  });
  const { mutate: registerReferral } = usePostRegisterReferral();

  const [referralCode, setReferralCode] = useState('');

  const handleRegister = () => {
    if (!userId) return;
    registerReferral({
      data: {
        referralCode,
        userId,
      },
    });
  };

  return (
    <div>
      <h2>Referral Program</h2>
      <div>
        <p>Your Code: {stats?.referralCode}</p>
        <p>Total Referrals: {stats?.totalReferrals}</p>
        <p>Total Earned: {stats?.totalEarned} points</p>
      </div>
      <div>
        <h3>Register with Code</h3>
        <input
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          placeholder="Enter referral code"
        />
        <button onClick={handleRegister}>Register</button>
      </div>
      <div>
        <h3>Your Referral Tree</h3>
        {/* Отобразить дерево рефералов */}
      </div>
    </div>
  );
}
```

## Переменные окружения

Добавьте в `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=https://api-staging.go2asia.space
```

## Обработка ошибок

SDK автоматически обрабатывает ошибки аутентификации. Для кастомной обработки:

```tsx
import { useGetBalance } from '@go2asia/sdk';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export function ProtectedComponent() {
  const { isSignedIn, signOut } = useAuth();
  const router = useRouter();
  const { data, error } = useGetBalance({
    query: { enabled: isSignedIn },
  });

  useEffect(() => {
    if (error && error.status === 401) {
      // Токен истёк или невалиден
      signOut();
      router.push('/sign-in');
    }
  }, [error, signOut, router]);

  // ...
}
```

## Тестирование

Для тестирования без реального Clerk токена можно использовать localStorage:

```tsx
// В development режиме
if (process.env.NODE_ENV === 'development') {
  localStorage.setItem('clerk_token', 'test-token');
}
```

## Следующие шаги

1. ✅ SDK настроен для работы с Clerk
2. ✅ Примеры интеграции готовы
3. ⏳ Интегрировать Clerk Provider в `app/layout.tsx`
4. ⏳ Создать страницы входа/регистрации
5. ⏳ Добавить защиту приватных роутов
6. ⏳ Протестировать интеграцию

