import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { requestIdMiddleware } from './middleware/request-id';
import { createDb } from './db';
import { healthRoutes } from './routes/health';
import { statsRoutes } from './routes/stats';
import { treeRoutes } from './routes/tree';
import { registerRoutes } from './routes/register';
import { vipRoutes } from './routes/vip';
import type { ReferralServiceEnv } from './types';

const app = new Hono<ReferralServiceEnv>();

// Middleware
app.use('*', async (c, next) => {
  const db = createDb(c.env ?? {});
  c.set('db', db);
  await next();
});
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
app.route('/v1/stats', statsRoutes);
app.route('/v1/tree', treeRoutes);
app.route('/v1/register', registerRoutes);
app.route('/v1/vip', vipRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  const requestId = c.get('requestId');
  console.error('Referral Service Error:', {
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

