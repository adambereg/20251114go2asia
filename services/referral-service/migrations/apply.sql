-- Referral Service Migration
-- Выполните этот SQL в Neon Console → SQL Editor

-- Создание таблицы referrals
CREATE TABLE IF NOT EXISTS "referrals" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"sponsor_id" text NOT NULL,
	"referral_code" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "referrals_user_id_unique" UNIQUE("user_id")
);

-- Создание таблицы referral_codes
CREATE TABLE IF NOT EXISTS "referral_codes" (
	"user_id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "referral_codes_code_unique" UNIQUE("code")
);

-- Создание индексов
CREATE INDEX IF NOT EXISTS "referrals_sponsor_id_idx" ON "referrals" ("sponsor_id");
CREATE INDEX IF NOT EXISTS "referrals_user_id_idx" ON "referrals" ("user_id");

-- Проверка
SELECT 'Migration completed successfully!' as status;

