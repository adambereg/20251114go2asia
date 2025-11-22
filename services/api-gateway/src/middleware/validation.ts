import { z } from 'zod';
import { Context, Next } from 'hono';
import type { ApiGatewayEnv } from '../types';

/**
 * Middleware для валидации тела запроса с использованием Zod схемы
 */
export function validateBody<T extends z.ZodType>(schema: T) {
  return async (c: Context<ApiGatewayEnv>, next: Next) => {
    try {
      const body = await c.req.json();
      const validated = schema.parse(body);
      c.set('validatedBody', validated);
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Validation failed',
              details: error.errors.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
              })),
              traceId: c.get('requestId'),
            },
          },
          400
        );
      }
      throw error;
    }
  };
}

/**
 * Middleware для валидации query параметров
 */
export function validateQuery<T extends z.ZodType>(schema: T) {
  return async (c: Context<ApiGatewayEnv>, next: Next) => {
    try {
      const queryEntries = Object.entries(c.req.query());
      const query = Object.fromEntries(queryEntries);
      const validated = schema.parse(query);
      c.set('validatedQuery', validated);
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid query parameters',
              details: error.errors.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
              })),
              traceId: c.get('requestId'),
            },
          },
          400
        );
      }
      throw error;
    }
  };
}

