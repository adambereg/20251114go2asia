import { EmptyStateAtlas } from '@/modules/atlas';

export default function CountryPlacesPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Места страны</h2>
      <EmptyStateAtlas
        title="Каталог мест"
        description="Здесь будет каталог мест внутри страны: города, районы, достопримечательности и Russian Friendly-заведения с фильтрами и рейтингами."
      />
    </div>
  );
}


