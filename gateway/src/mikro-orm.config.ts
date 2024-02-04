import {
  Options,
  PostgreSqlDriver,
  EntityCaseNamingStrategy,
  ReflectMetadataProvider,
} from '@mikro-orm/postgresql';

const config: Options = {
  driver: PostgreSqlDriver,
  dbName: 'dev',
  user: 'postgres',
  password: '123',
  host: 'postgres',
  port: 5432,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  metadataProvider: ReflectMetadataProvider,
  // enable debug mode to log SQL queries and discovery information
  namingStrategy: EntityCaseNamingStrategy,
  debug: false,
};

export default config;
