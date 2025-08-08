import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: z.coerce.number().int().min(1024).max(65_535),
    WS_PORT: z.coerce.number().int().min(1024).max(65_535).optional(),
    POSTGRES_WRITER_HOST: z.string(),
    POSTGRES_READER_HOSTS: z.string().optional(),
    GEMINI_API_KEY: z.string().default(''),
});
export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | undefined;

export function getEnv(): Env {
    if (!cachedEnv) {
        const parseResult = envSchema.safeParse(process.env);

        if (!parseResult.success) {
            throw new Error(
                'Parsing Env variables failed!\n' +
                    JSON.stringify(parseResult.error.issues, null, 2),
            );
        }

        cachedEnv = parseResult.data;
    }

    return cachedEnv;
}
