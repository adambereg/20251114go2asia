import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@go2asia/ui';
import { ModuleHero } from '@/components/modules';
import { Globe, MapPin } from 'lucide-react';
import { AtlasMainNav } from '@/modules/atlas';
import { AtlasSearchBar } from '@/modules/atlas';

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
  
  // Fetch cities from API with timeout
  let cities: any[] = [];
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 секунды таймаут
    
    const response = await fetch(`${apiUrl}/v1/api/content/cities`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.items && Array.isArray(data.items)) {
        cities = data.items;
      }
    }
  } catch (error) {
    // Используем пустой массив при любой ошибке (таймаут, сеть, etc.)
    console.warn('Failed to fetch cities from API:', error);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Globe}
        title="Atlas Asia"
        description="«Живой» вики-справочник по странам Юго-Восточной Азии с UGC и редакционной поддержкой"
        gradientFrom="from-sky-500"
        gradientTo="to-sky-600"
      />

      {/* Top controls: internal nav + search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <AtlasMainNav />
        <AtlasSearchBar />
      </section>

      {/* Cities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-6">
          Города
        </h2>
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
