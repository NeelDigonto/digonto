import { ORM } from '@/db/orm';
import { CentralAPIServer } from '@/server/CentralAPIServer';
import { DigontoWSServer } from '@/server/WebSocketServer';
import { Logger } from '@/utils/logger';
import { tryGracefulAppExit } from '@/utils/misc';

async function main(): Promise<void> {
    let app: CentralAPIServer;
    let wsServer: DigontoWSServer | null = null;
    const logger: Logger = console;
    const orm = new ORM(logger, { name: 'gateway' });

    try {
        logger.log('Starting Central API Server');

        app = new CentralAPIServer(logger);
        wsServer = new DigontoWSServer({ logger, orm });

        await app.start();
    } catch (err) {
        logger.error(err);

        if (err instanceof Error) {
            return Promise.reject(err);
        }

        return Promise.reject(new Error('An error during Server Start'));
    }

    return new Promise<void>((resolve, reject) => {
        // CTRL+C
        process.on('SIGINT', () => {
            logger.log('Received SIGINT');
            tryGracefulAppExit(app, resolve, reject);
        });

        // Keyboard quit
        process.on('SIGQUIT', () => {
            logger.log('Received SIGQUIT');
            tryGracefulAppExit(app, resolve, reject);
        });

        // `kill` command
        //process.on('SIGTERM', () => {
        //    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        //    if (!app) {
        //        logger.warn('Spurious SIGTERM');
        //    }
        //
        //    logger.log('Received SIGTERM');
        //    tryGracefulAppExit(app, resolve, reject);
        //});
    });
}

main()
    .then(() => {
        console.warn('Gracefully Exitted');
        process.exit(0);
    })
    .catch((err: unknown) => {
        console.error(err);
        console.log('Force Exitted');
        process.exit(1);
    });
