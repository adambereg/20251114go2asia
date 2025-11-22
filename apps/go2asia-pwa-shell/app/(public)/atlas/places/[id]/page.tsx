import type { Metadata } from 'next';
import { AtlasPlaceLayout } from '@/modules/atlas';

export const metadata: Metadata = {
  title: 'Место в Atlas Asia | Go2Asia',
  description:
    'Карточка места в Atlas Asia: базовые данные, удобства, отзывы и интеграции с Russian Friendly.',
};

export default async function PlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Заглушка для структуры POI; потом сюда придут реальные данные из SDK.
  return (
    <AtlasPlaceLayout
      title="Место в разработке"
      cityName="Город"
      countryName="Страна"
      isRussianFriendly={false}
      attributes={[
        { id: 'wifi', label: 'Wi‑Fi' },
        { id: 'power', label: 'Розетки' },
        { id: 'kids', label: 'Детская зона' },
      ]}
    >
      <section className="space-y-6">
        <div>
          <h2 className="text-h2 md:text-2xl font-bold text-slate-900 mb-2">
            Описание и формат
          </h2>
          <p className="text-sm text-slate-600">
            Здесь появится редакционное описание места, формат посещения,
            целевая аудитория и тонкие нюансы («подводные камни»).
          </p>
        </div>

        <div>
          <h2 className="text-h2 md:text-2xl font-bold text-slate-900 mb-2">
            Фото, меню и прайс
          </h2>
          <p className="text-sm text-slate-600">
            Галерея и медиа-отчёты пользователей появятся после интеграции с
            UGC-слоем и Russian Friendly.
          </p>
        </div>
      </section>
    </AtlasPlaceLayout>
  );
}


