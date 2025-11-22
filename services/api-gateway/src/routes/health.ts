import { Hono } from 'hono';
import type { ApiGatewayEnv } from '../types';

const app = new Hono<ApiGatewayEnv>();

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'api-gateway',
  });
});

app.get('/ready', async (c) => {
  // TODO: Добавить проверку подключения к БД когда будет настроена
  try {
    return c.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return c.json(
      {
        status: 'not ready',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      503
    );
  }
});

export const healthRoutes = app;

