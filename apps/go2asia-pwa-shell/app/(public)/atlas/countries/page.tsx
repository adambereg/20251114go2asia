import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@go2asia/ui';
import { ModuleHero } from '@/components/modules';
import { Globe, MapPin } from 'lucide-react';
import { AtlasMainNav } from '@/modules/atlas';
import { AtlasSearchBar } from '@/modules/atlas';

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

// Fallback моковые данные для стран
const fallbackCountries = [
  {
    id: 'thailand',
    name: 'Таиланд',
    flag: '🇹🇭',
    placesCount: 245,
    citiesCount: 12,
    description: 'Королевство Таиланд',
    heroImage: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
  },
  {
    id: 'vietnam',
    name: 'Вьетнам',
    flag: '🇻🇳',
    placesCount: 189,
    citiesCount: 10,
    description: 'Социалистическая Республика Вьетнам',
    heroImage: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
  },
  {
    id: 'indonesia',
    name: 'Индонезия',
    flag: '🇮🇩',
    placesCount: 312,
    citiesCount: 15,
    description: 'Республика Индонезия',
    heroImage: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
  },
  {
    id: 'malaysia',
    name: 'Малайзия',
    flag: '🇲🇾',
    placesCount: 156,
    citiesCount: 8,
    description: 'Высокий уровень жизни, отличное медобслуживание, программа ММ2Н',
    heroImage: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
  },
  {
    id: 'singapore',
    name: 'Сингапур',
    flag: '🇸🇬',
    placesCount: 98,
    citiesCount: 1,
    description: 'Современный мегаполис, высокий уровень жизни, бизнес-хаб Азии',
    heroImage: 'https://images.pexels.com/photos/774691/pexels-photo-774691.jpeg',
  },
  {
    id: 'cambodia',
    name: 'Камбоджа',
    flag: '🇰🇭',
    placesCount: 87,
    citiesCount: 5,
    description: 'Самые низкие цены в регионе, простое получение долгосрочных виз',
    heroImage: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
  },
  {
    id: 'laos',
    name: 'Лаос',
    flag: '🇱🇦',
    placesCount: 45,
    citiesCount: 3,
    description: 'Тихая жизнь среди гор и джунглей, минимальный туристический поток',
    heroImage: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
  },
  {
    id: 'myanmar',
    name: 'Мьянма',
    flag: '🇲🇲',
    placesCount: 32,
    citiesCount: 4,
    description: 'Аутентичная Азия, минимум иностранцев, очень низкие цены',
    heroImage: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
  },
];

export default async function CountriesPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
  
  // Fetch countries from API with timeout
  let countries = fallbackCountries;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 секунды таймаут
    
    const response = await fetch(`${apiUrl}/v1/api/content/countries`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        countries = data.items;
      }
    }
  } catch (error) {
    // Используем fallback данные при любой ошибке (таймаут, сеть, etc.)
    console.warn('Failed to fetch countries from API, using fallback data:', error);
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

      {/* Countries Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-6">
          Страны
        </h2>
        {countries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country: any) => (
              <Link key={country.id} href={`/atlas/countries/${country.id}`}>
                <Card hover className="h-full overflow-hidden p-0 border-0">
                  {country.heroImage && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={country.heroImage}
                        alt={country.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {country.flag && (
                        <div className="absolute top-4 left-4 text-4xl">{country.flag}</div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{country.name}</h3>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6">
                    {!country.heroImage && (
                      <div className="flex items-start gap-4 mb-4">
                        {country.flag && (
                          <div className="text-4xl flex-shrink-0">{country.flag}</div>
                        )}
                        <h3 className="text-h3 md:text-2xl font-bold text-slate-900">
                          {country.name}
                        </h3>
                      </div>
                    )}
                    {country.description && (
                      <p className="text-small text-slate-600 mb-3 line-clamp-2">
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

