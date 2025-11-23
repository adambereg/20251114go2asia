import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { Handshake } from 'lucide-react';
import { Card, CardContent } from '@go2asia/ui';

export const metadata: Metadata = {
  title: 'Russian Friendly - Партнёрская программа | Go2Asia',
  description: 'Партнёрские места с особыми условиями для русскоязычных путешественников',
  openGraph: {
    title: 'Russian Friendly - Партнёрская программа',
    description: 'Партнёрские места с особыми условиями для русскоязычных путешественников',
    type: 'website',
  },
};

export default function RFPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Handshake}
        title="Russian Friendly"
        description="Партнёрские места с особыми условиями для русскоязычных путешественников"
        gradientFrom="from-blue-500"
        gradientTo="to-blue-600"
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-4">
              Партнёрские места
            </h2>
            <p className="text-body text-slate-600">
              Модуль Russian Friendly находится в разработке. Здесь будет каталог партнёрских мест и ваучеры.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}






