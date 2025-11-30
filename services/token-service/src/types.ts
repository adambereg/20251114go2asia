import type { Env } from 'hono';
import type { createDb } from './db';

export interface TokenServiceBindings extends Record<string, unknown> {
  DATABASE_URL?: string;
  NODE_ENV?: string;
}

export interface TokenServiceEnv extends Env {
  Bindings: TokenServiceBindings;
  Variables: {
    db: ReturnType<typeof createDb>;
    requestId: string;
    userId?: string;
  };
}


















