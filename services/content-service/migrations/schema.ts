import { pgTable, unique, pgEnum, text, varchar, timestamp, foreignKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const countryCode = pgEnum("country_code", ['PH', 'SG', 'MY', 'ID', 'VN', 'TH'])


export const articles = pgTable("articles", {
	id: text("id").primaryKey().notNull(),
	slug: varchar("slug", { length: 255 }).notNull(),
	title: text("title").notNull(),
	excerpt: text("excerpt"),
	content: text("content").notNull(),
	authorId: text("author_id").notNull(),
	category: varchar("category", { length: 50 }),
	tags: text("tags").array(),
	coverImage: text("cover_image"),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		articlesSlugUnique: unique("articles_slug_unique").on(table.slug),
	}
});

export const countries = pgTable("countries", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	code: varchar("code", { length: 3 }).notNull(),
	flag: text("flag"),
	description: text("description"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		countriesCodeUnique: unique("countries_code_unique").on(table.code),
	}
});

export const cities = pgTable("cities", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	countryId: text("country_id").notNull().references(() => countries.id),
	description: text("description"),
	latitude: text("latitude"),
	longitude: text("longitude"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const events = pgTable("events", {
	id: text("id").primaryKey().notNull(),
	title: text("title").notNull(),
	description: text("description"),
	startTime: timestamp("start_time", { mode: 'string' }).notNull(),
	endTime: timestamp("end_time", { mode: 'string' }),
	cityId: text("city_id").notNull().references(() => cities.id),
	placeId: text("place_id").references(() => places.id),
	type: varchar("type", { length: 50 }),
	category: varchar("category", { length: 50 }),
	organizerId: text("organizer_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const places = pgTable("places", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	cityId: text("city_id").notNull().references(() => cities.id),
	description: text("description"),
	latitude: text("latitude").notNull(),
	longitude: text("longitude").notNull(),
	type: varchar("type", { length: 50 }),
	categories: text("categories").array(),
	photos: text("photos").array(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});