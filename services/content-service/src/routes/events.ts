import { Hono } from 'hono';
import { z } from 'zod';
import { events } from '../db';
import { eq, sql, gt, and, gte, lt } from 'drizzle-orm';

const app = new Hono();

// Валидационные схемы
const getEventsQuerySchema = z.object({
  cityId: z.string().optional(),
  date: z.enum(['today', 'tomorrow', 'week']).optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().min(1).max(100)),
  cursor: z.string().optional(),
});

const getEventParamsSchema = z.object({
  id: z.string().min(1),
});

// Вспомогательная функция для вычисления диапазонов дат
function getDateRange(dateFilter?: 'today' | 'tomorrow' | 'week'): { start: Date; end: Date } | null {
  if (!dateFilter) return null;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  switch (dateFilter) {
    case 'today':
      return {
        start: startOfToday,
        end: endOfToday,
      };
    case 'tomorrow':
      const startOfTomorrow = new Date(startOfToday);
      startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
      const endOfTomorrow = new Date(startOfTomorrow);
      endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
      return {
        start: startOfTomorrow,
        end: endOfTomorrow,
      };
    case 'week':
      const endOfWeek = new Date(startOfToday);
      endOfWeek.setDate(endOfWeek.getDate() + 7);
      return {
        start: startOfToday,
        end: endOfWeek,
      };
    default:
      return null;
  }
}

// GET /v1/events - список событий
app.get('/', async (c) => {
  const requestId = c.get('requestId');

  try {
    // Валидация query параметров
    const queryParams = getEventsQuerySchema.safeParse({
      cityId: c.req.query('cityId'),
      date: c.req.query('date'),
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

    const { cityId, date, limit, cursor } = queryParams.data;
    const db = c.get('db');

    // Базовый запрос
    let baseQuery = db.select().from(events);

    // Условия фильтрации
    const conditions = [];
    if (cityId) {
      conditions.push(eq(events.cityId, cityId));
    }
    if (date) {
      const dateRange = getDateRange(date);
      if (dateRange) {
        // Фильтруем события, которые начинаются в указанном диапазоне
        conditions.push(gte(events.startTime, dateRange.start));
        conditions.push(lt(events.startTime, dateRange.end));
      }
    }
    if (cursor) {
      conditions.push(gt(events.id, cursor));
    }

    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions)) as any;
    }

    // Сортировка по дате начала (сначала ближайшие) и лимит
    const query = baseQuery.orderBy(events.startTime).orderBy(events.id).limit(limit + 1) as any;
    const result = await query;

    // Определяем, есть ли следующая страница
    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;

    // Формируем nextCursor
    const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : null;

    // Устанавливаем заголовки кэширования
    c.header('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300');
    c.header('Vary', 'Accept, Accept-Encoding');

    return c.json({
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        startTime: item.startTime,
        endTime: item.endTime,
        cityId: item.cityId,
        placeId: item.placeId,
        type: item.type,
        category: item.category,
        organizerId: item.organizerId,
        address: item.address,
        contact: item.contact,
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

// GET /v1/events/:id - событие по ID
app.get('/:id', async (c) => {
  const requestId = c.get('requestId');

  try {
    // Валидация параметров
    const params = getEventParamsSchema.safeParse({
      id: c.req.param('id'),
    });

    if (!params.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid event ID',
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
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (result.length === 0) {
      return c.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Event not found',
            traceId: requestId,
          },
        },
        404
      );
    }

    const event = result[0];

    // Устанавливаем заголовки кэширования
    c.header('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300');
    c.header('Vary', 'Accept, Accept-Encoding');

    return c.json({
      id: event.id,
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      cityId: event.cityId,
      placeId: event.placeId,
      type: event.type,
      category: event.category,
      organizerId: event.organizerId,
      address: event.address,
      contact: event.contact,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
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

export const eventsRoutes = app;

