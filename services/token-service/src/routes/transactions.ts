import { Hono } from 'hono';

const app = new Hono();

// GET /v1/transactions - получить историю транзакций
app.get('/', async (c) => {
  // TODO: Implement transactions list
  const requestId = c.get('requestId');
  return c.json(
    {
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Transactions endpoint not yet implemented',
        traceId: requestId,
      },
    },
    501
  );
});

export const transactionsRoutes = app;

