import { Hono } from 'hono';
import { db } from '../db';

const app = new Hono();

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'content-service',
  });
});

app.get('/ready', async (c) => {
  try {
    // Проверка подключения к БД
    await db.execute('SELECT 1');
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

