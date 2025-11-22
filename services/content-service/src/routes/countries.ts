import { Hono } from 'hono';
import { z } from 'zod';
import { countries, cities, places } from '../db';
import { eq, sql, gt } from 'drizzle-orm';
import type { ContentServiceEnv } from '../types';

type CountryWithCounts = typeof countries.$inferSelect & {
  citiesCount: number;
  placesCount: number;
};

const app = new Hono<ContentServiceEnv>();

// Валидационные схемы
const getCountriesQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().min(1).max(100)),
  cursor: z.string().optional(),
});

const getCountryParamsSchema = z.object({
  id: z.string().min(1),
});

// GET /v1/countries - список стран
app.get('/', async (c) => {
  const requestId = c.get('requestId');

  try {
    // Валидация query параметров
    const queryParams = getCountriesQuerySchema.safeParse({
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

    const { limit, cursor } = queryParams.data;
    const db = c.get('db');

    // Базовый запрос с подзапросами для счетчиков
    let baseQuery = db
      .select({
        id: countries.id,
        name: countries.name,
        code: countries.code,
        flag: countries.flag,
        description: countries.description,
        capital: countries.capital,
        population: countries.population,
        currency: countries.currency,
        language: countries.language,
        area: countries.area,
        timezone: countries.timezone,
        nameEn: countries.nameEn,
        heroImage: countries.heroImage,
        gallery: countries.gallery,
        createdAt: countries.createdAt,
        updatedAt: countries.updatedAt,
        citiesCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${cities} 
          WHERE ${cities.countryId} = ${countries.id}
        )`,
        placesCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${places} 
          INNER JOIN ${cities} ON ${places.cityId} = ${cities.id}
          WHERE ${cities.countryId} = ${countries.id}
        )`,
      })
      .from(countries);

    // Cursor-based пагинация
    if (cursor) {
      baseQuery = baseQuery.where(gt(countries.id, cursor)) as any;
    }

    // Сортировка и лимит (берем на 1 больше для проверки hasMore)
    const query = baseQuery.orderBy(countries.id).limit(limit + 1) as any;
    const result = await query;

    // Определяем, есть ли следующая страница
    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;
    const itemsTyped = items as CountryWithCounts[];

    // Формируем nextCursor
    const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : null;

    // Устанавливаем заголовки кэширования для публичных данных
    c.header('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=600');
    c.header('Vary', 'Accept, Accept-Encoding');

    return c.json({
      items: itemsTyped.map((item) => ({
        id: item.id,
        name: item.name,
        code: item.code,
        flag: item.flag,
        description: item.description,
        citiesCount: Number(item.citiesCount),
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

// GET /v1/countries/:id - страна по ID
app.get('/:id', async (c) => {
  const requestId = c.get('requestId');

  try {
    // Валидация параметров
    const params = getCountryParamsSchema.safeParse({
      id: c.req.param('id'),
    });

    if (!params.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid country ID',
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

    // Запрос с подзапросами для счетчиков
    const result = await db
      .select({
        id: countries.id,
        name: countries.name,
        code: countries.code,
        flag: countries.flag,
        description: countries.description,
        capital: countries.capital,
        population: countries.population,
        currency: countries.currency,
        language: countries.language,
        area: countries.area,
        timezone: countries.timezone,
        nameEn: countries.nameEn,
        heroImage: countries.heroImage,
        gallery: countries.gallery,
        createdAt: countries.createdAt,
        updatedAt: countries.updatedAt,
        citiesCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${cities} 
          WHERE ${cities.countryId} = ${countries.id}
        )`,
        placesCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${places} 
          INNER JOIN ${cities} ON ${places.cityId} = ${cities.id}
          WHERE ${cities.countryId} = ${countries.id}
        )`,
      })
      .from(countries)
      .where(eq(countries.id, id))
      .limit(1);

    if (result.length === 0) {
      return c.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Country not found',
            traceId: requestId,
          },
        },
        404
      );
    }

    const country = result[0];

    // Устанавливаем заголовки кэширования
    c.header('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=600');
    c.header('Vary', 'Accept, Accept-Encoding');

    return c.json({
      id: country.id,
      name: country.name,
      code: country.code,
      flag: country.flag,
      description: country.description,
      capital: country.capital,
      population: country.population,
      currency: country.currency,
      language: country.language,
      area: country.area,
      timezone: country.timezone,
      nameEn: country.nameEn,
      heroImage: country.heroImage,
      gallery: country.gallery,
      citiesCount: Number(country.citiesCount),
      placesCount: Number(country.placesCount),
      createdAt: country.createdAt,
      updatedAt: country.updatedAt,
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

export const countriesRoutes = app;

