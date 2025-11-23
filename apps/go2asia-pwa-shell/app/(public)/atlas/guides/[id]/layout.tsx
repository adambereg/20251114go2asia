'use client';

import type { ReactNode } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AtlasGuideLayout } from '@/modules/atlas';
import {
  Info,
  Route,
  Map,
  MapPin,
  HelpCircle,
  Calendar,
  MessageCircle,
  History,
} from 'lucide-react';

// Моковые данные для разных гайдов (fallback, если API не работает)
const mockGuides: Record<string, { title: string; cityName?: string; countryName: string; heroImageUrl: string; heroImageAlt: string; guideType: string; readingTime: number; duration?: string; tags: string[]; rating: number }> = {
  '3-days-hanoi': {
    title: '3 дня в Ханое',
    cityName: 'Ханой',
    countryName: 'Вьетнам',
    heroImageUrl: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
    heroImageAlt: '3 дня в Ханое',
    guideType: 'Маршруты и планы',
    readingTime: 15,
    duration: '3 дня',
    tags: ['культура', 'еда'],
    rating: 4.8,
  },
  'visa-thailand': {
    title: 'Визы в Таиланд: полное руководство',
    countryName: 'Таиланд',
    heroImageUrl: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    heroImageAlt: 'Визы в Таиланд',
    guideType: 'Практика и документы',
    readingTime: 20,
    tags: ['визы', 'документы'],
    rating: 4.9,
  },
  'phuket-week': {
    title: 'Неделя на Пхукете',
    cityName: 'Пхукет',
    countryName: 'Таиланд',
    heroImageUrl: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    heroImageAlt: 'Неделя на Пхукете',
    guideType: 'Маршруты и планы',
    readingTime: 25,
    duration: '7 дней',
    tags: ['пляжи', 'отдых'],
    rating: 4.7,
  },
  'top-beaches': {
    title: 'Топ-10 пляжей ЮВА',
    countryName: 'Юго-Восточная Азия',
    heroImageUrl: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
    heroImageAlt: 'Топ-10 пляжей ЮВА',
    guideType: 'Подборки мест',
    readingTime: 12,
    tags: ['пляжи', 'природа'],
    rating: 4.6,
  },
  'new-year-vietnam': {
    title: 'Новый год во Вьетнаме',
    countryName: 'Вьетнам',
    heroImageUrl: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
    heroImageAlt: 'Новый год во Вьетнаме',
    guideType: 'Сезонные/ивентные',
    readingTime: 18,
    tags: ['события', 'праздники'],
    rating: 4.5,
  },
  'bangkok-digital-nomad': {
    title: 'Бангкок для digital nomad',
    cityName: 'Бангкок',
    countryName: 'Таиланд',
    heroImageUrl: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    heroImageAlt: 'Бангкок для digital nomad',
    guideType: 'Жизнь на месте',
    readingTime: 30,
    tags: ['работа', 'коворкинги'],
    rating: 4.8,
  },
};

const sideNavItems = [
  { key: 'overview', label: 'Обзор', icon: Info, href: '' },
  { key: 'route', label: 'Маршрут / План', icon: Route, href: 'route' },
  { key: 'map', label: 'Карта', icon: Map, href: 'map' },
  { key: 'places', label: 'Подборки мест', icon: MapPin, href: 'places' },
  { key: 'tips', label: 'Практическая информация', icon: HelpCircle, href: 'tips' },
  { key: 'events', label: 'События рядом', icon: Calendar, href: 'events' },
  { key: 'reviews', label: 'Отзывы и опыт', icon: MessageCircle, href: 'reviews' },
  { key: 'versions', label: 'Версии / Обновления', icon: History, href: 'versions' },
] as const;

interface GuideData {
  title: string;
  cityName?: string;
  countryName?: string;
  heroImage?: string;
  guideType?: string;
  readingTime?: number;
  duration?: string;
  tags?: string[];
  rating?: number;
  updatedAt?: string;
}

export default function GuideLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const guideIdFromUrl = params?.id as string;
  const guideId = pathname.split('/').slice(0, 4).join('/'); // /atlas/guides/[id]

  const [guideData, setGuideData] = useState<GuideData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем данные гайда из API
  useEffect(() => {
    if (!guideIdFromUrl) {
      setIsLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
    fetch(`${apiUrl}/v1/api/content/guides/${guideIdFromUrl}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data) {
          setGuideData(data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [guideIdFromUrl]);

  // Определяем данные гайда: сначала из API, потом из моков, потом дефолт
  const guideIdKey = guideIdFromUrl?.toLowerCase() || '';
  const fallbackMockGuide = mockGuides[guideIdKey] || mockGuides['3-days-hanoi'];
  
  const title = guideData?.title || fallbackMockGuide.title;
  const cityName = guideData?.cityName || fallbackMockGuide.cityName;
  const countryName = guideData?.countryName || fallbackMockGuide.countryName;
  const heroImageUrl = guideData?.heroImage || fallbackMockGuide.heroImageUrl;
  const heroImageAlt = guideData?.title || fallbackMockGuide.heroImageAlt;
  const guideType = guideData?.guideType || fallbackMockGuide.guideType;
  const readingTime = guideData?.readingTime || fallbackMockGuide.readingTime;
  const duration = guideData?.duration || fallbackMockGuide.duration;
  const tags = guideData?.tags || fallbackMockGuide.tags;
  const rating = guideData?.rating || fallbackMockGuide.rating;
  const lastUpdatedAt = guideData?.updatedAt
    ? `Последнее обновление: ${new Date(guideData.updatedAt).toLocaleDateString('ru-RU')}`
    : 'Последнее обновление: 17.11.2025';

  return (
    <AtlasGuideLayout
      title={title}
      cityName={cityName}
      countryName={countryName}
      guideType={guideType}
      readingTime={readingTime}
      duration={duration}
      isEditor={true}
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
                const href = item.href === '' ? guideId : `${guideId}/${item.href}`;
                const isActive =
                  item.href === '' ? pathname === guideId : pathname === href;
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
                  const href = item.href === '' ? guideId : `${guideId}/${item.href}`;
                  const isActive =
                    item.href === '' ? pathname === guideId : pathname === href;
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
    </AtlasGuideLayout>
  );
}

