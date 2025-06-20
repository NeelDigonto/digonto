import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { logger as honoLogger } from 'hono/logger';
import { compress } from 'hono/compress';
import { etag } from 'hono/etag';
import { timing } from 'hono/timing';
import { requestContextMiddleware } from './middleware/request-context.js';
import { registerMetrics, printMetrics } from './middleware/metrics.js';
import { authRoutes } from './routes/auth.routes.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

export const createApp = () => {
  const app = new Hono();
  
  // Global middleware
  app.use('*', timing());
  app.use('*', secureHeaders());
  app.use('*', compress());
  app.use('*', etag());
  
  // CORS
  app.use('*', cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposeHeaders: ['X-Request-ID'],
  }));
  
  // Logging
  app.use('*', honoLogger((message) => {
    logger.info(message);
  }));
  
  // Metrics
  app.use('*', registerMetrics);
  
  // Request context (MikroORM + OpenTelemetry)
  app.use('*', requestContextMiddleware);
  
  // Health check
  app.get('/health', (c) => {
    return c.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  });
  
  // Metrics endpoint
  app.get('/metrics', printMetrics);
  
  // API routes
  app.route('/api/auth', authRoutes);
  
  // 404 handler
  app.notFound((c) => {
    return c.json({ error: 'Not found' }, 404);
  });
  
  // Global error handler
  app.onError((err, c) => {
    const requestId = c.get('requestId');
    
    logger.error({
      error: err,
      requestId,
      method: c.req.method,
      path: c.req.path,
    }, 'Request error');
    
    if (err instanceof Error) {
      return c.json({
        error: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        requestId,
      }, 500);
    }
    
    return c.json({
      error: 'Internal server error',
      requestId,
    }, 500);
  });
  
  return app;
};