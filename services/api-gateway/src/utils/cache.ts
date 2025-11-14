/**
 * Утилиты для управления кэшированием
 */

export interface CacheConfig {
  ttl: number; // Time to live в секундах
  swr?: number; // Stale-while-revalidate в секундах
}

/**
 * Кэш-матрица для различных типов эндпоинтов
 */
export const CACHE_CONFIG: Record<string, CacheConfig> = {
  // Публичные GET эндпоинты
  '/v1/api/content/countries': { ttl: 600, swr: 600 },
  '/v1/api/content/cities': { ttl: 600, swr: 600 },
  '/v1/api/content/places': { ttl: 300, swr: 300 },
  '/v1/api/content/events': { ttl: 300, swr: 300 },
  '/v1/api/content/articles': { ttl: 600, swr: 600 },
};

/**
 * Проверяет, является ли эндпоинт публичным
 */
export function isPublicEndpoint(path: string): boolean {
  return Object.keys(CACHE_CONFIG).some((key) => path.startsWith(key));
}

/**
 * Проверяет, является ли эндпоинт приватным
 */
export function isPrivateEndpoint(path: string): boolean {
  const privatePrefixes = [
    '/v1/api/token',
    '/v1/api/referral',
    '/v1/api/auth',
  ];
  return privatePrefixes.some((prefix) => path.startsWith(prefix));
}

/**
 * Устанавливает заголовки кэширования для публичных эндпоинтов
 */
export function setPublicCacheHeaders(
  response: Response,
  path: string
): void {
  const config = CACHE_CONFIG[path] || { ttl: 300, swr: 60 };
  const swr = config.swr || config.ttl;

  response.headers.set(
    'Cache-Control',
    `public, s-maxage=${config.ttl}, stale-while-revalidate=${swr}`
  );
  response.headers.set('Vary', 'Accept, Accept-Encoding');
}

/**
 * Устанавливает заголовки для приватных эндпоинтов (no-store)
 */
export function setPrivateCacheHeaders(response: Response): void {
  response.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
}

/**
 * Устанавливает заголовки кэширования в зависимости от типа эндпоинта
 */
export function setCacheHeaders(
  response: Response,
  path: string,
  method: string
): void {
  // POST/PUT/DELETE никогда не кешируются
  if (method !== 'GET') {
    setPrivateCacheHeaders(response);
    return;
  }

  // Приватные эндпоинты
  if (isPrivateEndpoint(path)) {
    setPrivateCacheHeaders(response);
    return;
  }

  // Публичные эндпоинты
  if (isPublicEndpoint(path)) {
    setPublicCacheHeaders(response, path);
    return;
  }

  // По умолчанию - не кешировать
  setPrivateCacheHeaders(response);
}

