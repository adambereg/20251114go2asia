import { EmptyStateAtlas } from '@/modules/atlas';

export default function CountryVisasPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Визы</h2>
      <EmptyStateAtlas
        title="Визы и миграция"
        description="Типы виз, требования, сроки, стоимость и риски. Здесь будут структурированные блоки с пошаговыми инструкциями и ссылками на официальные регламенты."
      />
    </div>
  );
}


