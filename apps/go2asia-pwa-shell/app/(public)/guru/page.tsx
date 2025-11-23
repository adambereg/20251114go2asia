import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { Compass } from 'lucide-react';
import { Card, CardContent } from '@go2asia/ui';

export const metadata: Metadata = {
  title: 'Guru Asia - Всё интересное рядом с вами | Go2Asia',
  description: 'Места, события, жильё и люди рядом с вами',
  openGraph: {
    title: 'Guru Asia - Всё интересное рядом с вами',
    description: 'Места, события, жильё и люди рядом с вами',
    type: 'website',
  },
};

export default function GuruPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Compass}
        title="Guru Asia"
        description="Всё интересное рядом с вами: места, события, жильё и люди"
        gradientFrom="from-sky-500"
        gradientTo="to-sky-600"
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-4">
              Рядом с вами
            </h2>
            <p className="text-body text-slate-600">
              Модуль Guru Asia находится в разработке. Здесь будет интерактивная карта и список объектов рядом с вами.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}






