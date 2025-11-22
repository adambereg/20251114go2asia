import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { User } from 'lucide-react';
import { Card, CardContent } from '@go2asia/ui';

export const metadata: Metadata = {
  title: 'Профиль - Go2Asia',
  description: 'Личный профиль пользователя',
  openGraph: {
    title: 'Профиль - Go2Asia',
    description: 'Личный профиль пользователя',
    type: 'website',
  },
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={User}
        title="Профиль"
        description="Личный профиль и настройки"
        gradientFrom="from-slate-500"
        gradientTo="to-slate-600"
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-4">
              Личный профиль
            </h2>
            <p className="text-body text-slate-600">
              Страница профиля находится в разработке. Здесь будет информация о пользователе, NFT коллекция и история активности.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

