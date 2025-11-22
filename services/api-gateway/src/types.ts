import type { Env } from 'hono';

export interface ApiGatewayEnv extends Env {
  Variables: {
    requestId: string;
    validatedBody?: unknown;
    validatedQuery?: unknown;
  };
}


