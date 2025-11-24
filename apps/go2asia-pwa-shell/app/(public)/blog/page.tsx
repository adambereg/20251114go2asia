import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, Chip, Badge } from '@go2asia/ui';
import { ModuleHero } from '@/components/modules';
import { Clock, User, Heart, Bookmark, Share2, Globe, Calendar, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog Asia - Статьи и истории | Go2Asia',
  description: 'Медиа-площадка Go2Asia: редакционные материалы, UGC-статьи, тематические подборки и спецпроекты о жизни в Юго-Восточной Азии',
};

// Моковые данные для Hero-блока "Тема номера"
const featuredArticle = {
  id: 'featured-1',
  slug: 'digital-nomads-southeast-asia-2025',
  title: 'Цифровые кочевники в ЮВА: новый сезон 2025',
  subtitle: 'Как изменилась жизнь digital nomads после пандемии. Топ-5 направлений, визы, коворкинги и сообщества.',
  cover: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
  readingTime: 12,
  insights: ['Новые визовые программы', 'Рост коворкингов', 'Сообщества nomads'],
  badges: ['EDITORIAL', 'Выбор редакции'],
  relatedThemes: ['Работа', 'Визы', 'Коворкинги'],
};

// Моковые данные для "Главные сегодня"
const editorialArticles = [
  {
    id: '1',
    slug: 'visa-thailand-2025',
    title: 'Визы в Таиланд 2025: что изменилось',
    excerpt: 'Полное руководство по новым правилам въезда и продления виз для экспатов.',
    cover: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    author: { name: 'Редакция Go2Asia', avatar: null },
    publishedAt: '2024-12-10',
    readingTime: 8,
    type: 'Гайд',
    badges: ['EDITORIAL'],
  },
  {
    id: '2',
    slug: 'best-coworking-bangkok',
    title: '10 лучших коворкингов Бангкока',
    excerpt: 'Подборка проверенных мест с быстрым Wi-Fi, хорошим кофе и удобными рабочими местами.',
    cover: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    author: { name: 'Мария PRO', avatar: null },
    publishedAt: '2024-12-08',
    readingTime: 5,
    type: 'Подборка',
    badges: ['EDITORIAL'],
  },
  {
    id: '3',
    slug: 'food-festival-phuket',
    title: 'Фестиваль еды на Пхукете: репортаж',
    excerpt: 'Как прошёл крупнейший гастрономический фестиваль сезона. Фото, впечатления, рекомендации.',
    cover: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
    author: { name: 'Алексей PRO', avatar: null },
    publishedAt: '2024-12-05',
    readingTime: 6,
    type: 'Репортаж',
    badges: ['EDITORIAL'],
  },
  {
    id: '4',
    slug: 'moving-to-vietnam-guide',
    title: 'Переезд во Вьетнам: полный гид',
    excerpt: 'Всё, что нужно знать о визах, жилье, работе и жизни во Вьетнаме для digital nomads.',
    cover: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
    author: { name: 'Иван PRO', avatar: null },
    publishedAt: '2024-12-03',
    readingTime: 10,
    type: 'Лонгрид',
    badges: ['EDITORIAL'],
  },
];

// Моковые данные для "Выбор сообщества" (UGC)
const ugcArticles = [
  {
    id: 'ugc-1',
    slug: 'my-first-month-hanoi',
    title: 'Мой первый месяц в Ханое: честный отчёт',
    excerpt: 'Личный опыт переезда, первые впечатления и практические советы.',
    cover: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
    author: { name: 'Анна Spacer', avatar: null },
    publishedAt: '2024-12-07',
    readingTime: 7,
    type: 'Колонка',
    badges: ['UGC', 'Проверено редакцией'],
  },
  {
    id: 'ugc-2',
    slug: 'bangkok-digital-nomad-life',
    title: 'Жизнь digital nomad в Бангкоке: год спустя',
    excerpt: 'Что изменилось за год жизни в столице Таиланда. Бюджет, районы, сообщество.',
    cover: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    author: { name: 'Дмитрий VIP', avatar: null },
    publishedAt: '2024-12-04',
    readingTime: 9,
    type: 'Колонка',
    badges: ['UGC', 'Проверено PRO'],
  },
];

