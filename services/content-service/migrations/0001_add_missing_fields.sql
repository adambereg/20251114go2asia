-- Migration: Add missing fields from old schema
-- Generated: 2025-11-14

-- Add fields to countries table
ALTER TABLE "countries" 
ADD COLUMN IF NOT EXISTS "capital" text,
ADD COLUMN IF NOT EXISTS "population" text,
ADD COLUMN IF NOT EXISTS "currency" text,
ADD COLUMN IF NOT EXISTS "language" text,
ADD COLUMN IF NOT EXISTS "area" text,
ADD COLUMN IF NOT EXISTS "timezone" text,
ADD COLUMN IF NOT EXISTS "name_en" text,
ADD COLUMN IF NOT EXISTS "hero_image" text,
ADD COLUMN IF NOT EXISTS "gallery" text[];

-- Add image field to cities table
ALTER TABLE "cities" 
ADD COLUMN IF NOT EXISTS "image" text;

-- Add fields to places table
ALTER TABLE "places" 
ADD COLUMN IF NOT EXISTS "address" text,
ADD COLUMN IF NOT EXISTS "rating" integer;

-- Add fields to events table
ALTER TABLE "events" 
ADD COLUMN IF NOT EXISTS "address" text,
ADD COLUMN IF NOT EXISTS "contact" jsonb;

-- Add fields to articles table
ALTER TABLE "articles" 
ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS "views" integer DEFAULT 0;

