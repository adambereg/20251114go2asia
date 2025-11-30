import { Hono } from 'hono';
import { z } from 'zod';
import { places } from '../db';
import { eq, sql, gt, and } from 'drizzle-orm';
import type { ContentServiceEnv } from '../types';
import { parseSortParams, createSortSQL } from '../utils/sorting';
import { createSearchCondition } from '../utils/search';

type PlaceRow = typeof places.$inferSelect;

const app = new Hono<ContentServiceEnv>();

// Валидационные схемы
const getPlacesQuerySchema = z.object({
  cityId: z.string().optional(),
  types: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      if (typeof val === 'string') {
        // Поддержка формата "type1,type2" или "type1"
        return val.split(',').filter((t) => t.trim().length > 0);
      }
      return val;
    }),
  search: z.string().optional(),
  sortBy: z.enum(['id', 'name', 'rating', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().min(1).max(100)),
  cursor: z.string().optional(),
});

const getPlaceParamsSchema = z.object({
  id: z.string().min(1),
});

// GET /v1/places - список мест
app.get('/', async (c) => {
  const requestId = c.get('requestId');

  try {
    // Парсинг query параметров
    const queryParams = c.req.query();
    const typesParam = queryParams.types
      ? Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types]
      : undefined;

    // Валидация query параметров
    const validatedParams = getPlacesQuerySchema.safeParse({
      cityId: queryParams.cityId,
      types: typesParam,
      search: queryParams.search,
      sortBy: queryParams.sortBy,
      sortOrder: queryParams.sortOrder,
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

    const { cityId, types, search, sortBy, sortOrder, limit, cursor } = validatedParams.data;
    const db = c.get('db');

    // Определяем параметры сортировки
    const allowedSortFields = {
      id: places.id,
      name: places.name,
      rating: places.rating,
      createdAt: places.createdAt,
    };

    const sortParams = parseSortParams(
      { sortBy, sortOrder },
      allowedSortFields,
      'name',
      'asc'
    );

    // Базовый запрос
    let baseQuery = db.select().from(places);

    // Условия фильтрации
    const conditions = [];
    if (cityId) {
      conditions.push(eq(places.cityId, cityId));
    }
    if (types && types.length > 0) {
      // Фильтрация по типу (type) или категориям (categories)
      // Используем OR для каждого типа: проверяем поле type или массив categories
      const typeConditions = types.map((type) => {
        return sql`(${places.type} = ${type} OR ${type} = ANY(${places.categories}))`;
      });
      // Объединяем все условия через OR
      if (typeConditions.length === 1) {
        conditions.push(typeConditions[0]);
      } else if (typeConditions.length > 1) {
        conditions.push(sql`(${typeConditions.reduce((acc, cond, idx) => {
          if (idx === 0) return cond;
          return sql`${acc} OR ${cond}`;
        })})`);
      }
    }
    if (search) {
      const searchCondition = createSearchCondition(search, [
        places.name,
        places.description,
        places.address,
      ]);
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }
    if (cursor) {
      conditions.push(gt(places.id, cursor));
    }

    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions)) as any;
    }

    // Сортировка
    const sortField = allowedSortFields[sortParams.field];
    const sortSQL = createSortSQL(sortField, sortParams.order);
    
    // Добавляем вторичную сортировку по id для стабильности
    const query = baseQuery
      .orderBy(sortSQL)
      .orderBy(places.id)
      .limit(limit + 1) as any;
    const result = await query;

    // Определяем, есть ли следующая страница
    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;
    const itemsTyped = items as PlaceRow[];

    // Формируем nextCursor
    const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : null;

    // Устанавливаем заголовки кэширования
    c.header('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300');
    c.header('Vary', 'Accept, Accept-Encoding');

    return c.json({
      items: itemsTyped.map((item) => ({
        id: item.id,
        name: item.name,
        cityId: item.cityId,
        description: item.description,
        latitude: item.latitude,
        longitude: item.longitude,
        type: item.type,
        categories: item.categories,
        photos: item.photos,
        address: item.address,
        rating: item.rating,
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

// GET /v1/places/:id - место по ID
app.get('/:id', async (c) => {
  const requestId = c.get('requestId');

  try {
    // Валидация параметров
    const params = getPlaceParamsSchema.safeParse({
      id: c.req.param('id'),
    });

    if (!params.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid place ID',
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

    const result = await db
      .select()
      .from(places)
      .where(eq(places.id, id))
      .limit(1);

    if (result.length === 0) {
      return c.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Place not found',
            traceId: requestId,
          },
        },
        404
      );
    }

    const place = result[0];

    // Устанавливаем заголовки кэширования
    c.header('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300');
    c.header('Vary', 'Accept, Accept-Encoding');

    return c.json({
      id: place.id,
      name: place.name,
      cityId: place.cityId,
      description: place.description,
      latitude: place.latitude,
      longitude: place.longitude,
      type: place.type,
      categories: place.categories,
      photos: place.photos,
      address: place.address,
      rating: place.rating,
      createdAt: place.createdAt,
      updatedAt: place.updatedAt,
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

export const placesRoutes = app;

