'use client';

import React from 'react';
import { Event, EventFilters } from './types';

export interface DayViewProps {
  date: Date;
  events: Event[];
  filters?: EventFilters;
  onEventClick?: (event: Event) => void;
  onDateChange?: (date: Date) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  date,
  events,
  filters,
  onEventClick,
  onDateChange,
}) => {
  // TODO: Реализовать дневной вид календаря
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
      <p>Дневной вид календаря (в разработке)</p>
    </div>
  );
};

