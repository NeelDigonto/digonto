import { MikroORM } from '@mikro-orm/postgresql';
import config from '@/mikro-orm.config';

let cachedOrm: MikroORM;

export async function initORM(/* migrationPath?:string */): Promise<MikroORM> {
  if (cachedOrm) {
    return cachedOrm;
  }

  const orm = await MikroORM.init({
    ...config,
    /* migrations: {
      ...config.migrations,
    }, */
  });

  // save to cache before returning
  return (cachedOrm = orm);
}
