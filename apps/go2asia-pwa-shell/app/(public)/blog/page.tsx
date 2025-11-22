import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, Chip, Badge } from '@go2asia/ui';
import { ModuleHero } from '@/components/modules';
import { Clock, User, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog Asia - Статьи и истории | Go2Asia',
  description: 'Статьи, репортажи и истории о жизни в Юго-Восточной Азии',
};

// Mock данные
const articles = [
  {
    id: '1',
    slug: 'kak-pereehat-v-thailand',
    title: 'Как переехать в Таиланд: полный гид',
    excerpt:
      'Всё, что нужно знать о визах, жилье, работе и жизни в Таиланде для digital nomads и экспатов.',
    author: {
      name: 'Иван PRO',
      avatar: null,
    },
    publishedAt: '2024-12-10',
    readingTime: 5,
    type: 'Гид',
    cover: null,
  },
  {
    id: '2',
    slug: 'luchshie-kofejni-bangkoka',
    title: '10 лучших кофеен Бангкока для работы',
    excerpt:
      'Подборка проверенных мест с быстрым Wi-Fi, хорошим кофе и удобными рабочими местами.',
    author: {
      name: 'Мария',
      avatar: null,
    },
    publishedAt: '2024-12-08',
    readingTime: 3,
    type: 'Подборка',
    cover: null,
  },
  {
    id: '3',
    slug: 'festival-edy-phuket',
    title: 'Фестиваль еды на Пхукете: репортаж',
    excerpt:
      'Как прошёл крупнейший гастрономический фестиваль сезона. Фото, впечатления, рекомендации.',
    author: {
      name: 'Алексей PRO',
      avatar: null,
    },
    publishedAt: '2024-12-05',
    readingTime: 4,
    type: 'Репортаж',
    cover: null,
  },
];

const categories = ['Все', 'Путешествия', 'Лайфстайл', 'Бизнес', 'Культура'];

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
        description="Статьи и истории о жизни в Юго-Восточной Азии"
        gradientFrom="from-sky-500"
        gradientTo="to-sky-600"
      />

      {/* Filters */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Chip key={category} selected={category === 'Все'}>
                {category}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`}>
              <Card hover className="h-full flex flex-col">
                {/* Cover Image Placeholder */}
                <div className="aspect-[21/9] bg-slate-200"></div>

                <CardContent className="p-6 flex-1 flex flex-col">
                  {/* Type & Reading Time */}
                  <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
                    <Badge variant="info">{article.type}</Badge>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {article.readingTime} мин
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-h3 md:text-2xl font-bold text-slate-900 line-clamp-2 mb-3">
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-slate-700 line-clamp-3 mb-4 flex-1">
                    {article.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                        <User size={16} className="text-slate-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {article.author.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatDate(article.publishedAt)}
                        </div>
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
    </div>
  );
}
