# ⚡ Performance Budget — Целевые метрики и мониторинг

> **Документ определяет целевые метрики производительности для Go2Asia PWA и процесс их мониторинга.**

---

## 1. Целевые метрики Lighthouse

### 1.1 MVP (Фаза 1)

**Минимальные требования для запуска:**

| Метрика | Mobile | Desktop | Примечание |
|---------|--------|---------|------------|
| **Performance** | ≥ 85 | ≥ 90 | Критично для мобильных |
| **Accessibility** | ≥ 90 | ≥ 90 | WCAG AA минимум |
| **Best Practices** | ≥ 90 | ≥ 90 | Безопасность и стандарты |
| **SEO** | ≥ 90 | ≥ 90 | Индексация контента |

**Обоснование:**
- Mobile Performance ≥ 85 — приемлемо для MVP, позволяет улучшать
- Desktop Performance ≥ 90 — выше, т.к. больше ресурсов
- Accessibility ≥ 90 — важно для инклюзивности
- SEO ≥ 90 — критично для контентных модулей (Atlas, Blog)

### 1.2 Production (Фаза 2+)

**Целевые метрики после оптимизации:**

| Метрика | Mobile | Desktop | Примечание |
|---------|--------|---------|------------|
| **Performance** | ≥ 90 | ≥ 95 | Высокая производительность |
| **Accessibility** | ≥ 95 | ≥ 95 | WCAG AAA для критичных экранов |
| **Best Practices** | ≥ 95 | ≥ 95 | Максимальная безопасность |
| **SEO** | ≥ 95 | ≥ 95 | Оптимальная индексация |

---

## 2. Core Web Vitals

### 2.1 Целевые значения

**Google Core Web Vitals (критичные метрики):**

| Метрика | Целевое значение | Плохое значение | Описание |
|---------|------------------|-----------------|----------|
| **LCP** | < 2.5s | > 4.0s | Largest Contentful Paint |
| **FID** | < 100ms | > 300ms | First Input Delay |
| **CLS** | < 0.1 | > 0.25 | Cumulative Layout Shift |

**Дополнительные метрики:**

| Метрика | Целевое значение | Описание |
|---------|------------------|----------|
| **TTI** | < 3.5s | Time to Interactive |
| **FCP** | < 1.8s | First Contentful Paint |
| **TBT** | < 200ms | Total Blocking Time |

### 2.2 Стратегии оптимизации

**LCP (Largest Contentful Paint):**
- Оптимизация изображений (WebP, lazy loading)
- Preload критичных ресурсов
- Минимизация render-blocking ресурсов
- CDN для статики

**FID (First Input Delay):**
- Минимизация JavaScript (code splitting)
- Оптимизация третьих скриптов
- Использование Web Workers для тяжёлых задач

**CLS (Cumulative Layout Shift):**
- Резервирование места для изображений (aspect-ratio)
- Избежание динамического контента выше fold
- Font-display: swap для шрифтов

---

## 3. Bundle Size Budget

### 3.1 Целевые размеры

**App Shell (initial load):**
- **JavaScript:** < 100kb (gzip)
- **CSS:** < 20kb (gzip)
- **Общий размер:** < 120kb (gzip)

**Модуль (lazy loaded):**
- **JavaScript:** < 200kb (gzip)
- **CSS:** < 30kb (gzip)
- **Общий размер:** < 230kb (gzip)

**Общий размер (initial load):**
- **Всего:** < 200kb (gzip) — включая App Shell и критичные ресурсы

### 3.2 Мониторинг размера

**Инструменты:**
- `@next/bundle-analyzer` — анализ bundle size
- `webpack-bundle-analyzer` — визуализация зависимостей
- Lighthouse — автоматическая проверка

**CI/CD проверка:**
```yaml
# .github/workflows/bundle-size.yml
- name: Check bundle size
  run: |
    npm run build
    npm run analyze
    # Проверка, что размер не превышает budget
```

---

## 4. Мониторинг производительности

### 4.1 Lighthouse CI

**Настройка:**
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm run start &
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/atlas
            http://localhost:3000/pulse
          uploadArtifacts: true
          temporaryPublicStorage: true
```

**Конфигурация:**
```json
// lighthouse-budget.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.85}],
        "categories:accessibility": ["error", {"minScore": 0.90}],
        "categories:best-practices": ["error", {"minScore": 0.90}],
        "categories:seo": ["error", {"minScore": 0.90}],
        "first-contentful-paint": ["error", {"maxNumericValue": 1800}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 200}]
      }
    }
  }
}
```

### 4.2 Real User Monitoring (RUM)

**Сбор метрик от реальных пользователей:**

**Инструменты:**
- **Web Vitals** — библиотека от Google
- **Sentry** — мониторинг производительности
- **Custom analytics** — собственный сбор метрик

**Реализация:**
```typescript
// packages/analytics/src/web-vitals.ts
import { onCLS, onFID, onLCP } from 'web-vitals';

