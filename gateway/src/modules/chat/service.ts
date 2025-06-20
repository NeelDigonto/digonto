import { Hono } from 'hono';

export const chatModule = new Hono()
    .get('/', (c) => {
        return c.json({
            success: true,
            message: 'Chat service is running',
            data: null,
        });
    })
    .post('/send', async (c) => {
        const body = await c.req.json();
        
        return c.json({
            success: true,
            message: 'Message sent',
            data: { ...body, timestamp: Date.now() },
        });
    });