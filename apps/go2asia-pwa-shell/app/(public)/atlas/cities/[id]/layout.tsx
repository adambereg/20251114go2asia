'use client';

import type { ReactNode } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AtlasCityLayout } from '@/modules/atlas';
import {
  Info,
  MapPin,
  Home,
  UtensilsCrossed,
  Landmark,
  Train,
  CloudSun,
  ShoppingBag,
  Moon,
  BookOpen,
  HelpCircle,
  Star,
  Calculator,
} from 'lucide-react';

// Моковые данные для разных городов (fallback, если API не работает)
const mockCities: Record<string, { name: string; nameNative: string; countryName: string; heroImageUrl: string; heroImageAlt: string }> = {
  bangkok: {
    name: 'Бангкок',
    nameNative: 'Bangkok',
    countryName: 'Таиланд',
    heroImageUrl: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    heroImageAlt: 'Бангкок',
  },
  hanoi: {
    name: 'Ханой',
    nameNative: 'Hà Nội',
    countryName: 'Вьетнам',
    heroImageUrl: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
    heroImageAlt: 'Ханой',
  },
  'ho-chi-minh': {
    name: 'Хошимин',
    nameNative: 'Hồ Chí Minh',
    countryName: 'Вьетнам',
    heroImageUrl: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
    heroImageAlt: 'Хошимин',
  },
  vientiane: {
    name: 'Вьентьян',
    nameNative: 'Vientiane',
    countryName: 'Лаос',
    heroImageUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    heroImageAlt: 'Вьентьян',
  },
  'phnom-penh': {
    name: 'Пномпень',
    nameNative: 'Phnom Penh',
    countryName: 'Камбоджа',
    heroImageUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    heroImageAlt: 'Пномпень',
  },
  'kuala-lumpur': {
    name: 'Куала-Лумпур',
    nameNative: 'Kuala Lumpur',
    countryName: 'Малайзия',
    heroImageUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    heroImageAlt: 'Куала-Лумпур',
  },
  manila: {
    name: 'Манила',
    nameNative: 'Manila',
    countryName: 'Филиппины',
    heroImageUrl: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
    heroImageAlt: 'Манила',
  },
  jakarta: {
    name: 'Джакарта',
    nameNative: 'Jakarta',
    countryName: 'Индонезия',
    heroImageUrl: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
    heroImageAlt: 'Джакарта',
  },
  singapore: {
    name: 'Сингапур',
    nameNative: 'Singapore',
    countryName: 'Сингапур',
    heroImageUrl: 'https://images.pexels.com/photos/774691/pexels-photo-774691.jpeg',
    heroImageAlt: 'Сингапур',
  },
  naypyidaw: {
    name: 'Нейпьидо',
    nameNative: 'Naypyidaw',
    countryName: 'Мьянма',
    heroImageUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    heroImageAlt: 'Нейпьидо',
  },
};

const sideNavItems = [
  { key: 'overview', label: 'Обзор', icon: Info, href: '' },
  { key: 'districts', label: 'Районы', icon: MapPin, href: 'districts' },
  { key: 'accommodation', label: 'Проживание', icon: Home, href: 'accommodation' },
  { key: 'food', label: 'Еда и кафе', icon: UtensilsCrossed, href: 'food' },
  { key: 'places', label: 'Достопримечательности', icon: Landmark, href: 'places' },
  { key: 'transport', label: 'Транспорт', icon: Train, href: 'transport' },
  { key: 'weather', label: 'Погода и сезонность', icon: CloudSun, href: 'weather' },
  { key: 'shopping', label: 'Шопинг', icon: ShoppingBag, href: 'shopping' },
  { key: 'nightlife', label: 'Ночная жизнь', icon: Moon, href: 'nightlife' },
  { key: 'guides', label: 'Гайды', icon: BookOpen, href: 'guides' },
  { key: 'tips', label: 'Практическая информация', icon: HelpCircle, href: 'tips' },
  { key: 'reviews', label: 'Отзывы', icon: Star, href: 'reviews' },
  { key: 'budget', label: 'Цены и бюджет', icon: Calculator, href: 'budget' },
] as const;

interface CityData {
  name: string;
  nameNative?: string;
  countryName?: string;
  heroImage?: string;
  updatedAt?: string;
}

export default function CityLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const cityIdFromUrl = params?.id as string;
  const cityId = pathname.split('/').slice(0, 4).join('/'); // /atlas/cities/[id]

  const [cityData, setCityData] = useState<CityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем данные города из API
  useEffect(() => {
    if (!cityIdFromUrl) {
      setIsLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
    fetch(`${apiUrl}/v1/api/content/cities/${cityIdFromUrl}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data) {
          setCityData(data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [cityIdFromUrl]);

  // Определяем данные города: сначала из API, потом из моков, потом дефолт
  const cityIdKey = cityIdFromUrl?.toLowerCase() || '';
  const fallbackMockCity = mockCities[cityIdKey] || mockCities.bangkok;
  
  const cityName = cityData?.name || fallbackMockCity.name;
  const cityNameNative = cityData?.nameNative || fallbackMockCity.nameNative;
  const countryName = cityData?.countryName || fallbackMockCity.countryName;
  const heroImageUrl = cityData?.heroImage || fallbackMockCity.heroImageUrl;
  const heroImageAlt = cityData?.name || fallbackMockCity.heroImageAlt;
  const lastUpdatedAt = cityData?.updatedAt
    ? `Последнее обновление: ${new Date(cityData.updatedAt).toLocaleDateString('ru-RU')}`
    : 'Последнее обновление: 17.11.2025';

  return (
    <AtlasCityLayout
      cityName={cityName}
      cityNameNative={cityNameNative}
      countryName={countryName}
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
                const href = item.href === '' ? cityId : `${cityId}/${item.href}`;
                const isActive =
                  item.href === '' ? pathname === cityId : pathname === href;
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
                  const href = item.href === '' ? cityId : `${cityId}/${item.href}`;
                  const isActive =
                    item.href === '' ? pathname === cityId : pathname === href;
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
    </AtlasCityLayout>
  );
}

