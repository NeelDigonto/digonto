import { Entity, PrimaryKey, Property, Unique, Index } from '@mikro-orm/core';
import { randomBytes } from 'crypto';

@Entity()
export class User {
  @PrimaryKey()
  id!: string;

  @Property()
  @Unique()
  @Index()
  email!: string;

  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: true })
  picture?: string;

  @Property()
  provider!: string; // oauth provider (google, github, etc.)

  @Property()
  providerId!: string; // id from oauth provider

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date() })
  updatedAt!: Date;

  constructor() {
    this.id = randomBytes(16).toString('hex');
  }
}