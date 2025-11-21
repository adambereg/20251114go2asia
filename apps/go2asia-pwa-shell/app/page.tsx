'use client';

import { useRouter } from 'next/navigation';
import { useAuthMode } from '../contexts/AuthModeContext';
import {
  MapPin,
  Calendar,
  BookOpen,
  Users,
  Target,
  Handshake,
  Building,
  Wallet,
  ArrowRight,
} from 'lucide-react';
import {
  ModuleTile,
  Button,
  FeatureCard,
  UserSummary,
} from '@go2asia/ui';

const modules = [
  {
    module: 'atlas' as const,
    icon: MapPin,
    title: 'Atlas Asia',
    description: 'Энциклопедия мест',
    href: '/atlas',
  },
  {
    module: 'pulse' as const,
    icon: Calendar,
    title: 'Pulse Asia',
    description: 'События и мероприятия',
    href: '/pulse',
  },
  {
    module: 'blog' as const,
    icon: BookOpen,
    title: 'Blog Asia',
    description: 'Статьи и истории',
    href: '/blog',
  },
  {
    module: 'space' as const,
    icon: Users,
    title: 'Space Asia',
    description: 'Социальная сеть',
    href: '/space',
  },
  {
    module: 'quest' as const,
    icon: Target,
    title: 'Quest Asia',
    description: 'Квесты и миссии',
    href: '/quest',
  },
  {
    module: 'rf' as const,
    icon: Handshake,
    title: 'Russian Friendly',
    description: 'Партнёрские места',
    href: '/rf',
  },
  {
    module: 'rielt' as const,
    icon: Building,
    title: 'Rielt.Market',
    description: 'Аренда жилья',
    href: '/rielt',
  },
  {
    module: 'connect' as const,
    icon: Wallet,
    title: 'Connect Asia',
    description: 'Кошелёк и достижения',
    href: '/connect',
  },
];

const benefits = [
  {
    type: 'community' as const,
    icon: Users,
    title: 'Живое сообщество Go2Asia',
    description:
      'Знакомьтесь с людьми, делитесь опытом, находите ответы на любые вопросы о ЮВА.',
    cta: 'Перейти в Space Asia',
    href: '/space',
  },
  {
    type: 'teams' as const,
    icon: Users,
    title: 'Команды и совместные путешествия',
    description:
      'Создавайте команды, планируйте совместные поездки и делитесь впечатлениями.',
    cta: 'Создать команду',
    href: '/space/teams',
  },
  {
    type: 'rf' as const,
    icon: Handshake,
    title: 'Russian Friendly партнёры',
    description:
      'Специальные предложения и скидки от партнёров, которые говорят по-русски.',
    cta: 'Найти партнёров',
    href: '/rf',
  },
  {
    type: 'referral' as const,
    icon: Users,
    title: 'Реферальная программа',
    description:
      'Приглашайте друзей и получайте награды за каждого нового участника экосистемы.',
    cta: 'Пригласить друзей',
    href: '/connect/referral',
  },
  {
    type: 'rewards' as const,
    icon: Wallet,
    title: 'Награды и достижения',
    description:
      'Зарабатывайте баллы, получайте NFT и разблокируйте новые возможности.',
    cta: 'Посмотреть награды',
    href: '/connect/rewards',
  },
  {
    type: 'quests' as const,
    icon: Target,
    title: 'Квесты и миссии',
    description:
      'Выполняйте квесты, исследуйте новые места и получайте уникальные награды.',
    cta: 'Начать квест',
    href: '/quest',
  },
];

// Компонент для неавторизованных пользователей
function UnauthenticatedHomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              🌏 Go2Asia
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Экосистема путешествий в Юго-Восточной Азии
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/atlas')}
              >
                Начать путешествие
                <ArrowRight />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push('/blog')}
              >
                Узнать больше
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Launch Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
          Модули экосистемы
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {modules.map((module) => (
            <ModuleTile
              key={module.href}
              module={module.module}
              icon={module.icon}
              title={module.title}
              description={module.description}
              onClick={() => router.push(module.href)}
            />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Преимущества Go2Asia
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {benefits.map((benefit, index) => (
              <FeatureCard
                key={index}
                type={benefit.type}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                cta={benefit.cta}
                onClick={() => router.push(benefit.href)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Компонент для авторизованных пользователей
function AuthenticatedHomePage() {
  const router = useRouter();

  // Mock данные для демонстрации (в будущем из API)
  // В development режиме всегда используем mock данные
  // Когда Clerk будет настроен, данные будут приходить из API
  const userStats = {
    name: 'Иван Петров',
    initials: 'ИП',
    location: 'Бангкок, Таиланд',
    level: 5,
    progress: 65,
    pointsToNextLevel: 350,
    stats: {
      points: 1250,
      nfts: 3,
      teamMembers: 2,
      vouchers: 1,
    },
    isPro: false,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* User Dashboard Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <UserSummary
          name={userStats.name}
          initials={userStats.initials}
          location={userStats.location}
          level={userStats.level}
          progress={userStats.progress}
          pointsToNextLevel={userStats.pointsToNextLevel}
          stats={userStats.stats}
          isPro={userStats.isPro}
        />
      </section>

      {/* Quick Launch Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 md:mb-8">
          Модули экосистемы
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {modules.map((module) => (
            <ModuleTile
              key={module.href}
              module={module.module}
              icon={module.icon}
              title={module.title}
              description={module.description}
              onClick={() => router.push(module.href)}
            />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Преимущества Go2Asia
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {benefits.map((benefit, index) => (
              <FeatureCard
                key={index}
                type={benefit.type}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                cta={benefit.cta}
                onClick={() => router.push(benefit.href)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// В Next.js NEXT_PUBLIC_* переменные доступны и на сервере, и на клиенте
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Компонент-обертка для условного использования Clerk
function ClerkAuthWrapper({ children }: { children: (auth: { isLoaded: boolean; isSignedIn: boolean }) => React.ReactNode }) {
  if (!isClerkConfigured) {
    return <>{children({ isLoaded: true, isSignedIn: false })}</>;
  }
  const auth = useUser();
  return <>{children({ isLoaded: auth.isLoaded ?? true, isSignedIn: auth.isSignedIn ?? false })}</>;
}

export default function HomePage() {
  const { isAuthenticated: devModeAuthenticated } = useAuthMode();

  return (
    <ClerkAuthWrapper>
      {({ isLoaded, isSignedIn }) => {
        // Если Clerk настроен и в production - используем его, иначе используем dev mode toggle
        const isAuthenticated = isClerkConfigured && process.env.NODE_ENV === 'production'
          ? isSignedIn
          : devModeAuthenticated;

        // Показываем загрузку только если Clerk настроен и еще загружается
        if (isClerkConfigured && !isLoaded) {
          return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
              <div className="text-slate-600">Загрузка...</div>
            </div>
          );
        }

        // Условный рендеринг в зависимости от статуса авторизации
        return isAuthenticated ? <AuthenticatedHomePage /> : <UnauthenticatedHomePage />;
      }}
    </ClerkAuthWrapper>
  );
}
