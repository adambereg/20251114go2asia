import { Hono } from 'hono';
import { articles } from '../db';
import { db } from '../db';
import { eq } from 'drizzle-orm';

const app = new Hono();

app.get('/', async (c) => {
  const category = c.req.query('category');
  const limit = parseInt(c.req.query('limit') || '20');

  try {
    let query = db.select().from(articles);
    
    if (category) {
      query = query.where(eq(articles.category, category)) as any;
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

app.get('/:slug', async (c) => {
  const slug = c.req.param('slug');

  try {
    const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    
    if (result.length === 0) {
      return c.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Article not found',
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

export const articlesRoutes = app;

