import type { Metadata } from 'next';
import { Badge } from '@go2asia/ui';
import { Clock, User, Heart, Bookmark, Share2 } from 'lucide-react';

// Mock данные
const articles: Record<string, any> = {
  'kak-pereehat-v-thailand': {
    title: 'Как переехать в Таиланд: полный гид',
    author: {
      name: 'Иван PRO',
      avatar: null,
    },
    publishedAt: '2024-12-10',
    readingTime: 5,
    type: 'Гид',
    content: `
# Как переехать в Таиланд: полный гид

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
    description: article?.excerpt || 'Статья из Blog Asia',
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
    author: { name: 'Автор' },
    publishedAt: new Date().toISOString(),
    readingTime: 0,
    type: 'Статья',
    content: 'Статья не найдена',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <a href="/blog" className="hover:text-sky-600">
              Blog
            </a>
            <span>/</span>
            <span className="text-slate-900 line-clamp-1">{article.title}</span>
          </nav>

          {/* Title & Meta */}
          <h1 className="text-h1 md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User size={16} className="text-slate-600" />
              </div>
              <span className="font-medium">{article.author.name}</span>
            </div>
            <span>•</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {article.readingTime} мин чтения
            </span>
          </div>

          {/* Cover Image Placeholder */}
          <div className="aspect-video bg-slate-200 rounded-xl mb-6"></div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8">
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

          {/* Actions */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
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
      </article>
    </div>
  );
}
