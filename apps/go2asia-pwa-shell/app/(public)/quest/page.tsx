import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { Target } from 'lucide-react';
import { Card, CardContent } from '@go2asia/ui';

export const metadata: Metadata = {
  title: 'Quest Asia - Квесты и миссии | Go2Asia',
  description: 'Проходите квесты, выполняйте миссии и получайте награды',
  openGraph: {
    title: 'Quest Asia - Квесты и миссии',
    description: 'Проходите квесты, выполняйте миссии и получайте награды',
    type: 'website',
  },
};

export default function QuestPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Target}
        title="Quest Asia"
        description="Проходите квесты, выполняйте миссии и получайте награды"
        gradientFrom="from-purple-500"
        gradientTo="to-purple-600"
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-4">
              Доступные квесты
            </h2>
            <p className="text-body text-slate-600">
              Модуль Quest Asia находится в разработке. Здесь будет список квестов и миссий для выполнения.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}








