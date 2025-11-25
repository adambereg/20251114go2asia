'use client';

import React from 'react';
import { EventFilters as EventFiltersType } from './types';

export interface EventFiltersProps {
  filters: EventFiltersType;
  onFiltersChange: (filters: EventFiltersType) => void;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  filters: _filters,
  onFiltersChange: _onFiltersChange,
}) => {
  // TODO: Реализовать фильтры событий
  return (
    <div className="bg-white border-b border-slate-200 sticky top-[120px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-sm text-slate-500">Фильтры (в разработке)</p>
      </div>
    </div>
  );
};

