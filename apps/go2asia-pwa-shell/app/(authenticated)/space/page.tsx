import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@go2asia/ui';

export const metadata: Metadata = {
  title: 'Space Asia - Социальная сеть | Go2Asia',
  description: 'Социальная сеть для путешественников и экспатов в Юго-Восточной Азии',
  openGraph: {
    title: 'Space Asia - Социальная сеть',
    description: 'Социальная сеть для путешественников и экспатов в Юго-Восточной Азии',
    type: 'website',
  },
};

export default function SpacePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Users}
        title="Space Asia"
        description="Социальная сеть для путешественников и экспатов в Юго-Восточной Азии"
        gradientFrom="from-sky-500"
        gradientTo="to-sky-600"
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-4">
              Лента новостей
            </h2>
            <p className="text-body text-slate-600">
              Модуль Space Asia находится в разработке. Здесь будет лента новостей, профили пользователей и группы.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}





