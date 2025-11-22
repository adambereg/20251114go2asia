import { Hono } from 'hono';
import type { ApiGatewayEnv } from '../types';

const app = new Hono<ApiGatewayEnv>();

// Placeholder routes - будут реализованы позже
app.get('/balance', async (c) => {
  // TODO: Проксировать запрос в Token Service
  return c.json({ message: 'Token Service - Balance endpoint (placeholder)' });
});

app.get('/transactions', async (c) => {
  // TODO: Проксировать запрос в Token Service
  return c.json({ message: 'Token Service - Transactions endpoint (placeholder)' });
});

app.post('/add', async (c) => {
  // TODO: Проксировать запрос в Token Service
  return c.json({ message: 'Token Service - Add Points endpoint (placeholder)' });
});

app.post('/subtract', async (c) => {
  // TODO: Проксировать запрос в Token Service
  return c.json({ message: 'Token Service - Subtract Points endpoint (placeholder)' });
});

export const tokenRoutes = app;

