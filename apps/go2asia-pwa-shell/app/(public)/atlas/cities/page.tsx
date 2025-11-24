import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@go2asia/ui';
import { ModuleHero } from '@/components/modules';
import { Globe, MapPin, Building2, Star } from 'lucide-react';
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

// Fallback данные для столиц
const capitalCities = [
  {
    id: 'bangkok',
    name: 'Бангкок',
    nameNative: 'Bangkok',
    country: 'Таиланд',
    countryId: 'thailand',
    description: 'Столица, с башнями Петронас',
    population: 8.3,
    populationUnit: 'M',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
  },
  {
    id: 'hanoi',
    name: 'Ханой',
    nameNative: 'Hà Nội',
    country: 'Вьетнам',
    countryId: 'vietnam',
    description: 'Древний город с озером Хоан Кием и французской архитектурой',
    population: 8.0,
    populationUnit: 'M',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg',
  },
  {
    id: 'vientiane',
    name: 'Вьентьян',
    nameNative: 'Vientiane',
    country: 'Лаос',
    countryId: 'laos',
    description: 'Столица, на берегу Меконга',
    population: 820,
    populationUnit: 'K',
    rating: 4.5,
    image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
  },
  {
    id: 'phnom-penh',
    name: 'Пномпень',
    nameNative: 'Phnom Penh',
    country: 'Камбоджа',
    countryId: 'cambodia',
    description: 'Королевский дворец и рынки',
    population: 2.1,
    populationUnit: 'M',
    rating: 4.4,
    image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
  },
  {
    id: 'kuala-lumpur',
    name: 'Куала-Лумпур',
    nameNative: 'Kuala Lumpur',
    country: 'Малайзия',
    countryId: 'malaysia',
    description: 'Столица, с башнями Петронас',
    population: 1.8,
    populationUnit: 'M',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
  },
  {
    id: 'manila',
    name: 'Манила',
    nameNative: 'Manila',
    country: 'Филиппины',
    countryId: 'philippines',
    description: 'Исторический Интрамурос и шопинг',
    population: 1.8,
    populationUnit: 'M',
    rating: 4.3,
    image: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
  },
  {
    id: 'jakarta',
    name: 'Джакарта',
    nameNative: 'Jakarta',
    country: 'Индонезия',
    countryId: 'indonesia',
    description: 'Музеи и шопинг',
    population: 10.6,
    populationUnit: 'M',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg',
  },
  {
    id: 'singapore',
    name: 'Сингапур',
    nameNative: 'Singapore',
    country: 'Сингапур',
    countryId: 'singapore',
    description: 'Современный мегаполис, высокий уровень жизни',
    population: 5.7,
    populationUnit: 'M',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/774691/pexels-photo-774691.jpeg',
  },
  {
    id: 'naypyidaw',
    name: 'Нейпьидо',
    nameNative: 'Naypyidaw',
    country: 'Мьянма',
    countryId: 'myanmar',
    description: 'Современная административная столица с широкими проспектами и правительственными комплексами',
    population: 1.2,
    populationUnit: 'M',
    rating: 4.3,
    image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
  },
];

