import { MapPin } from 'lucide-react';
import { cn } from '@go2asia/ui';

interface LocationPromptProps {
  className?: string;
  onAllowLocation?: () => void;
  onManualCity?: () => void;
}

export function LocationPrompt({
  className,
  onAllowLocation,
  onManualCity,
}: LocationPromptProps) {
  return (
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12', className)}>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Рядом с вами
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Места, события и жильё в вашем районе
        </p>
      </div>
      <div className="bg-sky-50 rounded-xl p-6 sm:p-8 border border-sky-200">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center">
            <MapPin size={32} className="text-sky-600" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Включите определение местоположения
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Мы покажем интересные места и события рядом с вами
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
              <button
                onClick={onAllowLocation}
                className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors font-medium text-sm"
              >
                Разрешить доступ к геолокации
              </button>
              <button
                onClick={onManualCity}
                className="px-6 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg transition-colors font-medium text-sm"
              >
                Указать город вручную
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

