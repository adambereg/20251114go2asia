import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, Chip, Badge } from '@go2asia/ui';
import { ModuleHero } from '@/components/modules';
import { Calendar, MapPin, Users, Clock, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pulse Asia - События и мероприятия | Go2Asia',
  description: 'Актуальные события и мероприятия в Юго-Восточной Азии',
};

// Mock данные
const events = [
  {
    id: '1',
    title: 'Фестиваль еды на Пхукете',
    description: 'Гастрономический фестиваль с участием лучших ресторанов',
    date: '2024-12-15',
    time: '18:00',
    location: 'Пляж Камала, Пхукет',
    city: 'Пхукет',
    country: 'Таиланд',
    attendeesCount: 45,
    category: 'Еда',
    cover: null,
  },
  {
    id: '2',
    title: 'Встреча Digital Nomads в Бангкоке',
    description: 'Еженедельная встреча удалённых работников',
    date: '2024-12-10',
    time: '19:00',
    location: 'Кофейня "Кофе и Код", Бангкок',
    city: 'Бангкок',
    country: 'Таиланд',
    attendeesCount: 23,
    category: 'Сообщество',
    cover: null,
  },
  {
    id: '3',
    title: 'Концерт традиционной музыки',
    description: 'Выступление местных музыкантов',
    date: '2024-12-20',
    time: '20:00',
    location: 'Ханойская опера',
    city: 'Ханой',
    country: 'Вьетнам',
    attendeesCount: 67,
    category: 'Культура',
    cover: null,
  },
];

const dateFilters = ['Сегодня', 'Завтра', 'Выходные', 'Все'];

function formatEventDate(date: string, time: string) {
  const eventDate = new Date(`${date}T${time}`);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (eventDate.toDateString() === today.toDateString()) {
    return `Сегодня, ${time}`;
  }
  if (eventDate.toDateString() === tomorrow.toDateString()) {
    return `Завтра, ${time}`;
  }
  return `${eventDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  })}, ${time}`;
}

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

      {/* Filters */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {dateFilters.map((filter) => (
              <Chip key={filter} selected={filter === 'Все'}>
                {filter}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event.id} href={`/pulse/events/${event.id}`}>
              <Card hover className="h-full">
                {/* Cover Image Placeholder */}
                <div className="aspect-video bg-slate-200 relative">
                  {/* Date Badge Overlay */}
                  <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-xs text-slate-600 uppercase">
                      {new Date(event.date).toLocaleDateString('ru-RU', {
                        month: 'short',
                      })}
                    </div>
                  </div>
                </div>

                <CardContent className="p-5">
                  {/* Category Badge */}
                  <Badge variant="info" className="mb-3">
                    {event.category}
                  </Badge>

                  {/* Title */}
                  <h3 className="text-h3 md:text-2xl font-bold text-slate-900 line-clamp-2 mb-3">
                    {event.title}
                  </h3>

                  {/* Meta */}
                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatEventDate(event.date, event.time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{event.attendeesCount} участников</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button className="w-full bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors font-medium">
                    Участвовать
                  </button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
