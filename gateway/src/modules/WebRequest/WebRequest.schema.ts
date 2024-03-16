import { z } from 'zod';

export const webRequestAPISchema = z
  .object({
    route: z.string(),
    headerKVs: z.object({ key: z.string(), value: z.string() }).array(),
    cookieNVs: z.object({ name: z.string(), value: z.string() }).array(),
  })
  .strict();
export type WebRequestAPI = z.infer<typeof webRequestAPISchema>;
