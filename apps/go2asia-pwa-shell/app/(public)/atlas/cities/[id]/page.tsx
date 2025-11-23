export default function CityOverviewPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Обзор</h2>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* TL;DR полоса */}
        <div className="border-b border-slate-100 bg-sky-50 px-4 py-3 text-sm text-slate-800">
          Краткое описание города и почему стоит посетить.
        </div>

        {/* Основное описание */}
        <div className="px-4 py-4 text-sm text-slate-700 space-y-4">
          <p>
            Динамично развивающийся город с богатой историей, потрясающей
            архитектурой и доступными ценами. Популярное направление для цифровых
            кочевников и экспатов.
          </p>

          {/* Ключевые факты */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Население
              </div>
              <div className="mt-1 font-semibold">8.3M</div>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Площадь
              </div>
              <div className="mt-1 font-semibold">1,568 км²</div>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Часовой пояс
              </div>
              <div className="mt-1 font-semibold">UTC+7</div>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                GDP на душу
              </div>
              <div className="mt-1 font-semibold">$18,000</div>
            </div>
          </div>

          {/* Топ-3 достопримечательности */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Топ-3 достопримечательности</h3>
            <ul className="space-y-2 text-sm">
              <li>• Главная достопримечательность города</li>
              <li>• Вторая популярная локация</li>
              <li>• Третье место для посещения</li>
            </ul>
          </div>

          {/* Сезонность */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Лучшее время для посещения</h3>
            <p className="text-sm text-slate-600">
              Ноябрь — март: сухой сезон, комфортная температура. Апрель — октябрь: сезон дождей, но меньше туристов.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
