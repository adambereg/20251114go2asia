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
  });

  // Преобразуем данные из API в формат компонента
  const countries = useMemo(() => {
    if (!countriesData?.items) return [];
    return countriesData.items.map((country) => ({
      id: country.id,
      name: country.name,
      flag: country.flag || '🌏',
      placesCount: country.placesCount || 0,
      description: country.description || '',
      heroImage: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg', // TODO: Get heroImage when API supports it
    }));
  }, [countriesData]);

  const popularPlaces = useMemo(() => {
    if (!placesData?.items) return [];
    return placesData.items.map((place) => ({
      id: place.id,
      title: place.name,
      city: '', // TODO: Get city name from cityId when API supports it
      country: '', // TODO: Get country name when API supports it
      rating: 0, // TODO: Get rating when API supports it
      reviewsCount: 0, // TODO: Get reviews count when API supports it
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

