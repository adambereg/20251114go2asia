import { Context, Next } from 'hono';
import { generateRequestId } from '@go2asia/logger';
import type { ContentServiceEnv } from '../types';

export async function requestIdMiddleware(c: Context<ContentServiceEnv>, next: Next) {
  const requestId = c.req.header('X-Request-Id') || generateRequestId();
  c.set('requestId', requestId);
  c.header('X-Request-Id', requestId);
  await next();
}

