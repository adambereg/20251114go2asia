import { Hono } from 'hono';
import type { ApiGatewayEnv } from '../types';

const app = new Hono<ApiGatewayEnv>();

// Placeholder routes - будут реализованы позже
app.get('/countries', async (c) => {
  // TODO: Проксировать запрос в Content Service
  return c.json({ message: 'Content Service - Countries endpoint (placeholder)' });
});

app.get('/cities', async (c) => {
  // TODO: Проксировать запрос в Content Service
  return c.json({ message: 'Content Service - Cities endpoint (placeholder)' });
});

app.get('/places', async (c) => {
  // TODO: Проксировать запрос в Content Service
  return c.json({ message: 'Content Service - Places endpoint (placeholder)' });
});

app.get('/events', async (c) => {
  // TODO: Проксировать запрос в Content Service
  return c.json({ message: 'Content Service - Events endpoint (placeholder)' });
});

app.get('/articles', async (c) => {
  // TODO: Проксировать запрос в Content Service
  return c.json({ message: 'Content Service - Articles endpoint (placeholder)' });
});

export const contentRoutes = app;

