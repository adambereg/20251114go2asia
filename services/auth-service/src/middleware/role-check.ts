import { Context, Next } from 'hono';
import type { AuthServiceEnv } from '../types';
import { hasRole, isAdmin, isPROOrAdmin, type UserRole } from '../utils/roles';

/**
 * Middleware для проверки роли пользователя
 * Требует, чтобы authMiddleware был вызван перед этим middleware
 */
export function requireRole(requiredRole: UserRole) {
  return async (c: Context<AuthServiceEnv>, next: Next) => {
    const requestId = c.get('requestId');
    const userRole = c.get('userRole') as UserRole | undefined;

    if (!userRole) {
      return c.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'User role not found. Authentication required.',
            traceId: requestId,
          },
        },
        401
      );
    }

    if (!hasRole(userRole, requiredRole)) {
      return c.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: `Access denied. Required role: ${requiredRole}`,
            traceId: requestId,
          },
        },
        403
      );
    }

    await next();
  };
}

/**
 * Middleware для проверки, является ли пользователь админом
 */
export function requireAdmin() {
  return requireRole('admin');
}

/**
 * Middleware для проверки, является ли пользователь PRO или админом
 */
export function requirePROOrAdmin() {
  return async (c: Context<AuthServiceEnv>, next: Next) => {
    const requestId = c.get('requestId');
    const userRole = c.get('userRole') as UserRole | undefined;

    if (!userRole) {
      return c.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'User role not found. Authentication required.',
            traceId: requestId,
          },
        },
        401
      );
    }

    if (!isPROOrAdmin(userRole)) {
      return c.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'Access denied. Required role: pro or admin',
            traceId: requestId,
          },
        },
        403
      );
    }

    await next();
  };
}

/**
 * Middleware для проверки, является ли пользователь VIP или выше
 */
export function requireVIPOrAbove() {
  return requireRole('vip');
}


