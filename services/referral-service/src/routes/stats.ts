import { Hono } from 'hono';

const app = new Hono();

// GET /v1/stats - получить статистику рефералов
app.get('/', async (c) => {
  // TODO: Implement referral stats
  const requestId = c.get('requestId');
  return c.json(
    {
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Referral stats endpoint not yet implemented',
        traceId: requestId,
      },
    },
    501
  );
});

export const statsRoutes = app;

