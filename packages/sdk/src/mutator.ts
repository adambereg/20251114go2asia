// Custom mutator для Orval
// Используется для настройки HTTP клиента с поддержкой Clerk аутентификации

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-staging.go2asia.space';

type QueryParamValue = string | number | boolean | null | undefined | Array<string | number | boolean>;

type RequestConfig = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  data?: unknown;
  params?: Record<string, QueryParamValue>;
  signal?: AbortSignal;
};

type RequestOptions = Omit<RequestInit, 'body' | 'method' | 'headers' | 'signal'> & {
  baseURL?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

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
  config: RequestConfig,
  options: RequestOptions = {}
): Promise<T> => {
  const { url, method, headers = {}, data, params, signal } = config;
  const { baseURL, headers: optionHeaders, signal: optionSignal, ...restOptions } = options;

  // Добавляем токен аутентификации если доступен
  const token = await getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const searchParams =
    params && Object.keys(params).length > 0
      ? Object.entries(params).reduce((acc, [key, value]) => {
          if (value === undefined || value === null) {
            return acc;
          }
          const values = Array.isArray(value) ? value : [value];
          values.forEach((val) => {
            acc.append(key, String(val));
          });
          return acc;
        }, new URLSearchParams())
      : null;

  const resolvedBaseURL = baseURL ?? API_URL;
  const finalURL = `${resolvedBaseURL}${url}${searchParams ? `?${searchParams.toString()}` : ''}`;

  const response = await fetch(finalURL, {
    ...restOptions,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...optionHeaders,
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    signal: signal ?? optionSignal,
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

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
