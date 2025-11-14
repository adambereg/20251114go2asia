-- Migration: Add media_files table
-- Generated: 2025-11-14

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

