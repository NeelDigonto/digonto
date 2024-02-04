import { WebRequest } from '@/modules/WebRequest/WebRequest.entity';
import {
  EntityManager,
  EntityRepository,
  MikroORM,
  Options,
} from '@mikro-orm/postgresql';

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  webrequest: EntityRepository<WebRequest>;
}

let cache: Services;

export async function initORM(options?: Options): Promise<Services> {
  if (cache) {
    return cache;
  }

  const orm = await MikroORM.init(options);

  // save to cache before returning
  return (cache = {
    orm,
    em: orm.em,
    webrequest: orm.em.getRepository(WebRequest),
  });
}
