import { Context, Next } from 'hono';
import { setCacheHeaders } from '../utils/cache';
import type { ApiGatewayEnv } from '../types';

/**
 * Middleware для установки заголовков кэширования
 */
export async function cacheMiddleware(c: Context<ApiGatewayEnv>, next: Next) {
  await next();

  const response = c.res;
  const path = c.req.path;
  const method = c.req.method;

  // Устанавливаем заголовки кэширования только для успешных ответов
  if (response.status >= 200 && response.status < 300) {
    setCacheHeaders(response, path, method);
  }
}

