import { Hono } from 'hono';

const app = new Hono();

// POST /v1/webhook - webhook от Clerk
app.post('/', async (c) => {
  // TODO: Implement Clerk webhook verification and handling
  const requestId = c.get('requestId');
  return c.json(
    {
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Webhook endpoint not yet implemented',
        traceId: requestId,
      },
    },
    501
  );
});

export const webhookRoutes = app;

