export default function CountryPlacesPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Достопримечательности</h2>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-4 py-4 space-y-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">Популярные места</h3>
            <div className="space-y-3">
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="font-semibold text-slate-900 mb-1">Бухта Халонг</div>
                <div className="text-sm text-slate-600 mb-2">
                  Легендарная бухта с тысячами известняковых островов. Объект Всемирного наследия
                  ЮНЕСКО.
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>⭐ 4.8</span>
                  <span>📍 Провинция Куангнинь</span>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="font-semibold text-slate-900 mb-1">Старый квартал Ханоя</div>
                <div className="text-sm text-slate-600 mb-2">
                  Исторический центр с узкими улочками, храмами и традиционными ремесленными
                  кварталами.
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>⭐ 4.7</span>
                  <span>📍 Ханой</span>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="font-semibold text-slate-900 mb-1">Хойан</div>
                <div className="text-sm text-slate-600 mb-2">
                  Древний портовый город с японским мостом и яркими фонарями. Объект Всемирного
                  наследия ЮНЕСКО.
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>⭐ 4.9</span>
                  <span>📍 Провинция Куангнам</span>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="font-semibold text-slate-900 mb-1">Тоннели Кучи</div>
                <div className="text-sm text-slate-600 mb-2">
                  Подземная сеть туннелей времен Вьетнамской войны. Исторический музей под
                  открытым небом.
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>⭐ 4.5</span>
                  <span>📍 Хошимин</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


