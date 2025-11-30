import { pgTable, text, integer, numeric, timestamp, pgEnum, jsonb } from 'drizzle-orm/pg-core';

// Enums
export const transactionTypeEnum = pgEnum('transaction_type', [
  'points_add',
  'points_subtract',
  'g2a_add',
  'g2a_subtract',
]);

// Balances table - балансы пользователей
export const balances = pgTable('balances', {
  userId: text('user_id').primaryKey(), // Clerk user ID
  points: integer('points').default(0).notNull(),
  g2a: numeric('g2a', { precision: 10, scale: 2 }).default('0').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Transactions table - история транзакций
export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  type: transactionTypeEnum('type').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  reason: text('reason').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// NFT Badges table - NFT-бейджи пользователей (off-chain)
export const nftBadges = pgTable('nft_badges', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  badgeId: text('badge_id').notNull(), // Идентификатор бейджа (например, 'newcomer', 'explorer')
  badgeName: text('badge_name').notNull(), // Название бейджа
  badgeDescription: text('badge_description'),
  badgeImage: text('badge_image'), // URL изображения бейджа
  source: text('source').notNull(), // Источник получения (например, 'level_up', 'quest_complete', 'achievement')
  metadata: jsonb('metadata'), // Дополнительные данные
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Daily limits table - отслеживание дневных лимитов начислений
export const dailyLimits = pgTable('daily_limits', {
  userId: text('user_id').notNull(),
  action: text('action').notNull(), // Тип действия (например, 'post_like')
  date: timestamp('date').notNull(), // Дата (только дата, без времени)
  count: integer('count').default(0).notNull(), // Количество начислений за день
  lastRewardTime: timestamp('last_reward_time'), // Время последнего начисления
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  pk: {
    primaryKey: [table.userId, table.action, table.date],
  },
}));

