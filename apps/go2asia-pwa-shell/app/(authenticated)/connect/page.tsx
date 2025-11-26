import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { Wallet } from 'lucide-react';
import { Card, CardContent } from '@go2asia/ui';

export const metadata: Metadata = {
  title: 'Connect Asia - Кошелёк и награды | Go2Asia',
  description: 'Управляйте балансом Points и токенов, отслеживайте транзакции и рефералов',
  openGraph: {
    title: 'Connect Asia - Кошелёк и награды',
    description: 'Управляйте балансом Points и токенов, отслеживайте транзакции и рефералов',
    type: 'website',
  },
};

export default function ConnectPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Wallet}
        title="Connect Asia"
        description="Управляйте балансом Points и токенов, отслеживайте транзакции и рефералов"
        gradientFrom="from-amber-500"
        gradientTo="to-amber-600"
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-4">
              Баланс и транзакции
            </h2>
            <p className="text-body text-slate-600">
              Модуль Connect Asia находится в разработке. Здесь будет dashboard с балансом, историей транзакций и реферальной программой.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}








