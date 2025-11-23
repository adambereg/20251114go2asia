import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { Building } from 'lucide-react';
import { Card, CardContent } from '@go2asia/ui';

export const metadata: Metadata = {
  title: 'Rielt.Market - Поиск жилья | Go2Asia',
  description: 'Поиск краткосрочной и долгосрочной аренды жилья в Юго-Восточной Азии',
  openGraph: {
    title: 'Rielt.Market - Поиск жилья',
    description: 'Поиск краткосрочной и долгосрочной аренды жилья в Юго-Восточной Азии',
    type: 'website',
  },
};

export default function RieltPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Building}
        title="Rielt.Market"
        description="Поиск краткосрочной и долгосрочной аренды жилья в Юго-Восточной Азии"
        gradientFrom="from-emerald-500"
        gradientTo="to-emerald-600"
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-4">
              Поиск жилья
            </h2>
            <p className="text-body text-slate-600">
              Модуль Rielt.Market находится в разработке. Здесь будет поиск и фильтрация объявлений о жилье.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}






