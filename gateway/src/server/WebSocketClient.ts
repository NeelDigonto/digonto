import { WSClientEvent, WSClientEventType } from '@/types/core';
import { Env, getEnv } from '@/utils/environment';
import { Logger } from '@/utils/logger';
import { WebSocket } from 'ws';

import { GoogleGenAI } from '@google/genai';

export class DigontoWSClient {
    logger: Logger;
    env: Env;
    ws: WebSocket;
    sessionId: string;

    private readonly HEARTBEAT_INTERVAL = 6_000; // 3 seconds
    private readonly CONNECTION_TIMEOUT = 30_000; // 30 seconds
    private heartbeatInterval: NodeJS.Timeout | null = null;
    private connectionTimeout: NodeJS.Timeout | null = null;
    private lastPongReceived: number = Date.now();
    private isAlive: boolean = true;

    private notifyServerOnClientDrop: () => void;

    constructor(
        logger: Logger,
        sessionId: string,
        ws: WebSocket,
        notifyServerOnClientDrop: (sessionId: string) => void,
        private gemini = new GoogleGenAI({ apiKey: 'AIzaSyDjAh8DoqCeOvKHBQ7jhFfpICb94yxAG3w' }),
    ) {
        this.notifyServerOnClientDrop = notifyServerOnClientDrop.bind(null, sessionId);
        this.logger = logger;
        this.env = getEnv();

        this.sessionId = sessionId;
        this.ws = ws;

        this.setupEventHandlers();
        this.startHeartbeat();
    }

    private setupEventHandlers(): void {
        // In order of invocation
        // this.ws.on('redirect', () => {});
        // this.ws.on('open', () => {});
        // this.ws.on('ping', () => {});
        // this.ws.on('pong', this.onPongHandler.bind(this));
        this.ws.on('error', this.onErrorHandler.bind(this));
        this.ws.on('message', this.onMessageHandler.bind(this));
        this.ws.on('close', this.onCloseHandler.bind(this));
        // this.ws.on('unexpected-response', () => {});
        // this.ws.on('upgrade', () => {});

        // // Graceful shutdown
        // process.on('SIGTERM', this.shutdown.bind(this));
        // process.on('SIGINT', this.shutdown.bind(this));
        // process.on('SIGQUIT', this.shutdown.bind(this));
    }

    onErrorHandler(error: Error): void {
        this.logger.error(`WebSocket error for session ${this.sessionId}, error: ${error}`);
        // Handle error, e.g., log it or clean up resources
    }

    onMessageHandler(data: WebSocket.RawData, isBinary: boolean): void {
        // this.logger.log(`Received message for session ${this.sessionId}, isBinary: ${isBinary}, data: ${data}`);

        if (isBinary) {
            // Handle binary data
            this.logger.debug(`Binary data received for session ${this.sessionId}`);
        } else {
            // Handle text data
            const message = data.toString();

            // this.logger.debug(`Text message received for session ${this.sessionId}: ${message}`);

            // Process the message as needed
            // For example, you can parse JSON or handle specific commands

            if (message === 'PONG') {
                // this.logger.debug(`Received pong from session ${this.sessionId}`);
                this.onPongHandler();
                return;
            }

            const event: WSClientEvent = JSON.parse(message);

            switch (event.type) {
                case WSClientEventType.CREATE_CHAT:
                    this.logger.debug(`Create chat event received for session ${this.sessionId}: ${event.data}`);
                    // Handle create chat logic here
                    break;
                case WSClientEventType.USER_MESSAGE:
                    // this.logger.debug(`User message received for session ${this.sessionId}: ${event.data}`);
                    this.gemini.models
                        .generateContentStream({
                            model: 'gemini-2.0-flash',
                            contents: event.data.message,
                        })
                        .then(async (response) => {
                            for await (const chunk of response) {
                                if (chunk.text) {
                                    console.log(chunk.text);
                                }
                            }
                        });
                    break;

                default:
                    this.logger.warn(`Unknown event type received for session ${this.sessionId}: ${event.type}`);
                    break;
            }
        }
    }

    onCloseHandler(code: number, reason: string): void {
        this.logger.log(`WebSocket closed for session ${this.sessionId}, code: ${code}, reason: ${reason}`);
        this.cleanup();
    }

    onPongHandler(): void {
        // this.logger.debug(`Received pong from session ${this.sessionId}`);
        this.lastPongReceived = Date.now();
        this.isAlive = true;

        // Reset connection timeout
        if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
        }
        this.connectionTimeout = setTimeout(() => {
            this.handleConnectionTimeout();
        }, this.CONNECTION_TIMEOUT);
    }

    private startHeartbeat(): void {
        // Send initial ping
        this.sendPing();

        // Set up heartbeat interval
        this.heartbeatInterval = setInterval(() => {
            if (this.ws.readyState === WebSocket.OPEN) {
                this.sendPing();
            }
        }, this.HEARTBEAT_INTERVAL);

        // Set up initial connection timeout
        this.connectionTimeout = setTimeout(() => {
            this.handleConnectionTimeout();
        }, this.CONNECTION_TIMEOUT);
    }

    private sendPing(): void {
        if (this.ws.readyState === WebSocket.OPEN) {
            // this.logger.debug(`Sending ping to session ${this.sessionId}`);
            // this.ws.ping();
            this.ws.send('PING');
        }
    }

    private handleConnectionTimeout(): void {
        const timeSinceLastPong = Date.now() - this.lastPongReceived;
        this.logger.error(
            `Connection timeout for session ${this.sessionId}. No pong received for ${timeSinceLastPong}ms`,
        );
        this.isAlive = false;

        // Close the connection
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.close(1000, 'Connection timeout - no heartbeat response');
        }

        this.cleanup();
    }

    private cleanup(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }

        if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
        }

        this.notifyServerOnClientDrop();
    }

    public isConnectionAlive(): boolean {
        return this.isAlive && this.ws.readyState === WebSocket.OPEN;
    }

    public close(code?: number, reason?: string): void {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.close(code || 1000, reason || 'Normal closure');
        }

        this.cleanup();
    }
}
