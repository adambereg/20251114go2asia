import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Create database instance for Cloudflare Workers
 * @param env - Environment bindings from Cloudflare Workers (contains DATABASE_URL as secret)
 */
export function createDb(env: { DATABASE_URL?: string }) {
  const connectionString = env.DATABASE_URL;

  if (!connectionString) {
    console.warn('DATABASE_URL not set - database operations will fail');
    // Return a mock that throws errors
    return {
      select: () => {
        throw new Error('Database not configured - DATABASE_URL is required');
      },
      execute: async () => {
        throw new Error('Database not configured - DATABASE_URL is required');
      },
    } as any;
  }

  const client = postgres(connectionString);
  return drizzle(client, { schema });
}

export * from './schema';

