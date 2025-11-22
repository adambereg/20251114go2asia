import { EmptyStateAtlas } from '@/modules/atlas';

export default function CountryLivingPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Проживание</h2>
      <EmptyStateAtlas
        title="Районы и стоимость жизни"
        description="Районы для долгосрочной жизни, вилки аренды, безопасные зоны и «русскофрендли» сервисы поблизости. Здесь появятся чеклисты и калькулятор стоимости месяца."
      />
    </div>
  );
}


