import { MikroORM } from '@mikro-orm/postgresql';
import config from './mikro-orm.config.js';
import { logger } from '../utils/logger.js';

const runMigrations = async () => {
  let orm: MikroORM | null = null;
  
  try {
    orm = await MikroORM.init(config);
    const migrator = orm.getMigrator();
    
    // Create initial migration if none exist
    const pending = await migrator.getPendingMigrations();
    if (pending.length === 0) {
      logger.info('No pending migrations');
      
      // Check if we need to create initial migration
      const executed = await migrator.getExecutedMigrations();
      if (executed.length === 0) {
        logger.info('Creating initial migration');
        await migrator.createInitialMigration();
      }
    }
    
    // Run migrations
    await migrator.up();
    logger.info('Migrations completed successfully');
    
  } catch (error) {
    logger.error({ error }, 'Migration failed');
    process.exit(1);
  } finally {
    if (orm) {
      await orm.close();
    }
  }
};

runMigrations();