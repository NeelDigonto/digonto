import { Env, getEnv } from '@/utils/environment';
import { Logger } from '@/utils/logger';
import { IncomingMessage } from 'http';
import { ServerOptions, WebSocket, WebSocketServer } from 'ws';
import { z } from 'zod';
import { DigontoWSClient } from './WebSocketClient';
import {
    AuthSession,
    authSession,
    NewWebsocketSession,
    ORM,
    User,
    user,
    WebsocketSession,
    websocketSession,
} from '@/db/orm';
import { AuthenticatedRequest, Deps, NascentRequest } from '@/types/misc';
import { randomUUID } from 'crypto';
import cookie from 'cookie';
import { eq } from 'drizzle-orm';
import { RootWSClientRequest, rootWSClientRequestSchema, WSClientEventType } from '@/types/core';

export class DigontoWSServer {
    logger: Logger;
    env: Env;
    websocketServerOptions: ServerOptions;
    wss: WebSocketServer;
    orm: ORM;

    private clients: Map<string, DigontoWSClient> = new Map();
    private cleanupInterval: NodeJS.Timeout | null = null;
    private readonly CLEANUP_INTERVAL = 30_000; // 30 seconds - check for dead connections

    constructor(deps: Deps<'orm'>) {
        this.logger = deps.logger;
        this.orm = deps.orm;
        this.env = getEnv();

        this.websocketServerOptions = {
            port: 8080,
            // perMessageDeflate: {
            //     zlibDeflateOptions: {
            //         chunkSize: 1024,
            //         memLevel: 7,
            //         level: 3,
            //     },
            //     zlibInflateOptions: {
            //         chunkSize: 10 * 1024,
            //     },
            //     clientNoContextTakeover: true, // Defaults to negotiated value.
            //     serverNoContextTakeover: true, // Defaults to negotiated value.
            //     serverMaxWindowBits: 10, // Defaults to negotiated value.
            //     // Below options specified as default values.
            //     concurrencyLimit: 10, // Limits zlib concurrency for perf.
            //     threshold: 1024, // Size (in bytes) below which messages
            //     // should not be compressed if context takeover is disabled.
            // },
        };

        this.wss = new WebSocketServer(this.websocketServerOptions);

        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        // In order of invocation
        this.wss.shouldHandle = this.shouldHandle.bind(this);
        this.wss.on('wsClientError', this.onWSClientErrorHandler.bind(this));
        this.wss.on('headers', this.onHeaderHandler.bind(this));
        this.wss.on('connection', this.onConnectionHandler.bind(this));
        this.wss.on('error', this.onErrorHandler.bind(this));
        this.wss.on('close', this.onCloseHandler.bind(this));
        this.wss.on('listening', this.onListeningHandler.bind(this));

        // // Graceful shutdown
        // process.on('SIGTERM', this.shutdown.bind(this));
        // process.on('SIGINT', this.shutdown.bind(this));
        // process.on('SIGQUIT', this.shutdown.bind(this));
    }

    private onListeningHandler(): void {
        this.logger.log(
            `WebSocket Server is listening on port ${this.websocketServerOptions.port}`,
        );
    }

    private shouldHandle(
        request: IncomingMessage,
        // socket: Duplex,
        // upgradeHead: Buffer,
        // callback: (client: WebSocket, request: IncomingMessage) => void,
    ): boolean {
        const cookies: Record<string, string> = {};
        let sessionId: string | undefined = undefined;

        if (request.headers.cookie) {
            request.headers.cookie.split(';').forEach((cookie) => {
                const cookieKV = cookie.split('=').map((_) => _.trim());
                cookies[cookieKV[0]] = cookieKV[1];
            });
        }

        if (!('Session-ID' in cookies)) {
            this.logger.warn('Client reported without session_id cookie');
        } else {
            if (!z.string().uuid().safeParse(cookies.session_id).success) {
                this.logger.warn('Client reported with invalid session_id format');
            }
        }

        sessionId = cookies['Session-ID'];
        const existingClient = this.clients.get(sessionId);
        if (existingClient) {
            // Close the existing client connection
            existingClient.close(1000, 'Duplicate session - new connection established');
            this.clients.delete(sessionId);
        }

        // If no valid session_id, generate a new one
        if (!sessionId) {
            sessionId = randomUUID();
            // this.logger.log(`Generated new session_id for client: ${sessionId}`);

            (request as NascentRequest).requiresSetCookie = true;
        }

        // Attach sessionId to the request object
        (request as NascentRequest).sessionId = sessionId;

        return true;
    }

    private onWSClientErrorHandler(error: Error, nascentWS: WebSocket): void {
        this.logger.error(`WebSocket Client Error:`, error);
        nascentWS.close(1000, 'Client Error');
    }

    private onHeaderHandler(headers: string[], request: NascentRequest): void {
        if (request.requiresSetCookie) {
            this.logger.log(`Setting session cookie for session ID: ${request.sessionId}`);
            // Set the session cookie in the response headers
            const sessionCookie = cookie.serialize('Session-ID', request.sessionId!, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7, // 1 week
                sameSite: 'strict',
            });
            headers.push(`Set-Cookie: ${sessionCookie}`);
        }
    }

    private onConnectionHandler(nascentWS: WebSocket, request: AuthenticatedRequest): void {
        this.logger.log(`WebSocket Client connected with session ID: ${request.sessionId}`);
        // console.log('Session ID:', request.sessionId);

        const sessionId = request.sessionId;

        // Remove any existing client with the same session ID
        if (this.clients.has(sessionId)) {
            const existingClient = this.clients.get(sessionId);
            existingClient?.close(1000, 'Duplicate session - new connection established');
            this.clients.delete(sessionId);
        }

        this.handleNewClient().then(([user, authSession, websocketSession]) => {
            nascentWS;
            const client = new DigontoWSClient(
                this.logger,
                this.orm,
                sessionId,
                nascentWS,
                { user, authSession, websocketSession },
                () => {
                    this.clients.delete(sessionId);
                    this.logger.log(`Client ${sessionId} dropped`);
                },
            );
            this.clients.set(sessionId, client);

            // Set up cleanup when client disconnects
            nascentWS.on('close', () => {
                this.logger.log(`Client ${sessionId} disconnected`);
                this.clients.delete(sessionId);
            });
        });
    }

    private onErrorHandler(error: Error): void {
        this.logger.error('WebSocket Server Error:', error);
    }

    private onCloseHandler(code: number, reason: Buffer): void {
        this.logger.log(`WebSocket Server closed. Code: ${code}, Reason: ${reason.toString()}`);
    }

    private async handleNewClient(): Promise<[User, AuthSession, WebsocketSession]> {
        const [defaultUser] = await this.orm.db
            .select()
            .from(user)
            .where(eq(user.name, 'Anonymous'))
            .execute();

        const [defaultAuthSession] = await this.orm.db
            .select()
            .from(authSession)
            .where(eq(authSession.userId, defaultUser.id));

        const newWebsocketSession: NewWebsocketSession = {
            id: randomUUID(),
            authSession: defaultAuthSession.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const [currentWebsocketSession] = await this.orm.db
            .insert(websocketSession)
            .values(newWebsocketSession)
            .returning()
            .execute();

        return [defaultUser, defaultAuthSession, currentWebsocketSession];
    }
}
