import type { FC, ReactNode } from 'react';
import { Badge } from '@go2asia/ui';

export interface AtlasCityLayoutProps {
  cityName: string;
  countryName?: string;
  tldr?: string;
  children: ReactNode;
}

// Каркас страницы города: районы, транспорт, стоимость жизни и т.д.
export const AtlasCityLayout: FC<AtlasCityLayoutProps> = ({
  cityName,
  countryName,
  tldr,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <a href="/atlas" className="hover:text-sky-600">
              Atlas
            </a>
            <span>/</span>
            {countryName && (
              <>
                <span className="text-slate-600">{countryName}</span>
                <span>/</span>
              </>
            )}
            <span className="text-slate-900">{cityName}</span>
          </nav>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-h1 md:text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                {cityName}
              </h1>
              {countryName && (
                <p className="text-sm text-slate-600 mb-3">{countryName}</p>
              )}
              {tldr && (
                <p className="text-body text-slate-700 leading-relaxed">
                  {tldr}
                </p>
              )}
            </div>
            <Badge>Городской гид в разработке</Badge>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default AtlasCityLayout;


