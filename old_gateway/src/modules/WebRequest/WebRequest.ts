import { EntityManager } from '@mikro-orm/postgresql';
import { WebRequestAPI } from './WebRequest.schema';
import { ID } from '@/lib/misc';
import { WebRequest } from '@/db/entities/WebRequest.entity';

export async function createWebRequest(
  em: EntityManager,
  { route, headerKVs, cookieNVs }: WebRequestAPI,
): Promise<ID<WebRequest>> {
  const webRequest = new WebRequest({
    route,
    headerKVs,
    cookieNVs,
  });

  return em.persistAndFlush(webRequest).then(() => webRequest.id);
}
