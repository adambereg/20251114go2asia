-- Token Service Migration
-- Выполните этот SQL в Neon Console → SQL Editor

-- Создание типа для транзакций
DO $$ BEGIN
 CREATE TYPE "transaction_type" AS ENUM('points_add', 'points_subtract', 'g2a_add', 'g2a_subtract');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Создание таблицы balances
CREATE TABLE IF NOT EXISTS "balances" (
	"user_id" text PRIMARY KEY NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"g2a" numeric(10, 2) DEFAULT '0' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Создание таблицы transactions
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" "transaction_type" NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"reason" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Создание индексов
CREATE INDEX IF NOT EXISTS "transactions_user_id_idx" ON "transactions" ("user_id");
CREATE INDEX IF NOT EXISTS "transactions_created_at_idx" ON "transactions" ("created_at");

-- Проверка
SELECT 'Migration completed successfully!' as status;

