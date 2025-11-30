'use client';

import { AtlasHomeView } from '@/modules/atlas';
import { useGetCountries, useGetPlaces } from '@go2asia/sdk/atlas';
import { useMemo } from 'react';

export function AtlasHomeClient() {
  // Загружаем страны из API
  const { data: countriesData, isLoading: countriesLoading } = useGetCountries({
    limit: 20,
  });

  // Загружаем популярные места из API
  const { data: placesData, isLoading: placesLoading } = useGetPlaces({
    limit: 3,
    sort: '-rating', // Сортировка по рейтингу по убыванию
  });

  // Преобразуем данные из API в формат компонента
  const countries = useMemo(() => {
    if (!countriesData?.data) return [];
    return countriesData.data.map((country) => ({
      id: country.id,
      name: country.name,
      flag: country.flag || '🌏',
      placesCount: country.placesCount || 0,
      description: country.description || '',
      heroImage: country.heroImage || 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
    }));
  }, [countriesData]);

  const popularPlaces = useMemo(() => {
    if (!placesData?.data) return [];
    return placesData.data.map((place) => ({
      id: place.id,
      title: place.name,
      city: place.city?.name || '',
      country: place.city?.country?.name || '',
      rating: place.rating || 0,
      reviewsCount: place.reviewsCount || 0,
    }));
  }, [placesData]);

  // Показываем загрузку или данные
  if (countriesLoading || placesLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Загрузка...</div>
      </div>
    );
  }

  return <AtlasHomeView countries={countries} popularPlaces={popularPlaces} />;
}

