import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { CalendarView } from '@/components/pulse';
import { Globe } from 'lucide-react';
import { Event } from '@/components/pulse/types';

export const metadata: Metadata = {
  title: 'Pulse Asia - События и мероприятия | Go2Asia',
  description: 'Актуальные события и мероприятия в Юго-Восточной Азии',
};

// Mock данные событий в формате Event
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Фестиваль еды на Пхукете',
    description: 'Гастрономический фестиваль с участием лучших ресторанов',
    startDate: new Date('2024-12-15T18:00:00'),
    endDate: new Date('2024-12-15T22:00:00'),
    timezone: 'Asia/Bangkok',
    location: {
      name: 'Пляж Камала',
      address: 'Пляж Камала, Пхукет',
      city: 'Пхукет',
      country: 'Таиланд',
    },
    attendeesCount: 45,
    category: 'Еда',
    badges: ['verified', 'russian-friendly'],
    price: { type: 'free' },
    language: 'ru',
    scale: 'city',
    status: 'published',
    verified: true,
    russianFriendly: true,
  },
  {
    id: '2',
    title: 'Встреча Digital Nomads в Бангкоке',
    description: 'Еженедельная встреча удалённых работников',
    startDate: new Date('2024-12-10T19:00:00'),
    endDate: new Date('2024-12-10T21:00:00'),
    timezone: 'Asia/Bangkok',
    location: {
      name: 'Кофейня "Кофе и Код"',
      address: 'Кофейня "Кофе и Код", Бангкок',
      city: 'Бангкок',
      country: 'Таиланд',
    },
    attendeesCount: 23,
    category: 'Сообщество',
    badges: ['free'],
    price: { type: 'free' },
    language: 'ru',
    scale: 'city',
    status: 'published',
  },
  {
    id: '3',
    title: 'Концерт традиционной музыки',
    description: 'Выступление местных музыкантов',
    startDate: new Date('2024-12-20T20:00:00'),
    endDate: new Date('2024-12-20T22:00:00'),
    timezone: 'Asia/Ho_Chi_Minh',
    location: {
      name: 'Ханойская опера',
      address: 'Ханойская опера',
      city: 'Ханой',
      country: 'Вьетнам',
    },
    attendeesCount: 67,
    category: 'Культура',
    badges: ['verified'],
    price: { type: 'paid', amount: 500, currency: 'VND' },
    language: 'local',
    scale: 'place',
    status: 'published',
    verified: true,
  },
];

export default function PulsePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Globe}
        title="Pulse Asia"
        description="События и мероприятия в Юго-Восточной Азии"
        gradientFrom="from-sky-500"
        gradientTo="to-sky-600"
      />

      <CalendarView
        events={mockEvents}
        initialView="month"
      />
    </div>
  );
}
