import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => ({
    test: {
        environment: 'node',
        // runs before each test file
        setupFiles: './__tests__/setup.ts',
        isolate: true,
        maxConcurrency: 5,
        coverage: {
            provider: 'v8',
        },
        env: loadEnv(mode, process.cwd(), ''),
    },
    plugins: [tsconfigPaths()],
}));
