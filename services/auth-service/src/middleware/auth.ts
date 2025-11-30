import { Context, Next } from 'hono';
import { verifyToken } from '@clerk/backend';
import type { AuthServiceEnv } from '../types';
import { getRoleFromClerkJWT, type UserRole } from '../utils/roles';

/**
 * Middleware для аутентификации через Clerk JWT
 * Извлекает userId, email и role из токена и сохраняет в контексте
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
        publicMetadata?: Record<string, unknown>;
        metadata?: Record<string, unknown>;
      };

      const payload = rawPayload as ClerkJwtPayload;

      // Извлекаем роль из метаданных Clerk
      const userRole = getRoleFromClerkJWT(payload);

      // Сохраняем данные пользователя в контексте
      c.set('userId', payload.sub);
      c.set('userEmail', payload.email ?? payload.primaryEmailAddressId);
      c.set('userRole', userRole);
      
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

