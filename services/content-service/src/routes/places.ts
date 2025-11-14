import { Hono } from 'hono';
import { places } from '../db';
import { db } from '../db';
import { eq } from 'drizzle-orm';

const app = new Hono();

app.get('/', async (c) => {
  const cityId = c.req.query('cityId');
  const limit = parseInt(c.req.query('limit') || '20');

  try {
    let query = db.select().from(places);
    
    if (cityId) {
      query = query.where(eq(places.cityId, cityId)) as any;
    }
    
    const result = await query.limit(limit);
    
    return c.json({
      items: result,
      hasMore: result.length === limit,
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

app.get('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const result = await db.select().from(places).where(eq(places.id, id)).limit(1);
    
    if (result.length === 0) {
      return c.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Place not found',
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

export const placesRoutes = app;

