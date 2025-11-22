import { Hono } from 'hono';
import { Webhook } from 'svix';
import { users } from '../db';
import { eq } from 'drizzle-orm';
import type { AuthServiceEnv } from '../types';

const app = new Hono<AuthServiceEnv>();

// POST /v1/webhook - webhook от Clerk
app.post('/', async (c) => {
  const requestId = c.get('requestId');
  const env = c.env as { CLERK_WEBHOOK_SECRET?: string };

  try {
    // Проверяем наличие секрета
    if (!env.CLERK_WEBHOOK_SECRET) {
      console.error('CLERK_WEBHOOK_SECRET not configured');
      return c.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Webhook secret not configured',
            traceId: requestId,
          },
        },
        500
      );
    }

    // Получаем заголовки для валидации подписи
    const svixId = c.req.header('svix-id');
    const svixTimestamp = c.req.header('svix-timestamp');
    const svixSignature = c.req.header('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return c.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Missing Svix headers',
            traceId: requestId,
          },
        },
        401
      );
    }

    // Получаем тело запроса как строку для валидации
    const body = await c.req.text();

    // Валидируем подпись через Svix
    const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
    let payload: any;

    try {
      payload = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as any;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return c.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid webhook signature',
            traceId: requestId,
          },
        },
        401
      );
    }

    // Обрабатываем событие
    const eventType = payload.type;
    const eventData = payload.data;

    const db = c.get('db');

    switch (eventType) {
      case 'user.created':
        // Создаём пользователя в БД
        try {
          // Обрабатываем email: либо из email_addresses, либо используем primary_email_address_id как fallback
          let email = '';
          if (Array.isArray(eventData.email_addresses) && eventData.email_addresses.length > 0) {
            email = eventData.email_addresses[0].email_address || '';
          } else if (eventData.primary_email_address_id) {
            // Если email_addresses пустой, но есть primary_email_address_id, используем его как идентификатор
            // В реальном сценарии можно получить email через Clerk API, но для тестирования используем пустую строку
            email = '';
          }

          await db.insert(users).values({
            id: eventData.id,
            email: email || `user_${eventData.id}@placeholder.local`, // Временный email для тестирования
            firstName: eventData.first_name || null,
            lastName: eventData.last_name || null,
            avatar: eventData.image_url || eventData.profile_image_url || null,
            role: 'spacer',
          });
          console.log(`User created: ${eventData.id}`);
        } catch (error) {
          // Игнорируем ошибку, если пользователь уже существует
          console.warn(`User ${eventData.id} might already exist:`, error);
          // Возвращаем success даже если пользователь уже существует
        }
        break;

      case 'user.updated':
        // Обновляем данные пользователя
        try {
          const email = Array.isArray(eventData.email_addresses) && eventData.email_addresses.length > 0
            ? eventData.email_addresses[0].email_address
            : undefined;

          await db
            .update(users)
            .set({
              email: email,
              firstName: eventData.first_name ?? undefined,
              lastName: eventData.last_name ?? undefined,
              avatar: eventData.image_url ?? undefined,
              updatedAt: new Date(),
            })
            .where(eq(users.id, eventData.id));
          console.log(`User updated: ${eventData.id}`);
        } catch (error) {
          console.error(`Failed to update user ${eventData.id}:`, error);
        }
        break;

      case 'user.deleted':
        // Удаляем пользователя из БД (или помечаем как удалённого)
        try {
          await db.delete(users).where(eq(users.id, eventData.id));
          console.log(`User deleted: ${eventData.id}`);
        } catch (error) {
          console.error(`Failed to delete user ${eventData.id}:`, error);
        }
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return c.json({ success: true });
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

export const webhookRoutes = app;
