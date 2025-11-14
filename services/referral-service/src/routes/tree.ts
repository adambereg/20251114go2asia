import { Hono } from 'hono';

const app = new Hono();

// GET /v1/tree - получить реферальное дерево
app.get('/', async (c) => {
  // TODO: Implement referral tree
  const requestId = c.get('requestId');
  return c.json(
    {
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Referral tree endpoint not yet implemented',
        traceId: requestId,
      },
    },
    501
  );
});

export const treeRoutes = app;

