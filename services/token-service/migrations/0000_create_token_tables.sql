DO $$ BEGIN
 CREATE TYPE "transaction_type" AS ENUM('points_add', 'points_subtract', 'g2a_add', 'g2a_subtract');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "balances" (
	"user_id" text PRIMARY KEY NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"g2a" numeric(10, 2) DEFAULT '0' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" "transaction_type" NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"reason" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_user_id_idx" ON "transactions" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_created_at_idx" ON "transactions" ("created_at");

