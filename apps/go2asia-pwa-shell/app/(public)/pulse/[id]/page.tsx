import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventDetail } from '@/components/pulse/EventDetail';
import { Event } from '@/components/pulse/types';

// Mock данные событий (в реальности будут загружаться из API)
const mockEvents: Record<string, Event> = {
  '1': {
    id: '1',
    title: 'Утренняя йога на пляже',
    description: 'Йога-сессия на рассвете с видом на море. Подходит для всех уровней подготовки. Приносите коврик и хорошее настроение!',
    startDate: new Date('2025-11-23T06:00:00'),
    endDate: new Date('2025-11-23T07:30:00'),
    timezone: 'Asia/Bangkok',
    location: {
      name: 'Пляж Ката',
      address: 'Пляж Ката, Пхукет',
      city: 'Пхукет',
      country: 'Таиланд',
      placeId: 'kata-beach-phuket',
    },
    attendeesCount: 12,
    maxAttendees: 20,
    category: 'Спорт',
    tags: ['йога', 'утро', 'пляж', 'здоровье'],
    badges: ['free', 'verified'],
    price: { type: 'free' },
    language: 'ru',
    scale: 'place',
    status: 'published',
    verified: true,
    organizer: {
      id: 'org-1',
      name: 'Yoga Phuket Community',
      type: 'pro',
    },
    atlasLinks: {
      countryId: 'thailand',
      cityId: 'phuket',
      placeId: 'kata-beach-phuket',
    },
  },
  '5': {
    id: '5',
    title: 'Мастер-класс по тайской кухне',
    description: 'Учимся готовить пад тай, том ям и другие классические блюда тайской кухни. Все ингредиенты включены, рецепты на русском языке.',
    startDate: new Date('2025-11-25T10:00:00'),
    endDate: new Date('2025-11-25T13:00:00'),
    timezone: 'Asia/Bangkok',
    location: {
      name: 'Cooking School Bangkok',
      address: 'Silom Road, Бангкок',
      city: 'Бангкок',
      country: 'Таиланд',
      placeId: 'cooking-school-bangkok',
    },
    attendeesCount: 8,
    maxAttendees: 12,
    category: 'Еда',
    tags: ['кулинария', 'тайская кухня', 'мастер-класс'],
    badges: ['verified', 'russian-friendly'],
    price: { type: 'paid', amount: 1200, currency: 'THB' },
    language: 'ru',
    scale: 'place',
    status: 'published',
    verified: true,
    russianFriendly: true,
    organizer: {
      id: 'org-2',
      name: 'Cooking School Bangkok',
      type: 'partner',
    },
    atlasLinks: {
      countryId: 'thailand',
      cityId: 'bangkok',
      placeId: 'cooking-school-bangkok',
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = mockEvents[id];

  if (!event) {
    return {
      title: 'Событие не найдено | Pulse Asia',
    };
  }

  return {
    title: `${event.title} | Pulse Asia`,
    description: event.description || `Событие ${event.title} в ${event.location?.city || event.location?.country}`,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = mockEvents[id];

  if (!event) {
    notFound();
  }

  return <EventDetail event={event} />;
}

