import type { Env } from 'hono';
import type { createDb } from './db';

export interface ContentServiceBindings {
  DATABASE_URL?: string;
  NODE_ENV?: string;
  [key: string]: unknown;
}

export type ContentDbInstance = ReturnType<typeof createDb>;

export interface ContentServiceEnv extends Env {
  Bindings: ContentServiceBindings;
  Variables: {
    db: ContentDbInstance;
    requestId: string;
  };
}


