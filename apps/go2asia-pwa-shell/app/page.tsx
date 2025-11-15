import Link from 'next/link';
import { MapPin, Calendar, BookOpen, Users, Target, Handshake, Building, Wallet } from 'lucide-react';
import { Card, CardContent } from '@go2asia/ui';

const modules = [
  {
    href: '/atlas',
    icon: MapPin,
    title: 'Atlas Asia',
    description: 'Справочник мест',
    color: 'text-blue-600',
  },
  {
    href: '/pulse',
    icon: Calendar,
    title: 'Pulse Asia',
    description: 'События и мероприятия',
    color: 'text-purple-600',
  },
  {
    href: '/blog',
    icon: BookOpen,
    title: 'Blog Asia',
    description: 'Статьи и истории',
    color: 'text-green-600',
  },
  {
    href: '/space',
    icon: Users,
    title: 'Space Asia',
    description: 'Социальная сеть',
    color: 'text-pink-600',
  },
  {
    href: '/quest',
    icon: Target,
    title: 'Quest Asia',
    description: 'Квесты и миссии',
    color: 'text-orange-600',
  },
  {
    href: '/rf',
    icon: Handshake,
    title: 'Russian Friendly',
    description: 'Партнёрские места',
    color: 'text-red-600',
  },
  {
    href: '/rielt',
    icon: Building,
    title: 'Rielt.Market',
    description: 'Аренда жилья',
    color: 'text-indigo-600',
  },
  {
    href: '/connect',
    icon: Wallet,
    title: 'Connect Asia',
    description: 'Кошелёк и достижения',
    color: 'text-amber-600',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              🌏 Go2Asia
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Экосистема путешествий в Юго-Восточной Азии
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/atlas"
                className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white rounded-lg
                         hover:bg-sky-700 shadow-sm hover:shadow-md transition-all font-medium"
              >
                Начать путешествие
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg
                         hover:bg-slate-50 transition-colors font-medium"
              >
                Узнать больше
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Launch Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
          Модули экосистемы
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.href} href={module.href}>
                <Card hover className="h-full">
                  <CardContent className="flex flex-col items-center text-center p-6">
                    <div className={`mb-3 ${module.color}`}>
                      <Icon size={32} />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {module.title}
                    </h3>
                    <p className="text-sm text-slate-600">{module.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Преимущества Go2Asia
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Актуальная информация о местах
                </h3>
                <p className="text-sm text-slate-600">
                  Проверенные данные о странах, городах и локациях
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  События и мероприятия рядом
                </h3>
                <p className="text-sm text-slate-600">
                  Календарь актуальных событий в регионе
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Сообщество путешественников
                </h3>
                <p className="text-sm text-slate-600">
                  Обмен опытом и советами с единомышленниками
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Квесты и награды
                </h3>
                <p className="text-sm text-slate-600">
                  Геймификация путешествий с наградами
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Партнёрские скидки
                </h3>
                <p className="text-sm text-slate-600">
                  Специальные предложения от Russian Friendly партнёров
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Поиск жилья
                </h3>
                <p className="text-sm text-slate-600">
                  Удобный поиск аренды жилья в регионе
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
