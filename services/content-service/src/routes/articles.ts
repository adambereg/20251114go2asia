import { Hono } from 'hono';
import { z } from 'zod';
import { articles } from '../db';
import { eq, sql, gt, and, lte, isNotNull } from 'drizzle-orm';
import type { ContentServiceEnv } from '../types';

const app = new Hono<ContentServiceEnv>();

// Валидационные схемы
const getArticlesQuerySchema = z.object({
  category: z.string().optional(),
  tags: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      if (typeof val === 'string') {
        // Поддержка формата "tag1,tag2" или "tag1"
        return val.split(',').filter((t) => t.trim().length > 0);
      }
      return val;
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().min(1).max(100)),
  cursor: z.string().optional(),
});

const getArticleParamsSchema = z.object({
  slug: z.string().min(1),
});

// GET /v1/articles - список статей
app.get('/', async (c) => {
  const requestId = c.get('requestId');

  try {
    // Парсинг query параметров
    const queryParams = c.req.query();
    const tagsParam = queryParams.tags
      ? Array.isArray(queryParams.tags)
        ? queryParams.tags
        : [queryParams.tags]
      : undefined;

    // Валидация query параметров
    const validatedParams = getArticlesQuerySchema.safeParse({
      category: queryParams.category,
      tags: tagsParam,
      limit: queryParams.limit,
      cursor: queryParams.cursor,
    });

    if (!validatedParams.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: validatedParams.error.errors.map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            })),
            traceId: requestId,
          },
        },
        400
      );
    }

    const { category, tags, limit, cursor } = validatedParams.data;
    const db = c.get('db');

    // Базовый запрос - только опубликованные статьи
    let baseQuery = db.select().from(articles);

    // Условия фильтрации
    const conditions = [];
    
    // Фильтр: только опубликованные статьи (publishedAt не null и в прошлом/настоящем)
    conditions.push(isNotNull(articles.publishedAt));
    conditions.push(lte(articles.publishedAt, new Date()));

    if (category) {
      conditions.push(eq(articles.category, category));
    }
    if (tags && tags.length > 0) {
      // Фильтрация по тегам: проверяем, что массив tags содержит хотя бы один из указанных тегов
      const tagConditions = tags.map((tag) => {
        return sql`${tag} = ANY(${articles.tags})`;
      });
      if (tagConditions.length === 1) {
        conditions.push(tagConditions[0]);
      } else if (tagConditions.length > 1) {
        conditions.push(sql`(${tagConditions.reduce((acc, cond, idx) => {
          if (idx === 0) return cond;
          return sql`${acc} OR ${cond}`;
        })})`);
      }
    }
    if (cursor) {
      conditions.push(gt(articles.id, cursor));
    }

    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions)) as any;
    }

    // Сортировка по дате публикации (сначала новые) и лимит
    const query = baseQuery.orderBy(articles.publishedAt).orderBy(articles.id).limit(limit + 1) as any;
    const result = await query;

    // Определяем, есть ли следующая страница
    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;

    // Формируем nextCursor
    const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : null;

    // Устанавливаем заголовки кэширования
    c.header('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=600');
    c.header('Vary', 'Accept, Accept-Encoding');

    return c.json({
      items: items.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        authorId: item.authorId,
        category: item.category,
        tags: item.tags,
        coverImage: item.coverImage,
        publishedAt: item.publishedAt,
        featured: item.featured,
        views: item.views,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      hasMore,
      nextCursor,
    });
  } catch (error) {
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

// GET /v1/articles/:slug - статья по slug
app.get('/:slug', async (c) => {
  const requestId = c.get('requestId');

  try {
    // Валидация параметров
    const params = getArticleParamsSchema.safeParse({
      slug: c.req.param('slug'),
    });

    if (!params.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid article slug',
            details: params.error.errors.map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            })),
            traceId: requestId,
          },
        },
        400
      );
    }

    const { slug } = params.data;
    const db = c.get('db');

    // Получаем статью - только если она опубликована
    const result = await db
      .select()
      .from(articles)
      .where(and(eq(articles.slug, slug), isNotNull(articles.publishedAt), lte(articles.publishedAt, new Date())))
      .limit(1);

    if (result.length === 0) {
      return c.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Article not found',
            traceId: requestId,
          },
        },
        404
      );
    }

    const article = result[0];

    // Увеличиваем счетчик просмотров (асинхронно, не блокируем ответ)
    db.update(articles)
      .set({ views: sql`${articles.views} + 1` })
      .where(eq(articles.id, article.id))
      .then(() => {})
      .catch(() => {});

    // Устанавливаем заголовки кэширования
    c.header('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=600');
    c.header('Vary', 'Accept, Accept-Encoding');

    return c.json({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      authorId: article.authorId,
      category: article.category,
      tags: article.tags,
      coverImage: article.coverImage,
      publishedAt: article.publishedAt,
      featured: article.featured,
      views: article.views,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    });
  } catch (error) {
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

