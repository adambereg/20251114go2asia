import type { FC, ReactNode } from 'react';
import { Badge, Card, CardContent, Chip } from '@go2asia/ui';
import { MapPin } from 'lucide-react';

export interface AtlasPlaceAttribute {
  id: string;
  label: string;
}

export interface AtlasPlaceLayoutProps {
  title: string;
  cityName?: string;
  countryName?: string;
  isRussianFriendly?: boolean;
  attributes?: AtlasPlaceAttribute[];
  children?: ReactNode;
}

// Карточка места (POI): базовые данные + атрибуты, интеграции и UGC-зона.
export const AtlasPlaceLayout: FC<AtlasPlaceLayoutProps> = ({
  title,
  cityName,
  countryName,
  isRussianFriendly,
  attributes = [],
  children,
}) => {
  const locationLabel = [cityName, countryName].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
          <nav className="flex items-center gap-2 text-sm text-slate-600">
            <a href="/atlas" className="hover:text-sky-600">
              Atlas
            </a>
            <span>/</span>
            {cityName && (
              <>
                <span className="text-slate-600">{cityName}</span>
                <span>/</span>
              </>
            )}
            <span className="text-slate-900">{title}</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-h1 md:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                {title}
              </h1>
              {locationLabel && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={14} />
                  <span>{locationLabel}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {isRussianFriendly && (
                <Badge variant="verified">Russian Friendly</Badge>
              )}
              <Badge>Профиль в разработке</Badge>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {attributes.map((attribute) => (
                <Chip key={attribute.id}>{attribute.label}</Chip>
              ))}
              {attributes.length === 0 && (
                <span className="text-sm text-slate-500">
                  Атрибуты места появятся после настройки Russian Friendly и
                  контент-квестов.
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {children}
      </main>
    </div>
  );
};

export default AtlasPlaceLayout;


