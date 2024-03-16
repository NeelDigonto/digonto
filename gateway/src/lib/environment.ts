import * as dotenv from 'dotenv';
import { z } from 'zod';

const vtRawEnvSchema = z.object({
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
// type vtRawEnv = z.infer<typeof vtRawEnvSchema>;

interface VTEnv {
  pgUser: string;
  pgPassword: string;
  pgHost: string;
  pgPort: number;
  pgDB: string;
  websocketPort: number;
  nodeEnv: string;
}

let cachedVTEnv: VTEnv;

export function getVTEnv(): VTEnv {
  if (!cachedVTEnv) {
    if (process.env.NODE_ENV === 'migration') {
      dotenv.config({ path: './.env.dev' });
    }

    const parseResult = vtRawEnvSchema.safeParse(process.env);

    if (!parseResult.success) {
      throw new Error(
        'Parsing Env variables failed!\n' +
          JSON.stringify(parseResult.error.issues, null, 2),
      );
    }

    const vtRawEnv = parseResult.data;

    cachedVTEnv = {
      pgUser: vtRawEnv.POSTGRES_USER,
      pgPassword: vtRawEnv.POSTGRES_PASSWORD,
      pgHost: vtRawEnv.POSTGRES_HOST,
      pgPort: vtRawEnv.POSTGRES_PORT,
      pgDB: vtRawEnv.POSTGRES_DB,
      websocketPort: vtRawEnv.PORT,
      nodeEnv: vtRawEnv.NODE_ENV,
    };
  }

  //console.log(process.env);

  return cachedVTEnv;
}
