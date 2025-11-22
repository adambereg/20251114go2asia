import type { ReactNode } from 'react';
import { AtlasCountryLayout } from '@/modules/atlas';

// Временно используем статичные данные — дальше их поднимем в SDK/сервер.
const mockCountry = {
  name: 'Вьетнам',
  flagEmoji: '🇻🇳',
  tldr:
    'Отличный баланс цены и качества жизни, развитая инфраструктура в крупных городах.',
};

export default function CountryLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AtlasCountryLayout
      countryName={mockCountry.name}
      flagEmoji={mockCountry.flagEmoji}
      tldr={mockCountry.tldr}
      lastUpdatedAt="Последнее обновление: 17.11.2025"
      viewsCount={1234}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <aside className="hidden lg:block">
          <nav className="space-y-1 text-sm">
            <div className="font-semibold text-slate-900 mb-2">
              Разделы страны
            </div>
            {[
              { href: '', label: 'Обзор' },
              { href: 'history', label: 'История' },
              { href: 'geography', label: 'География' },
              { href: 'culture', label: 'Культура' },
              { href: 'living', label: 'Проживание' },
              { href: 'visas', label: 'Визы' },
              { href: 'business', label: 'Бизнес' },
              { href: 'places', label: 'Места' },
            ].map((item) => (
              <a
                key={item.href || 'overview'}
                href={item.href ? item.href : '.'}
                className="block rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </AtlasCountryLayout>
  );
}


