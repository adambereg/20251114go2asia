import { Context, Next } from 'hono';
import { verifyToken } from '@clerk/backend';
import type { AuthServiceEnv } from '../types';

/**
 * Middleware для аутентификации через Clerk JWT
 */
export async function authMiddleware(c: Context<AuthServiceEnv>, next: Next) {
  const requestId = c.get('requestId');
  
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Missing or invalid Authorization header',
            traceId: requestId,
          },
        },
        401
      );
    }

    const token = authHeader.substring(7); // Убираем "Bearer "
    const env = c.env as { CLERK_SECRET_KEY?: string };

    if (!env.CLERK_SECRET_KEY) {
      console.error('CLERK_SECRET_KEY not configured');
      return c.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Authentication service not configured',
            traceId: requestId,
          },
        },
        500
      );
    }

    // Верифицируем токен через Clerk
    try {
      const rawPayload = await verifyToken(token, {
        secretKey: env.CLERK_SECRET_KEY,
      });

      type ClerkJwtPayload = {
        sub: string;
        email?: string;
        primaryEmailAddressId?: string;
      };

      const payload = rawPayload as ClerkJwtPayload;

      // Сохраняем данные пользователя в контексте
      c.set('userId', payload.sub);
      c.set('userEmail', payload.email ?? payload.primaryEmailAddressId);
      
      await next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return c.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired token',
            traceId: requestId,
          },
        },
        401
      );
    }
  } catch (error) {
    return c.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          traceId: requestId,
        },
      },
      500
    );
  }
}