// Fallback данные для нестоличных городов, организованные по странам
const citiesByCountry: Record<string, Array<{
  id: string;
  name: string;
  nameNative: string;
  description: string;
  population: number;
  populationUnit: 'M' | 'K';
  rating: number;
}>> = {
  vietnam: [
    { id: 'ho-chi-minh', name: 'Хошимин', nameNative: 'Hồ Chí Minh', description: 'Бывший Сайгон, крупнейший город страны', population: 9.0, populationUnit: 'M', rating: 4.8 },
    { id: 'danang', name: 'Дананг', nameNative: 'Đà Nẵng', description: 'Мосты и современная инфраструктура', population: 1.2, populationUnit: 'M', rating: 4.7 },
    { id: 'hue', name: 'Хюэ', nameNative: 'Huế', description: 'Императорские цитадели', population: 455, populationUnit: 'K', rating: 4.6 },
    { id: 'hoi-an', name: 'Хойан', nameNative: 'Hội An', description: 'Древний город с фонариками', population: 152, populationUnit: 'K', rating: 4.9 },
    { id: 'nha-trang', name: 'Нячанг', nameNative: 'Nha Trang', description: 'Пляжи и аквапарки', population: 392, populationUnit: 'K', rating: 4.5 },
    { id: 'phu-quoc', name: 'Фукуок', nameNative: 'Phú Quốc', description: 'Тропические острова', population: 179, populationUnit: 'K', rating: 4.7 },
    { id: 'sapa', name: 'Сапа', nameNative: 'Sa Pa', description: 'Горы и этнические деревни', population: 61, populationUnit: 'K', rating: 4.6 },
    { id: 'can-tho', name: 'Кан Тхо', nameNative: 'Cần Thơ', description: 'Меконг Дельта, рынки', population: 1.2, populationUnit: 'M', rating: 4.4 },
    { id: 'da-lat', name: 'Далат', nameNative: 'Đà Lạt', description: 'Горный климат и цветы', population: 406, populationUnit: 'K', rating: 4.7 },
    { id: 'hai-phong', name: 'Хайфон', nameNative: 'Hải Phòng', description: 'Портовый город', population: 2.0, populationUnit: 'M', rating: 4.3 },
    { id: 'quy-nhon', name: 'Куй Ньон', nameNative: 'Quy Nhon', description: 'Пляжи и релакс', population: 311, populationUnit: 'K', rating: 4.4 },
    { id: 'vung-tau', name: 'Вунгтау', nameNative: 'Vũng Tàu', description: 'Курортный город', population: 327, populationUnit: 'K', rating: 4.3 },
    { id: 'phan-thiet', name: 'Фантхьет', nameNative: 'Phan Thiết', description: 'Муй Не, пляжи и дюны', population: 205, populationUnit: 'K', rating: 4.5 },
    { id: 'ninh-binh', name: 'Нинь Бинь', nameNative: 'Ninh Bình', description: 'Карстовые пейзажи', population: 160, populationUnit: 'K', rating: 4.6 },
    { id: 'mai-chau', name: 'Май Чау', nameNative: 'Mai Châu', description: 'Долины и трекинг', population: 54, populationUnit: 'K', rating: 4.5 },
  ],
  thailand: [
    { id: 'chiang-mai', name: 'Чианг Май', nameNative: 'Chiang Mai', description: 'Культурный центр с храмами и рынками', population: 1.2, populationUnit: 'M', rating: 4.8 },
    { id: 'chiang-rai', name: 'Чианг Рай', nameNative: 'Chiang Rai', description: 'Золотой треугольник', population: 70, populationUnit: 'K', rating: 4.6 },
    { id: 'pattaya', name: 'Паттайя', nameNative: 'Pattaya', description: 'Ночной отдых и пляжи', population: 119, populationUnit: 'K', rating: 4.2 },
    { id: 'phuket', name: 'Пхукет', nameNative: 'Phuket', description: 'Пляжи и дайвинг', population: 416, populationUnit: 'K', rating: 4.7 },
    { id: 'krabi', name: 'Краби', nameNative: 'Krabi', description: 'Скалы и острова', population: 52, populationUnit: 'K', rating: 4.8 },
    { id: 'hua-hin', name: 'Хуа Хин', nameNative: 'Hua Hin', description: 'Королевский курорт с гольф-полями', population: 85, populationUnit: 'K', rating: 4.5 },
    { id: 'ayutthaya', name: 'Аюттхая', nameNative: 'Ayutthaya', description: 'Исторические руины', population: 54, populationUnit: 'K', rating: 4.7 },
    { id: 'sukhothai', name: 'Сухотай', nameNative: 'Sukhothai', description: 'Древние храмы', population: 37, populationUnit: 'K', rating: 4.6 },
  ],
  indonesia: [
    { id: 'yogyakarta', name: 'Джокьякарта', nameNative: 'Yogyakarta', description: 'Храмы Боробудур и Прамбанан', population: 422, populationUnit: 'K', rating: 4.8 },
    { id: 'bandung', name: 'Бандунг', nameNative: 'Bandung', description: 'Вулканы и чай', population: 2.5, populationUnit: 'M', rating: 4.5 },
    { id: 'surabaya', name: 'Сурабая', nameNative: 'Surabaya', description: 'История и еда', population: 2.9, populationUnit: 'M', rating: 4.4 },
    { id: 'medan', name: 'Медан', nameNative: 'Medan', description: 'Озеро Тоба', population: 2.4, populationUnit: 'M', rating: 4.3 },
    { id: 'denpasar', name: 'Денпасар', nameNative: 'Denpasar', description: 'Столица Бали', population: 725, populationUnit: 'K', rating: 4.6 },
    { id: 'ubud', name: 'Убуд', nameNative: 'Ubud', description: 'Искусство и йога', population: 74, populationUnit: 'K', rating: 4.9 },
  ],
  malaysia: [
    { id: 'george-town', name: 'Джорджтаун', nameNative: 'George Town', description: 'Пенанг, стрит-арт и кухня', population: 708, populationUnit: 'K', rating: 4.7 },
    { id: 'malacca', name: 'Малакка', nameNative: 'Malacca', description: 'Исторический центр', population: 484, populationUnit: 'K', rating: 4.6 },
    { id: 'kota-kinabalu', name: 'Кота Кинабалу', nameNative: 'Kota Kinabalu', description: 'Доступ к Борнео', population: 452, populationUnit: 'K', rating: 4.5 },
    { id: 'ipoh', name: 'Ипох', nameNative: 'Ipoh', description: 'Пещеры и еда', population: 737, populationUnit: 'K', rating: 4.4 },
  ],
  cambodia: [
    { id: 'siem-reap', name: 'Сием Рип', nameNative: 'Siem Reap', description: 'Ангкор Ват', population: 245, populationUnit: 'K', rating: 4.9 },
    { id: 'battambang', name: 'Баттамбанг', nameNative: 'Battambang', description: 'Колониальные здания и бамбуковый поезд', population: 130, populationUnit: 'K', rating: 4.5 },
    { id: 'sihanoukville', name: 'Сиануквиль', nameNative: 'Sihanoukville', description: 'Пляжи и казино', population: 89, populationUnit: 'K', rating: 4.2 },
  ],
  laos: [
    { id: 'luang-prabang', name: 'Луанг Прабанг', nameNative: 'Luang Prabang', description: 'ЮНЕСКО-сайт с водопадами', population: 56, populationUnit: 'K', rating: 4.8 },
    { id: 'vang-vieng', name: 'Ванг Виенг', nameNative: 'Vang Vieng', description: 'Тубинг и пещеры', population: 30, populationUnit: 'K', rating: 4.4 },
  ],
  myanmar: [
    { id: 'yangon', name: 'Янгон', nameNative: 'Yangon', description: 'Бывшая столица, пагода Шведагон', population: 5.4, populationUnit: 'M', rating: 4.6 },
    { id: 'mandalay', name: 'Мандалай', nameNative: 'Mandalay', description: 'Королевский город', population: 1.7, populationUnit: 'M', rating: 4.5 },
    { id: 'bagan', name: 'Баган', nameNative: 'Bagan', description: 'Тысячи пагод, воздушные шары', population: 22, populationUnit: 'K', rating: 4.9 },
  ],
  philippines: [
    { id: 'cebu', name: 'Себу', nameNative: 'Cebu City', description: 'Кресты Магеллана и дайвинг', population: 922, populationUnit: 'K', rating: 4.6 },
    { id: 'davao', name: 'Давао', nameNative: 'Davao', description: 'Фрукты и орлы', population: 1.7, populationUnit: 'M', rating: 4.4 },
  ],
  singapore: [],
};

