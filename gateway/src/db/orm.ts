import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { user, userRelations } from './schema/user';
import { authSession, authSessionRelations } from './schema/auth_session';
import { websocketSession, websocketSessionRelations } from './schema/websocket_session';
import { withReplicas } from 'drizzle-orm/pg-core';
import { getEnv } from '@/utils/environment';
import { Logger } from '@/utils/logger';
import {
    chatMessage,
    chatMessageRelations,
    chatSession,
    chatSessionRelations,
} from './schema/chat';

// Export all table schemas
export * from './schema/user';
export * from './schema/auth_session';
export * from './schema/websocket_session';
export * from './schema/chat';

// Combined schema object
const schema = {
    user,
    userRelations,
    authSession,
    authSessionRelations,
    websocketSession,
    websocketSessionRelations,
    chatSession,
    chatSessionRelations,
    chatMessage,
    chatMessageRelations,
} as const;

// Infer the database type with schema
export type Database = NodePgDatabase<typeof schema>;

export interface ORMConfig {
    name: string;
    poolSize?: number;
    enableReplicas?: boolean;
}

export class ORM {
    public db: Database;

    private logger: Logger;
    public readonly name: string;

    // Expose the schema for external use
    public readonly schema = schema;
    writerPool: Pool;
    readerPools: Pool[] = [];

    constructor(logger: Logger, config: ORMConfig) {
        this.logger = logger;
        this.name = config.name;

        const poolSize = config.poolSize || 10;
        const enableReplicas = config.enableReplicas ?? true;

        const env = getEnv();

        // Create writer pool
        this.writerPool = new Pool({
            connectionString: env.POSTGRES_WRITER_HOST,
            max: poolSize,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        });

        // Create reader pools if replicas are configured
        if (enableReplicas && env.POSTGRES_READER_HOSTS) {
            const readerHosts = env.POSTGRES_READER_HOSTS.split(',');
            this.readerPools = readerHosts.map(
                (host) =>
                    new Pool({
                        connectionString: host.trim(),
                        max: Math.floor(poolSize / readerHosts.length),
                        idleTimeoutMillis: 30000,
                        connectionTimeoutMillis: 5000,
                    }),
            );
        }

        // Initialize Drizzle with or without replicas
        if (this.readerPools.length > 0) {
            const writer = drizzle(this.writerPool, {
                logger: false,
                schema,
            });

            const readers = this.readerPools.map((pool) =>
                drizzle(pool, {
                    logger: false,
                    schema,
                }),
            );

            this.db = withReplicas(
                writer,
                readers as [typeof writer, ...Array<typeof writer>],
            ) as Database;
        } else {
            this.db = drizzle(this.writerPool, {
                logger: false,
                schema,
            });
        }

        this.logger.log(`ORM "${this.name}" initialized with ${this.readerPools.length} replicas`);
    }

    // Expose the Drizzle database instance
    // get db(): Database {
    //     return this.db;
    // }

    // Alias for database
    // get query() {
    //     return this.db.query;
    // }

    // Transaction helper with proper typing
    async transaction<T>(fn: (tx: Database) => Promise<T>): Promise<T> {
        return await this.db.transaction(fn);
    }

    // Connection health check
    async isHealthy(): Promise<boolean> {
        try {
            await this.writerPool.query('SELECT 1');
            return true;
        } catch (error) {
            this.logger.error('Database health check failed:', error);
            return false;
        }
    }

    // Graceful shutdown
    async destroy(): Promise<void> {
        this.logger.log(`Closing database connections for ORM "${this.name}"`);

        await Promise.all([this.writerPool.end(), ...this.readerPools.map((pool) => pool.end())]);

        this.logger.log(`Database connections closed for ORM "${this.name}"`);
    }

    // Get pool statistics
    getPoolStats() {
        return {
            writer: {
                total: this.writerPool.totalCount,
                idle: this.writerPool.idleCount,
                waiting: this.writerPool.waitingCount,
            },
            readers: this.readerPools.map((pool, index) => ({
                index,
                total: pool.totalCount,
                idle: pool.idleCount,
                waiting: pool.waitingCount,
            })),
        };
    }
}
