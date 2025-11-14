/**
 * Интеграция SDK с Clerk для аутентификации
 * 
 * Этот файл содержит утилиты для интеграции с Clerk в Next.js приложении
 */

/**
 * Получить токен из Clerk для использования в API запросах
 * 
 * @example
 * ```tsx
 * import { useAuth } from '@clerk/nextjs';
 * import { getClerkToken } from '@go2asia/sdk/clerk-integration';
 * 
 * function MyComponent() {
 *   const { getToken } = useAuth();
 *   
 *   const fetchData = async () => {
 *     const token = await getClerkToken(getToken);
 *     // Использовать token в запросах
 *   };
 * }
 * ```
 */
export async function getClerkToken(
  getToken: () => Promise<string | null>
): Promise<string | null> {
  try {
    return await getToken();
  } catch (error) {
    console.error('Failed to get Clerk token:', error);
    return null;
  }
}

/**
 * Настроить SDK для использования Clerk токена
 * 
 * @example
 * ```tsx
 * import { setupClerkAuth } from '@go2asia/sdk/clerk-integration';
 * import { useAuth } from '@clerk/nextjs';
 * 
 * function App() {
 *   const { getToken } = useAuth();
 *   
 *   useEffect(() => {
 *     setupClerkAuth(getToken);
 *   }, [getToken]);
 * }
 * ```
 */
export function setupClerkAuth(getToken: () => Promise<string | null>): void {
  if (typeof window !== 'undefined') {
    // Сохраняем функцию получения токена для использования в mutator
    (window as any).__clerkGetToken = getToken;
  }
}

/**
 * Получить токен из глобального хранилища (для использования в mutator)
 */
export async function getStoredClerkToken(): Promise<string | null> {
  if (typeof window !== 'undefined' && (window as any).__clerkGetToken) {
    return await (window as any).__clerkGetToken();
  }
  return null;
}

