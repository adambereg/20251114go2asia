import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { requestIdMiddleware } from './middleware/request-id';
import { healthRoutes } from './routes/health';
import { balanceRoutes } from './routes/balance';
import { transactionsRoutes } from './routes/transactions';

const app = new Hono();

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
app.route('/v1/balance', balanceRoutes);
app.route('/v1/transactions', transactionsRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  const requestId = c.get('requestId');
  console.error('Token Service Error:', {
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

