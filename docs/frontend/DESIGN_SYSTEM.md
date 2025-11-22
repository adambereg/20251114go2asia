# Go2Asia Design System & PWA Structure

## 🎨 Цветовая палитра

### Основные цвета (Primary)
- **Sky Blue (Основной бренд)**: `#0EA5E9` (sky-600 в Tailwind)
  - Hover: `#0284C7` (sky-700)
  - Light: `#7DD3FC` (sky-300)
  - Lighter: `#E0F2FE` (sky-100)
  - Градиент: `from-sky-500 to-sky-600` или `from-sky-500 to-sky-700`

### Вторичные цвета (Secondary)
- **Slate (Текст и границы)**:
  - Текст основной: `#0F172A` (slate-900)
  - Текст вторичный: `#475569` (slate-600)
  - Текст третичный: `#94A3B8` (slate-400)
  - Границы: `#E2E8F0` (slate-200)
  - Фон: `#F8FAFC` (slate-50)

### Акцентные цвета (по модулям)
- **Atlas**: `from-sky-500 to-sky-600`
- **Pulse**: `from-sky-500 to-sky-600`
- **Blog**: `from-sky-500 to-sky-600`
- **Guru**: `from-sky-500 to-sky-600`
- **Space**: `from-sky-500 to-sky-600`
- **Rielt**: `from-emerald-500 to-emerald-600`
- **Quest**: `from-purple-500 to-purple-600`
- **RF (Russian Friendly)**: `from-blue-500 to-blue-600`
- **Connect**: `from-amber-500 to-amber-600`
- **Partner**: `from-orange-500 to-orange-600`

### Системные цвета
- **Success**: `#10B981` (emerald-500)
- **Warning**: `#F59E0B` (amber-500)
- **Error**: `#EF4444` (red-500)
- **Info**: `#3B82F6` (blue-500)

### Специальные эффекты
- **White overlay**: `bg-white/10`, `bg-white/20`, `bg-white/90`
- **Black overlay**: `bg-black/50`
- **Backdrop blur**: `backdrop-blur-sm`

---

## 📐 Структура PWA-оболочки

### Общая архитектура
```
┌─────────────────────────────────────┐
│      TopAppBar (64px height)       │ ← Sticky top-0 z-50
├─────────────────────────────────────┤
│                                     │
│         Main Content                │ ← pb-20 pt-16
│       (max-w-7xl mx-auto)           │
│                                     │
├─────────────────────────────────────┤
│     BottomNav (64px height)         │ ← Fixed bottom-0 z-50 (Mobile)
└─────────────────────────────────────┘
```

### TopAppBar (Верхняя панель)
**Класс**: `sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm`

**Структура**:
```html
<header>
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="flex items-center justify-between h-16">
      <!-- Логотип -->
      <button class="flex items-center gap-3">
        <Globe class="w-8 h-8 text-sky-600" />
        <span class="text-xl font-bold text-slate-900">Go2Asia</span>
      </button>

      <!-- Навигация Desktop (hidden md:flex) -->
      <nav class="hidden md:flex items-center gap-6">
        <button class="text-slate-600 hover:text-sky-600">Atlas</button>
        <button class="text-slate-600 hover:text-sky-600">Pulse</button>
        <button class="text-slate-600 hover:text-sky-600">Blog</button>
        <button class="text-slate-600 hover:text-sky-600">Space</button>
      </nav>

      <!-- Действия -->
      <div class="flex items-center gap-3">
        <button class="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg">
          <Search size={20} />
        </button>
        <button class="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg">
          <Grid3x3 size={20} />
        </button>
        <!-- Аватар/Войти -->
        <button class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg">
          Войти
        </button>
      </div>
    </div>
  </div>
</header>
```

**Важные классы**:
- Container: `max-w-7xl mx-auto px-4 sm:px-6`
- Высота: `h-16` (64px)
- Фон: `bg-white`
- Тень: `shadow-sm`
- Граница: `border-b border-slate-200`

### BottomNav (Нижняя навигация Mobile)
**Класс**: `fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 md:hidden`

**Структура**:
```html
<nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 md:hidden">
  <div class="flex items-center justify-around h-16">
    <button class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-sky-600">
      <Home size={20} class="stroke-[2.5]" />
      <span class="text-xs font-medium">Главная</span>
    </button>
    <!-- 4 других пункта -->
  </div>
</nav>
```

**Пункты навигации**:
1. Главная (Home) - `home`
2. Atlas (Globe) - `atlas`
3. Pulse (Calendar) - `pulse`
4. Blog (BookOpen) - `blog`
5. Space (User) - `space`

