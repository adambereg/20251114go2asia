import type { Metadata } from 'next';
import { AtlasCityLayout } from '@/modules/atlas';

export const metadata: Metadata = {
  title: 'Города Юго-Восточной Азии | Atlas Asia',
  description:
    'Агрегатор городов Юго-Восточной Азии: краткий обзор, районы, транспорт и цифровые сервисы.',
};

export default function CitiesIndexPage() {
  return (
    <AtlasCityLayout cityName="Города Юго-Восточной Азии">
      <section className="space-y-4">
        <p className="text-sm text-slate-700">
          Здесь появится каталог городов региона с фильтрами по стране, морю,
          климату и уровню жизни.
        </p>
      </section>
    </AtlasCityLayout>
  );
}


