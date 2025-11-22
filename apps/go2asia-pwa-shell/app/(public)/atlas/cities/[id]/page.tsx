import type { Metadata } from 'next';
import { AtlasCityLayout } from '@/modules/atlas';

export const metadata: Metadata = {
  title: 'Город Юго-Восточной Азии | Atlas Asia',
  description:
    'Гид по городам Юго-Восточной Азии: районы, транспорт, стоимость жизни и цифровые сервисы.',
};

export default async function CityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Пока без реальных данных; позже сюда придёт SDK (@go2asia/sdk).
  const cityName = 'Город в разработке';

  return (
    <AtlasCityLayout cityName={cityName}>
      <section className="space-y-6">
        <div>
          <h2 className="text-h2 md:text-2xl font-bold text-slate-900 mb-2">
            Районы
          </h2>
          <p className="text-sm text-slate-600">
            Здесь появятся описания районов, уровень шума и трафика, близость к
            школам и коворкингам, а также интеграция с Rielt.Market / AIRent.
          </p>
        </div>

        <div>
          <h2 className="text-h2 md:text-2xl font-bold text-slate-900 mb-2">
            Транспорт и цифровые сервисы
          </h2>
          <p className="text-sm text-slate-600">
            Блоки для транспорта, супер-аппов, доставки, такси и местных
            приложений будут подключены через SDK.
          </p>
        </div>

        <div>
          <h2 className="text-h2 md:text-2xl font-bold text-slate-900 mb-2">
            Русскофрендли-карта
          </h2>
          <p className="text-sm text-slate-600">
            Здесь появится карта Russian Friendly, коворкингов, кафе и местных
            сервисов с UGC-отзывами и бейджами PRO-спейсеров.
          </p>
        </div>
      </section>
    </AtlasCityLayout>
  );
}


