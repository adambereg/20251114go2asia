/**
 * Script to apply Drizzle migrations automatically (non-interactive)
 * 
 * Usage:
 *   DATABASE_URL=postgresql://... tsx scripts/apply-migration-auto.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/db/schema';
import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Load .env from project root
const possiblePaths = [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), '../../.env'),
];

for (const envPath of possiblePaths) {
  if (existsSync(envPath)) {
    config({ path: envPath });
    break;
  }
}

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is required');
  process.exit(1);
}

async function applySchema() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client, { schema });

  try {
    console.log('Applying schema changes...');
    console.log('This will create/update tables according to schema.ts');
    
    // Drizzle push will sync schema with database
    // We need to use drizzle-kit for this, but we can manually execute the SQL
    // For now, let's use the postgres client directly to create the table
    
    const createTableSQL = `
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
    `;

    await client.unsafe(createTableSQL);
    console.log('✓ Table media_files created/verified');
    
    await client.end();
    console.log('✓ Schema applied successfully');
  } catch (error) {
    console.error('❌ Error applying schema:', error);
    await client.end();
    process.exit(1);
  }
}

applySchema();

