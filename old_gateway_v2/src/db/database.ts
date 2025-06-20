import { MikroORM } from '@mikro-orm/postgresql';
import type { EntityManager } from '@mikro-orm/postgresql';
import { RequestContext } from '@mikro-orm/core';
import config from './mikro-orm.config.js';
import { logger } from '../utils/logger.js';

let orm: MikroORM | null = null;

export const initDatabase = async (): Promise<MikroORM> => {
  try {
    orm = await MikroORM.init(config);
    
    const generator = orm.getSchemaGenerator();
    await generator.ensureDatabase();
    
    logger.info('Database connection established');
    return orm;
  } catch (error) {
    logger.error({ error }, 'Failed to initialize database');
    throw error;
  }
};

export const getORM = (): MikroORM => {
  if (!orm) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return orm;
};

export const getEM = (): EntityManager => {
  const em = RequestContext.getEntityManager();
  if (em) {
    return em as EntityManager;
  }
  return getORM().em.fork();
};

export const closeDatabase = async (): Promise<void> => {
  if (orm) {
    await orm.close();
    orm = null;
    logger.info('Database connection closed');
  }
};