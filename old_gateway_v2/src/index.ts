import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { initDatabase, closeDatabase } from './db/database.js';
import { initTelemetry, shutdownTelemetry } from './utils/telemetry.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const start = async () => {
  try {
    // Initialize telemetry
    await initTelemetry();
    
    // Initialize database
    await initDatabase();
    
    // Create app
    const app = createApp();
    
    // Start server
    const server = serve({
      fetch: app.fetch,
      port: env.PORT,
    });
    
    logger.info({ port: env.PORT }, 'Server started');
    
    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info({ signal }, 'Shutdown signal received');
      
      server.close(() => {
        logger.info('HTTP server closed');
      });
      
      await closeDatabase();
      await shutdownTelemetry();
      
      process.exit(0);
    };
    
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
  } catch (error) {
    logger.fatal({ error }, 'Failed to start server');
    process.exit(1);
  }
};

start();