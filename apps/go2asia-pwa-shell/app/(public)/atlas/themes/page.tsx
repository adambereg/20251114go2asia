import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { Globe } from 'lucide-react';
import { AtlasMainNav } from '@/modules/atlas';
import { AtlasSearchBar } from '@/modules/atlas';
import { Card, CardContent } from '@go2asia/ui';

export const metadata: Metadata = {
  title: 'Темы Atlas Asia',
  description:
    'Тематические хабы Atlas Asia: визы, налоги, образование, медицина, связь и другие ключевые вопросы жизни в ЮВА.',
  openGraph: {
    title: 'Темы Atlas Asia',
    description: 'Тематические хабы Atlas Asia: визы, налоги, образование, медицина, связь и другие ключевые вопросы жизни в ЮВА.',
    type: 'website',
  },
};

const themes = [
  {
    id: 'visas',
    title: 'Визы и миграция',
    description: 'Типы виз, правила въезда, риски и обновления регламентов.',
  },
  {
    id: 'taxes',
    title: 'Налоги и работа',
    description: 'Фриланс, удалёнка, бизнес-структуры и базовые налоговые режимы.',
  },
  {
    id: 'education',
    title: 'Образование и дети',
    description: 'Школы, садики, курсы и семейные сценарии переезда.',
  },
  {
    id: 'medicine',
    title: 'Медицина',
    description: 'Медицинское обслуживание, страховка, клиники и врачи в ЮВА.',
  },
  {
    id: 'communication',
    title: 'Связь и интернет',
    description: 'Мобильная связь, интернет, VPN и цифровые сервисы.',
  },
  {
    id: 'banking',
    title: 'Банки и финтех',
    description: 'Банковские счета, карты, переводы и финансовые сервисы.',
  },
];

export default function ThemesIndexPage() {
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

      {/* Themes Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-6">
          Темы
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <Card key={theme.id} hover className="h-full">
              <CardContent className="p-6">
                <h3 className="text-h3 md:text-xl font-bold text-slate-900 mb-2">
                  {theme.title}
                </h3>
                <p className="text-small text-slate-600">
                  {theme.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}


