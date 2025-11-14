import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { requestIdMiddleware } from './middleware/request-id';
import { cacheMiddleware } from './middleware/cache';
import { healthRoutes } from './routes/health';
import { contentRoutes } from './routes/content';
import { authRoutes } from './routes/auth';
import { tokenRoutes } from './routes/token';
import { referralRoutes } from './routes/referral';

const app = new Hono();

// Middleware
app.use('*', honoLogger());
app.use('*', requestIdMiddleware);
app.use('*', cacheMiddleware);
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
app.route('/v1/api/content', contentRoutes);
app.route('/v1/api/auth', authRoutes);
app.route('/v1/api/token', tokenRoutes);
app.route('/v1/api/referral', referralRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  const requestId = c.get('requestId');
  console.error('API Gateway Error:', {
    requestId,
    error: err.message,
    stack: err.stack,
  });
  return c.json(
    {
      error: 'Internal Server Error',
      requestId,
    },
    500
  );
});

export default app;

