import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@go2asia/ui';
import { MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Atlas Asia - Путеводитель по Юго-Восточной Азии | Go2Asia',
  description: 'Исследуйте страны, города и места Юго-Восточной Азии с Go2Asia Atlas',
  openGraph: {
    title: 'Atlas Asia - Путеводитель по Юго-Восточной Азии',
    description: 'Исследуйте страны, города и места Юго-Восточной Азии',
    type: 'website',
  },
};

// Mock данные - в будущем будут из API
const countries = [
  {
    id: 'thailand',
    name: 'Таиланд',
    flag: '🇹🇭',
    placesCount: 245,
    description: 'Королевство Таиланд',
  },
  {
    id: 'vietnam',
    name: 'Вьетнам',
    flag: '🇻🇳',
    placesCount: 189,
    description: 'Социалистическая Республика Вьетнам',
  },
  {
    id: 'indonesia',
    name: 'Индонезия',
    flag: '🇮🇩',
    placesCount: 312,
    description: 'Республика Индонезия',
  },
];

const popularPlaces = [
  {
    id: '1',
    title: 'Большой дворец, Бангкок',
    city: 'Бангкок',
    country: 'Таиланд',
    rating: 4.8,
    reviewsCount: 1234,
  },
  {
    id: '2',
    title: 'Ханойская цитадель',
    city: 'Ханой',
    country: 'Вьетнам',
    rating: 4.6,
    reviewsCount: 892,
  },
  {
    id: '3',
    title: 'Храмовый комплекс Боробудур',
    city: 'Джокьякарта',
    country: 'Индонезия',
    rating: 4.9,
    reviewsCount: 2156,
  },
];

export default function AtlasPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            🌏 Atlas Asia
          </h1>
          <p className="text-lg text-slate-600">
            Справочник мест Юго-Восточной Азии
          </p>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Страны</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country) => (
            <Link key={country.id} href={`/atlas/countries/${country.id}`}>
              <Card hover className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{country.flag}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {country.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3">
                        {country.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={16} />
                        <span>{country.placesCount} мест</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Places */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Популярные места
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularPlaces.map((place) => (
            <Link key={place.id} href={`/atlas/places/${place.id}`}>
              <Card hover>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                    {place.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    {place.city}, {place.country}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="text-amber-500">⭐</span>
                      {place.rating}
                    </span>
                    <span>{place.reviewsCount} отзывов</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
