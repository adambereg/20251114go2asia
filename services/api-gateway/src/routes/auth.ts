import { Hono } from 'hono';
import type { ApiGatewayEnv } from '../types';

const app = new Hono<ApiGatewayEnv>();

// Placeholder routes - будут реализованы позже
app.get('/profile', async (c) => {
  // TODO: Проксировать запрос в Auth Service
  return c.json({ message: 'Auth Service - Profile endpoint (placeholder)' });
});

app.patch('/profile', async (c) => {
  // TODO: Проксировать запрос в Auth Service
  return c.json({ message: 'Auth Service - Update Profile endpoint (placeholder)' });
});

app.post('/webhooks/clerk', async (c) => {
  // TODO: Обработать webhook от Clerk
  return c.json({ message: 'Auth Service - Clerk Webhook endpoint (placeholder)' });
});

export const authRoutes = app;

