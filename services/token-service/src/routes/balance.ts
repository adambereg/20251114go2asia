import { Hono } from 'hono';

const app = new Hono();

// GET /v1/balance - получить баланс пользователя
app.get('/', async (c) => {
  // TODO: Implement balance retrieval
  const requestId = c.get('requestId');
  return c.json(
    {
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Balance endpoint not yet implemented',
        traceId: requestId,
      },
    },
    501
  );
});

// POST /v1/balance/add - добавить поинты
app.post('/add', async (c) => {
  // TODO: Implement add points
  const requestId = c.get('requestId');
  return c.json(
    {
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Add points endpoint not yet implemented',
        traceId: requestId,
      },
    },
    501
  );
});

// POST /v1/balance/subtract - списать поинты
app.post('/subtract', async (c) => {
  // TODO: Implement subtract points
  const requestId = c.get('requestId');
  return c.json(
    {
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Subtract points endpoint not yet implemented',
        traceId: requestId,
      },
    },
    501
  );
});

export const balanceRoutes = app;

