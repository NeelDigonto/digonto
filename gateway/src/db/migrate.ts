import * as dotenv from 'dotenv';
dotenv.config({ path: './.env.mig' });

import { initORM } from '@/db/db';

async function main() {
  const orm = await initORM();
  const migrator = orm.getMigrator();
  // await migrator.createInitialMigration(); // creates file Migration20191019195930.ts
  //await migrator.createMigration(); // creates file Migration20191019195930.ts
  //await migrator.up(); // runs migrations up to the latest
  //await migrator.up('name'); // runs only given migration, up
  //await migrator.up({ to: 'up-to-name' }); // runs migrations up to given version
  //await migrator.down(); // migrates one step down
  //await migrator.down('name'); // runs only given migration, down
  //await migrator.down({ to: 'down-to-name' }); // runs migrations down to given version
  //await migrator.down({ to: 0 }); // migrates down to the first version
  //await orm.close(true);

  if (process.argv.length !== 3) {
    // eslint-disable-next-line no-console
    console.error('Need to pass exactly one argument');
    process.exit(1);
  }

  const migrationType = process.argv[2];

  switch (migrationType) {
    case 'create':
      await migrator.createMigration();
      break;

    case 'up':
      await migrator.up();
      break;

    default:
      // eslint-disable-next-line no-console
      console.error('Unkown command');
  }

  await orm.close(true);
}

main();

// async function main() {
//   const orm = await initORM();
//
//   console.log('Started Generating Schema Diff');
//
//   const diff = await orm.schema.getUpdateSchemaSQL();
//   console.log(diff);
//
//   // await orm.schema.updateSchema();
//
//   orm.close();
// }