export function reportWebVitals() {
  onCLS(metric => {
    analytics.track('web_vital', {
      name: 'CLS',
      value: metric.value,
      rating: metric.rating,
    });
  });

  onFID(metric => {
    analytics.track('web_vital', {
      name: 'FID',
      value: metric.value,
      rating: metric.rating,
    });
  });

  onLCP(metric => {
    analytics.track('web_vital', {
      name: 'LCP',
      value: metric.value,
      rating: metric.rating,
    });
  });
}
```

### 4.3 Регулярные аудиты

**Расписание:**
- **Еженедельно** — автоматический Lighthouse аудит всех страниц
- **При каждом релизе** — полный аудит перед деплоем
- **Ежемесячно** — глубокий анализ производительности

**Отчёты:**
- Результаты сохраняются в GitHub Actions artifacts
- Отправка уведомлений при регрессиях
- Дашборд с историей метрик

---

## 5. Оптимизации

### 5.1 Code Splitting

**Стратегия:**
- Разделение по роутам (Next.js автоматически)
- Lazy loading модулей (микрофронтенды)
- Динамические импорты для тяжёлых компонентов

**Пример:**
```typescript
// Lazy loading модуля
const AtlasModule = dynamic(() => import('./atlas/AtlasModule'), {
  loading: () => <Skeleton />,
  ssr: false, // Если модуль не требует SSR
});
```

### 5.2 Оптимизация изображений

**Стратегии:**
- **Формат:** WebP с fallback на JPEG/PNG
- **Lazy loading:** `loading="lazy"` для изображений ниже fold
- **Responsive images:** `srcset` для разных размеров экрана
- **CDN:** Cloudflare Image Resizing для динамической оптимизации

**Пример:**
```tsx
<Image
  src="/place.jpg"
  alt="Место"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### 5.3 Минимизация JavaScript

**Стратегии:**
- Tree shaking — удаление неиспользуемого кода
- Минификация — сжатие кода
- Dead code elimination — удаление недостижимого кода
- Оптимизация зависимостей — использование лёгких альтернатив

**Проверка:**
```bash
npm run analyze
# Показывает размер каждого модуля
```

### 5.4 Кеширование

**Стратегии:**
- **Service Worker** — кеширование статики
- **HTTP Cache** — кеширование на CDN
- **Browser Cache** — кеширование в браузере
- **API Cache** — кеширование ответов API

**Настройка:**
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

---

## 6. Процесс работы с Performance Budget

### 6.1 При разработке

**Проверка перед коммитом:**
```bash
npm run build
npm run lighthouse:local
# Проверка, что метрики в пределах budget
```

**Проверка в PR:**
- Lighthouse CI автоматически проверяет метрики
- PR блокируется, если метрики ниже budget
- Комментарий в PR с результатами проверки

### 6.2 При регрессиях

**Процесс:**
1. Обнаружение регрессии (Lighthouse CI или RUM)
2. Анализ причин (bundle analyzer, performance profiling)
3. Исправление проблемы
4. Повторная проверка

**Эскалация:**
- Если регрессия критична → блокировка мержа
- Если регрессия незначительна → предупреждение в PR

### 6.3 Регулярные улучшения

**Ежемесячный аудит:**
- Анализ метрик за месяц
- Выявление узких мест
- Планирование оптимизаций
- Обновление budget при необходимости

---

## 7. Инструменты и команды

### 7.1 Команды npm

```json
{
  "scripts": {
    "lighthouse": "lhci autorun",
    "lighthouse:local": "lighthouse http://localhost:3000 --view",
    "analyze": "ANALYZE=true next build",
    "perf:test": "npm run build && npm run lighthouse"
  }
}
```

### 7.2 Инструменты разработки

- **Chrome DevTools** — Performance, Lighthouse, Coverage
- **WebPageTest** — детальный анализ производительности
- **Bundle Analyzer** — анализ размера bundle
- **Lighthouse CI** — автоматическая проверка

---

## 8. Чеклист Performance Budget

### Для каждого модуля:

- [ ] Lighthouse score ≥ 85 (mobile) / ≥ 90 (desktop)
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Bundle size < 200kb (gzip)
- [ ] Lazy loading изображений реализован
- [ ] Code splitting настроен
- [ ] Кеширование настроено
- [ ] Минификация включена
- [ ] Tree shaking работает
- [ ] Lighthouse CI настроен
- [ ] RUM метрики собираются

---

## 9. Примеры целевых значений

### 9.1 App Shell (initial load)

**Целевые значения:**
- JavaScript: 85kb (gzip) ✅
- CSS: 15kb (gzip) ✅
- LCP: 1.8s ✅
- FID: 50ms ✅
- CLS: 0.05 ✅

### 9.2 Atlas Module (lazy loaded)

**Целевые значения:**
- JavaScript: 150kb (gzip) ✅
- CSS: 25kb (gzip) ✅
- LCP: 2.2s ✅
- FID: 80ms ✅
- CLS: 0.08 ✅

---

## 10. Мониторинг в продакшене

### 10.1 Дашборд метрик

**Метрики для отслеживания:**
- Средний Lighthouse score по всем страницам
- P50, P75, P95, P99 для Core Web Vitals
- Bundle size тренд
- Количество регрессий

**Инструменты:**
- Grafana + Prometheus
- Google Analytics (Web Vitals)
- Sentry Performance Monitoring

### 10.2 Алерты

**Условия для алертов:**
- Lighthouse score упал ниже budget на 5+ пунктов
- LCP превысил 3s для >10% пользователей
- Bundle size увеличился на >20kb

**Действия:**
- Уведомление команды
- Создание issue для расследования
- Блокировка деплоя (если критично)

---

**Версия:** 1.0  
**Дата:** 2024-11-14  
**Статус:** Technical Guide — готов к реализации

