export interface WebSocketMessage {
    type: string;
    payload?: any;
    id?: string;
    timestamp?: number;
}

export interface WebSocketClientOptions {
    url: string;
    protocols?: string[];
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    timeout?: number;
    heartbeatInterval?: number;
    auth?: {
        token: string;
    };
}

export interface PendingRequest {
    resolve: (message: WebSocketMessage) => void;
    reject: (error: Error) => void;
    timeout: number;
}

export type WebSocketClientEvent = 
    | 'connecting'
    | 'connected'
    | 'disconnected'
    | 'authenticated'
    | 'reconnecting'
    | 'reconnectFailed'
    | 'maxReconnectAttemptsReached'
    | 'message'
    | 'error'
    | 'pong';

export class WebSocketClient {
    private ws: WebSocket | null = null;
    private options: Required<WebSocketClientOptions>;
    private reconnectAttempts = 0;
    private reconnectTimer: number | null = null;
    private heartbeatTimer: number | null = null;
    private isConnecting = false;
    private isAuthenticated = false;
    private pendingRequests: Map<string, PendingRequest> = new Map();
    private messageQueue: WebSocketMessage[] = [];
    private eventListeners: Map<WebSocketClientEvent, Set<Function>> = new Map();

    constructor(options: WebSocketClientOptions) {
        this.options = {
            protocols: [],
            reconnectInterval: 5000,
            maxReconnectAttempts: 10,
            timeout: 30000,
            heartbeatInterval: 25000,
            ...options,
        } as Required<WebSocketClientOptions>;

        // Initialize event listener sets
        const events: WebSocketClientEvent[] = [
            'connecting', 'connected', 'disconnected', 'authenticated',
            'reconnecting', 'reconnectFailed', 'maxReconnectAttemptsReached',
            'message', 'error', 'pong'
        ];
        events.forEach(event => {
            this.eventListeners.set(event, new Set());
        });
    }

