# Netlify Deployment Guide

## Настройка деплоя Frontend в Netlify

### Требования

- Репозиторий подключен к Netlify
- Настроен Continuous Deployment из GitHub

### Настройки Build Settings в Netlify Dashboard

1. **Base directory:** (оставить пустым)
   - Netlify будет работать из корня репозитория

2. **Package directory:** `apps/go2asia-pwa-shell`
   - Указывает Netlify где находится Next.js приложение

3. **Build command:** `pnpm turbo build --filter=@go2asia/pwa-shell`
   - Или можно оставить пустым, если указано в `netlify.toml`

4. **Publish directory:** `apps/go2asia-pwa-shell/.next`
   - Директория где Next.js создаёт собранные файлы

### Конфигурация в `netlify.toml`

Файл находится в `apps/go2asia-pwa-shell/netlify.toml`:

```toml
[build]
  command = "pnpm turbo build --filter=@go2asia/pwa-shell"
  publish = "apps/go2asia-pwa-shell/.next"

[build.environment]
  NODE_VERSION = "20"
  PNPM_VERSION = "8"
```

### Переменные окружения

Добавьте в Netlify Dashboard → Site settings → Environment variables:

**Production:**
- `NEXT_PUBLIC_API_URL` = `https://api.go2asia.space`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_...`

**Staging:**
- `NEXT_PUBLIC_API_URL` = `https://api-staging.go2asia.space`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_test_...`

**Deploy Preview:**
- `NEXT_PUBLIC_API_URL` = `https://api-staging.go2asia.space`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_test_...`

### Troubleshooting

#### Ошибка: "Your publish directory was not found"

**Причина:** Неправильный путь к publish directory.

**Решение:**
1. Убедитесь, что в `netlify.toml` указано: `publish = "apps/go2asia-pwa-shell/.next"`
2. Или в Netlify Dashboard: `Publish directory` = `apps/go2asia-pwa-shell/.next`
3. Проверьте, что команда сборки выполняется успешно (смотрите логи)

#### Ошибка: "Build command failed"

**Причина:** Проблемы с зависимостями или сборкой.

**Решение:**
1. Проверьте логи сборки
2. Убедитесь, что все зависимости установлены
3. Проверьте, что Turbo правильно настроен

#### Ошибка: "Module not found"

**Причина:** Проблемы с workspace зависимостями.

**Решение:**
1. Убедитесь, что `pnpm-workspace.yaml` настроен правильно
2. Проверьте, что все workspace пакеты собраны перед сборкой frontend
3. Используйте `--filter=@go2asia/pwa-shell^...` для сборки зависимостей

### Проверка деплоя

После успешного деплоя проверьте:

1. **Главная страница:** `https://your-site.netlify.app`
2. **API запросы:** Проверьте что запросы идут на правильный API URL
3. **SSR страницы:** Проверьте что публичные страницы рендерятся на сервере
4. **Статические файлы:** Проверьте что `/robots.txt` и `/sitemap.xml` доступны

### Автоматический деплой

Netlify автоматически деплоит при:
- Push в `main` ветку → Production deploy
- Push в другие ветки → Deploy Preview
- Pull Request → Deploy Preview

### Дополнительные настройки

#### Redirects для SPA

Если нужны redirects для клиентской маршрутизации, добавьте в `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false
  conditions = {Role = ["admin"]}
```

#### Headers для безопасности

Уже настроены в `netlify.toml`:
- Security headers
- Cache headers для статических ресурсов

#### Functions (если нужны)

Если нужны Netlify Functions, создайте директорию `netlify/functions/` в `apps/go2asia-pwa-shell/`.

