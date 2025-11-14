import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import type { Config } from 'drizzle-kit';

// Загружаем .env файл
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

export default {
  schema: './src/db/schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || '',
  },
} satisfies Config;

