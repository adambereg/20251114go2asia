import { pgTable, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

// Referrals table - реферальные связи
export const referrals = pgTable('referrals', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(), // Clerk user ID (уникальный - один пользователь может быть рефералом только один раз)
  sponsorId: text('sponsor_id').notNull(), // Clerk user ID спонсора
  referralCode: text('referral_code').notNull(), // Код реферала спонсора
  isActive: boolean('is_active').default(true).notNull(),
  isVIP: boolean('is_vip').default(false).notNull(), // VIP статус реферала
  pointsUnlocked: integer('points_unlocked').default(0).notNull(), // Разблокированные Points для спонсора
  pointsPending: integer('points_pending').default(5000).notNull(), // Ожидающие разблокировки Points (5000 за регистрацию)
  registeredAt: timestamp('registered_at').defaultNow().notNull(),
  vipActivatedAt: timestamp('vip_activated_at'), // Дата активации VIP статуса
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Referral codes table - коды рефералов пользователей
export const referralCodes = pgTable('referral_codes', {
  userId: text('user_id').primaryKey(), // Clerk user ID
  code: text('code').notNull().unique(), // Уникальный реферальный код
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