**Активное состояние**:
- Цвет: `text-sky-600`
- Толщина иконки: `stroke-[2.5]`

**Неактивное состояние**:
- Цвет: `text-slate-600`
- Hover: `hover:text-sky-600 hover:bg-slate-50`

### Main Content Area
**Класс**: `pb-20 pt-16`
- `pt-16`: отступ сверху под TopAppBar (64px)
- `pb-20`: отступ снизу под BottomNav (80px mobile)

---

## 🏠 Стартовая страница (HomeModule)

### Hero Section (для неавторизованных)
**Класс**: `bg-gradient-to-br from-sky-500 to-sky-700 rounded-2xl p-6 md:p-12 text-white`

**Структура**:
```html
<section class="mb-8 md:mb-12">
  <div class="bg-gradient-to-br from-sky-500 to-sky-700 rounded-2xl p-6 md:p-12 text-white overflow-hidden relative">
    <!-- Декоративные круги -->
    <div class="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24" />
    <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />

    <div class="relative z-10 max-w-3xl">
      <!-- Sparkles icon -->
      <div class="flex items-center gap-2 mb-3">
        <Sparkles class="w-5 h-5" />
        <span class="text-xs font-medium opacity-90">Добро пожаловать в экосистему</span>
      </div>

      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">Go2Asia</h1>
      <p class="text-lg md:text-xl lg:text-2xl mb-4 opacity-95">
        Всё для жизни, путешествий и работы в Юго-Восточной Азии
      </p>

      <!-- Value propositions с CheckCircle -->
      <div class="mb-6 space-y-2">
        <div class="flex items-center gap-2">
          <CheckCircle class="w-4 h-4" />
          <span>Гайды и события по всей ЮВА</span>
        </div>
        <!-- ... -->
      </div>

      <!-- CTA кнопки -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button class="bg-white text-sky-600 px-6 py-3 rounded-xl font-semibold shadow-lg">
          Зарегистрироваться
          <ArrowRight size={18} />
        </button>
        <button class="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl">
          Посмотреть контент
        </button>
      </div>
    </div>
  </div>
</section>
```

### Personal Dashboard (для авторизованных)
**Класс**: `bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 md:p-7 text-white`

**Структура**:
```html
<section class="mb-8 md:mb-12">
  <div class="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 md:p-7 text-white">
    <!-- Аватар + инфо -->
    <div class="flex items-start gap-4 mb-5">
      <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-xl font-bold">
        А
      </div>
      <div>
        <h2 class="text-lg font-bold">Анна Петрова</h2>
        <div class="flex items-center gap-1.5 text-xs opacity-90">
          <MapPin size={14} />
          <span>Сейчас: Пхукет, Таиланд</span>
        </div>
      </div>
    </div>

    <!-- Level Progress -->
    <div class="mb-5">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-bold flex items-center gap-1.5">
          <Star size={16} />
          Level 12
        </span>
        <span class="text-sm font-bold">75%</span>
      </div>
      <div class="bg-white/20 rounded-full h-2 mb-1">
        <div class="bg-white rounded-full h-2" style="width: 75%"></div>
      </div>
      <p class="text-xs opacity-80">+120 Points до следующего уровня</p>
    </div>

    <!-- Mini Stats Grid (2x2 на mobile, 4x1 на desktop) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
      <button class="bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl p-3">
        <div class="flex items-center gap-2 mb-1">
          <Coins size={18} class="text-yellow-200" />
          <span class="text-lg font-bold">3,450</span>
        </div>
        <p class="text-xs opacity-90">Points на балансе</p>
      </button>
      <!-- ... 3 другие карточки -->
    </div>

    <!-- Quick Actions -->
    <div class="flex flex-wrap gap-2 mt-4">
      <button class="px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur rounded-lg text-sm flex items-center gap-2">
        <Target size={16} />
        Продолжить квест
      </button>
      <!-- ... -->
    </div>
  </div>
</section>
```

### Сетка модулей
**Класс**: `grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4`

**Карточка модуля**:
```html
<button class="bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-xl p-4 md:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-left w-full h-full flex flex-col relative">
  <!-- Lock badge для неавторизованных -->
  <div class="absolute top-2 right-2 bg-white/20 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium">
    <Lock size={12} />
    <span class="hidden sm:inline">После входа</span>
  </div>

  <!-- PRO badge -->
  <div class="absolute top-2 right-2 bg-purple-500 px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
    <Crown size={12} />
    PRO
  </div>

  <div class="mb-2">{icon}</div>
  <h3 class="font-bold text-base md:text-lg mb-1">{title}</h3>
  <p class="text-xs md:text-sm opacity-90">{description}</p>
</button>
```

