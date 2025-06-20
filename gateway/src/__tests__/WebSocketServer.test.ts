import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebSocketServer as WSServer } from 'ws';
import { WebSocketServer } from '../server/WebSocketServerBCKP';
import { Logger } from '../utils/logger';

describe('WebSocketServer', () => {
    let wsServer: WebSocketServer;
    let mockLogger: Logger;
    let testWss: WSServer;
    let testPort: number;

    beforeEach(async () => {
        mockLogger = {
            log: vi.fn(),
            error: vi.fn(),
            warn: vi.fn(),
        } as any;

        wsServer = new WebSocketServer(mockLogger);

        // Create a test server for integration tests
        testPort = 8080 + Math.floor(Math.random() * 1000);
        testWss = new WSServer({ port: testPort });
    });

    afterEach(async () => {
        await wsServer.shutdown();
        if (testWss) {
            await new Promise<void>((resolve) => {
                testWss.close(() => resolve());
            });
        }
    });

    describe('Server Initialization', () => {
        it('should initialize WebSocket server', () => {
            expect(wsServer).toBeDefined();
            expect(wsServer.getConnectedClients()).toBe(0);
        });

        it('should handle graceful shutdown', async () => {
            await expect(wsServer.shutdown()).resolves.not.toThrow();
        });
    });

    describe('Client Connection Handling', () => {
        it('should have handleUpgrade method', () => {
            // Test that the handleUpgrade method exists
            expect(wsServer.handleUpgrade).toBeDefined();
            expect(typeof wsServer.handleUpgrade).toBe('function');
        });

        it('should track connected clients', () => {
            expect(wsServer.getConnectedClients()).toBe(0);
        });
    });

    describe('Message Broadcasting', () => {
        it('should broadcast messages to all clients', () => {
            const message = {
                type: 'broadcast',
                payload: { data: 'test' },
                timestamp: Date.now(),
            };

            // Should not throw even with no clients
            expect(() => wsServer.broadcast(message)).not.toThrow();
        });

        it('should broadcast with filter function', () => {
            const message = {
                type: 'filtered_broadcast',
                payload: { data: 'test' },
                timestamp: Date.now(),
            };

            const filter = (ws: any) => ws.userId === 'test_user';

            expect(() => wsServer.broadcast(message, filter)).not.toThrow();
        });
    });

    describe('User Messaging', () => {
        it('should return false when sending to non-existent user', () => {
            const message = {
                type: 'direct_message',
                payload: { data: 'test' },
                timestamp: Date.now(),
            };

            const result = wsServer.sendToUser('non_existent_user', message);
            expect(result).toBe(false);
        });
    });
});
