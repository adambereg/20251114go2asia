import type { Metadata } from 'next';
import { AtlasPlaceLayout } from '@/modules/atlas';

export const metadata: Metadata = {
  title: 'Места Юго-Восточной Азии | Atlas Asia',
  description:
    'Каталог мест Atlas Asia: города, достопримечательности, Russian Friendly локации и партнёрские заведения.',
};

export default function PlacesIndexPage() {
  return (
    <AtlasPlaceLayout
      title="Места Юго-Восточной Азии"
      attributes={[]}
      isRussianFriendly={false}
    >
      <section className="space-y-4">
        <p className="text-sm text-slate-700">
          Здесь появится единый каталог мест по всем странам с фильтрами по
          типу, ценам, режиму работы и Russian Friendly-мёткам.
        </p>
      </section>
    </AtlasPlaceLayout>
  );
}


