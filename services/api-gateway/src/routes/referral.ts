import { Hono } from 'hono';

const app = new Hono();

// Placeholder routes - будут реализованы позже
app.get('/stats', async (c) => {
  // TODO: Проксировать запрос в Referral Service
  return c.json({ message: 'Referral Service - Stats endpoint (placeholder)' });
});

app.get('/tree', async (c) => {
  // TODO: Проксировать запрос в Referral Service
  return c.json({ message: 'Referral Service - Tree endpoint (placeholder)' });
});

app.post('/register', async (c) => {
  // TODO: Проксировать запрос в Referral Service
  return c.json({ message: 'Referral Service - Register endpoint (placeholder)' });
});

export const referralRoutes = app;

