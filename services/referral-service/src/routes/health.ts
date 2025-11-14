import { Hono } from 'hono';
import { sql } from 'drizzle-orm';

const app = new Hono();

app.get('/', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'referral-service',
  });
});

app.get('/ready', async (c) => {
  try {
    const db = c.get('db');
    // Проверяем подключение к БД
    await db.execute(sql`SELECT 1`);
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

