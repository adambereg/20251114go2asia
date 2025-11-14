import { Hono } from 'hono';
import { countries } from '../db';
import { db } from '../db';
import { eq } from 'drizzle-orm';

const app = new Hono();

// GET /v1/countries - список стран
app.get('/', async (c) => {
  const limit = parseInt(c.req.query('limit') || '20');
  const cursor = c.req.query('cursor');

  try {
    const result = await db.select().from(countries).limit(limit);
    
    return c.json({
      items: result,
      hasMore: result.length === limit,
      nextCursor: cursor || null,
    });
  } catch (error) {
    const requestId = c.get('requestId');
    return c.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          traceId: requestId,
        },
      },
      500
    );
  }
});

// GET /v1/countries/:id - страна по ID
app.get('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const result = await db.select().from(countries).where(eq(countries.id, id)).limit(1);
    
    if (result.length === 0) {
      return c.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Country not found',
            traceId: c.get('requestId'),
          },
        },
        404
      );
    }

    return c.json(result[0]);
  } catch (error) {
    const requestId = c.get('requestId');
    return c.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          traceId: requestId,
        },
      },
      500
    );
  }
});

export const countriesRoutes = app;

