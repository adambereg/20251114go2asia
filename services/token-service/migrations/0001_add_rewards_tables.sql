-- Миграция для добавления таблиц системы начислений и NFT-бейджей

-- Таблица NFT-бейджей (off-chain)
CREATE TABLE IF NOT EXISTS "nft_badges" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"badge_id" text NOT NULL,
	"badge_name" text NOT NULL,
	"badge_description" text,
	"badge_image" text,
	"source" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nft_badges_user_id_idx" ON "nft_badges" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nft_badges_badge_id_idx" ON "nft_badges" ("badge_id");

-- Таблица дневных лимитов начислений
CREATE TABLE IF NOT EXISTS "daily_limits" (
	"user_id" text NOT NULL,
	"action" text NOT NULL,
	"date" timestamp NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"last_reward_time" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	PRIMARY KEY("user_id", "action", "date")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "daily_limits_user_id_idx" ON "daily_limits" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "daily_limits_date_idx" ON "daily_limits" ("date");


