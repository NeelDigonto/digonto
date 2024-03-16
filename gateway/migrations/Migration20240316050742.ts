import { Migration } from '@mikro-orm/migrations';

export class Migration20240316050742 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "WebRequest" ("id" serial primary key, "route" text not null, "headerKVs" jsonb not null, "cookieNVs" jsonb not null, "createdAt" timestamptz not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "WebRequest" cascade;');
  }

}
