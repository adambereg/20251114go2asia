'use client';

import React, { useMemo, useState } from 'react';
import { Event, EventFilters, CalendarDay } from './types';
import { DayPopover } from './DayPopover';

export interface MonthViewProps {
  date: Date;
  events: Event[];
  filters?: EventFilters;
  onEventClick?: (event: Event) => void;
  onDateClick?: (date: Date) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  date,
  events,
  filters,
  onEventClick,
  onDateClick,
}) => {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null);

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const calendarDays = useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Первый день месяца
    const firstDay = new Date(year, month, 1);
    // Последний день месяца
    const lastDay = new Date(year, month + 1, 0);
    
    // Первый день недели (понедельник = 1)
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    // Начало календаря (может быть предыдущий месяц)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDayOfWeek);
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 42 дня (6 недель)
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.startDate);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === currentDate.getTime();
      });
      
      days.push({
        date: currentDate,
        isToday: currentDate.getTime() === today.getTime(),
        isCurrentMonth: currentDate.getMonth() === month,
        events: dayEvents,
      });
    }
    
    return days;
  }, [date, events]);

  const handleDayClick = (day: CalendarDay, event: React.MouseEvent<HTMLDivElement>) => {
    if (day.events.length === 0) {
      onDateClick?.(day.date);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8,
    });
    setSelectedDay(day.date);
  };

  const handlePopoverClose = () => {
    setSelectedDay(null);
    setPopoverPosition(null);
  };

  const selectedDayData = selectedDay
    ? calendarDays.find((day) => day.date.getTime() === selectedDay.getTime())
    : null;

  return (
    <div className="relative">
      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header with days of week */}
        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-slate-600 border-r border-slate-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-px bg-slate-200">
          {calendarDays.map((day, index) => {
            const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
            
            return (
              <div
                key={index}
                onClick={(e) => handleDayClick(day, e)}
                className={`
                  bg-white min-h-[100px] p-2 cursor-pointer
                  hover:bg-slate-50 transition-colors
                  ${!day.isCurrentMonth ? 'opacity-40' : ''}
                  ${day.isToday ? 'ring-2 ring-sky-600 ring-inset' : ''}
                  ${isWeekend ? 'bg-slate-50' : ''}
                `}
              >
                {/* Day number */}
                <div
                  className={`
                    text-sm font-medium mb-1
                    ${day.isToday ? 'text-sky-600 font-bold' : 'text-slate-900'}
                    ${!day.isCurrentMonth ? 'text-slate-400' : ''}
                  `}
                >
                  {day.date.getDate()}
                </div>

                {/* Events indicators */}
                <div className="space-y-1">
                  {day.events.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                      className="text-xs bg-sky-100 text-sky-700 rounded px-1.5 py-0.5 truncate hover:bg-sky-200 transition-colors"
                    >
                      {event.title}
                    </div>
                  ))}
                  {day.events.length > 3 && (
                    <div className="text-xs text-slate-500 font-medium">
                      +{day.events.length - 3}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Popover */}
      {selectedDayData && popoverPosition && (
        <DayPopover
          day={selectedDayData}
          position={popoverPosition}
          onClose={handlePopoverClose}
          onEventClick={onEventClick}
          onDateClick={onDateClick}
        />
      )}
    </div>
  );
};

