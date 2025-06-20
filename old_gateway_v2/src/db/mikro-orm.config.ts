import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import postgres from 'postgres';
import type { EntityManager, Connection } from '@mikro-orm/core';

const config = defineConfig({
  driver: PostgreSqlDriver,
  driverOptions: {
    connection: {
      create: (config) => {
        const sql = postgres({
          host: config.host,
          port: config.port,
          database: config.dbName,
          username: config.user,
          password: config.password,
          max: 10,
          idle_timeout: 20,
          connect_timeout: 10,
          ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
        });
        
        return {
          execute: async (query: string) => {
            const result = await sql.unsafe(query);
            return { rows: result, rowCount: result.length };
          },
          close: async () => {
            await sql.end();
          },
        } as unknown as Connection;
      },
    },
  },
  entities: ['./dist/db/entities/**/*.js'],
  entitiesTs: ['./src/db/entities/**/*.ts'],
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  dbName: process.env.POSTGRES_DB || 'gateway',
  debug: process.env.NODE_ENV === 'development',
  extensions: [Migrator, SeedManager],
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './dist/db/migrations',
    pathTs: './src/db/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    allOrNothing: true,
    emit: 'ts',
  },
  seeder: {
    path: './dist/db/seeds',
    pathTs: './src/db/seeds',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
  },
  pool: {
    min: 2,
    max: 10,
  },
  forceUtcTimezone: true,
});

export default config;