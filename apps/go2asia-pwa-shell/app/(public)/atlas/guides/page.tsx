import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { Globe } from 'lucide-react';
import { AtlasMainNav } from '@/modules/atlas';
import { AtlasSearchBar } from '@/modules/atlas';
import { Card, CardContent, Badge, Chip } from '@go2asia/ui';
import Link from 'next/link';
import { MapPin, Star, BookOpen, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Гайды Atlas Asia',
  description:
    'Подборки и маршруты по странам и городам Юго-Восточной Азии: для новичков, путешественников и PRO-спейсеров.',
  openGraph: {
    title: 'Гайды Atlas Asia',
    description: 'Подборки и маршруты по странам и городам Юго-Восточной Азии',
    type: 'website',
  },
};

// Моковые данные гайдов для демонстрации
const mockGuides = [
  {
    id: '3-days-hanoi',
    title: '3 дня в Ханое',
    city: 'Ханой',
    country: 'Вьетнам',
    heroImage: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
    guideType: 'Маршруты и планы',
    readingTime: 15,
    duration: '3 дня',
    difficulty: 'light' as const,
    audience: ['первый раз'],
    rating: 4.8,
    reviewsCount: 1234,
    isEditor: true,
    tags: ['культура', 'еда'],
  },
  {
    id: 'visa-thailand',
    title: 'Визы в Таиланд: полное руководство',
    country: 'Таиланд',
    heroImage: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    guideType: 'Практика и документы',
    readingTime: 20,
    difficulty: 'medium' as const,
    audience: ['первый раз', 'зимовка'],
    rating: 4.9,
    reviewsCount: 2156,
    isEditor: true,
    tags: ['визы', 'документы'],
  },
  {
    id: 'phuket-week',
    title: 'Неделя на Пхукете',
    city: 'Пхукет',
    country: 'Таиланд',
    heroImage: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    guideType: 'Маршруты и планы',
    readingTime: 25,
    duration: '7 дней',
    difficulty: 'light' as const,
    audience: ['с детьми', 'отдых'],
    rating: 4.7,
    reviewsCount: 1456,
    isEditor: true,
    tags: ['пляжи', 'отдых'],
  },
  {
    id: 'top-beaches',
    title: 'Топ-10 пляжей ЮВА',
    heroImage: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
    guideType: 'Подборки мест',
    readingTime: 12,
    difficulty: 'light' as const,
    audience: ['отдых'],
    rating: 4.6,
    reviewsCount: 892,
    isEditor: true,
    tags: ['пляжи', 'природа'],
  },
  {
    id: 'new-year-vietnam',
    title: 'Новый год во Вьетнаме',
    country: 'Вьетнам',
    heroImage: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
    guideType: 'Сезонные/ивентные',
    readingTime: 18,
    difficulty: 'medium' as const,
    audience: ['события'],
    rating: 4.5,
    reviewsCount: 567,
    isEditor: true,
    tags: ['события', 'праздники'],
  },
  {
    id: 'bangkok-digital-nomad',
    title: 'Бангкок для digital nomad',
    city: 'Бангкок',
    country: 'Таиланд',
    heroImage: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    guideType: 'Жизнь на месте',
    readingTime: 30,
    difficulty: 'medium' as const,
    audience: ['digital nomad', 'зимовка'],
    rating: 4.8,
    reviewsCount: 1890,
    isUGC: true,
    tags: ['работа', 'коворкинги'],
  },
];

export default function GuidesIndexPage() {
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
          <Chip>Маршруты и планы</Chip>
          <Chip>Практика и документы</Chip>
          <Chip>Жизнь на месте</Chip>
          <Chip>Еда / культура</Chip>
          <Chip>Подборки мест</Chip>
          <Chip>Сезонные</Chip>
          <Chip>Безопасность</Chip>
        </div>
      </section>

      {/* Guides Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-6">
          Все гайды
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockGuides.map((guide) => (
            <Link key={guide.id} href={`/atlas/guides/${guide.id}`}>
              <Card hover className="h-full">
                {guide.heroImage && (
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={guide.heroImage}
                      alt={guide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      {guide.isEditor && (
                        <Badge variant="editor" className="text-xs">
                          От редакции
                        </Badge>
                      )}
                      {guide.isUGC && (
                        <Badge variant="ugc" className="text-xs">
                          UGC
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-h3 md:text-xl font-bold text-slate-900 line-clamp-2 flex-1">
                      {guide.title}
                    </h3>
                  </div>
                  {(guide.city || guide.country) && (
                    <div className="flex items-center gap-1 text-sm text-slate-600 mb-3">
                      <MapPin size={14} />
                      <span>{[guide.city, guide.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <Chip size="sm">{guide.guideType}</Chip>
                    {guide.duration && (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock size={12} />
                        <span>{guide.duration}</span>
                      </div>
                    )}
                    {guide.readingTime && (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <BookOpen size={12} />
                        <span>{guide.readingTime} мин</span>
                      </div>
                    )}
                  </div>
                  {guide.tags && guide.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {guide.tags.map((tag, index) => (
                        <Chip key={index} size="sm" className="text-xs">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    {guide.rating && (
                      <span className="flex items-center gap-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{guide.rating}</span>
                      </span>
                    )}
                    {guide.reviewsCount && (
                      <span>{guide.reviewsCount.toLocaleString('ru-RU')} отзывов</span>
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
