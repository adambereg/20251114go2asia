'use client';

import { SpaceLayout } from '@/components/space/Shared';
import { Card } from '@go2asia/ui';

export default function BalancePage() {
  return (
    <SpaceLayout>
      <Card className="border-2 border-slate-200 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Баланс</h1>
          <p className="text-slate-600">
            Раздел в разработке. Здесь будет история транзакций и управление балансом.
          </p>
        </div>
      </Card>
    </SpaceLayout>
  );
}