// Моковые данные для рубрик
const categories = [
  {
    id: 'travel',
    title: 'Путешествия',
    description: 'Маршруты, советы, впечатления',
    articles: 24,
    cover: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
  },
  {
    id: 'work',
    title: 'Работа в ЮВА',
    description: 'Фриланс, удалёнка, бизнес',
    articles: 18,
    cover: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
  },
  {
    id: 'culture',
    title: 'Культура / Еда',
    description: 'Традиции, кухня, праздники',
    articles: 15,
    cover: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
  },
  {
    id: 'lifestyle',
    title: 'Городская жизнь',
    description: 'Районы, жильё, быт',
    articles: 12,
    cover: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
  },
];

// Моковые данные для "События недели" (из Pulse)
const weeklyEvents = [
  {
    id: 'event-1',
    title: 'Митап digital nomads в Бангкоке',
    date: '25 декабря',
    location: 'Бангкок',
    rating: 4.8,
    isProOrganizer: true,
    cover: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
  },
  {
    id: 'event-2',
    title: 'Фестиваль еды в Ханое',
    date: '28 декабря',
    location: 'Ханой',
    rating: 4.6,
    isProOrganizer: false,
    cover: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
  },
];

// Моковые данные для "Жить здесь" (из Atlas)
const atlasPlaces = [
  {
    id: 'place-1',
    title: 'Район Сукхумвит',
    location: 'Бангкок, Таиланд',
    type: 'Район',
    cover: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
  },
  {
    id: 'place-2',
    title: 'Озеро Хоан Кием',
    location: 'Ханой, Вьетнам',
    type: 'Место',
    cover: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
  },
  {
    id: 'place-3',
    title: 'Café Russian Friendly',
    location: 'Пхукет, Таиланд',
    type: 'RF Business',
    cover: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
  },
];

// Моковые данные для "Партнёрские истории"
const partnerStories = [
  {
    id: 'partner-1',
    slug: 'rf-business-success-story',
    title: 'Как открыть кафе в Таиланде: история Russian Friendly',
    excerpt: 'Реальный опыт открытия бизнеса в ЮВА от партнёра Go2Asia.',
    cover: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    badges: ['RF', 'Partner Story'],
  },
];

