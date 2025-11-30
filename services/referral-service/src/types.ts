import type { Env } from 'hono';
import type { createDb } from './db';

export interface ReferralServiceBindings extends Record<string, unknown> {
  DATABASE_URL?: string;
  NODE_ENV?: string;
  TOKEN_SERVICE_URL?: string; // URL Token Service для интеграции
}

export interface ReferralServiceEnv extends Env {
  Bindings: ReferralServiceBindings;
  Variables: {
    db: ReturnType<typeof createDb>;
    requestId: string;
    userId?: string;
  };
}
