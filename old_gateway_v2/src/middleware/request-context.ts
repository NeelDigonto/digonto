import type { Context, Next } from 'hono';
import { RequestContext } from '@mikro-orm/core';
import { getORM } from '../db/database.js';
import { getTracer } from '../utils/telemetry.js';
import { randomBytes } from 'crypto';

declare module 'hono' {
  interface ContextVariableMap {
    requestId: string;
  }
}

export const requestContextMiddleware = async (c: Context, next: Next) => {
  const requestId = c.req.header('x-request-id') || randomBytes(16).toString('hex');
  c.set('requestId', requestId);
  
  // Set up tracing span
  const tracer = getTracer('gateway');
  const span = tracer.startSpan(`${c.req.method} ${c.req.path}`, {
    attributes: {
      'http.method': c.req.method,
      'http.url': c.req.url,
      'http.target': c.req.path,
      'request.id': requestId,
    },
  });
  
  // Set up MikroORM request context
  return RequestContext.create(getORM().em, async () => {
    try {
      await next();
      
      span.setAttributes({
        'http.status_code': c.res.status,
      });
    } catch (error) {
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  });
};