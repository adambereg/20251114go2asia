import { Hono } from 'hono';
import { z } from 'zod';
import { cities, places } from '../db';
import { eq, sql, gt, ilike, and } from 'drizzle-orm';
import type { ContentServiceEnv } from '../types';

type CityWithPlacesCount = typeof cities.$inferSelect & { placesCount: number };

const app = new Hono<ContentServiceEnv>();

// Валидационные схемы
const getCitiesQuerySchema = z.object({
  countryId: z.string().optional(),
  search: z.string().optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().min(1).max(100)),
  cursor: z.string().optional(),
});

const getCityParamsSchema = z.object({
  id: z.string().min(1),
});

// GET /v1/cities - список городов
app.get('/', async (c) => {
  const requestId = c.get('requestId');

  try {
    // Валидация query параметров
    const queryParams = getCitiesQuerySchema.safeParse({
      countryId: c.req.query('countryId'),
      search: c.req.query('search'),
      limit: c.req.query('limit'),
      cursor: c.req.query('cursor'),
    });

    if (!queryParams.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: queryParams.error.errors.map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            })),
            traceId: requestId,
          },
        },
        400
      );
    }

    const { countryId, search, limit, cursor } = queryParams.data;
    const db = c.get('db');

    // Базовый запрос с подзапросом для счетчика мест
    let baseQuery = db
      .select({
        id: cities.id,
        name: cities.name,
        countryId: cities.countryId,
        description: cities.description,
        latitude: cities.latitude,
        longitude: cities.longitude,
        image: cities.image,
        createdAt: cities.createdAt,
        updatedAt: cities.updatedAt,
        placesCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${places} 
          WHERE ${places.cityId} = ${cities.id}
        )`,
      })
      .from(cities);

    // Условия фильтрации
    const conditions = [];
    if (countryId) {
      conditions.push(eq(cities.countryId, countryId));
    }
    if (search) {
      conditions.push(ilike(cities.name, `%${search}%`));
    }
    if (cursor) {
      conditions.push(gt(cities.id, cursor));
    }

    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions)) as any;
    }

    // Сортировка и лимит
    const query = baseQuery.orderBy(cities.id).limit(limit + 1) as any;
    const result = await query;

    // Определяем, есть ли следующая страница
    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;
    const itemsTyped = items as CityWithPlacesCount[];

    // Формируем nextCursor
    const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : null;

    // Устанавливаем заголовки кэширования
    c.header('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=600');
    c.header('Vary', 'Accept, Accept-Encoding');

    return c.json({
      items: itemsTyped.map((item) => ({
        id: item.id,
        name: item.name,
        countryId: item.countryId,
        description: item.description,
        latitude: item.latitude,
        longitude: item.longitude,
        image: item.image,
        placesCount: Number(item.placesCount),
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

// GET /v1/cities/:id - город по ID
app.get('/:id', async (c) => {
  const requestId = c.get('requestId');

  try {
    // Валидация параметров
    const params = getCityParamsSchema.safeParse({
      id: c.req.param('id'),
    });

    if (!params.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid city ID',
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

    const { id } = params.data;
    const db = c.get('db');

    // Запрос с подзапросом для счетчика мест
    const result = await db
      .select({
        id: cities.id,
        name: cities.name,
        countryId: cities.countryId,
        description: cities.description,
        latitude: cities.latitude,
        longitude: cities.longitude,
        image: cities.image,
        createdAt: cities.createdAt,
        updatedAt: cities.updatedAt,
        placesCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${places} 
          WHERE ${places.cityId} = ${cities.id}
        )`,
      })
      .from(cities)
      .where(eq(cities.id, id))
      .limit(1);

    if (result.length === 0) {
      return c.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'City not found',
            traceId: requestId,
          },
        },
        404
      );
    }

    const city = result[0];

    // Устанавливаем заголовки кэширования
    c.header('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=600');
    c.header('Vary', 'Accept, Accept-Encoding');

    return c.json({
      id: city.id,
      name: city.name,
      countryId: city.countryId,
      description: city.description,
      latitude: city.latitude,
      longitude: city.longitude,
      image: city.image,
      placesCount: Number(city.placesCount),
      createdAt: city.createdAt,
      updatedAt: city.updatedAt,
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

export const citiesRoutes = app;