### Trending Content Carousel
**Класс**: `flex gap-4 overflow-x-auto pb-4 -mx-4 px-4`

**Карточка**:
```html
<button class="flex-shrink-0 w-48 md:w-64 bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:shadow-lg hover:border-sky-300 hover:-translate-y-1 transition-all">
  <div class="aspect-[4/3] overflow-hidden">
    <img src={image} class="w-full h-full object-cover" />
  </div>
  <div class="p-4">
    <div class="text-xs text-sky-600 font-medium mb-1">{type}</div>
    <h3 class="font-bold text-slate-900 mb-1">{title}</h3>
    <p class="text-sm text-slate-600">{subtitle}</p>
  </div>
</button>
```

### Ecosystem Features
**Класс**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5`

**Feature Card**:
```html
<div class="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-5 md:p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
  <div class="mb-4">
    <Users class="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
  </div>
  <h3 class="font-bold text-slate-900 mb-2 text-base md:text-lg">
    {title}
  </h3>
  <p class="text-sm md:text-base text-slate-700 mb-4 leading-relaxed">
    {description}
  </p>
  <button class="text-sm md:text-base font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group">
    {cta}
    <ArrowRight size={16} class="group-hover:translate-x-1 transition-transform" />
  </button>
</div>
```

**Цветовые схемы feature cards**:
- Сообщество: `from-blue-50 to-cyan-50` + `border-blue-200` + `text-blue-600`
- Команды: `from-purple-50 to-pink-50` + `border-purple-200` + `text-purple-600`
- RF партнёры: `from-emerald-50 to-teal-50` + `border-emerald-200` + `text-emerald-600`
- Рефералка: `from-amber-50 to-orange-50` + `border-amber-200` + `text-amber-600`
- Награды: `from-indigo-50 to-blue-50` + `border-indigo-200` + `text-indigo-600`
- Квесты: `from-rose-50 to-pink-50` + `border-rose-200` + `text-rose-600`

### CTA Section (Footer)
**Класс**: `bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 text-white text-center`

```html
<div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 text-white text-center">
  <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
    Присоединяйтесь к сообществу
  </h2>
  <p class="text-base md:text-lg lg:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
    Получите доступ ко всем возможностям экосистемы, зарабатывайте награды и находите единомышленников
  </p>
  <div class="flex flex-col sm:flex-row gap-4 justify-center">
    <button class="bg-sky-500 hover:bg-sky-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold">
      Зарегистрироваться
      <ArrowRight size={20} />
    </button>
    <button class="bg-white/10 hover:bg-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold">
      Узнать больше
    </button>
  </div>
</div>
```

---

## 🎯 Типография

### Шрифты
- **Font Family**: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
- **Antialiasing**: включен глобально

### Размеры заголовков
- **H1**: `text-3xl md:text-4xl lg:text-5xl font-bold` (30px → 36px → 48px)
- **H2**: `text-2xl md:text-3xl font-bold` (24px → 30px)
- **H3**: `text-xl md:text-2xl font-bold` (20px → 24px)
- **H4**: `text-lg md:text-xl font-bold` (18px → 20px)

### Размеры текста
- **Large**: `text-lg md:text-xl` (18px → 20px)
- **Base**: `text-sm md:text-base` (14px → 16px)
- **Small**: `text-xs md:text-sm` (12px → 14px)
- **Tiny**: `text-xs` (12px)

### Вес шрифта
- **Bold**: `font-bold` (700)
- **Semibold**: `font-semibold` (600)
- **Medium**: `font-medium` (500)
- **Regular**: `font-normal` (400)

---

## 🔘 Кнопки

### Primary Button
```html
<button class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors">
  Войти
</button>
```

### Secondary Button
```html
<button class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
  Отмена
</button>
```

### Ghost Button (прозрачная)
```html
<button class="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white rounded-lg font-medium transition-colors">
  Узнать больше
</button>
```

### Icon Button
```html
<button class="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-all">
  <Search size={20} />
</button>
```

### Размеры кнопок
- **Small**: `px-3 py-1.5 text-xs`
- **Medium**: `px-4 py-2 text-sm`
- **Large**: `px-6 py-3 text-base`
- **XLarge**: `px-8 py-4 text-lg`

---

## 📦 Карточки

### Базовая карточка
```html
<div class="bg-white rounded-xl border-2 border-slate-200 p-4 hover:shadow-lg hover:border-sky-300 hover:-translate-y-0.5 transition-all">
  {content}
