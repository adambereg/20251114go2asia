'use client';

import React from 'react';
import { Event, EventFilters } from './types';

export interface AgendaViewProps {
  events: Event[];
  filters?: EventFilters;
  onEventClick?: (event: Event) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  events,
  filters,
  onEventClick,
}) => {
  // TODO: Реализовать вид списка событий (Agenda)
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
      <p>Список событий (в разработке)</p>
    </div>
  );
};

