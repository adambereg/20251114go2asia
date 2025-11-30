-- Миграция для добавления полей VIP статуса и разблокировки Points

-- Добавляем поля для отслеживания VIP статуса и разблокированных Points
ALTER TABLE "referrals" 
  ADD COLUMN IF NOT EXISTS "is_vip" boolean DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS "points_unlocked" integer DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS "points_pending" integer DEFAULT 5000 NOT NULL,
  ADD COLUMN IF NOT EXISTS "vip_activated_at" timestamp;

-- Создаём индекс для быстрого поиска VIP рефералов
CREATE INDEX IF NOT EXISTS "referrals_is_vip_idx" ON "referrals" ("is_vip");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "referrals_sponsor_id_idx" ON "referrals" ("sponsor_id");


