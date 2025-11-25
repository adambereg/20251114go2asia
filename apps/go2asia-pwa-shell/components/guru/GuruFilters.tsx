'use client';

/**
 * Guru Asia - GuruFilters
 * Панель фильтров с поиском, типами, временем, атрибутами
 */

import React, { useState } from 'react';
import {
  Search,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Home,
  User,
  Trophy,
  Wifi,
  Coffee,
  Zap,
  VolumeX,
  Baby,
  Clock,
  Layers,
} from 'lucide-react';
import { Button } from '@go2asia/ui';
import type {
  GuruFilters as GuruFiltersType,
  GuruObjectType,
  TimeFilter,
  RadiusOption,
  SortMode,
} from './types';
import {
  DEFAULT_FILTERS,
  RADIUS_OPTIONS,
  SORT_OPTIONS,
  OBJECT_TYPE_LABELS,
  MARKER_COLORS,
} from './types';
import { countActiveFilters } from './utils/filters';

// =============================================================================
// Типы
// =============================================================================

interface GuruFiltersProps {
  filters: GuruFiltersType;
  onFilterChange: (filters: GuruFiltersType) => void;
  onReset: () => void;
  objectCount: number;
  className?: string;
}

// =============================================================================
// Чип фильтра
// =============================================================================

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
}

const FilterChip: React.FC<FilterChipProps> = ({
  active,
  onClick,
  children,
  color,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
      transition-all duration-200
      ${
        active
          ? 'bg-primary text-white shadow-sm'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }
    `}
    style={
      active && color
        ? { backgroundColor: color }
        : undefined
    }
  >
    {children}
  </button>
);

// =============================================================================
// Иконки типов
// =============================================================================

const TypeIcon: React.FC<{ type: GuruObjectType; className?: string }> = ({
  type,
  className = 'w-4 h-4',
}) => {
  switch (type) {
    case 'place':
      return <MapPin className={className} />;
    case 'event':
      return <Calendar className={className} />;
    case 'housing':
      return <Home className={className} />;
    case 'person':
      return <User className={className} />;
    case 'quest':
      return <Trophy className={className} />;
  }
};

// =============================================================================
// Основной компонент
// =============================================================================

export const GuruFiltersComponent: React.FC<GuruFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  objectCount,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeCount = countActiveFilters(filters);

  // Обновление конкретного поля фильтров
  const updateFilter = <K extends keyof GuruFiltersType>(
    key: K,
    value: GuruFiltersType[K]
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  // Переключение типа объекта
  const toggleType = (type: GuruObjectType) => {
    const currentTypes = filters.types;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    
    // Не позволяем снять все типы
    if (newTypes.length > 0) {
      updateFilter('types', newTypes);
    }
  };

  // Переключение атрибута места
  const togglePlaceAttr = (attr: keyof GuruFiltersType['placeAttrs']) => {
    updateFilter('placeAttrs', {
      ...filters.placeAttrs,
      [attr]: !filters.placeAttrs[attr],
    });
  };

  // Все типы объектов
  const allTypes: GuruObjectType[] = ['place', 'event', 'housing', 'person', 'quest'];

  // Временные фильтры
  const timeOptions: { value: TimeFilter; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'Все', icon: <Layers className="w-4 h-4" /> },
    { value: 'now', label: 'Сейчас', icon: <Clock className="w-4 h-4" /> },
    { value: 'today', label: 'Сегодня', icon: <Calendar className="w-4 h-4" /> },
    { value: 'weekend', label: 'Выходные', icon: <Calendar className="w-4 h-4" /> },
  ];

  // Атрибуты мест
  const placeAttrs: {
    key: keyof GuruFiltersType['placeAttrs'];
    label: string;
    icon: React.ReactNode;
  }[] = [
    { key: 'wifi', label: 'Wi-Fi', icon: <Wifi className="w-4 h-4" /> },
    { key: 'powerOutlets', label: 'Розетки', icon: <Zap className="w-4 h-4" /> },
    { key: 'coffee', label: 'Кофе', icon: <Coffee className="w-4 h-4" /> },
    { key: 'quiet', label: 'Тихо', icon: <VolumeX className="w-4 h-4" /> },
    { key: 'kidFriendly', label: 'Детское', icon: <Baby className="w-4 h-4" /> },
    { key: 'rfPartner', label: 'RF', icon: <span className="text-xs font-bold">RF</span> },
  ];

  return (
    <div className={`bg-white rounded-xl border border-slate-200 ${className}`}>
      {/* Поиск */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по названию или адресу..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg
                       text-sm placeholder:text-slate-400
                       focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => updateFilter('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Типы объектов */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex flex-wrap gap-2">
          {allTypes.map((type) => (
            <FilterChip
              key={type}
              active={filters.types.includes(type)}
              onClick={() => toggleType(type)}
              color={filters.types.includes(type) ? MARKER_COLORS[type] : undefined}
            >
              <TypeIcon type={type} />
              {OBJECT_TYPE_LABELS[type]}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Радиус */}
      <div className="p-4 border-b border-slate-100">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
          Радиус
        </p>
        <div className="flex flex-wrap gap-2">
          {RADIUS_OPTIONS.map((option) => (
            <FilterChip
              key={option.value}
              active={filters.radius === option.value}
              onClick={() => updateFilter('radius', option.value)}
            >
              {option.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Кнопка расширения */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-center gap-2 text-sm text-slate-600 hover:bg-slate-50"
      >
        <Filter className="w-4 h-4" />
        {isExpanded ? 'Скрыть фильтры' : 'Больше фильтров'}
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        {activeCount > 0 && (
          <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {/* Расширенные фильтры */}
      {isExpanded && (
        <div className="border-t border-slate-100">
          {/* Время */}
          <div className="p-4 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              Время
            </p>
            <div className="flex flex-wrap gap-2">
              {timeOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  active={filters.time === option.value}
                  onClick={() => updateFilter('time', option.value)}
                >
                  {option.icon}
                  {option.label}
                </FilterChip>
              ))}
            </div>
          </div>

          {/* Атрибуты мест */}
          <div className="p-4 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              Атрибуты мест
            </p>
            <div className="flex flex-wrap gap-2">
              {placeAttrs.map((attr) => (
                <FilterChip
                  key={attr.key}
                  active={!!filters.placeAttrs[attr.key]}
                  onClick={() => togglePlaceAttr(attr.key)}
                >
                  {attr.icon}
                  {attr.label}
                </FilterChip>
              ))}
            </div>
          </div>

          {/* Сортировка */}
          <div className="p-4 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              Сортировка
            </p>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  active={filters.sortMode === option.value}
                  onClick={() => updateFilter('sortMode', option.value)}
                >
                  {option.label}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Футер с результатами и сбросом */}
      <div className="p-4 flex items-center justify-between bg-slate-50 rounded-b-xl">
        <p className="text-sm text-slate-600">
          Найдено: <span className="font-semibold text-slate-900">{objectCount}</span> объектов
        </p>
        {activeCount > 0 && (
          <Button variant="secondary" size="sm" onClick={onReset}>
            <X className="w-4 h-4 mr-1" />
            Сбросить ({activeCount})
          </Button>
        )}
      </div>
    </div>
  );
};

export default GuruFiltersComponent;

