import { beforeAll, afterAll } from 'vitest';
import type { MikroORM } from '@mikro-orm/postgresql';
import { initDatabase, closeDatabase } from '../src/db/database.js';

let orm: MikroORM;

beforeAll(async () => {
  // Use test database
  process.env.NODE_ENV = 'test';
  process.env.POSTGRES_DB = 'gateway_e2e_test';
  
  orm = await initDatabase();
  
  // Ensure clean database
  const generator = orm.getSchemaGenerator();
  await generator.dropSchema();
  await generator.createSchema();
});

afterAll(async () => {
  await closeDatabase();
});