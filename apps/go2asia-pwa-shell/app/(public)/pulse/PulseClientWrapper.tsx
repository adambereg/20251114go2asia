'use client';

import { ModuleHero } from '@/components/modules';
import { PulseClient } from './PulseClient';
import { Globe } from 'lucide-react';
import { useGetEvents } from '@go2asia/sdk/pulse';
import { useMemo } from 'react';
import type { Event } from '@/components/pulse/types';

export function PulseClientWrapper() {
  // Загружаем события из API
  const { data: eventsData, isLoading } = useGetEvents({
    limit: 100, // Загружаем больше событий для календаря
  });

  // Преобразуем данные из API в формат компонента
  const events = useMemo(() => {
    if (!eventsData?.data) return [];
    return eventsData.data.map((event): Event => ({
      id: event.id,
      title: event.title,
      description: event.description || '',
      startTime: new Date(event.startTime),
      endTime: event.endTime ? new Date(event.endTime) : undefined,
      location: {
        city: event.city?.name || '',
        country: event.city?.country?.name || '',
        address: event.address || '',
        coordinates: event.coordinates
          ? {
              lat: event.coordinates.lat,
              lng: event.coordinates.lng,
            }
          : undefined,
      },
      category: event.category || 'other',
      type: event.type || 'event',
      coverImage: event.coverImage || 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
      organizer: event.organizer
        ? {
            id: event.organizer.id,
            name: event.organizer.name || '',
            avatar: event.organizer.avatar || undefined,
            isPro: event.organizer.isPro || false,
          }
        : undefined,
      price: event.price
        ? {
            amount: event.price.amount,
            currency: event.price.currency || 'USD',
            isFree: event.price.isFree || false,
          }
        : undefined,
      language: event.language || 'ru',
      rating: event.rating || 0,
      attendeesCount: event.attendeesCount || 0,
      isFeatured: event.isFeatured || false,
    }));
  }, [eventsData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ModuleHero
          icon={Globe}
          title="Pulse Asia"
          description="События и мероприятия в Юго-Восточной Азии"
          gradientFrom="from-sky-500"
          gradientTo="to-sky-600"
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600">Загрузка событий...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Globe}
        title="Pulse Asia"
        description="События и мероприятия в Юго-Восточной Азии"
        gradientFrom="from-sky-500"
        gradientTo="to-sky-600"
      />
      <PulseClient events={events} />
    </div>
  );
}
