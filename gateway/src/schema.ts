import { z } from 'zod';

export const webRequestMetadataV = z
  .object({
    headerKVs: z.object({ key: z.string(), value: z.string() }).array(),
    cookieNVs: z.object({ name: z.string(), value: z.string() }).array(),
  })
  .strict();
export type WebRequestMetadataVT = z.infer<typeof webRequestMetadataV>;

export const webRequestV = z
  .object({
    route: z.string(),
  })
  .merge(webRequestMetadataV)
  .strict();
export type WebRequestVT = z.infer<typeof webRequestV>;
