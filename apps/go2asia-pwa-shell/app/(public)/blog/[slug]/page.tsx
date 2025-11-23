import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge, Card, CardContent, Chip } from '@go2asia/ui';
import { Clock, User, Heart, Bookmark, Share2, MapPin, Calendar, Globe2 } from 'lucide-react';

// Mock данные
const articles: Record<string, any> = {
  'digital-nomads-southeast-asia-2025': {
    title: 'Цифровые кочевники в ЮВА: новый сезон 2025',
    lead: 'Как изменилась жизнь digital nomads после пандемии. Топ-5 направлений, визы, коворкинги и сообщества.',
    author: {
      name: 'Редакция Go2Asia',
      avatar: null,
      role: 'PRO',
      city: 'Бангкок',
      profileUrl: '/space/user/editor',
    },
    publishedAt: '2024-12-10',
    updatedAt: '2024-12-15',
    readingTime: 12,
    type: 'Лонгрид',
    badges: ['EDITORIAL', 'Выбор редакции'],
    cover: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    content: `
# Цифровые кочевники в ЮВА: новый сезон 2025

Переезд в Таиланд — это захватывающее приключение, которое требует тщательной подготовки. В этом гиде мы расскажем обо всех аспектах переезда: от виз до поиска жилья.

## Визы

Таиланд предлагает несколько типов виз для долгосрочного пребывания:

- **Tourist Visa** — до 60 дней с возможностью продления
- **Education Visa** — для изучения тайского языка или других курсов
- **Business Visa** — для ведения бизнеса
- **Retirement Visa** — для лиц старше 50 лет

## Жильё

Поиск жилья в Таиланде может быть как простым, так и сложным, в зависимости от города:

- **Бангкок** — широкий выбор от бюджетных студий до люксовых апартаментов
- **Пхукет** — популярны виллы и кондоминиумы у пляжа
- **Чиангмай** — более доступные цены, много вариантов для digital nomads

## Работа

Для работы в Таиланде требуется рабочая виза и разрешение на работу. Однако многие digital nomads работают удалённо на зарубежные компании, что не требует рабочей визы.

## Заключение

Переезд в Таиланд — это возможность начать новую жизнь в тропическом раю. При правильной подготовке этот процесс может быть гладким и приятным.
    `,
    context: {
      country: 'Таиланд',
      city: 'Бангкок',
      seasonality: 'Круглый год',
      budget: '$$',
    },
    relatedPlaces: [
      { id: 'place-1', title: 'Коворкинг Hubba', type: 'Коворкинг' },
      { id: 'place-2', title: 'Район Сукхумвит', type: 'Район' },
    ],
    relatedEvents: [
      { id: 'event-1', title: 'Митап nomads', date: '25 декабря' },
    ],
  },
  'kak-pereehat-v-thailand': {
    title: 'Как переехать в Таиланд: полный гид',
    lead: 'Всё, что нужно знать о визах, жилье, работе и жизни в Таиланде для digital nomads и экспатов.',
    author: {
      name: 'Иван PRO',
      avatar: null,
      role: 'PRO',
      city: 'Бангкок',
      profileUrl: '/space/user/ivan',
    },
    publishedAt: '2024-12-10',
    readingTime: 5,
    type: 'Гид',
    badges: ['EDITORIAL'],
    cover: null,
    content: 'Статья в разработке',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  return {
    title: `${article?.title || 'Статья'} - Blog Asia | Go2Asia`,
    description: article?.lead || 'Статья из Blog Asia',
  };
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug] || {
    title: 'Статья не найдена',
    lead: '',
    author: { name: 'Автор', role: '', city: '', profileUrl: '' },
    publishedAt: new Date().toISOString(),
    readingTime: 0,
    type: 'Статья',
    badges: [],
    cover: null,
    content: 'Статья не найдена',
    context: {},
    relatedPlaces: [],
    relatedEvents: [],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Link href="/blog" className="hover:text-sky-600">
              Blog
            </Link>
            <span>/</span>
            <span className="text-slate-900 line-clamp-1">{article.title}</span>
          </nav>

          {/* Cover Image */}
          {article.cover && (
            <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-6">
              <img
                src={article.cover}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {article.badges.map((badge: string, index: number) => (
                  <Badge
                    key={index}
                    variant={
                      badge === 'EDITORIAL' ? 'editor' :
                      badge === 'UGC' ? 'ugc' :
                      badge === 'Выбор редакции' ? 'popular' :
                      'info'
                    }
                    className="text-xs"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Title & Lead */}
          <h1 className="text-h1 md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {article.title}
          </h1>
          {article.lead && (
            <p className="text-xl text-slate-600 mb-6">{article.lead}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
            <Link href={article.author.profileUrl || '#'} className="flex items-center gap-2 hover:text-sky-600">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User size={16} className="text-slate-600" />
              </div>
              <div>
                <div className="font-medium text-slate-900">{article.author.name}</div>
                {article.author.role && (
                  <div className="text-xs text-slate-500">{article.author.role}</div>
                )}
              </div>
            </Link>
            <span>•</span>
            <span>{formatDate(article.publishedAt)}</span>
            {article.updatedAt && article.updatedAt !== article.publishedAt && (
              <>
                <span>•</span>
                <span>Обновлено: {formatDate(article.updatedAt)}</span>
              </>
            )}
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {article.readingTime} мин чтения
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Heart size={20} />
              <span>24</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
              <Bookmark size={20} />
              <span>Сохранить</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
              <Share2 size={20} />
              <span>Поделиться</span>
            </button>
          </div>
        </div>
      </section>

      {/* Article Content with Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] gap-6">
          {/* Left Sidebar - Context Widgets */}
          <aside className="hidden lg:block space-y-4">
            {/* Контекст */}
            {article.context && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-3 text-sm">Контекст</h3>
                  <div className="space-y-2 text-sm">
                    {article.context.country && (
                      <Link href={`/atlas/countries/${article.context.country.toLowerCase()}`} className="flex items-center gap-2 text-slate-600 hover:text-sky-600">
                        <Globe2 size={14} />
                        <span>{article.context.country}</span>
                      </Link>
                    )}
                    {article.context.city && (
                      <Link href={`/atlas/cities/${article.context.city.toLowerCase()}`} className="flex items-center gap-2 text-slate-600 hover:text-sky-600">
                        <MapPin size={14} />
                        <span>{article.context.city}</span>
                      </Link>
                    )}
                    {article.context.seasonality && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={14} />
                        <span>{article.context.seasonality}</span>
                      </div>
                    )}
                    {article.context.budget && (
                      <div className="text-slate-600">
                        Бюджет: {article.context.budget}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Места из статьи */}
            {article.relatedPlaces && article.relatedPlaces.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-3 text-sm">Места из статьи</h3>
                  <div className="space-y-2">
                    {article.relatedPlaces.map((place: any) => (
                      <Link
                        key={place.id}
                        href={`/atlas/places/${place.id}`}
                        className="block text-sm text-slate-600 hover:text-sky-600"
                      >
                        {place.title}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>

          {/* Main Content */}
          <article className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8">
            {/* Prose Content */}
            <div className="prose prose-slate max-w-none
                          prose-headings:font-bold prose-headings:text-slate-900
                          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                          prose-p:text-slate-700 prose-p:leading-relaxed
                          prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline
                          prose-strong:text-slate-900 prose-strong:font-semibold
                          prose-ul:text-slate-700 prose-ol:text-slate-700">
              <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
            </div>

            {/* UGC-блок комментариев */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Обсуждение и дополнения</h3>
              <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
                Интеграция со Space Asia: авторы оставляют фактоиды/исправления/советы, PRO выделяет важные замечания, редакция вносит обновления.
              </div>
            </div>
          </article>

          {/* Right Sidebar - Recommendations */}
          <aside className="hidden lg:block space-y-4">
            {/* События по теме */}
            {article.relatedEvents && article.relatedEvents.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-3 text-sm">События по теме</h3>
                  <div className="space-y-2">
                    {article.relatedEvents.map((event: any) => (
                      <Link
                        key={event.id}
                        href={`/pulse/${event.id}`}
                        className="block text-sm text-slate-600 hover:text-sky-600"
                      >
                        <div>{event.title}</div>
                        <div className="text-xs text-slate-500">{event.date}</div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Рекомендации */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900 mb-3 text-sm">Рекомендации</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div>• Ещё по теме</div>
                  <div>• В этом городе читают</div>
                  <div>• Материалы этого автора</div>
                  <div>• Популярное в рубрике</div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}
