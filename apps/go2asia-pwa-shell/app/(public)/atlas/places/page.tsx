import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { Globe } from 'lucide-react';
import { AtlasMainNav } from '@/modules/atlas';
import { AtlasSearchBar } from '@/modules/atlas';
import { Card, CardContent, Badge, Chip } from '@go2asia/ui';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Места Юго-Восточной Азии | Atlas Asia',
  description:
    'Каталог мест Atlas Asia: города, достопримечательности, Russian Friendly локации и партнёрские заведения.',
  openGraph: {
    title: 'Места Юго-Восточной Азии',
    description: 'Каталог мест Atlas Asia: города, достопримечательности, Russian Friendly локации и партнёрские заведения.',
    type: 'website',
  },
};

// Моковые данные мест для демонстрации
const mockPlaces = [
  {
    id: 'grand-palace-bangkok',
    title: 'Большой дворец',
    city: 'Бангкок',
    country: 'Таиланд',
    heroImage: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    rating: 4.8,
    reviewsCount: 1234,
    tags: ['храм', 'культура'],
    isPartner: false,
    isPopular: true,
  },
  {
    id: 'hoan-kiem-lake',
    title: 'Озеро Хоан Кием',
    city: 'Ханой',
    country: 'Вьетнам',
    heroImage: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
    rating: 4.6,
    reviewsCount: 892,
    tags: ['парк', 'природа'],
    isPartner: false,
    isPopular: true,
  },
  {
    id: 'borobudur',
    title: 'Храмовый комплекс Боробудур',
    city: 'Джокьякарта',
    country: 'Индонезия',
    heroImage: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
    rating: 4.9,
    reviewsCount: 2156,
    tags: ['храм', 'культура'],
    isPartner: false,
    isPopular: true,
  },
  {
    id: 'petronas-towers',
    title: 'Башни Петронас',
    city: 'Куала-Лумпур',
    country: 'Малайзия',
    heroImage: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    rating: 4.7,
    reviewsCount: 1456,
    tags: ['архитектура', 'viewpoint'],
    isPartner: false,
    isPopular: true,
  },
  {
    id: 'marina-bay',
    title: 'Марина Бэй',
    city: 'Сингапур',
    country: 'Сингапур',
    heroImage: 'https://images.pexels.com/photos/774691/pexels-photo-774691.jpeg',
    rating: 4.9,
    reviewsCount: 2345,
    tags: ['парк', 'viewpoint'],
    isPartner: true,
    isPopular: true,
  },
  {
    id: 'angkor-wat',
    title: 'Ангкор-Ват',
    city: 'Сиемреап',
    country: 'Камбоджа',
    heroImage: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    rating: 4.9,
    reviewsCount: 3124,
    tags: ['храм', 'культура'],
    isPartner: false,
    isPopular: true,
  },
];

export default function PlacesIndexPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Globe}
        title="Atlas Asia"
        description="«Живой» вики-справочник по странам Юго-Восточной Азии с UGC и редакционной поддержкой"
        gradientFrom="from-sky-500"
        gradientTo="to-sky-600"
      />

      {/* Top controls: internal nav + search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <AtlasMainNav />
        <AtlasSearchBar />
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap gap-2 mb-6">
          <Chip>Все типы</Chip>
          <Chip>Природа</Chip>
          <Chip>Храмы</Chip>
          <Chip>Рынки</Chip>
          <Chip>Парки</Chip>
          <Chip>Viewpoint</Chip>
          <Chip>Пляжи</Chip>
          <Chip>Музеи</Chip>
        </div>
      </section>

      {/* Places Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-6">
          Топовые места
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPlaces.map((place) => (
            <Link key={place.id} href={`/atlas/places/${place.id}`}>
              <Card hover className="h-full">
                {place.heroImage && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={place.heroImage}
                      alt={place.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      {place.isPartner && (
                        <Badge variant="verified" className="text-xs">
                          Партнёр
                        </Badge>
                      )}
                      {place.isPopular && (
                        <Badge variant="popular" className="bg-amber-100 text-amber-800 text-xs">
                          Популярно
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                <CardContent className="p-5">
                  <h3 className="text-h3 md:text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                    {place.title}
                  </h3>
                  {(place.city || place.country) && (
                    <div className="flex items-center gap-1 text-sm text-slate-600 mb-3">
                      <MapPin size={14} />
                      <span>{[place.city, place.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                  {place.tags && place.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {place.tags.map((tag, index) => (
                        <Chip key={index} size="sm" className="text-xs">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    {place.rating && (
                      <span className="flex items-center gap-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{place.rating}</span>
                      </span>
                    )}
                    {place.reviewsCount && (
                      <span>{place.reviewsCount.toLocaleString('ru-RU')} отзывов</span>
                    )}
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