const countryNames: Record<string, string> = {
  vietnam: 'Вьетнам',
  thailand: 'Таиланд',
  indonesia: 'Индонезия',
  malaysia: 'Малайзия',
  cambodia: 'Камбоджа',
  laos: 'Лаос',
  myanmar: 'Мьянма',
  philippines: 'Филиппины',
  singapore: 'Сингапур',
};

// SSG с revalidation каждый час
export const revalidate = 3600;

export default async function CitiesPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
  
  // Fetch cities from API with timeout
  let cities: any[] = [];
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
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

      {/* Capital Cities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {capitalCities.map((city) => (
            <Link key={city.id} href={`/atlas/cities/${city.id}`}>
              <Card hover className="h-full overflow-hidden p-0 border-0">
                <div className="relative w-full h-64 overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-slate-900">
                      Столица
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                    <p className="text-sm text-white/90 mb-2">{city.nameNative}</p>
                    <p className="text-sm text-white/80 mb-3">• {city.country}</p>
                    <p className="text-sm text-white/90 mb-4">{city.description}</p>
                    <div className="flex items-center gap-4 text-sm text-white/90">
                      <span>{city.population}{city.populationUnit}</span>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span>{city.rating}</span>
                      </div>
                      <span>0</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-sky-600">Открыть →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Other Cities Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-slate-600" />
            <h2 className="text-h2 md:text-3xl font-bold text-slate-900">Другие города</h2>
          </div>
          <p className="text-sm text-slate-600 mb-6">Города по странам</p>

          {Object.entries(citiesByCountry).map(([countryId, countryCities]) => {
            if (countryCities.length === 0) return null;
            
            return (
              <div key={countryId} className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                  <MapPin size={16} className="flex-shrink-0" />
                  <span>• {countryNames[countryId]} ({countryCities.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {countryCities.map((city) => {
                    const isMillionPlus = city.population >= 1 && city.populationUnit === 'M';
                    return (
                      <Link key={city.id} href={`/atlas/cities/${city.id}`}>
                        <Card hover className="h-full">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">
                                  {city.name}
                                </h3>
                                <p className="text-sm text-slate-600 mb-1">{city.nameNative}</p>
                              </div>
                              {isMillionPlus && (
                                <span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700 ml-2">
                                  1M+
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                              {city.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span>{city.population}{city.populationUnit}</span>
                              <div className="flex items-center gap-1">
                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                <span>{city.rating}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