const rubricFilters = ['Путешествия', 'Городская жизнь', 'Культура', 'Работа', 'Финансы', 'Образование', 'Outdoor', 'Технологии/AI'];
const formatFilters = ['Гайд', 'Лонгрид', 'Интервью', 'Репортаж', 'Подборка', 'Колонка'];
const readingTimeFilters = ['5 мин', '10 мин', '20 мин'];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';
  if (diffDays < 7) return `${diffDays} дня назад`;
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Globe}
        title="Blog Asia"
        description="Медиа-площадка Go2Asia: редакционные материалы, UGC-статьи, тематические подборки и спецпроекты"
        gradientFrom="from-sky-500"
        gradientTo="to-sky-600"
      />

      {/* Hero-блок "Тема номера" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/blog/${featuredArticle.slug}`}>
          <Card hover className="overflow-hidden">
            {featuredArticle.cover && (
              <div className="relative w-full h-96 overflow-hidden">
                <img
                  src={featuredArticle.cover}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredArticle.badges.map((badge, index) => (
                      <Badge key={index} variant={badge === 'EDITORIAL' ? 'editor' : 'popular'}>
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{featuredArticle.title}</h2>
                  <p className="text-lg text-white/90 mb-4">{featuredArticle.subtitle}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredArticle.insights.map((insight, index) => (
                      <Chip key={index} size="sm" className="bg-white/20 text-white border-white/30">
                        {insight}
                      </Chip>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-white/80">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{featuredArticle.readingTime} мин чтения</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {featuredArticle.relatedThemes.map((theme, index) => (
                        <span key={index} className="text-sm">#{theme}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </Link>
      </section>

      {/* Чип-фильтры */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-2">Рубрики</div>
              <div className="flex flex-wrap gap-2">
                {rubricFilters.map((rubric) => (
                  <Chip key={rubric}>{rubric}</Chip>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-2">Формат</div>
              <div className="flex flex-wrap gap-2">
                {formatFilters.map((format) => (
                  <Chip key={format}>{format}</Chip>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-2">Время чтения</div>
              <div className="flex flex-wrap gap-2">
                {readingTimeFilters.map((time) => (
                  <Chip key={time}>{time}</Chip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Главные сегодня */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Главные сегодня</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {editorialArticles.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`}>
              <Card hover className="h-full flex flex-col">
                {article.cover && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={article.cover}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {article.badges.map((badge, index) => (
                        <Badge key={index} variant={badge === 'EDITORIAL' ? 'editor' : 'ugc'} className="text-xs mb-1">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="info" className="text-xs">{article.type}</Badge>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={12} />
                      {article.readingTime} мин
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      {formatDate(article.publishedAt)}
                    </div>
                    <span className="text-sky-600 hover:text-sky-700 font-medium text-sm">
                      Читать →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Выбор сообщества */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Выбор сообщества</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ugcArticles.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`}>
              <Card hover className="h-full flex flex-col">
                {article.cover && (
                  <div className="relative w-full h-64 overflow-hidden">
                    <img
                      src={article.cover}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {article.badges.map((badge, index) => (
                        <Badge key={index} variant={badge === 'UGC' ? 'ugc' : 'verified'} className="text-xs mb-1">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="info" className="text-xs">{article.type}</Badge>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={12} />
                      {article.readingTime} мин
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-2 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                        <User size={14} className="text-slate-600" />
                      </div>
                      <div className="text-xs">
                        <div className="font-medium text-slate-900">{article.author.name}</div>
                        <div className="text-slate-500">{formatDate(article.publishedAt)}</div>
                      </div>
                    </div>
                    <span className="text-sky-600 hover:text-sky-700 font-medium text-sm">
                      Читать →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Рубрики */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Рубрики</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/blog/category/${category.id}`}>
              <Card hover className="h-full">
                {category.cover && (
                  <div className="relative w-full h-40 overflow-hidden">
                    <img
                      src={category.cover}
                      alt={category.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {category.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2">
                    {category.description}
                  </p>
                  <div className="text-xs text-slate-500">
                    {category.articles} статей
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* События недели */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">События недели</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {weeklyEvents.map((event) => (
            <Link key={event.id} href={`/pulse/${event.id}`}>
              <Card hover className="h-full">
                {event.cover && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={event.cover}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {event.isProOrganizer && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="verified" className="text-xs">PRO Организатор</Badge>
                      </div>
                    )}
                  </div>
                )}
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⭐</span>
                      <span>{event.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Жить здесь (из Atlas) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Жить здесь</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {atlasPlaces.map((place) => (
            <Link key={place.id} href={`/atlas/places/${place.id}`}>
              <Card hover className="h-full">
                {place.cover && (
                  <div className="relative w-full h-40 overflow-hidden">
                    <img
                      src={place.cover}
                      alt={place.title}
                      className="w-full h-full object-cover"
                    />
                    {place.type === 'RF Business' && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="verified" className="text-xs">RF</Badge>
                      </div>
                    )}
                  </div>
                )}
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {place.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {place.location}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Партнёрские истории */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Партнёрские истории</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {partnerStories.map((story) => (
            <Link key={story.id} href={`/blog/${story.slug}`}>
              <Card hover className="h-full">
                {story.cover && (
                  <div className="relative w-full h-64 overflow-hidden">
                    <img
                      src={story.cover}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {story.badges.map((badge, index) => (
                        <Badge key={index} variant={badge === 'RF' ? 'russian-friendly' : 'popular'} className="text-xs mb-1">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {story.excerpt}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
