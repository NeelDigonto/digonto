import { createServer, Server } from 'http';
import { WebSocketServer } from './WebSocketServerBCKP';
import { Logger } from '@/utils/logger';
import { Env, getEnv } from '@/utils/environment';

export class WebSocketApp {
    private httpServer: Server;
    private wsServer: WebSocketServer;
    private logger: Logger;
    private env: Env;

    constructor(logger: Logger) {
        this.logger = logger;
        this.env = getEnv();

        // Create HTTP server for WebSocket upgrades
        this.httpServer = createServer();
        this.wsServer = new WebSocketServer(logger);

        this.setupServer();
    }

    private setupServer(): void {
        // Handle WebSocket upgrade requests
        this.httpServer.on('upgrade', (request, socket, head) => {
            const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;

            if (pathname === '/ws') {
                this.wsServer.handleUpgrade(request, socket, head);
            } else {
                socket.destroy();
            }
        });

        // Handle regular HTTP requests (health check, etc.)
        this.httpServer.on('request', (req, res) => {
            if (req.url === '/health') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(
                    JSON.stringify({
                        success: true,
                        message: 'WebSocket server is healthy',
                        data: {
                            connectedClients: this.wsServer.getConnectedClients(),
                            uptime: process.uptime(),
                        },
                    }),
                );
            } else if (req.url === '/') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(
                    JSON.stringify({
                        success: true,
                        message: 'Digonto WebSocket Server',
                        data: {
                            endpoint: '/ws',
                            connectedClients: this.wsServer.getConnectedClients(),
                        },
                    }),
                );
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(
                    JSON.stringify({
                        success: false,
                        message: 'Not Found',
                        data: null,
                    }),
                );
            }
        });

        // Graceful shutdown handling
        process.on('SIGTERM', this.shutdown.bind(this));
        process.on('SIGINT', this.shutdown.bind(this));
    }

    async start({ port = this.env.WS_PORT || 4001 }: { port?: number } = {}): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const timerId = setTimeout(() => {
                reject(new Error('WebSocket server failed to start'));
            }, 5000);

            this.httpServer.listen(port, () => {
                this.logger.log(`WebSocket server listening on http://localhost:${port}`);
                this.logger.log(`WebSocket endpoint: ws://localhost:${port}/ws`);
                clearTimeout(timerId);
                resolve();
            });

            this.httpServer.on('error', (error) => {
                clearTimeout(timerId);
                reject(error);
            });
        });
    }

    async stop(): Promise<void> {
        this.logger.log('Shutting down WebSocket server...');

        // Shutdown WebSocket server first
        await this.wsServer.shutdown();

        // Then close HTTP server
        return new Promise<void>((resolve, reject) => {
            const timerId = setTimeout(() => {
                reject(new Error('WebSocket server failed to stop'));
            }, 5000);

            this.httpServer.close((err) => {
                clearTimeout(timerId);

                if (err) {
                    reject(err);
                } else {
                    this.logger.log('WebSocket server shut down');
                    resolve();
                }
            });
        });
    }

    private async shutdown(): Promise<void> {
        try {
            await this.stop();
            process.exit(0);
        } catch (error) {
            this.logger.error('Error during WebSocket server shutdown:', error);
            process.exit(1);
        }
    }

    // Expose WebSocket server for external access
    getWebSocketServer(): WebSocketServer {
        return this.wsServer;
    }

    // Broadcast methods for convenience
    broadcast(message: any, filter?: (ws: any) => boolean): void {
        this.wsServer.broadcast(message, filter);
    }

    sendToUser(userId: string, message: any): boolean {
        return this.wsServer.sendToUser(userId, message);
    }

    getConnectedClients(): number {
        return this.wsServer.getConnectedClients();
    }
}
