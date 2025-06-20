import { createMiddleware } from 'hono/factory';

export const xResponseTime = () =>
    createMiddleware(async (c, next) => {
        const start = performance.now();
        await next();
        const ms = performance.now() - start;
        c.header('X-Response-Time', `${ms.toFixed(1)}ms`);
    });
