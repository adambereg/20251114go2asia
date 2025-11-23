import { Chip } from '@go2asia/ui';

export default function GuideOverviewPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Обзор</h2>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Описание */}
        <div className="px-4 py-4 text-sm text-slate-700 space-y-4">
          <p>
            Этот гайд поможет вам спланировать идеальное путешествие с учётом всех
            практических аспектов и особенностей региона.
          </p>
        </div>

        {/* For whom / когда актуально */}
        <div className="border-t border-slate-100 px-4 py-4">
          <h3 className="font-semibold text-slate-900 mb-3">Для кого</h3>
          <div className="flex flex-wrap gap-2">
            <Chip>Первый раз</Chip>
            <Chip>С детьми</Chip>
            <Chip>Digital nomad</Chip>
          </div>
        </div>

        {/* Ключевые тезисы */}
        <div className="border-t border-slate-100 px-4 py-4">
          <h3 className="font-semibold text-slate-900 mb-3">Ключевые тезисы</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• Подробный маршрут с таймингом</li>
            <li>• Практические советы по транспорту и жилью</li>
            <li>• Рекомендации по местам и еде</li>
            <li>• Бюджет и стоимость</li>
            <li>• Безопасность и полезные контакты</li>
          </ul>
        </div>

        {/* Связанные места */}
        <div className="border-t border-slate-100 px-4 py-4">
          <h3 className="font-semibold text-slate-900 mb-3">Связанные места</h3>
          <div className="flex flex-wrap gap-2">
            <Chip>Ханой</Chip>
            <Chip>Вьетнам</Chip>
            <Chip>Озеро Хоан Кием</Chip>
            <Chip>Ханойская цитадель</Chip>
          </div>
        </div>
      </section>
    </div>
  );
}

