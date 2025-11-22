export default function CountryCitiesPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Города</h2>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-4 py-4 space-y-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">Крупные города</h3>
            <div className="space-y-3">
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="font-semibold text-slate-900 mb-1">Хошимин</div>
                <div className="text-sm text-slate-600">
                  Экономический центр страны. Динамичный мегаполис с развитой инфраструктурой,
                  коворкингами и активной ночной жизнью.
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="font-semibold text-slate-900 mb-1">Ханой</div>
                <div className="text-sm text-slate-600">
                  Столица Вьетнама. Исторический центр с богатой культурой, озёрами и
                  традиционной архитектурой.
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="font-semibold text-slate-900 mb-1">Дананг</div>
                <div className="text-sm text-slate-600">
                  Прибрежный город с пляжами, развивающейся IT-индустрией и хорошей экологией.
                  Популярен среди цифровых кочевников.
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="font-semibold text-slate-900 mb-1">Нячанг</div>
                <div className="text-sm text-slate-600">
                  Курортный город на побережье. Пляжи, дайвинг, русскоязычное сообщество.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

