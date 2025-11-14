import { pgTable, text, varchar, integer, timestamp, pgEnum, boolean, jsonb } from 'drizzle-orm/pg-core';

// Enums
export const countryCodeEnum = pgEnum('country_code', ['TH', 'VN', 'ID', 'MY', 'SG', 'PH']);

// Countries table
export const countries = pgTable('countries', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: varchar('code', { length: 3 }).notNull().unique(),
  flag: text('flag'),
  description: text('description'),
  capital: text('capital'),
  population: text('population'),
  currency: text('currency'),
  language: text('language'),
  area: text('area'),
  timezone: text('timezone'),
  nameEn: text('name_en'),
  heroImage: text('hero_image'),
  gallery: text('gallery').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Cities table
export const cities = pgTable('cities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  countryId: text('country_id').notNull().references(() => countries.id),
  description: text('description'),
  latitude: text('latitude'),
  longitude: text('longitude'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Places table
export const places = pgTable('places', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  cityId: text('city_id').notNull().references(() => cities.id),
  description: text('description'),
  latitude: text('latitude').notNull(),
  longitude: text('longitude').notNull(),
  type: varchar('type', { length: 50 }),
  categories: text('categories').array(),
  photos: text('photos').array(),
  address: text('address'),
  rating: integer('rating'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Events table
export const events = pgTable('events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  cityId: text('city_id').notNull().references(() => cities.id),
  placeId: text('place_id').references(() => places.id),
  type: varchar('type', { length: 50 }),
  category: varchar('category', { length: 50 }),
  organizerId: text('organizer_id'),
  address: text('address'),
  contact: jsonb('contact'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Articles table
export const articles = pgTable('articles', {
  id: text('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  authorId: text('author_id').notNull(),
  category: varchar('category', { length: 50 }),
  tags: text('tags').array(),
  coverImage: text('cover_image'),
  publishedAt: timestamp('published_at'),
  featured: boolean('featured').default(false),
  views: integer('views').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

