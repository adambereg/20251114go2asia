import type { ReactNode } from 'react';
import { AtlasCountryLayout } from '@/modules/atlas';
import {
  Info,
  Image,
  Map,
  Building2,
  CloudSun,
  History,
  Globe2,
  Palette,
  Home,
  BadgeCheck,
  BriefcaseBusiness,
  Landmark,
  MessageCircle,
  Star,
  Calculator,
} from 'lucide-react';

// Временно используем статичные данные — дальше их поднимем в SDK/сервер.
const mockCountry = {
  name: 'Вьетнам',
  flagEmoji: '🇻🇳',
};

const sideNavItems = [
  { key: 'overview', label: 'Обзор', icon: Info, href: '.' },
  { key: 'gallery', label: 'Фотогалерея', icon: Image, href: '#' },
  { key: 'map', label: 'Карта', icon: Map, href: '#' },
  { key: 'cities', label: 'Города', icon: Building2, href: '#' },
  { key: 'weather', label: 'Погода и климат', icon: CloudSun, href: '#' },
  { key: 'history', label: 'История', icon: History, href: 'history' },
  { key: 'geography', label: 'География', icon: Globe2, href: 'geography' },
  { key: 'culture', label: 'Культура', icon: Palette, href: 'culture' },
  { key: 'living', label: 'Проживание', icon: Home, href: 'living' },
  { key: 'visas', label: 'Визы', icon: BadgeCheck, href: 'visas' },
  { key: 'business', label: 'Бизнес', icon: BriefcaseBusiness, href: 'business' },
  { key: 'sights', label: 'Достопримечательности', icon: Landmark, href: 'places' },
  { key: 'phrasebook', label: 'Разговорник', icon: MessageCircle, href: '#' },
  { key: 'reviews', label: 'Отзывы экспатов', icon: Star, href: '#' },
  { key: 'calculator', label: 'Калькулятор стоимости', icon: Calculator, href: '#' },
] as const;

export default function CountryLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AtlasCountryLayout
      countryName={mockCountry.name}
      flagEmoji={mockCountry.flagEmoji}
      lastUpdatedAt="Последнее обновление: 17.11.2025"
      viewsCount={1234}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <aside className="hidden lg:block">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm">
            <div className="font-semibold text-slate-900 mb-3">
              Структура справочника
            </div>
            <nav className="space-y-1">
              {sideNavItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = index === 0;
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors ${
                      isActive
                        ? 'bg-sky-50 text-sky-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>
        <section>{children}</section>
      </div>
    </AtlasCountryLayout>
  );
}


