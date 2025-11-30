/**
 * Утилиты для поиска данных в Content Service
 */

import { sql, SQL, and, or, ilike } from 'drizzle-orm';

/**
 * Параметры поиска из query string
 */
export interface SearchParams {
  search?: string;
  searchFields?: string[];
}

/**
 * Создать условие поиска по нескольким полям
 * Использует ILIKE для case-insensitive поиска
 */
export function createSearchCondition(
  searchQuery: string,
  fields: SQL[]
): SQL | null {
  if (!searchQuery || searchQuery.trim().length === 0) {
    return null;
  }

  const trimmedQuery = searchQuery.trim();
  
  // Экранируем специальные символы для ILIKE
  const escapedQuery = trimmedQuery.replace(/[%_\\]/g, '\\$&');
  
  // Создаём условия для каждого поля
  const conditions = fields.map((field) => 
    ilike(field, `%${escapedQuery}%`)
  );

  // Объединяем через OR
  return or(...conditions) || null;
}

/**
 * Создать условие полнотекстового поиска (для будущей интеграции с PostgreSQL full-text search)
 */
export function createFullTextSearchCondition(
  searchQuery: string,
  fields: SQL[]
): SQL | null {
  if (!searchQuery || searchQuery.trim().length === 0) {
    return null;
  }

  const trimmedQuery = searchQuery.trim();
  
  // Простая реализация через ILIKE (можно заменить на полнотекстовый поиск PostgreSQL)
  return createSearchCondition(trimmedQuery, fields);
}


