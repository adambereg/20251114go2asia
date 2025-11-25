'use client';

import React, { useMemo } from 'react';
import { Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Event, EventFilters } from './types';
import { Card, CardContent } from '@go2asia/ui';

export interface DayViewProps {
  date: Date;
  events: Event[];
  filters?: EventFilters;
  onEventClick?: (event: Event) => void;
  onDateChange?: (date: Date) => void;
}

// Генерация временных слотов (каждый час с 0:00 до 23:00)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    slots.push({
      hour,
      label: `${hour.toString().padStart(2, '0')}:00`,
    });
  }
  return slots;
};

export const DayView: React.FC<DayViewProps> = ({
  date,
  events,
  filters: _filters,
  onEventClick,
  onDateChange,
}) => {
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Фильтруем события для выбранного дня
  const dayEvents = useMemo(() => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return events
      .filter((event) => {
        const eventDate = new Date(event.startDate);
        return eventDate >= dayStart && eventDate <= dayEnd;
      })
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [date, events]);

  // Получаем события для конкретного временного слота
  const getEventsForSlot = (hour: number) => {
    return dayEvents.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate.getHours() === hour;
    });
  };

  // Вычисляем позицию события в слоте (для событий, которые не начинаются точно в начале часа)
  const getEventPosition = (event: Event) => {
    const eventDate = new Date(event.startDate);
    const minutes = eventDate.getMinutes();
    return (minutes / 60) * 100; // Процент от высоты слота
  };

  // Вычисляем высоту события в слотах
  const getEventHeight = (event: Event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const slotHeight = 80; // Высота одного слота в пикселях
    return Math.max((durationMinutes / 60) * slotHeight, 30); // Минимум 30px
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handlePrevDay = () => {
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    onDateChange?.(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange?.(nextDay);
  };

  return (
    <div className="space-y-4">
      {/* Навигация по дням */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevDay}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Предыдущий день"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          
          <div className="text-center">
            <h2 className="text-h3 md:text-2xl font-bold text-slate-900">
              {formatDate(date)}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {dayEvents.length} {dayEvents.length === 1 ? 'событие' : 'событий'}
            </p>
          </div>
          
          <button
            onClick={handleNextDay}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Следующий день"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Таймлайн */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4">
          {/* Колонка времени */}
          <div className="col-span-12 lg:col-span-2 border-r border-slate-200 bg-slate-50">
            <div className="sticky top-0 p-4">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Время</h3>
            </div>
            {timeSlots.map((slot) => (
              <div
                key={slot.hour}
                className="h-[80px] border-b border-slate-100 px-4 py-2 text-sm text-slate-600"
              >
                {slot.label}
              </div>
            ))}
          </div>

          {/* Колонка событий */}
          <div className="col-span-12 lg:col-span-10 relative">
            {timeSlots.map((slot, slotIndex) => {
              const slotEvents = getEventsForSlot(slot.hour);
              
              return (
                <div
                  key={slotIndex}
                  className="h-[80px] border-b border-slate-100 relative hover:bg-slate-50 transition-colors"
                >
                  {slotEvents.map((event) => {
                    const position = getEventPosition(event);
                    const height = getEventHeight(event);
                    
                    return (
                      <div
                        key={event.id}
                        onClick={() => onEventClick?.(event)}
                        className="absolute left-2 right-2 rounded-lg px-3 py-2 bg-sky-100 hover:bg-sky-200 cursor-pointer transition-colors z-20 shadow-sm border border-sky-200"
                        style={{
                          top: `${position}%`,
                          height: `${Math.min(height, 100 - position)}%`,
                          minHeight: '60px',
                        }}
                      >
                        <div className="flex items-start gap-2 h-full">
                          <Clock className="w-4 h-4 text-sky-700 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-sky-900 mb-1 line-clamp-1">
                              {event.title}
                            </h4>
                            <div className="text-xs text-sky-700 mb-1">
                              {new Date(event.startDate).toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                              {event.endDate && (
                                <> - {new Date(event.endDate).toLocaleTimeString('ru-RU', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}</>
                              )}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1 text-xs text-sky-600">
                                <MapPin className="w-3 h-3" />
                                <span className="line-clamp-1">
                                  {event.location.name || event.location.address}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Список событий (для мобильных устройств и как альтернатива) */}
      <div className="lg:hidden bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Все события дня</h3>
        <div className="space-y-3">
          {dayEvents.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              На этот день нет событий
            </p>
          ) : (
            dayEvents.map((event) => (
              <Card
                key={event.id}
                hover
                onClick={() => onEventClick?.(event)}
                className="cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="text-xs font-medium text-slate-600 mb-1">
                        {new Date(event.startDate).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      {event.endDate && (
                        <div className="text-xs text-slate-500">
                          {new Date(event.endDate).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-slate-900 mb-1 line-clamp-2">
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <MapPin className="w-3 h-3" />
                          <span className="line-clamp-1">
                            {event.location.name || event.location.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
