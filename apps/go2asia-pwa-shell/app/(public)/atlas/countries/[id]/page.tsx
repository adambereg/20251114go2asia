import { EmptyStateAtlas } from '@/modules/atlas';

export default function CountryOverviewPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Обзор</h2>
      <EmptyStateAtlas
        title="Обзор страны"
        description="Здесь будет краткий TL;DR по стране: климат, сезонность, валюта, базовые цены, язык и ключевые советы для экспатов и путешественников."
      />
    </div>
  );
}