    public on(event: WebSocketClientEvent, listener: Function): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.add(listener);
        }
    }

    public off(event: WebSocketClientEvent, listener: Function): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.delete(listener);
        }
    }

    private emit(event: WebSocketClientEvent, ...args: any[]): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(...args);
                } catch (error) {
                    console.error(`Error in WebSocket ${event} listener:`, error);
                }
            });
        }
    }

    public async connect(): Promise<void> {
        if (this.isConnecting || this.isConnected()) {
            return;
        }

        this.isConnecting = true;
        this.emit('connecting');

        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.options.url, this.options.protocols);
                
                const connectionTimeout = setTimeout(() => {
                    this.cleanup();
                    reject(new Error('Connection timeout'));
                }, this.options.timeout);

                this.ws.onopen = () => {
                    clearTimeout(connectionTimeout);
                    this.isConnecting = false;
                    this.reconnectAttempts = 0;
                    this.emit('connected');
                    this.setupHeartbeat();
                    
                    if (this.options.auth) {
                        this.authenticate()
                            .then(() => resolve())
                            .catch(reject);
                    } else {
                        resolve();
                    }
                };

                this.ws.onerror = (error) => {
                    clearTimeout(connectionTimeout);
                    this.isConnecting = false;
                    this.handleConnectionError(new Error('WebSocket connection error'));
                    reject(new Error('WebSocket connection error'));
                };

                this.setupEventHandlers();

            } catch (error) {
                this.isConnecting = false;
                reject(error);
            }
        });
    }

    private setupEventHandlers(): void {
        if (!this.ws) return;

        this.ws.onmessage = (event: MessageEvent) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);
                this.handleMessage(message);
            } catch (error) {
                this.emit('error', new Error(`Failed to parse message: ${error}`));
            }
        };

        this.ws.onclose = (event: CloseEvent) => {
            this.emit('disconnected', { code: event.code, reason: event.reason });
            this.cleanup();
            this.scheduleReconnect();
        };

        this.ws.onerror = (error) => {
            this.emit('error', new Error('WebSocket error'));
            this.handleConnectionError(new Error('WebSocket error'));
        };
    }

    private handleMessage(message: WebSocketMessage): void {
        this.emit('message', message);

        // Handle specific message types
        switch (message.type) {
            case 'pong':
                this.emit('pong');
                if (message.id && this.pendingRequests.has(message.id)) {
                    const pending = this.pendingRequests.get(message.id)!;
                    clearTimeout(pending.timeout);
                    pending.resolve(message);
                    this.pendingRequests.delete(message.id);
                }
                break;

            case 'auth_success':
                this.isAuthenticated = true;
                this.emit('authenticated');
                this.flushMessageQueue();
                break;

            case 'error':
                if (message.id && this.pendingRequests.has(message.id)) {
                    const pending = this.pendingRequests.get(message.id)!;
                    clearTimeout(pending.timeout);
                    pending.reject(new Error(message.payload?.error || 'Unknown error'));
                    this.pendingRequests.delete(message.id);
                } else {
                    this.emit('error', new Error(message.payload?.error || 'Server error'));
                }
                break;

            default:
                // Handle response messages
                if (message.id && this.pendingRequests.has(message.id)) {
                    const pending = this.pendingRequests.get(message.id)!;
                    clearTimeout(pending.timeout);
                    pending.resolve(message);
                    this.pendingRequests.delete(message.id);
                }
        }
    }

    private async authenticate(): Promise<void> {
        if (!this.options.auth) {
            throw new Error('No authentication configuration provided');
        }

        return this.sendRequest({
            type: 'auth',
            payload: { token: this.options.auth.token }
        });
    }

    private setupHeartbeat(): void {
        this.heartbeatTimer = window.setInterval(() => {
            if (this.isConnected()) {
                this.ping().catch(() => {
                    // Ping failed, connection might be dead
                    this.emit('error', new Error('Heartbeat failed'));
                });
            }
        }, this.options.heartbeatInterval);
    }

    private handleConnectionError(error: Error): void {
        this.cleanup();
        this.scheduleReconnect();
    }

    private scheduleReconnect(): void {
        if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
            this.emit('maxReconnectAttemptsReached');
            return;
        }

        this.reconnectAttempts++;
        this.emit('reconnecting', this.reconnectAttempts);

        this.reconnectTimer = window.setTimeout(() => {
            this.connect().catch((error) => {
                this.emit('reconnectFailed', error);
            });
        }, this.options.reconnectInterval * Math.min(this.reconnectAttempts, 5)); // Exponential backoff capped at 5x
    }

    private cleanup(): void {
        this.isConnecting = false;
        this.isAuthenticated = false;

        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }

        // Reject all pending requests
        this.pendingRequests.forEach((pending, id) => {
            clearTimeout(pending.timeout);
            pending.reject(new Error('Connection lost'));
        });
        this.pendingRequests.clear();

        if (this.ws) {
            this.ws.onopen = null;
            this.ws.onmessage = null;
            this.ws.onclose = null;
            this.ws.onerror = null;
            
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.close();
            }
            this.ws = null;
        }
    }

    public isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }

    public isReady(): boolean {
        return this.isConnected() && (this.isAuthenticated || !this.options.auth);
    }

    public send(message: WebSocketMessage): void {
        if (!this.isReady()) {
            // Queue message for later delivery
            this.messageQueue.push(message);
            return;
        }

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            try {
                this.ws.send(JSON.stringify(message));
            } catch (error) {
                this.emit('error', error);
            }
        }
    }

    public sendRequest(message: WebSocketMessage, timeout: number = 30000): Promise<WebSocketMessage> {
        return new Promise((resolve, reject) => {
            const id = this.generateId();
            const messageWithId = { ...message, id, timestamp: Date.now() };

            const timeoutId = window.setTimeout(() => {
                this.pendingRequests.delete(id);
                reject(new Error('Request timeout'));
            }, timeout);

            this.pendingRequests.set(id, {
                resolve,
                reject,
                timeout: timeoutId
            });

            this.send(messageWithId);
        });
    }

    public async ping(): Promise<WebSocketMessage> {
        return this.sendRequest({ type: 'ping' });
    }

    public subscribe(channel: string): Promise<WebSocketMessage> {
        return this.sendRequest({
            type: 'subscribe',
            payload: { channel }
        });
    }

    public unsubscribe(channel: string): Promise<WebSocketMessage> {
        return this.sendRequest({
            type: 'unsubscribe',
            payload: { channel }
        });
    }

    public sendChatMessage(content: string, metadata?: any): Promise<WebSocketMessage> {
        return this.sendRequest({
            type: 'chat',
            payload: { content, metadata }
        });
    }

    private flushMessageQueue(): void {
        while (this.messageQueue.length > 0 && this.isReady()) {
            const message = this.messageQueue.shift();
            if (message) {
                this.send(message);
            }
        }
    }

    private generateId(): string {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    public disconnect(): void {
        this.reconnectAttempts = this.options.maxReconnectAttempts; // Prevent reconnection
        this.cleanup();
        this.emit('disconnected', { code: 1000, reason: 'Client initiated disconnect' });
    }

    public getConnectionState(): string {
        if (!this.ws) return 'disconnected';
        
        switch (this.ws.readyState) {
            case WebSocket.CONNECTING: return 'connecting';
            case WebSocket.OPEN: return 'connected';
            case WebSocket.CLOSING: return 'closing';
            case WebSocket.CLOSED: return 'closed';
            default: return 'unknown';
        }
    }

    public getReconnectAttempts(): number {
        return this.reconnectAttempts;
    }

    public resetReconnectAttempts(): void {
        this.reconnectAttempts = 0;
    }

    public removeAllListeners(): void {
        this.eventListeners.forEach(listeners => listeners.clear());
    }
}