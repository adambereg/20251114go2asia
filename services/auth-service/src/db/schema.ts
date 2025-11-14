import { pgTable, text, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['spacer', 'vip', 'pro']);

// Users table - профили пользователей
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  avatar: text('avatar'),
  role: userRoleEnum('role').default('spacer').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

