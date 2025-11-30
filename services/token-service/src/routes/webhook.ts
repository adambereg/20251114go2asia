import { Hono } from 'hono';
import { z } from 'zod';
import type { TokenServiceEnv } from '../types';
import { rewardUser } from '../utils/rewards';
import { ActionType } from '../utils/reward-rules';

const app = new Hono<TokenServiceEnv>();

// Валидационные схемы для событий
const reactionCreatedSchema = z.object({
  userId: z.string(),
  reactionType: z.enum(['like', 'repost', 'comment']),
  targetType: z.string(),
  targetId: z.string(),
  metadata: z.record(z.unknown()).nullable().optional(),
});

const questCompletedSchema = z.object({
  userId: z.string(),
  questId: z.string(),
  metadata: z.record(z.unknown()).nullable().optional(),
});

const referralSignupSchema = z.object({
  referrerId: z.string(),
  referralId: z.string(),
  isVIP: z.boolean().optional(),
  metadata: z.record(z.unknown()).nullable().optional(),
});

// POST /v1/webhook - обработка событий от других сервисов
app.post('/', async (c) => {
  const requestId = c.get('requestId');

  try {
    const body = await c.req.json();
    const { event, data } = body;

    if (!event || !data) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing event or data',
            traceId: requestId,
          },
        },
        400
      );
    }

    const db = c.get('db');

    // Обработка различных типов событий
    switch (event) {
      case 'reaction.created': {
        // Событие от Reactions Service: пользователь создал реакцию
        const validatedData = reactionCreatedSchema.safeParse(data);
        if (!validatedData.success) {
          return c.json(
            {
              error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid reaction.created data',
                details: validatedData.error.errors,
                traceId: requestId,
              },
            },
            400
          );
        }

        const { userId, reactionType, metadata } = validatedData.data;

        // Определяем тип действия на основе типа реакции
        let action: ActionType;
        switch (reactionType) {
          case 'like':
            action = 'post_like';
            break;
          case 'repost':
            action = 'post_repost';
            break;
          default:
            // Комментарии и другие реакции пока не награждаются
            return c.json({ success: true, message: 'No reward for this reaction type' });
        }

        // TODO: Получить VIP статус пользователя из Auth Service
        const isVIP = false;

        const result = await rewardUser(db, userId, action, isVIP, metadata || undefined);

        if (!result.success) {
          console.warn(`Failed to reward user ${userId} for ${action}:`, result.error);
          // Не возвращаем ошибку, чтобы не блокировать обработку события
          return c.json({ success: false, error: result.error });
        }

        return c.json({
          success: true,
          pointsAwarded: result.pointsAwarded,
          newLevel: result.newLevel,
          badgeAwarded: result.badgeAwarded,
        });
      }

      case 'post.created': {
        // Событие от Space Service: пользователь создал пост
        const { userId, metadata } = data;
        if (!userId) {
          return c.json(
            {
              error: {
                code: 'VALIDATION_ERROR',
                message: 'Missing userId',
                traceId: requestId,
              },
            },
            400
          );
        }

        // TODO: Получить VIP статус пользователя из Auth Service
        const isVIP = false;

        const result = await rewardUser(db, userId, 'post_create', isVIP, metadata || undefined);

        if (!result.success) {
          console.warn(`Failed to reward user ${userId} for post_create:`, result.error);
          return c.json({ success: false, error: result.error });
        }

        return c.json({
          success: true,
          pointsAwarded: result.pointsAwarded,
          newLevel: result.newLevel,
          badgeAwarded: result.badgeAwarded,
        });
      }

      case 'quest.completed': {
        // Событие от Quest Service: пользователь завершил квест
        const validatedData = questCompletedSchema.safeParse(data);
        if (!validatedData.success) {
          return c.json(
            {
              error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid quest.completed data',
                details: validatedData.error.errors,
                traceId: requestId,
              },
            },
            400
          );
        }

        const { userId, metadata } = validatedData.data;

        // TODO: Получить VIP статус пользователя из Auth Service
        const isVIP = false;

        const result = await rewardUser(db, userId, 'quest_complete', isVIP, metadata || undefined);

        if (!result.success) {
          console.warn(`Failed to reward user ${userId} for quest_complete:`, result.error);
          return c.json({ success: false, error: result.error });
        }

        return c.json({
          success: true,
          pointsAwarded: result.pointsAwarded,
          newLevel: result.newLevel,
          badgeAwarded: result.badgeAwarded,
        });
      }

      case 'referral.signup': {
        // Событие от Referral Service: пользователь зарегистрировался по реферальной ссылке
        const validatedData = referralSignupSchema.safeParse(data);
        if (!validatedData.success) {
          return c.json(
            {
              error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid referral.signup data',
                details: validatedData.error.errors,
                traceId: requestId,
              },
            },
            400
          );
        }

        const { referrerId, isVIP: referrerIsVIP, metadata } = validatedData.data;

        // Награждаем реферера только если у него VIP статус
        if (referrerIsVIP) {
          const result = await rewardUser(
            db,
            referrerId,
            'referral_signup',
            referrerIsVIP,
            metadata || undefined
          );

          if (!result.success) {
            console.warn(`Failed to reward referrer ${referrerId} for referral_signup:`, result.error);
            return c.json({ success: false, error: result.error });
          }

          return c.json({
            success: true,
            pointsAwarded: result.pointsAwarded,
            newLevel: result.newLevel,
            badgeAwarded: result.badgeAwarded,
          });
        }

        return c.json({ success: true, message: 'Referrer is not VIP, no reward' });
      }

      default:
        return c.json(
          {
            error: {
              code: 'UNKNOWN_EVENT',
              message: `Unknown event type: ${event}`,
              traceId: requestId,
            },
          },
          400
        );
    }
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


