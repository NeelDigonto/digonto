import { initORM } from './db';

async function main() {
  const db = await initORM();

  console.log('Started Generating Schema Diff');

  const diff = await db.orm.schema.getUpdateSchemaSQL();
  console.log(diff);

  await db.orm.schema.updateSchema();

  db.orm.close();
}

main();
