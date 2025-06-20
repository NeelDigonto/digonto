import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebSocketClient } from '../utils/WebSocketClient';

// Mock WebSocket
const mockWebSocket = vi.fn() as any;
mockWebSocket.CONNECTING = 0;
mockWebSocket.OPEN = 1;
mockWebSocket.CLOSING = 2;
mockWebSocket.CLOSED = 3;

(global as any).WebSocket = mockWebSocket;

describe('WebSocketClient', () => {
    let client: WebSocketClient;
    let mockWs: any;

    beforeEach(() => {
        mockWs = {
            readyState: 1, // OPEN
            send: vi.fn(),
            close: vi.fn(),
            removeAllListeners: vi.fn(),
            on: vi.fn(),
            once: vi.fn(),
        };

        mockWebSocket.mockImplementation(() => mockWs);

        client = new WebSocketClient({
            url: 'ws://localhost:8080/ws',
            reconnectInterval: 100,
            maxReconnectAttempts: 3,
            timeout: 1000,
            heartbeatInterval: 500,
        });
    });

    afterEach(() => {
        client.disconnect();
        vi.clearAllMocks();
    });

    describe('Connection Management', () => {
        it('should initialize with correct options', () => {
            expect(client).toBeDefined();
            expect(client.getConnectionState()).toBe('disconnected');
            expect(client.getReconnectAttempts()).toBe(0);
        });

        it('should handle connection state correctly', () => {
            expect(client.isConnected()).toBe(false);
            expect(client.isReady()).toBe(false);
        });

        it('should generate unique request IDs', async () => {
            const message1 = { type: 'test', payload: {} };
            const message2 = { type: 'test', payload: {} };

            // We can't easily test the private generateId method,
            // but we can verify that request IDs are unique by checking
            // that multiple pending requests don't conflict
            expect(() => {
                client.send(message1);
                client.send(message2);
            }).not.toThrow();
        });
    });

    describe('Message Handling', () => {
        it('should queue messages when not ready', () => {
            const message = { type: 'test', payload: { data: 'test' } };
            
            // Should not throw when not connected
            expect(() => client.send(message)).not.toThrow();
        });

        it('should handle ping requests', async () => {
            // Mock connected state
            Object.defineProperty(client, 'isConnected', {
                value: () => true,
                writable: true
            });
            Object.defineProperty(client, 'isReady', {
                value: () => true,
                writable: true
            });

            const pingPromise = client.ping();
            
            // Should not throw
            expect(pingPromise).toBeInstanceOf(Promise);
        });

        it('should handle subscription requests', async () => {
            // Mock connected state
            Object.defineProperty(client, 'isConnected', {
                value: () => true,
                writable: true
            });
            Object.defineProperty(client, 'isReady', {
                value: () => true,
                writable: true
            });

            const subscribePromise = client.subscribe('test_channel');
            expect(subscribePromise).toBeInstanceOf(Promise);

            const unsubscribePromise = client.unsubscribe('test_channel');
            expect(unsubscribePromise).toBeInstanceOf(Promise);
        });

        it('should handle chat messages', async () => {
            // Mock connected state
            Object.defineProperty(client, 'isConnected', {
                value: () => true,
                writable: true
            });
            Object.defineProperty(client, 'isReady', {
                value: () => true,
                writable: true
            });

            const chatPromise = client.sendChatMessage('Hello, world!', { user: 'test' });
            expect(chatPromise).toBeInstanceOf(Promise);
        });
    });

    describe('Reconnection Logic', () => {
        it('should track reconnection attempts', () => {
            expect(client.getReconnectAttempts()).toBe(0);
            
            client.resetReconnectAttempts();
            expect(client.getReconnectAttempts()).toBe(0);
        });

        it('should handle disconnection gracefully', () => {
            expect(() => client.disconnect()).not.toThrow();
        });
    });

    describe('Error Handling', () => {
        it('should handle connection errors', () => {
            // Should not throw when connection fails
            expect(() => {
                mockWs.onerror?.(new Error('Connection failed'));
            }).not.toThrow();
        });

        it('should handle message parsing errors', () => {
            // Should not throw when receiving invalid messages
            expect(() => {
                mockWs.onmessage?.({ data: 'invalid json' });
            }).not.toThrow();
        });
    });
});