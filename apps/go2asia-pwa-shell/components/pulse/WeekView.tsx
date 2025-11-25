'use client';

import React from 'react';
import { Event, EventFilters } from './types';

export interface WeekViewProps {
  date: Date;
  events: Event[];
  filters?: EventFilters;
  onEventClick?: (event: Event) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  date: _date,
  events: _events,
  filters: _filters,
  onEventClick: _onEventClick,
}) => {
  // TODO: Реализовать недельный вид календаря
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
      <p>Недельный вид календаря (в разработке)</p>
    </div>
  );
};

