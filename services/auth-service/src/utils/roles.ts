/**
 * Утилиты для работы с ролями пользователей
 */

export type UserRole = 'spacer' | 'vip' | 'pro' | 'partner' | 'admin';

/**
 * Проверка, имеет ли пользователь указанную роль
 */
export function hasRole(userRole: UserRole | null | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  
  // Иерархия ролей (от меньшей к большей)
  const roleHierarchy: Record<UserRole, number> = {
    spacer: 0,
    vip: 1,
    pro: 2,
    partner: 2, // PRO и Partner на одном уровне
    admin: 3,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Проверка, является ли пользователь админом
 */
export function isAdmin(userRole: UserRole | null | undefined): boolean {
  return userRole === 'admin';
}

/**
 * Проверка, является ли пользователь PRO или админом
 */
export function isPROOrAdmin(userRole: UserRole | null | undefined): boolean {
  return userRole === 'pro' || userRole === 'admin';
}

/**
 * Проверка, является ли пользователь VIP или выше
 */
export function isVIPOrAbove(userRole: UserRole | null | undefined): boolean {
  return hasRole(userRole, 'vip');
}

/**
 * Получить роль из Clerk metadata
 * Clerk хранит роль в publicMetadata.role
 */
export function getRoleFromClerkMetadata(metadata: Record<string, unknown> | null | undefined): UserRole {
  if (!metadata || typeof metadata !== 'object') {
    return 'spacer'; // Роль по умолчанию
  }

  const role = metadata.role;
  if (typeof role === 'string' && ['spacer', 'vip', 'pro', 'partner', 'admin'].includes(role)) {
    return role as UserRole;
  }

  return 'spacer'; // Роль по умолчанию
}

/**
 * Получить роль из Clerk JWT payload
 */
export function getRoleFromClerkJWT(payload: Record<string, unknown>): UserRole {
  // Clerk хранит метаданные в разных местах в зависимости от версии
  const metadata = (payload.publicMetadata as Record<string, unknown>) || 
                   (payload.metadata as Record<string, unknown>) ||
                   {};
  
  return getRoleFromClerkMetadata(metadata);
}


