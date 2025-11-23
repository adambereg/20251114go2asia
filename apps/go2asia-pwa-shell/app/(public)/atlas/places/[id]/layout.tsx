'use client';

import type { ReactNode } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AtlasPlaceLayout } from '@/modules/atlas';
import {
  Info,
  Image,
  Map,
  BookOpen,
  MapPin,
  UtensilsCrossed,
  Route,
  HelpCircle,
  Star,
  Gift,
} from 'lucide-react';

// Моковые данные для разных мест (fallback, если API не работает)
const mockPlaces: Record<string, { title: string; cityName: string; countryName: string; heroImageUrl: string; heroImageAlt: string; tags: string[]; rating: number }> = {
  'grand-palace-bangkok': {
    title: 'Большой дворец',
    cityName: 'Бангкок',
    countryName: 'Таиланд',
    heroImageUrl: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    heroImageAlt: 'Большой дворец, Бангкок',
    tags: ['храм', 'культура'],
    rating: 4.8,
  },
  'hoan-kiem-lake': {
    title: 'Озеро Хоан Кием',
    cityName: 'Ханой',
    countryName: 'Вьетнам',
    heroImageUrl: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
    heroImageAlt: 'Озеро Хоан Кием, Ханой',
    tags: ['парк', 'природа'],
    rating: 4.6,
  },
  'borobudur': {
    title: 'Храмовый комплекс Боробудур',
    cityName: 'Джокьякарта',
    countryName: 'Индонезия',
    heroImageUrl: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
    heroImageAlt: 'Храмовый комплекс Боробудур',
    tags: ['храм', 'культура'],
    rating: 4.9,
  },
  'petronas-towers': {
    title: 'Башни Петронас',
    cityName: 'Куала-Лумпур',
    countryName: 'Малайзия',
    heroImageUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    heroImageAlt: 'Башни Петронас',
    tags: ['архитектура', 'viewpoint'],
    rating: 4.7,
  },
  'marina-bay': {
    title: 'Марина Бэй',
    cityName: 'Сингапур',
    countryName: 'Сингапур',
    heroImageUrl: 'https://images.pexels.com/photos/774691/pexels-photo-774691.jpeg',
    heroImageAlt: 'Марина Бэй',
    tags: ['парк', 'viewpoint'],
    rating: 4.9,
  },
  'angkor-wat': {
    title: 'Ангкор-Ват',
    cityName: 'Сиемреап',
    countryName: 'Камбоджа',
    heroImageUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    heroImageAlt: 'Ангкор-Ват',
    tags: ['храм', 'культура'],
    rating: 4.9,
  },
};

const sideNavItems = [
  { key: 'overview', label: 'Обзор', icon: Info, href: '' },
  { key: 'gallery', label: 'Галерея', icon: Image, href: 'gallery' },
  { key: 'map', label: 'На карте', icon: Map, href: 'map' },
  { key: 'history', label: 'История и факты', icon: BookOpen, href: 'history' },
  { key: 'nearby-places', label: 'Достопримечательности рядом', icon: MapPin, href: 'nearby-places' },
  { key: 'nearby-services', label: 'Что рядом', icon: UtensilsCrossed, href: 'nearby-services' },
  { key: 'guides', label: 'Гайды, маршруты', icon: Route, href: 'guides' },
  { key: 'tips', label: 'Практическая информация', icon: HelpCircle, href: 'tips' },
  { key: 'reviews', label: 'Отзывы', icon: Star, href: 'reviews' },
  { key: 'partners', label: 'Партнёрские предложения', icon: Gift, href: 'partners' },
] as const;

interface PlaceData {
  title: string;
  cityName?: string;
  countryName?: string;
  heroImage?: string;
  tags?: string[];
  rating?: number;
  updatedAt?: string;
}

export default function PlaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const placeIdFromUrl = params?.id as string;
  const placeId = pathname.split('/').slice(0, 4).join('/'); // /atlas/places/[id]

  const [placeData, setPlaceData] = useState<PlaceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем данные места из API
  useEffect(() => {
    if (!placeIdFromUrl) {
      setIsLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
    fetch(`${apiUrl}/v1/api/content/places/${placeIdFromUrl}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data) {
          setPlaceData(data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [placeIdFromUrl]);

  // Определяем данные места: сначала из API, потом из моков, потом дефолт
  const placeIdKey = placeIdFromUrl?.toLowerCase() || '';
  const fallbackMockPlace = mockPlaces[placeIdKey] || mockPlaces['grand-palace-bangkok'];
  
  const title = placeData?.title || fallbackMockPlace.title;
  const cityName = placeData?.cityName || fallbackMockPlace.cityName;
  const countryName = placeData?.countryName || fallbackMockPlace.countryName;
  const heroImageUrl = placeData?.heroImage || fallbackMockPlace.heroImageUrl;
  const heroImageAlt = placeData?.title || fallbackMockPlace.heroImageAlt;
  const tags = placeData?.tags || fallbackMockPlace.tags;
  const rating = placeData?.rating || fallbackMockPlace.rating;
  const lastUpdatedAt = placeData?.updatedAt
    ? `Последнее обновление: ${new Date(placeData.updatedAt).toLocaleDateString('ru-RU')}`
    : 'Последнее обновление: 17.11.2025';

  return (
    <AtlasPlaceLayout
      title={title}
      cityName={cityName}
      countryName={countryName}
      isRussianFriendly={placeIdKey.includes('marina')}
      isPartner={placeIdKey.includes('marina')}
      isPopular={true}
      rating={rating}
      tags={tags}
      lastUpdatedAt={lastUpdatedAt}
      viewsCount={1234}
      heroImageUrl={heroImageUrl}
      heroImageAlt={heroImageAlt}
    >
      <div className="space-y-6">
        {/* Горизонтальное меню для мобильных */}
        <div className="lg:hidden">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="font-semibold text-slate-900 mb-3 text-sm">
              Структура справочника
            </div>
            <nav className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3">
              {sideNavItems.map((item) => {
                const Icon = item.icon;
                const href = item.href === '' ? placeId : `${placeId}/${item.href}`;
                const isActive =
                  item.href === '' ? pathname === placeId : pathname === href;
                return (
                  <Link
                    key={item.key}
                    href={href}
                    className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 min-w-[80px] transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-sky-50 text-sky-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs text-center leading-tight">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Основной контент с вертикальным меню на десктопе */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          {/* Вертикальное меню для десктопа */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm">
              <div className="font-semibold text-slate-900 mb-3">
                Структура справочника
              </div>
              <nav className="space-y-1">
                {sideNavItems.map((item) => {
                  const Icon = item.icon;
                  const href = item.href === '' ? placeId : `${placeId}/${item.href}`;
                  const isActive =
                    item.href === '' ? pathname === placeId : pathname === href;
                  return (
                    <Link
                      key={item.key}
                      href={href}
                      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors ${
                        isActive
                          ? 'bg-sky-50 text-sky-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Контент */}
          <section>{children}</section>
        </div>
      </div>
    </AtlasPlaceLayout>
  );
}

