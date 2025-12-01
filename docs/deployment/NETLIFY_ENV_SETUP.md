# Настройка переменных окружения в Netlify

## Дата: 14 января 2025

## Проблема

После успешного деплоя на Netlify в браузере появляется ошибка:
```
@clerk/nextjs: Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.
```

Это означает, что переменные окружения для Clerk не настроены в Netlify.

## Решение

### Шаг 1: Получить ключи Clerk

1. Перейдите в [Clerk Dashboard](https://dashboard.clerk.com/)
2. Выберите ваш проект (или создайте новый)
3. Перейдите в **API Keys** (`https://dashboard.clerk.com/last-active?path=api-keys`)
4. Скопируйте следующие ключи:
   - **Publishable Key** (начинается с `pk_test_...` или `pk_live_...`)
   - **Secret Key** (начинается с `sk_test_...` или `sk_live_...`)

### Шаг 2: Добавить переменные окружения в Netlify

1. Перейдите в ваш проект на Netlify: `https://app.netlify.com/sites/YOUR_SITE_NAME`
2. Откройте **Site configuration** → **Environment variables**
3. Нажмите **Add a variable**
4. Добавьте следующие переменные:

#### Обязательные переменные для Clerk:

| Variable name | Value | Описание |
|--------------|-------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...` или `pk_live_...` | Публичный ключ Clerk (доступен в браузере) |
| `CLERK_SECRET_KEY` | `sk_test_...` или `sk_live_...` | Секретный ключ Clerk (только на сервере) |

#### Дополнительные переменные (если используются):

| Variable name | Value | Описание |
|--------------|-------|----------|
| `NEXT_PUBLIC_API_URL` | `https://api.go2asia.space` | URL API для микросервисов |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | URL страницы входа (опционально) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | URL страницы регистрации (опционально) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/` | URL после входа (опционально) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/` | URL после регистрации (опционально) |

### Шаг 3: Настроить окружения (Production/Deploy Preview)

Netlify позволяет настроить разные значения для разных окружений:

1. При добавлении переменной выберите **Scopes**:
   - ✅ **Production** - для production деплоев
   - ✅ **Deploy Preview** - для preview деплоев (pull requests)
   - ✅ **Branch Deploys** - для деплоев из веток

2. Для тестирования можно использовать `pk_test_...` и `sk_test_...`
3. Для production используйте `pk_live_...` и `sk_live_...`

### Шаг 4: Пересобрать деплой

После добавления переменных окружения:

1. Перейдите в **Deploys**
2. Нажмите **Trigger deploy** → **Deploy site**
3. Или сделайте новый коммит и push (Netlify автоматически пересоберёт)

### Шаг 5: Проверка

После пересборки проверьте:

1. Откройте сайт в браузере
2. Откройте Developer Tools (F12) → Console
3. Ошибка `Missing publishableKey` должна исчезнуть
4. Если используется Clerk, должна появиться возможность входа/регистрации

## Альтернатива: Использование без Clerk (для разработки)

Если вы не хотите использовать Clerk на данном этапе:

1. **Не добавляйте** переменные окружения в Netlify
2. Приложение будет работать в режиме без Clerk
3. Будет использоваться `AuthModeProvider` для разработки
4. Ошибка `Missing publishableKey` будет показываться, но не критична

**Примечание:** Код уже настроен для работы без Clerk - проверка `isClerkConfigured` предотвращает использование Clerk hooks, если ключ не настроен.

## Troubleshooting

### Ошибка всё ещё появляется после настройки

1. **Проверьте имя переменной**: Должно быть точно `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (с `NEXT_PUBLIC_` префиксом)
2. **Проверьте Scope**: Убедитесь, что переменная добавлена для нужного окружения (Production/Deploy Preview)
3. **Пересоберите деплой**: Netlify не применяет переменные окружения к уже собранным деплоям
4. **Проверьте значение**: Убедитесь, что скопировали ключ полностью (без пробелов в начале/конце)

### Как проверить, что переменные применены

1. В Netlify Dashboard → **Deploys** → выберите деплой
2. Откройте **Deploy log**
3. В логах сборки должны быть видны переменные окружения (значения скрыты для безопасности)

### Локальная разработка

Для локальной разработки создайте файл `.env.local` в корне `apps/go2asia-pwa-shell/`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:8787
```

**Важно:** Файл `.env.local` должен быть в `.gitignore` и не коммититься в репозиторий.

## Дополнительные ресурсы

- [Clerk Documentation - Environment Variables](https://clerk.com/docs/quickstarts/nextjs#add-your-api-keys)
- [Netlify Documentation - Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Next.js Documentation - Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

