import { EmptyStateAtlas } from '@/modules/atlas';

export default function CountryBusinessPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Бизнес</h2>
      <EmptyStateAtlas
        title="Бизнес и финансы"
        description="Формы компаний, базовые налоги, банки и финтех, релокация сотрудников и правовые риски на высоком уровне (без юр.консультаций)."
      />
    </div>
  );
}


