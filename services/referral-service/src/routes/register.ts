import { Hono } from 'hono';

const app = new Hono();

// POST /v1/register - зарегистрироваться по реферальному коду
app.post('/', async (c) => {
  // TODO: Implement referral registration
  const requestId = c.get('requestId');
  return c.json(
    {
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Referral registration endpoint not yet implemented',
        traceId: requestId,
      },
    },
    501
  );
});

export const registerRoutes = app;

