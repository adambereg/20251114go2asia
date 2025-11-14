import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Note: For Cloudflare Workers, we'll need to use a different approach
// This is a placeholder that will work for local development and Node.js environments
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL not set - database operations will fail');
}

// Create postgres client (only if DATABASE_URL is available)
let client: postgres.Sql | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

if (connectionString) {
  client = postgres(connectionString);
  dbInstance = drizzle(client, { schema });
}

// Export db instance or a mock that throws errors
export const db = dbInstance || {
  select: () => {
    throw new Error('Database not configured - DATABASE_URL is required');
  },
  execute: async () => {
    throw new Error('Database not configured - DATABASE_URL is required');
  },
} as any;

export * from './schema';