</div>
```

### Карточка с градиентом
```html
<div class="bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all">
  {content}
</div>
```

### Радиусы скругления
- **Small**: `rounded-lg` (8px)
- **Medium**: `rounded-xl` (12px)
- **Large**: `rounded-2xl` (16px)
- **Full**: `rounded-full` (9999px)

---

## ✨ Эффекты и анимации

### Transitions
- **Duration**: `transition-all duration-200`
- **Default**: `transition-colors` или `transition-all`

### Hover эффекты
- **Lift**: `hover:-translate-y-1`
- **Subtle lift**: `hover:-translate-y-0.5`
- **Shadow**: `hover:shadow-xl`
- **Border highlight**: `hover:border-sky-300`

### Transform на группе
```html
<button class="group">
  <ArrowRight class="group-hover:translate-x-1 transition-transform" />
</button>
```

---

## 📱 Responsive Breakpoints

### Tailwind Breakpoints
- **Mobile**: `< 768px` (по умолчанию)
- **Tablet (md)**: `≥ 768px`
- **Desktop (lg)**: `≥ 1024px`
- **Wide (xl)**: `≥ 1280px`

### Паттерны использования
- Grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- Text: `text-sm md:text-base lg:text-lg`
- Padding: `p-4 md:p-6 lg:p-8`
- Gap: `gap-3 md:gap-4 lg:gap-6`

---

## 🎭 Модальные окна

### Auth Modal
```html
<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl md:text-2xl font-bold text-slate-900">{title}</h3>
      <button class="text-slate-400 hover:text-slate-600 transition-colors">
        <X size={24} />
      </button>
    </div>
    {content}
  </div>
</div>
```

---

## 🔒 Lock States

### Locked Module Badge
```html
<div class="absolute top-2 right-2 bg-white/20 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium">
  <Lock size={12} />
  <span class="hidden sm:inline">После входа</span>
</div>
```

### PRO Badge
```html
<div class="absolute top-2 right-2 bg-purple-500 px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
  <Crown size={12} />
  PRO
</div>
```

---

## 📐 Spacing System

### Container
- **Max Width**: `max-w-7xl` (1280px)
- **Padding**: `px-4 sm:px-6` (16px → 24px)

### Margins (mb-{n})
- Section: `mb-8 md:mb-12` (32px → 48px)
- Header: `mb-4 md:mb-6` (16px → 24px)
- Element: `mb-2 md:mb-3` (8px → 12px)

### Gaps
- Small: `gap-2` (8px)
- Medium: `gap-3 md:gap-4` (12px → 16px)
- Large: `gap-4 md:gap-6` (16px → 24px)

---

## 🎨 Russian Friendly Badge

```html
<div class="px-3 py-1.5 bg-emerald-500 text-white rounded-lg font-semibold text-sm flex items-center gap-1.5">
  <CheckCircle size={16} />
  Russian Friendly
</div>
```

Или компактный:
```html
<span class="px-1.5 py-0.5 bg-green-600 text-white rounded text-xs font-bold shadow-lg">
  RF
</span>
```

---

## 🌐 Иконки (Lucide React)

### Основные иконки по модулям
- **Home**: `Home`
- **Atlas**: `Globe`
- **Pulse**: `Calendar`
- **Blog**: `BookOpen`
- **Guru**: `MapPin`
- **Rielt**: `Home`
- **Quest**: `Trophy`
- **RF**: `Building2`
- **Space**: `User`
- **Connect**: `Coins`

### Размеры иконок
- **Small**: `size={16}`
- **Medium**: `size={20}`
- **Large**: `size={24}`
- **XLarge**: `size={28}` или `class="w-8 h-8 md:w-10 md:h-10"`

---

## 🎯 Ключевые принципы дизайна

1. **Мобильный first**: все начинается с mobile, затем адаптация
2. **Градиенты**: активно используются для модулей и hero-секций
3. **Rounded corners**: всё скруглённое (xl, 2xl)
4. **Hover эффекты**: subtle lift + тень
5. **White space**: щедрые отступы между секциями
6. **Иконки везде**: каждая кнопка/модуль с иконкой
7. **Transitions**: всё плавно (200ms)
8. **Border на карточках**: `border-2 border-slate-200`
9. **Backdrop blur**: для полупрозрачных элементов
10. **Contrast**: чёткое разделение текстов (slate-900, slate-600, slate-400)
