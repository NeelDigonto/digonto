import { Hono } from 'hono';
import { serve, ServerType } from '@hono/node-server';
import { cors } from 'hono/cors';
import { compress } from 'hono/compress';
import { secureHeaders } from 'hono/secure-headers';
// import { ORM } from '@/db/orm';
import { errorTransformer } from '@/middleware/ErrorTransformer';
import { Env, getEnv } from '@/utils/environment';
import { requestId } from 'hono/request-id';
import { xResponseTime } from '@/middleware/ResponseTime';
import { Logger } from '@/utils/logger';

export class CentralAPIServer {
    server: ServerType | null = null;
    env: Env;
    logger: Logger;
    // orm: ORM;
    // globalEM: EntityManager;
    app: Hono;

    constructor(logger: Logger) {
        this.env = getEnv();
        this.logger = logger;

        // this.orm = new ORM({
        //     name: 'Primary',
        //     poolSize: 50,
        //     connectionType: 'replicated',
        //     logger: this.logger,
        // });

        this.app = new Hono()
            .use(xResponseTime())
            .use('*', requestId())
            .use(cors())
            .use(compress())
            .use(secureHeaders())
            .onError(errorTransformer)
            .get('/', (c) => {
                return c.json({
                    success: true,
                    message: 'Welcome to the Digonto API',
                    data: null,
                });
            })
            .get('/health', (c) => {
                return c.json({
                    success: true,
                    message: 'Server is healthy',
                    data: null,
                });
            });
    }

    async start({ port = this.env.PORT }: { port?: number } = {}) {
        // await this.orm.initialize();
        this.logger.log('ORM initialized');

        return new Promise<void>((resolve, reject) => {
            const timerId = setTimeout(() => {
                reject(new Error('Server failed to start'));
            }, 5000);

            this.server = serve(
                {
                    fetch: this.app.fetch,
                    port,
                },
                (info) => {
                    this.logger.log(`Central API Server listening on http://localhost:${String(info.port)}`);
                    clearTimeout(timerId);
                    resolve();
                },
            );
        });
    }

    async stop() {
        return new Promise<void>((resolve, reject) => {
            const timerId = setTimeout(() => {
                reject(new Error('Server failed to stop'));
            }, 5000);

            if (!this.server) {
                clearTimeout(timerId);
                reject(new Error('Server is not running'));
                return;
            }

            this.server.close((err) => {
                clearTimeout(timerId);

                if (err) {
                    reject(err);
                }

                resolve();
            });
        });
    }
}
