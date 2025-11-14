# Go2Asia Monorepo

Экосистема Go2Asia - монорепозиторий для цифровой платформы путешествий, жизни и бизнеса в Юго-Восточной Азии.

## 🚀 Быстрый старт

### Требования

- Node.js >= 20.0.0
- pnpm >= 8.0.0

### Установка

```bash
# Установить зависимости
pnpm install

# Запустить разработку
pnpm dev
```

## 📁 Структура проекта

```
go2asia-monorepo/
├── apps/
│   └── go2asia-pwa-shell/     # Frontend (Next.js 15 App Router)
├── services/
│   ├── api-gateway/           # Cloudflare Worker/Pages Functions
│   ├── auth-service/          # Cloudflare Worker
│   ├── content-service/       # Cloudflare Worker
│   ├── token-service/         # Cloudflare Worker
│   └── referral-service/      # Cloudflare Worker
├── packages/
│   ├── ui/                    # Дизайн-система (React/Tailwind/shadcn)
│   ├── types/                 # Общие TS-типы (генерятся из OpenAPI)
│   ├── sdk/                   # Автогенерируемый клиент по OpenAPI
│   ├── config/                # eslint, tsconfig, prettier
│   ├── logger/                # Единый логгер + requestId
│   └── schemas/               # Zod-схемы
└── docs/
    ├── openapi/               # Спецификации сервисов
    ├── ops/                   # Runbooks, SLO/SLA, миграции
    └── planning/              # Планы и чек-листы
```

## 🛠️ Команды

### Разработка

```bash
# Запустить все приложения в режиме разработки
pnpm dev

# Собрать все пакеты
pnpm build

# Проверить типы
pnpm typecheck

# Линтинг
pnpm lint

# Форматирование
pnpm format
```

### OpenAPI и генерация

```bash
# Генерировать типы из OpenAPI
pnpm gen:types

# Генерировать SDK из OpenAPI
pnpm gen:sdk

# Генерировать всё
pnpm gen:all

# Валидировать OpenAPI спецификации
pnpm validate:openapi
```

### Тестирование

```bash
# Unit тесты
pnpm test

# E2E тесты
pnpm test:e2e
```

## 📚 Документация

- [PHASE0_DETAILED_PLAN.md](docs/planning/PHASE0_DETAILED_PLAN.md) - Подробный план разработки Фазы 0
- [PHASE0_RESTART_PLAYBOOK.md](docs/planning/PHASE0_RESTART_PLAYBOOK.md) - Playbook Фазы 0
- [PHASE0_CHECKLIST.md](docs/planning/PHASE0_CHECKLIST.md) - Чек-лист прогресса

## 🔗 Ссылки

- [OpenAPI Guide](docs/ops/OPENAPI_GUIDE.md)
- [Security Policy](docs/ops/SECURITY_POLICY.md)
- [Deployment Process](docs/ops/DEPLOYMENT_PROCESS.md)

## 📝 Лицензия

Private

