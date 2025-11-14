import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Load .env from project root
// When running from root: pnpm db:migrate:up -> process.cwd() = root -> .env
// When running from services/content-service: cd services/content-service && pnpm db:migrate:up -> process.cwd() = services/content-service -> ../../.env
const possiblePaths = [
  resolve(process.cwd(), '.env'),           // From root (when running pnpm db:migrate:up from root)
  resolve(process.cwd(), '../../.env'),    // From services/content-service (when running from service dir)
];

// Try to load .env from one of the possible paths
let envLoaded = false;
for (const envPath of possiblePaths) {
  if (existsSync(envPath)) {
    config({ path: envPath });
    envLoaded = true;
    break;
  }
}

// Fallback: try default dotenv behavior (loads from process.cwd())
if (!envLoaded) {
  config();
}

export default {
  schema: './src/db/schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;

