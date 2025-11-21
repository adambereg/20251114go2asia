import type { Metadata } from 'next';
import { Badge, Card, CardContent, Chip } from '@go2asia/ui';
import { MapPin, Clock, Eye, CheckCircle2 } from 'lucide-react';

// Mock данные - в будущем из API
const countryData: Record<string, any> = {
  thailand: {
    name: 'Таиланд',
    flag: '🇹🇭',
    description: 'Королевство Таиланд — страна в Юго-Восточной Азии',
    cities: ['Бангкок', 'Пхукет', 'Чиангмай', 'Паттайя'],
    popularPlaces: [
      {
        id: '1',
        title: 'Большой дворец',
        city: 'Бангкок',
        rating: 4.8,
        reviewsCount: 1234,
      },
      {
        id: '2',
        title: 'Храм Изумрудного Будды',
        city: 'Бангкок',
        rating: 4.7,
        reviewsCount: 987,
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const country = countryData[id];
  return {
    title: `${country?.name || 'Страна'} - Atlas Asia | Go2Asia`,
    description: `Информация о ${country?.name || 'стране'} в Atlas Asia`,
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const country = countryData[id] || {
    name: 'Страна',
    flag: '🌏',
    description: 'Описание страны',
    cities: [],
    popularPlaces: [],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <a href="/atlas" className="hover:text-sky-600">
              Atlas
            </a>
            <span>/</span>
            <span className="text-slate-900">{country.name}</span>
          </nav>

          {/* Title & Meta */}
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl">{country.flag}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {country.name}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="verified">
                  Проверено редакцией
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Обновлено 2 дня назад
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  1,234 просмотра
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8 -mb-px overflow-x-auto">
            <button className="py-3 px-1 border-b-2 border-sky-600 text-sky-600 font-medium text-sm whitespace-nowrap">
              Обзор
            </button>
            <button className="py-3 px-1 border-b-2 border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 font-medium text-sm whitespace-nowrap">
              Визы
            </button>
            <button className="py-3 px-1 border-b-2 border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 font-medium text-sm whitespace-nowrap">
              Жильё
            </button>
            <button className="py-3 px-1 border-b-2 border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 font-medium text-sm whitespace-nowrap">
              Транспорт
            </button>
          </nav>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Editorial Content */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Обзор</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed mb-4">
              {country.description}
            </p>
            <p className="text-slate-700 leading-relaxed">
              Таиланд — одно из самых популярных направлений в Юго-Восточной
              Азии. Страна известна своими пляжами, храмами, богатой культурой
              и гостеприимством местных жителей.
            </p>
          </div>

          {/* Основные города */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Основные города
            </h3>
            <div className="flex flex-wrap gap-2">
              {country.cities.map((city: string) => (
                <Chip key={city}>{city}</Chip>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Places */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Популярные места
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {country.popularPlaces.map((place: any) => (
              <Card key={place.id} hover>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {place.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">{place.city}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="text-amber-500">⭐</span>
                      {place.rating}
                    </span>
                    <span>{place.reviewsCount} отзывов</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* UGC Block Placeholder */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Посты сообщества
            </h2>
            <div className="flex gap-2">
              <Chip selected>Релевантные</Chip>
              <Chip>Новые</Chip>
              <Chip>Полезные</Chip>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-600">
              Посты сообщества появятся здесь после интеграции с Space API
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
