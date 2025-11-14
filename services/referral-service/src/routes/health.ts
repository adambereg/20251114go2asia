import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'referral-service',
  });
});

app.get('/ready', async (c) => {
  // TODO: Add database check when DB is set up
  return c.json({
    status: 'ready',
    timestamp: new Date().toISOString(),
  });
});

export const healthRoutes = app;

