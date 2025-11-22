import { EmptyStateAtlas } from '@/modules/atlas';

export default function CountryCulturePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Культура</h2>
      <EmptyStateAtlas
        title="Культура и этикет"
        description="Базовые нормы поведения, что уважают и чего избегать, праздники и культурные коды. Здесь появятся блоки «Важно» и «Подводные камни»."
      />
    </div>
  );
}


