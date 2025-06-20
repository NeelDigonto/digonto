import { vi } from 'vitest';

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';

// Increase timeout for async operations in tests
vi.setConfig({ testTimeout: 10000 });