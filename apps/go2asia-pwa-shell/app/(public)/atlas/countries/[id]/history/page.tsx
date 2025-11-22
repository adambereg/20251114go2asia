import { EmptyStateAtlas } from '@/modules/atlas';

export default function CountryHistoryPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">История</h2>
      <EmptyStateAtlas
        title="История страны"
        description="Хронология, ключевые эпохи, влияние колониализма и современные вехи развития. Здесь будут таймлайны, карты и короткие исторические справки."
      />
    </div>
  );
}


