import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { WebSocketServer } from '../../server/WebSocketServerBCKP';
import { WebSocketClient } from '../../utils/WebSocketClient';
import { Logger } from '../../utils/logger';
import WebSocket from 'ws';
import { createServer, Server } from 'http';

describe('WebSocket Integration Tests', () => {
    let httpServer: Server;
    let wsServer: WebSocketServer;
    let client: WebSocketClient;
    let mockLogger: Logger;
    let serverPort: number;

    beforeAll(() => {
        mockLogger = {
            log: vi.fn(),
            error: vi.fn(),
            warn: vi.fn(),
        } as any;

        serverPort = 8080 + Math.floor(Math.random() * 1000);
    });

    beforeEach(async () => {
        // Create HTTP server
        httpServer = createServer();
        wsServer = new WebSocketServer(mockLogger);

        // Setup WebSocket upgrade handling
        httpServer.on('upgrade', (request, socket, head) => {
            wsServer.handleUpgrade(request, socket, head);
        });

        // Start the server
        await new Promise<void>((resolve) => {
            httpServer.listen(serverPort, () => resolve());
        });

        // Create client
        client = new WebSocketClient({
            url: `ws://localhost:${serverPort}/ws`,
            reconnectInterval: 100,
            maxReconnectAttempts: 3,
            timeout: 5000,
        });
    });

    afterEach(async () => {
        if (client) {
            client.disconnect();
        }

        if (wsServer) {
            await wsServer.shutdown();
        }

        if (httpServer) {
            await new Promise<void>((resolve) => {
                httpServer.close(() => resolve());
            });
        }
    });

    describe('Full WebSocket Flow', () => {
        it('should establish connection and exchange messages', async () => {
            const connected = new Promise<void>((resolve) => {
                client.on('connected', resolve);
            });

            await client.connect();
            await connected;

            expect(client.isConnected()).toBe(true);
            expect(wsServer.getConnectedClients()).toBe(1);
        });

        it('should handle ping-pong correctly', async () => {
            await client.connect();

            const pongReceived = new Promise<void>((resolve) => {
                client.on('pong', resolve);
            });

            await client.ping();
            await pongReceived;
        });

        it('should handle authentication flow', async () => {
            const clientWithAuth = new WebSocketClient({
                url: `ws://localhost:${serverPort}/ws`,
                auth: { token: 'test_token' },
                timeout: 5000,
            });

            const authenticated = new Promise<void>((resolve) => {
                clientWithAuth.on('authenticated', resolve);
            });

            await clientWithAuth.connect();
            await authenticated;

            expect(clientWithAuth.isReady()).toBe(true);

            clientWithAuth.disconnect();
        });

        it('should handle subscription and unsubscription', async () => {
            await client.connect();

            const subscribeResponse = await client.subscribe('test_channel');
            expect(subscribeResponse.type).toBe('subscribed');
            expect(subscribeResponse.payload?.channel).toBe('test_channel');

            const unsubscribeResponse = await client.unsubscribe('test_channel');
            expect(unsubscribeResponse.type).toBe('unsubscribed');
            expect(unsubscribeResponse.payload?.channel).toBe('test_channel');
        });

        it('should handle chat messages', async () => {
            await client.connect();

            const response = await client.sendChatMessage('Hello, WebSocket!', { user: 'test' });
            expect(response.type).toBe('chat_response');
            expect(response.payload?.echo).toBe(true);
        });

        it('should handle reconnection on connection loss', async () => {
            await client.connect();
            expect(client.isConnected()).toBe(true);

            const reconnecting = new Promise<void>((resolve) => {
                client.on('reconnecting', resolve);
            });

            const reconnected = new Promise<void>((resolve) => {
                client.on('connected', resolve);
            });

            // Simulate connection loss by closing the server
            httpServer.close();

            await reconnecting;
            expect(client.getReconnectAttempts()).toBeGreaterThan(0);

            // Restart server for reconnection
            httpServer = createServer();
            httpServer.on('upgrade', (request, socket, head) => {
                wsServer.handleUpgrade(request, socket, head);
            });

            await new Promise<void>((resolve) => {
                httpServer.listen(serverPort, () => resolve());
            });

            await reconnected;
            expect(client.isConnected()).toBe(true);
        }, 10000);

        it('should broadcast messages to multiple clients', async () => {
            const client1 = new WebSocketClient({
                url: `ws://localhost:${serverPort}/ws`,
                timeout: 5000,
            });

            const client2 = new WebSocketClient({
                url: `ws://localhost:${serverPort}/ws`,
                timeout: 5000,
            });

            await Promise.all([client1.connect(), client2.connect()]);

            expect(wsServer.getConnectedClients()).toBe(2);

            const message1Received = new Promise<void>((resolve) => {
                client1.on('message', (msg) => {
                    if (msg.type === 'broadcast_test') resolve();
                });
            });

            const message2Received = new Promise<void>((resolve) => {
                client2.on('message', (msg) => {
                    if (msg.type === 'broadcast_test') resolve();
                });
            });

            // Broadcast a message
            wsServer.broadcast({
                type: 'broadcast_test',
                payload: { message: 'Hello everyone!' },
                timestamp: Date.now(),
            });

            await Promise.all([message1Received, message2Received]);

            client1.disconnect();
            client2.disconnect();
        });

        it('should handle server shutdown gracefully', async () => {
            await client.connect();
            expect(client.isConnected()).toBe(true);

            const disconnected = new Promise<void>((resolve) => {
                client.on('disconnected', resolve);
            });

            await wsServer.shutdown();
            await disconnected;

            expect(client.isConnected()).toBe(false);
        });
    });

    describe('Error Scenarios', () => {
        it('should handle invalid message formats', async () => {
            await client.connect();

            const errorReceived = new Promise<void>((resolve) => {
                client.on('error', resolve);
            });

            // Send invalid JSON by directly accessing the WebSocket
            const ws = (client as any).ws;
            if (ws) {
                ws.send('invalid json');
            }

            // Should receive an error
            await errorReceived;
        });

        it('should timeout on unresponsive requests', async () => {
            await client.connect();

            // Send a request that the server won't respond to
            const timeoutPromise = client.sendRequest(
                { type: 'unknown_request' },
                1000, // 1 second timeout
            );

            await expect(timeoutPromise).rejects.toThrow('Request timeout');
        });

        it('should handle connection timeout', async () => {
            const slowClient = new WebSocketClient({
                url: `ws://localhost:${serverPort + 1}/ws`, // Wrong port
                timeout: 500,
                reconnectInterval: 100,
                maxReconnectAttempts: 1,
            });

            await expect(slowClient.connect()).rejects.toThrow();
        }, 5000);
    });
});
