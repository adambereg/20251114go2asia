import { Hono } from 'hono';

const app = new Hono();

// GET /v1/profile - получить профиль пользователя
app.get('/', async (c) => {
  // TODO: Implement profile retrieval
  const requestId = c.get('requestId');
  return c.json(
    {
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Profile endpoint not yet implemented',
        traceId: requestId,
      },
    },
    501
  );
});

// PATCH /v1/profile - обновить профиль пользователя
app.patch('/', async (c) => {
  // TODO: Implement profile update
  const requestId = c.get('requestId');
  return c.json(
    {
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Profile update endpoint not yet implemented',
        traceId: requestId,
      },
    },
    501
  );
});

export const profileRoutes = app;

