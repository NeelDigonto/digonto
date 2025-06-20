import { beforeAll, afterAll, beforeEach } from 'vitest';
import { MikroORM } from '@mikro-orm/postgresql';
import type { EntityManager } from '@mikro-orm/postgresql';
import config from '../src/db/mikro-orm.config.js';

let orm: MikroORM;
let em: EntityManager;

beforeAll(async () => {
  // Use test database
  process.env.NODE_ENV = 'test';
  process.env.POSTGRES_DB = 'gateway_test';
  
  orm = await MikroORM.init({
    ...config,
    dbName: 'gateway_test',
    debug: false,
  });
  
  // Ensure database exists and is clean
  const generator = orm.getSchemaGenerator();
  await generator.ensureDatabase();
  await generator.dropSchema();
  await generator.createSchema();
});

beforeEach(async () => {
  em = orm.em.fork();
  // Clear all data between tests
  await em.nativeDelete('Session', {});
  await em.nativeDelete('User', {});
});

afterAll(async () => {
  await orm.close();
});