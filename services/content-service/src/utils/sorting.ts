/**
 * Утилиты для сортировки данных в Content Service
 */

import { sql, SQL } from 'drizzle-orm';

export type SortOrder = 'asc' | 'desc';

export type SortField<T extends string> = T;

/**
 * Параметры сортировки из query string
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: SortOrder;
}

/**
 * Валидация и нормализация параметров сортировки
 */
export function parseSortParams<T extends Record<string, string>>(
  params: SortParams,
  allowedFields: T,
  defaultField: keyof T,
  defaultOrder: SortOrder = 'desc'
): { field: keyof T; order: SortOrder } {
  const sortBy = params.sortBy || defaultField;
  const sortOrder = params.sortOrder || defaultOrder;

  // Проверяем, что поле разрешено
  if (!(sortBy in allowedFields)) {
    return { field: defaultField, order: defaultOrder };
  }

  // Проверяем порядок сортировки
  const order = sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : defaultOrder;

  return { field: sortBy as keyof T, order };
}

/**
 * Создать SQL выражение для сортировки
 */
export function createSortSQL(
  field: SQL,
  order: SortOrder
): SQL {
  return sql`${field} ${sql.raw(order.toUpperCase())}`;
}


