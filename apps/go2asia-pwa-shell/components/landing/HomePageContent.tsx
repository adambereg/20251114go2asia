'use client';

import Link from 'next/link';
import {
  Globe,
  Calendar,
  BookOpen,
  MapPin,
  Building,
  Target,
  Users,
  Wallet,
  Handshake,
  Users2,
  Gift,
  TrendingUp,
  Award,
  Crosshair,
  ArrowRight,
} from 'lucide-react';
import {
  HeroSection,
  ModuleCard,
  PopularPlacesCard,
  EventCard,
  BenefitCard,
  CTABanner,
  PersonalWelcome,
} from '@go2asia/ui';
import { RewardsList } from './RewardsList';
import { LocationPrompt } from './LocationPrompt';

// TODO: Заменить на реальную проверку авторизации через Clerk
const isAuthenticated = false; // Временно false для демонстрации неавторизованного состояния

const modules = [
  {
    href: '/atlas',
    icon: Globe,
    title: 'Atlas Asia',
    description: 'Энциклопедия мест',
    color: 'blue' as const,
    requiresAuth: false,
  },
  {
    href: '/pulse',
    icon: Calendar,
    title: 'Pulse Asia',
    description: 'События и афиша',
    color: 'blue' as const,
    requiresAuth: false,
  },
  {
    href: '/blog',
    icon: BookOpen,
    title: 'Blog Asia',
    description: 'Статьи и гайды',
    color: 'blue' as const,
    requiresAuth: false,
  },
  {
    href: '/guru',
    icon: MapPin,
    title: 'Guru Asia',
    description: 'Рядом со мной',
    color: 'blue' as const,
    requiresAuth: true,
  },
  {
    href: '/rielt',
    icon: Building,
    title: 'Rielt.Market',
    description: 'Поиск жилья',
    color: 'emerald' as const,
    requiresAuth: true,
  },
  {
    href: '/quest',
    icon: Target,
    title: 'Quest Asia',
    description: 'Квесты и челленджи',
    color: 'purple' as const,
    requiresAuth: true,
  },
  {
    href: '/rf',
    icon: Handshake,
    title: 'Russian Friendly',
    description: 'Партнеры и скидки',
    color: 'blue' as const,
    requiresAuth: true,
  },
  {
    href: '/space',
    icon: Users,
    title: 'Space Asia',
    description: 'Социальная сеть',
    color: 'blue' as const,
    requiresAuth: true,
  },
  {
    href: '/connect',
    icon: Wallet,
    title: 'Connect Asia',
    description: 'Баланс и награды',
    color: 'amber' as const,
    requiresAuth: true,
  },
];

const popularPlaces = [
  {
    type: 'Страна',
    name: 'Бангкок',
    country: 'Таиланд',
    image: '/images/bangkok.jpg',
  },
  {
    type: 'Город',
    name: 'Чиангмай',
    country: 'Таиланд',
    image: '/images/chiangmai.jpg',
  },
  {
    type: 'Город',
    name: 'Пхукет',
    country: 'Таиланд',
    image: '/images/phuket.jpg',
  },
  {
    type: 'Остров',
    name: 'Бали',
    country: 'Индонезия',
    image: '/images/bali.jpg',
  },
];

const events = [
  {
    date: '23 ноября',
    location: 'Бангкок',
    title: 'Meetup цифровых кочевников',
    image: '/images/event-nomads.jpg',
  },
  {
    date: '24 ноября',
    location: 'Чиангмай',
    title: 'Йога и медитация на рассвете',
    image: '/images/event-yoga.jpg',
  },
  {
    date: '25 ноября',
    location: 'Пхукет',
    title: 'Фестиваль уличной еды',
    image: '/images/event-food.jpg',
  },
];

const benefits = [
  {
    icon: Users2,
    title: 'Живое сообщество Go2Asia',
    description:
      'Знакомьтесь с людьми, делитесь опытом, находите ответы на любые вопросы о ЮВА.',
    actionText: 'Перейти в Space Asia',
    color: 'blue' as const,
  },
  {
    icon: Users2,
    title: 'Путешествуйте командой',
    description:
      'Создавайте небольшие команды друзей и единомышленников, планируйте поездки и квесты вместе.',
    actionText: 'Создать группу в Space',
    color: 'purple' as const,
  },
  {
    icon: Gift,
    title: 'Скидки у Russian Friendly-партнёров',
    description:
      'Кафе, отели, коворкинги и сервисы, где вас понимают и дают бонусы по Go2Asia.',
    actionText: 'Смотреть партнёрские места',
    color: 'emerald' as const,
  },
  {
    icon: TrendingUp,
    title: 'Реферальная программа',
    description:
      'Приглашайте друзей в Go2Asia и получайте вознаграждения за их активность.',
    actionText: 'Получить свою реферальную ссылку',
    color: 'yellow' as const,
  },
  {
    icon: Award,
    title: 'Награды за активность',
    description:
      'Публикуйте посты, проходите квесты, помогайте новичкам и копите Points и NFT-бейджи.',
    actionText: 'Открыть профиль наград',
    color: 'indigo' as const,
  },
  {
    icon: Crosshair,
    title: 'Открывайте Азию через квесты',
    description:
      'Маршруты, челленджи и задания в любимых городах. Выполняйте миссии и получайте бонусы.',
    actionText: 'Смотреть квесты',
    color: 'rose' as const,
  },
];

