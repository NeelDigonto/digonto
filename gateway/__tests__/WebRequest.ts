import * as dotenv from 'dotenv';
dotenv.config({ path: './.env.test' });

import { MikroORM } from '@mikro-orm/postgresql';
import config from '@/mikro-orm.config';
import { createWebRequest } from '@/modules/WebRequest/WebRequest';
import { WebRequest } from '@/db/entities/WebRequest.entity';

let orm: MikroORM;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let createdWebRequestId: number;

beforeAll(async () => {
  orm = await MikroORM.init(config);
  await orm.schema.dropSchema();
  await orm.schema.createSchema();
});

afterAll(async () => {
  await orm.schema.dropSchema();
  await orm.close();
});

describe('UserRole Test Suite', () => {
  // eslint-disable-next-line jest/expect-expect
  it('Create', async () => {
    const em = orm.em.fork();

    const webRequest = new WebRequest({
      route: '/',
      headerKVs: [{ key: 'a', value: 'b' }],
      cookieNVs: [{ name: 'a', value: 'b' }],
    });

    createdWebRequestId = await createWebRequest(em, webRequest);
  });
});
