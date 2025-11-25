'use client';

import React, { useMemo } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Event, EventFilters } from './types';

export interface WeekViewProps {
  date: Date;
  events: Event[];
  filters?: EventFilters;
  onEventClick?: (event: Event) => void;
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

export const WeekView: React.FC<WeekViewProps> = ({
  date,
  events,
  filters: _filters,
  onEventClick,
}) => {
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Вычисляем начало недели (понедельник)
  const weekStart = useMemo(() => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Понедельник = 1
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }, [date]);

  // Генерируем дни недели
  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + i);
      
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.startDate);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === dayDate.getTime();
      });

      days.push({
        date: dayDate,
        isToday: dayDate.getTime() === today.getTime(),
        dayName: dayDate.toLocaleDateString('ru-RU', { weekday: 'short' }),
        dayNumber: dayDate.getDate(),
        events: dayEvents,
      });
    }
    return days;
  }, [weekStart, events]);

  // Получаем события для конкретного дня и временного слота
  const getEventsForSlot = (dayDate: Date, hour: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      const eventHour = eventDate.getHours();
      const eventDay = new Date(eventDate);
      eventDay.setHours(0, 0, 0, 0);
      const dayDateNormalized = new Date(dayDate);
      dayDateNormalized.setHours(0, 0, 0, 0);
      
      return eventDay.getTime() === dayDateNormalized.getTime() && eventHour === hour;
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
    const slotHeight = 60; // Высота одного слота в пикселях (примерно)
    return Math.max((durationMinutes / 60) * slotHeight, 20); // Минимум 20px
  };

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header с днями недели */}
      <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
        <div className="p-3 border-r border-slate-200"></div>
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`
              p-3 text-center border-r border-slate-200 last:border-r-0
              ${day.isToday ? 'bg-sky-50' : ''}
            `}
          >
            <div className="text-xs text-slate-600 mb-1">{dayNames[index]}</div>
            <div
              className={`
                text-lg font-bold
                ${day.isToday ? 'text-sky-600' : 'text-slate-900'}
              `}
            >
              {day.dayNumber}
            </div>
          </div>
        ))}
      </div>

      {/* Вертикальная сетка со слотами времени */}
      <div className="overflow-y-auto max-h-[600px]">
        <div className="grid grid-cols-8">
          {/* Колонка времени */}
          <div className="border-r border-slate-200 bg-slate-50">
            {timeSlots.map((slot) => (
              <div
                key={slot.hour}
                className="h-[60px] border-b border-slate-100 px-2 py-1 text-xs text-slate-500"
              >
                {slot.label}
              </div>
            ))}
          </div>

          {/* Колонки дней */}
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r border-slate-200 last:border-r-0 relative">
              {timeSlots.map((slot, slotIndex) => {
                const slotEvents = getEventsForSlot(day.date, slot.hour);
                
                return (
                  <div
                    key={slotIndex}
                    className="h-[60px] border-b border-slate-100 relative hover:bg-slate-50 transition-colors"
                  >
                    {slotEvents.map((event) => {
                      const position = getEventPosition(event);
                      const height = getEventHeight(event);
                      
                      return (
                        <div
                          key={event.id}
                          onClick={() => onEventClick?.(event)}
                          className="absolute left-1 right-1 rounded px-2 py-1 bg-sky-100 hover:bg-sky-200 cursor-pointer transition-colors z-20 overflow-hidden"
                          style={{
                            top: `${position}%`,
                            height: `${Math.min(height, 100 - position)}%`,
                            minHeight: '20px',
                          }}
                        >
                          <div className="text-xs font-medium text-sky-900 truncate">
                            {event.title}
                          </div>
                          <div className="text-[10px] text-sky-700 truncate">
                            {new Date(event.startDate).toLocaleTimeString('ru-RU', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Список всех событий недели (для мобильных устройств) */}
      <div className="lg:hidden border-t border-slate-200 p-4">
        <h3 className="text-sm font-bold text-slate-900 mb-3">События недели</h3>
        <div className="space-y-3">
          {events
            .filter((event) => {
              const eventDate = new Date(event.startDate);
              eventDate.setHours(0, 0, 0, 0);
              return eventDate >= weekStart && eventDate < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
            })
            .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
            .map((event) => (
              <div
                key={event.id}
                onClick={() => onEventClick?.(event)}
                className="p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 text-center">
                    <div className="text-xs font-medium text-slate-600">
                      {new Date(event.startDate).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 mb-1 line-clamp-1">
                      {event.title}
                    </h4>
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
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
