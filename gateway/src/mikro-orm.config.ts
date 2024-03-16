import 'reflect-metadata';
import {
  Options,
  PostgreSqlDriver,
  EntityCaseNamingStrategy,
  ReflectMetadataProvider,
} from '@mikro-orm/postgresql';
import { getEnv } from '@/environment';
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import { WebRequest } from './db/entities/WebRequest.entity';

const vtEnv = getEnv();

const config: Options = {
  driver: PostgreSqlDriver,
  dbName: vtEnv.pgDB,
  user: vtEnv.pgUser,
  password: vtEnv.pgPassword,
  host: vtEnv.pgHost,
  port: vtEnv.pgPort,
  //entities: ['dist/**/*.entity.js'],
  //entitiesTs: ['src/**/*.entity.ts'],
  entities: [WebRequest],
  metadataProvider: ReflectMetadataProvider,
  // enable debug mode to log SQL queries and discovery information
  namingStrategy: EntityCaseNamingStrategy,
  debug: false,
  extensions: [Migrator],
  migrations: {
    tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
    path: './dist/migrations', // path to the folder with migrations
    pathTs: './migrations', // path to the folder with TS migrations (if used, you should put path to compiled files in `path`)
    glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: false, // wrap statements with `set foreign_key_checks = 0` or equivalent, I changed to false
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    snapshot: true, // save snapshot when creating new migrations
    emit: 'ts', // migration generation mode
    generator: TSMigrationGenerator, // migration generator, e.g. to allow custom formatting
  },
};

export default config;
