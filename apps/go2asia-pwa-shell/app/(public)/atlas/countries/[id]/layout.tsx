'use client';

import type { ReactNode } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AtlasCountryLayout } from '@/modules/atlas';
import {
  Info,
  Image,
  Map,
  Building2,
  CloudSun,
  History,
  Globe2,
  Palette,
  Home,
  BadgeCheck,
  Briefcase,
  Landmark,
  MessageCircle,
  Star,
  Calculator,
} from 'lucide-react';

// Моковые данные для разных стран (fallback, если API не работает)
const mockCountries: Record<string, { name: string; flagEmoji: string; heroImageUrl: string; heroImageAlt: string }> = {
  vietnam: {
    name: 'Вьетнам',
    flagEmoji: '🇻🇳',
    heroImageUrl: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
    heroImageAlt: 'Вьетнам',
  },
  thailand: {
    name: 'Таиланд',
    flagEmoji: '🇹🇭',
    heroImageUrl: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    heroImageAlt: 'Таиланд',
  },
  indonesia: {
    name: 'Индонезия',
    flagEmoji: '🇮🇩',
    heroImageUrl: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
    heroImageAlt: 'Индонезия',
  },
  malaysia: {
    name: 'Малайзия',
    flagEmoji: '🇲🇾',
    heroImageUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    heroImageAlt: 'Малайзия',
  },
  singapore: {
    name: 'Сингапур',
    flagEmoji: '🇸🇬',
    heroImageUrl: 'https://images.pexels.com/photos/774691/pexels-photo-774691.jpeg',
    heroImageAlt: 'Сингапур',
  },
  philippines: {
    name: 'Филиппины',
    flagEmoji: '🇵🇭',
    heroImageUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    heroImageAlt: 'Филиппины',
  },
  cambodia: {
    name: 'Камбоджа',
    flagEmoji: '🇰🇭',
    heroImageUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    heroImageAlt: 'Камбоджа',
  },
  laos: {
    name: 'Лаос',
    flagEmoji: '🇱🇦',
    heroImageUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    heroImageAlt: 'Лаос',
  },
  myanmar: {
    name: 'Мьянма',
    flagEmoji: '🇲🇲',
    heroImageUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    heroImageAlt: 'Мьянма',
  },
};

const sideNavItems = [
  { key: 'overview', label: 'Обзор', icon: Info, href: '' },
  { key: 'gallery', label: 'Фотогалерея', icon: Image, href: 'gallery' },
  { key: 'map', label: 'Карта', icon: Map, href: 'map' },
  { key: 'cities', label: 'Города', icon: Building2, href: 'cities' },
  { key: 'weather', label: 'Погода и климат', icon: CloudSun, href: 'weather' },
  { key: 'history', label: 'История', icon: History, href: 'history' },
  { key: 'geography', label: 'География', icon: Globe2, href: 'geography' },
  { key: 'culture', label: 'Культура', icon: Palette, href: 'culture' },
  { key: 'living', label: 'Проживание', icon: Home, href: 'living' },
  { key: 'visas', label: 'Визы', icon: BadgeCheck, href: 'visas' },
  { key: 'business', label: 'Бизнес', icon: Briefcase, href: 'business' },
  { key: 'sights', label: 'Достопримечательности', icon: Landmark, href: 'places' },
  { key: 'phrasebook', label: 'Разговорник', icon: MessageCircle, href: 'phrasebook' },
  { key: 'reviews', label: 'Отзывы экспатов', icon: Star, href: 'reviews' },
  { key: 'calculator', label: 'Калькулятор стоимости', icon: Calculator, href: 'calculator' },
] as const;

interface CountryData {
  name: string;
  flag?: string;
  heroImage?: string;
  updatedAt?: string;
}

export default function CountryLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const countryIdFromUrl = params?.id as string;
  const countryId = pathname.split('/').slice(0, 4).join('/'); // /atlas/countries/[id]

  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем данные страны из API
  useEffect(() => {
    if (!countryIdFromUrl) {
      setIsLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
    fetch(`${apiUrl}/v1/api/content/countries/${countryIdFromUrl}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data) {
          setCountryData(data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [countryIdFromUrl]);

  // Определяем данные страны: сначала из API, потом из моков, потом дефолт
  const countryIdKey = countryIdFromUrl?.toLowerCase() || '';
  const mockCountry = mockCountries[countryIdKey] || mockCountries.vietnam;
  
  const countryName = countryData?.name || mockCountry.name;
  const flagEmoji = countryData?.flag || mockCountry.flagEmoji;
  const heroImageUrl = countryData?.heroImage || mockCountry.heroImageUrl;
  const heroImageAlt = countryData?.name || mockCountry.heroImageAlt;
  const lastUpdatedAt = countryData?.updatedAt
    ? `Последнее обновление: ${new Date(countryData.updatedAt).toLocaleDateString('ru-RU')}`
    : 'Последнее обновление: 17.11.2025';

  return (
    <AtlasCountryLayout
      countryName={countryName}
      flagEmoji={flagEmoji || '🌏'}
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
                const href = item.href === '' ? countryId : `${countryId}/${item.href}`;
                const isActive =
                  item.href === '' ? pathname === countryId : pathname === href;
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
                  const href = item.href === '' ? countryId : `${countryId}/${item.href}`;
                  const isActive =
                    item.href === '' ? pathname === countryId : pathname === href;
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
    </AtlasCountryLayout>
  );
}


