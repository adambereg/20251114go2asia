import type { FC, ReactNode } from 'react';
import { Badge } from '@go2asia/ui';
import { Clock, Eye } from 'lucide-react';

export interface AtlasCountryTab {
  id: string;
  label: string;
}

export interface AtlasCountryLayoutProps {
  countryName: string;
  flagEmoji?: string;
  tldr?: string;
  lastUpdatedAt?: string;
  viewsCount?: number;
  tabs?: AtlasCountryTab[];
  activeTabId?: string;
  headerSlot?: ReactNode;
  children: ReactNode;
}

const DEFAULT_TABS: AtlasCountryTab[] = [
  { id: 'overview', label: 'Обзор' },
  { id: 'history', label: 'История' },
  { id: 'geography', label: 'География' },
  { id: 'culture', label: 'Культура' },
  { id: 'living', label: 'Проживание' },
  { id: 'visas', label: 'Визы' },
  { id: 'business', label: 'Бизнес' },
];

// Базовый layout страницы страны в Atlas Asia.
// Содержит шапку, мета-информацию и навигацию по вкладкам.
export const AtlasCountryLayout: FC<AtlasCountryLayoutProps> = ({
  countryName,
  flagEmoji = '🌏',
  tldr,
  lastUpdatedAt = 'обновление в разработке',
  viewsCount,
  tabs = DEFAULT_TABS,
  activeTabId = 'overview',
  headerSlot,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <a href="/atlas" className="hover:text-sky-600">
              Atlas
            </a>
            <span>/</span>
            <span className="text-slate-900">{countryName}</span>
          </nav>

          {/* Title & Meta */}
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl" aria-hidden="true">
              {flagEmoji}
            </div>
            <div className="flex-1">
              <h1 className="text-h1 md:text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                {countryName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="verified">Проверено редакцией</Badge>
                {headerSlot}
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {lastUpdatedAt}
                </span>
                {viewsCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {viewsCount.toLocaleString('ru-RU')} просмотров
                  </span>
                )}
              </div>
            </div>
          </div>

          {tldr && (
            <p className="mt-4 text-body text-slate-700 leading-relaxed">
              {tldr}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default AtlasCountryLayout;


