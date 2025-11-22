import { EmptyStateAtlas } from '@/modules/atlas';

export default function CountryGeographyPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">География</h2>
      <EmptyStateAtlas
        title="География и климат"
        description="Регионы, рельеф, моря и горы, сезоны дождей и сухой сезон. Здесь появятся карты, климатические графики и зона «подводные камни» по погоде."
      />
    </div>
  );
}