const rewards = [
  {
    id: '1',
    icon: 'star' as const,
    text: '+50 Points за публикацию поста',
    timeAgo: '2 часа назад',
  },
  {
    id: '2',
    icon: 'gem' as const,
    text: 'Получен NFT "Исследователь Чиангмая"',
    timeAgo: '1 день назад',
  },
  {
    id: '3',
    icon: 'target' as const,
    text: 'Достигнут уровень 12',
    timeAgo: '3 дня назад',
  },
];

export function HomePageContent() {
  return (
    <div className="min-h-screen bg-white pb-20 pt-16">
      {/* Hero Section или Personal Welcome */}
      {isAuthenticated ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <PersonalWelcome
            userName="Анна Петрова"
            currentLocation="Паттайя, Таиланд"
            level={12}
            levelProgress={75}
            pointsToNextLevel={335}
            pointsBalance={3450}
            unfinishedNFTs={5}
            teamMembers={7}
            activeQuests={2}
            onContinueQuest={() => console.log('Продолжить квест')}
            onNewVouchers={() => console.log('Новые ваучеры')}
            onReferralLink={() => console.log('Реферальная ссылка')}
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <HeroSection
            primaryAction={
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-sky-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Зарегистрироваться
                <ArrowRight size={18} />
              </Link>
            }
            secondaryAction={
              <Link
                href="/atlas"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl transition-all"
              >
                Посмотреть контент
              </Link>
            }
          />
        </div>
      )}

      {/* Location Prompt - только для авторизованных */}
      {isAuthenticated && (
        <LocationPrompt
          onAllowLocation={() => console.log('Разрешить геолокацию')}
          onManualCity={() => console.log('Указать город вручную')}
        />
      )}

      {/* Rewards List - только для авторизованных */}
      {isAuthenticated && <RewardsList rewards={rewards} />}

      {/* Modules Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 md:mb-12">
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Модули экосистемы
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            Выберите модуль, чтобы начать исследование
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {modules.map((module) => (
            <Link key={module.href} href={module.href}>
              <ModuleCard
                icon={module.icon}
                title={module.title}
                description={module.description}
                color={module.color}
                requiresAuth={module.requiresAuth}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Places Section */}
      <section className="bg-slate-50 py-8 md:py-12 mb-8 md:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Популярно сейчас
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              Самые посещаемые места и контент
            </p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {popularPlaces.map((place, index) => (
              <div key={index} className="flex-shrink-0 w-48 md:w-64">
                <PopularPlacesCard
                  type={place.type}
                  name={place.name}
                  country={place.country}
                  image={place.image}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              События этой недели
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              Предстоящие мероприятия
            </p>
          </div>
          <Link
            href="/pulse"
            className="text-sm font-medium text-sky-600 hover:text-sky-700 hidden md:inline"
          >
            Смотреть все →
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {events.map((event, index) => (
            <div key={index} className="flex-shrink-0 w-72">
              <EventCard
                date={event.date}
                location={event.location}
                title={event.title}
                image={event.image}
              />
            </div>
          ))}
        </div>
        <div className="text-center md:hidden mt-4">
          <Link
            href="/pulse"
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            Смотреть все →
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-slate-50 py-8 md:py-12 mb-8 md:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Зачем вступать в экосистему Go2Asia?
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              Больше чем просто информация о путешествиях — целая экосистема
              возможностей
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                actionText={benefit.actionText}
                color={benefit.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner - только для неавторизованных */}
      {!isAuthenticated && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 md:mb-12">
          <CTABanner
            title="Присоединяйтесь к сообществу"
            description="Получите доступ ко всем возможностям экосистемы, зарабатывайте награды и находите единомышленников"
            primaryAction={
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all"
              >
                Зарегистрироваться
                <ArrowRight size={20} />
              </Link>
            }
            secondaryAction={
              <Link
                href="/about"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all"
              >
                Узнать больше
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}

