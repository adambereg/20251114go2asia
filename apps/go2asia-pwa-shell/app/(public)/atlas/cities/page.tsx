import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@go2asia/ui';
import { MapPin, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Города Юго-Восточной Азии | Go2Asia Atlas',
  description: 'Список всех городов Юго-Восточной Азии в Go2Asia Atlas',
  openGraph: {
    title: 'Города Юго-Восточной Азии',
    description: 'Исследуйте города региона и их уникальные особенности',
    type: 'website',
  },
};

// SSG с revalidation каждый час
export const revalidate = 3600;

export default async function CitiesPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
  
  // Fetch cities from API
  const cities = await fetch(`${apiUrl}/v1/api/content/cities`, {
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
            <span className="text-slate-900">Города</span>
          </nav>

          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 lg:w-10 lg:h-10 text-sky-600" />
            <h1 className="text-h1 md:text-4xl lg:text-5xl font-bold text-slate-900">
              Города Юго-Восточной Азии
            </h1>
          </div>
          <p className="text-body text-slate-600">
            Исследуйте города региона и их уникальные особенности
          </p>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city: any) => (
              <Link key={city.id} href={`/atlas/cities/${city.id}`}>
                <Card hover className="h-full overflow-hidden">
                  {city.image && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{city.name}</h3>
                        {city.countryName && (
                          <p className="text-sm text-white/90">{city.countryName}</p>
                        )}
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6">
                    {!city.image && (
                      <div className="mb-4">
                        <h3 className="text-h3 md:text-2xl font-bold text-slate-900 mb-1">
                          {city.name}
                        </h3>
                        {city.countryName && (
                          <p className="text-sm text-slate-600">{city.countryName}</p>
                        )}
                      </div>
                    )}
                    {city.description && (
                      <p className="text-small text-slate-600 mb-3 line-clamp-2">
                        {city.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={16} className="flex-shrink-0" />
                      <span>
                        {city.placesCount || 0} мест
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">Города загружаются...</p>
          </div>
        )}
      </section>
    </div>
  );
}
