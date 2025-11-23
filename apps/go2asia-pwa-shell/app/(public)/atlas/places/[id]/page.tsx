export default function PlaceOverviewPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Обзор</h2>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Описание */}
        <div className="px-4 py-4 text-sm text-slate-700 space-y-4">
          <p>
            Динамично развивающееся место с богатой историей, потрясающей
            архитектурой и доступными ценами. Популярное направление для туристов
            и экспатов.
          </p>
          <p>
            Это место является одним из самых значимых культурных объектов в регионе,
            привлекающим миллионы посетителей ежегодно.
          </p>
        </div>

        {/* Ключевая информация */}
        <div className="border-t border-slate-100 px-4 py-4">
          <h3 className="font-semibold text-slate-900 mb-3">Ключевая информация</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                Часы работы
              </div>
              <div className="text-sm font-semibold text-slate-900">
                08:00 — 18:00 ежедневно
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                Стоимость входа
              </div>
              <div className="text-sm font-semibold text-slate-900">
                500 THB (~$15)
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                Лучшее время для визита
              </div>
              <div className="text-sm font-semibold text-slate-900">
                Раннее утро (до 10:00)
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                Время на осмотр
              </div>
              <div className="text-sm font-semibold text-slate-900">
                2-3 часа
              </div>
            </div>
          </div>
        </div>

        {/* Ближайшие места */}
        <div className="border-t border-slate-100 px-4 py-4">
          <h3 className="font-semibold text-slate-900 mb-3">Ближайшие места</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <div>• Храм Ват Пхо (500 м)</div>
            <div>• Храм Ват Арун (1.2 км)</div>
            <div>• Королевский дворец (800 м)</div>
          </div>
        </div>

        {/* Похожие места */}
        <div className="border-t border-slate-100 px-4 py-4">
          <h3 className="font-semibold text-slate-900 mb-3">Похожие места</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <div>• Храмовый комплекс Боробудур (Индонезия)</div>
            <div>• Ангкор-Ват (Камбоджа)</div>
            <div>• Храм Ват Пхо (Таиланд)</div>
          </div>
        </div>
      </section>
    </div>
  );
}
