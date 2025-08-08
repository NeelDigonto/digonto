import { z } from 'zod';

export const userCreateAPISchema = {
    json: z.strictObject({
        name: z.string().min(1).max(150),
        username: z.string().min(3).max(20),
        password: z.string().min(8).max(100),
        email: z.string().email(),
    }),
};