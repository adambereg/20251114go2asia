import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@go2asia/ui';
import { MapPin, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Страны Юго-Восточной Азии | Go2Asia Atlas',
  description: 'Список всех стран Юго-Восточной Азии в Go2Asia Atlas',
  openGraph: {
    title: 'Страны Юго-Восточной Азии',
    description: 'Исследуйте страны Юго-Восточной Азии',
    type: 'website',
  },
};

// SSG с revalidation каждый час
export const revalidate = 3600;

export default async function CountriesPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
  
  // Fetch countries from API
  const countries = await fetch(`${apiUrl}/v1/api/content/countries`, {
    next: { revalidate: 3600 },
  })
    .then((res) => res.json())
    .then((data) => data.items || [])
    .catch(() => []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Link href="/atlas" className="hover:text-sky-600">
              Atlas
            </Link>
            <span>/</span>
            <span className="text-slate-900">Страны</span>
          </nav>

          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-8 h-8 lg:w-10 lg:h-10 text-sky-600" />
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Страны Юго-Восточной Азии
            </h1>
          </div>
          <p className="text-lg text-slate-600">
            Исследуйте страны региона и их уникальные особенности
          </p>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {countries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country: any) => (
              <Link key={country.id} href={`/atlas/countries/${country.id}`}>
                <Card hover className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {country.flag && (
                        <div className="text-4xl flex-shrink-0">{country.flag}</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {country.name}
                        </h3>
                        {country.description && (
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {country.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <MapPin size={16} className="flex-shrink-0" />
                          <span>
                            {country.citiesCount || 0} городов
                            {country.placesCount ? ` • ${country.placesCount} мест` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">Страны загружаются...</p>
          </div>
        )}
      </section>
    </div>
  );
}

