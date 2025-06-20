import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    dialect: 'postgresql',
    schema: './src/db/schema/*.ts',

    // driver: 'pglite',
    // dbCredentials: {
    //     url: './database/',
    // },

    dbCredentials: {
        url: 'postgres://postgres:postgres@localhost:5432/postgres',
    },

    // extensionsFilters: ['postgis'],
    schemaFilter: 'public',
    tablesFilter: '*',

    introspect: {
        casing: 'preserve',
    },

    migrations: {
        prefix: 'timestamp',
        table: '__drizzle_migrations__',
        schema: 'public',
    },

    breakpoints: true,
    strict: true,
    verbose: true,
});
