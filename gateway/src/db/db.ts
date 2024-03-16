import {
  //  EntityManager,
  //  EntityRepository,
  MikroORM,
  /* Options, */
} from '@mikro-orm/postgresql';
import config from '@/mikro-orm.config';

// export interface Services {
//   orm: MikroORM;
//   em: EntityManager;
//   webrequest: EntityRepository<WebRequest>;
// }

// let cache: Services;
let cachedOrm: MikroORM;

export async function initORM(/* options?: Options */): Promise<MikroORM> {
  if (cachedOrm) {
    return cachedOrm;
  }

  const orm = await MikroORM.init(config);

  // save to cache before returning
  return (cachedOrm = orm);
}
