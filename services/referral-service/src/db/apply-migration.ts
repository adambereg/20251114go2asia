/**
 * Script to apply raw SQL migration files
 * 
 * Usage:
 *   DATABASE_URL=postgresql://... tsx src/db/apply-migration.ts migrations/0000_create_referral_tables.sql
 */

import { createDb } from './index';
import { sql } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';
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

async function applyMigration(migrationFile: string) {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const db = createDb({ DATABASE_URL: process.env.DATABASE_URL });
  const migrationPath = resolve(process.cwd(), migrationFile);
  
  if (!existsSync(migrationPath)) {
    console.error(`Error: Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  const sqlContent = readFileSync(migrationPath, 'utf-8');
  
  try {
    console.log(`Applying migration: ${migrationFile}`);
    // Execute raw SQL - split by statement-breakpoint and execute each statement
    const statements = sqlContent
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        await db.execute(sql.raw(statement));
      }
    }
    console.log('✓ Migration applied successfully');
  } catch (error) {
    console.error('❌ Error applying migration:', error);
    process.exit(1);
  }
}

const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error('Usage: tsx src/db/apply-migration.ts <migration-file>');
  process.exit(1);
}

applyMigration(migrationFile).then(() => {
  console.log('Done');
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

