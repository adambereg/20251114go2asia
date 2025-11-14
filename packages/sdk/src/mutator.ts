// Custom mutator для Orval
// Используется для настройки HTTP клиента

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';

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
      error: 'Unknown error',
      status: response.status,
    }));
    throw new Error(JSON.stringify(error));
  }

  return response.json();
};

