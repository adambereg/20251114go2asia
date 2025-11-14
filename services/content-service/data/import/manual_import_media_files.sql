-- Manual import script for media_files table
-- Execute this in Neon Console SQL Editor

-- First, ensure the table exists (if not already created)
CREATE TABLE IF NOT EXISTS "media_files" (
	"id" text PRIMARY KEY NOT NULL,
	"filename" text,
	"original_filename" text,
	"url" text NOT NULL,
	"type" varchar(50),
	"mime_type" text,
	"size" integer,
	"width" integer,
	"height" integer,
	"thumbnail_url" text,
	"entity_type" varchar(50),
	"entity_id" text,
	"order_index" integer,
	"title" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Insert data (copy from CSV file)
-- You can copy-paste these INSERT statements or use Neon's CSV import feature

INSERT INTO "media_files" ("id", "filename", "original_filename", "url", "type", "mime_type", "size", "width", "height", "thumbnail_url", "entity_type", "entity_id", "order_index", "title", "description", "created_at", "updated_at")
VALUES
('001ad6bc-f9ae-40cd-a218-0dd370f835e2', 'country/country-vn/Halong_Bay.jpg', 'Halong_Bay.jpg', 'https://media.go2asia.space/country/country-vn/Halong_Bay.jpg', 'image', 'image/jpeg', 1024000, 1740, 1160, NULL, 'country', 'country-vn', 10, 'Бухта Халонг', 'Халонг - бухта Тонкинского залива Южно-китайского моря. Включает в себя более 3000 островов, а также небольшие скалы, утёсы и пещеры.', '2025-11-09 16:14:24.760249', '2025-11-10 03:19:22.843396')
ON CONFLICT (id) DO UPDATE SET
  url = EXCLUDED.url,
  updated_at = EXCLUDED.updated_at;

-- Note: For full import, you can:
-- 1. Use Neon Console's CSV import feature (recommended)
-- 2. Copy all INSERT statements from the CSV file
-- 3. Or use the seed script after ensuring migration is applied to staging DB

