import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { requestIdMiddleware } from './middleware/request-id';
import { healthRoutes } from './routes/health';
import { countriesRoutes } from './routes/countries';
import { citiesRoutes } from './routes/cities';
import { placesRoutes } from './routes/places';
import { eventsRoutes } from './routes/events';
import { articlesRoutes } from './routes/articles';
import { createDb } from './db';

export interface Env {
  DATABASE_URL?: string;
  NODE_ENV?: string;
}

const app = new Hono<{ Bindings: Env }>();

// Middleware to inject database instance
app.use('*', async (c, next) => {
  const db = createDb(c.env);
  c.set('db', db);
  await next();
});

// Middleware
app.use('*', honoLogger());
app.use('*', requestIdMiddleware);
app.use(
  '*',
  cors({
    origin: [
      'https://go2asia.space',
      'https://*.netlify.app',
      'http://localhost:3000',
    ],
    credentials: true,
  })
);

// Routes
app.route('/health', healthRoutes);
app.route('/v1/countries', countriesRoutes);
app.route('/v1/cities', citiesRoutes);
app.route('/v1/places', placesRoutes);
app.route('/v1/events', eventsRoutes);
app.route('/v1/articles', articlesRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  const requestId = c.get('requestId');
  console.error('Content Service Error:', {
    requestId,
    error: err.message,
    stack: err.stack,
  });
  return c.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal Server Error',
        traceId: requestId,
      },
    },
    500
  );
});

export default app;

