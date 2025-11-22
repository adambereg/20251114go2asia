export default function CountryOverviewPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Обзор</h2>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* TL;DR полоса */}
        <div className="border-b border-slate-100 bg-sky-50 px-4 py-3 text-sm text-slate-800">
          Отличный баланс цены и качества жизни, развитая инфраструктура в
          крупных городах.
        </div>

        {/* Основное описание */}
        <div className="px-4 py-4 text-sm text-slate-700 space-y-2">
          <p>
            Динамично развивающаяся страна с богатой историей, потрясающей
            природой и доступными ценами. Популярное направление для цифровых
            кочевников и экспатов.
          </p>
        </div>

        {/* Ключевые цифры */}
        <div className="grid gap-3 border-t border-slate-100 px-4 py-4 text-sm text-slate-800 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Валюта
            </div>
            <div className="mt-1 font-semibold">VND</div>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Часовой пояс
            </div>
            <div className="mt-1 font-semibold">UTC+7</div>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              ISO код
            </div>
            <div className="mt-1 font-semibold">VN</div>
          </div>
        </div>

        {/* Метаданные */}
        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          Последнее обновление: 17.11.2025
        </div>
      </section>
    </div>
  );
}
