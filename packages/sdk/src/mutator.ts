// Custom mutator для Orval
// Используется для настройки HTTP клиента с поддержкой Clerk аутентификации

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-staging.go2asia.space';

/**
 * Получить токен из Clerk для аутентификации
 * Поддерживает интеграцию через setupClerkAuth или localStorage
 */
async function getAuthToken(): Promise<string | null> {
  if (typeof window !== 'undefined') {
    // Попытка получить токен через Clerk интеграцию
    if ((window as any).__clerkGetToken) {
      try {
        return await (window as any).__clerkGetToken();
      } catch (error) {
        console.warn('Failed to get Clerk token:', error);
      }
    }
    
    // Fallback: получить токен из localStorage (для разработки)
    const token = localStorage.getItem('clerk_token');
    return token;
  }
  return null;
}

export const customInstance = async <T>(
  config: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    data?: unknown;
  },
  options?: {
    signal?: AbortSignal;
  }
): Promise<T> => {
  const { url, method, headers = {}, data } = config;

  // Добавляем токен аутентификации если доступен
  const token = await getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    signal: options?.signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: {
        code: 'UNKNOWN_ERROR',
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      },
    }));
    throw new Error(JSON.stringify(error));
  }

  return response.json();
};
