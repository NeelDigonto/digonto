import * as dotenv from 'dotenv';
import { z } from 'zod';

const RawEnvSchema = z.object({
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.preprocess(
    (x) => (x ? x : undefined),
    z.coerce.number().int().min(1024).max(65_535),
  ),
  POSTGRES_DB: z.string(),
  PORT: z.preprocess(
    (x) => (x ? x : undefined),
    z.coerce.number().int().min(1024).max(65_535),
  ),
  NODE_ENV: z.string(),
});
// type RawEnv = z.infer<typeof RawEnvSchema>;

interface Env {
  pgUser: string;
  pgPassword: string;
  pgHost: string;
  pgPort: number;
  pgDB: string;
  websocketPort: number;
  nodeEnv: string;
}

let cachedEnv: Env;

export function getEnv(): Env {
  if (!cachedEnv) {
    if (process.env.NODE_ENV === 'migration') {
      dotenv.config({ path: './.env.mig' });
    }

    const parseResult = RawEnvSchema.safeParse(process.env);

    if (!parseResult.success) {
      throw new Error(
        'Parsing Env variables failed!\n' +
          JSON.stringify(parseResult.error.issues, null, 2),
      );
    }

    const rawEnv = parseResult.data;

    cachedEnv = {
      pgUser: rawEnv.POSTGRES_USER,
      pgPassword: rawEnv.POSTGRES_PASSWORD,
      pgHost: rawEnv.POSTGRES_HOST,
      pgPort: rawEnv.POSTGRES_PORT,
      pgDB: rawEnv.POSTGRES_DB,
      websocketPort: rawEnv.PORT,
      nodeEnv: rawEnv.NODE_ENV,
    };
  }

  //console.log(process.env);

  return cachedEnv;
}
