import type { Env } from 'hono';
import type { createDb } from './db';

export interface AuthServiceBindings extends Record<string, unknown> {
  DATABASE_URL?: string;
  NODE_ENV?: string;
  CLERK_SECRET_KEY?: string;
  CLERK_WEBHOOK_SECRET?: string;
}

export interface AuthServiceEnv extends Env {
  Bindings: AuthServiceBindings;
  Variables: {
    db: ReturnType<typeof createDb>;
    requestId: string;
    userId?: string;
    userEmail?: string;
  };
}
