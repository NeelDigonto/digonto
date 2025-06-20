import { Entity, PrimaryKey, Property, ManyToOne, Index } from '@mikro-orm/core';
import { randomBytes } from 'crypto';
import type { User } from './User.entity.js';

@Entity()
export class Session {
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => 'User')
  @Index()
  user!: User;

  @Property()
  @Index()
  expiresAt!: Date;

  @Property({ type: 'jsonb', nullable: true })
  data?: Record<string, unknown>;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date() })
  lastAccessedAt!: Date;

  constructor() {
    this.id = randomBytes(32).toString('hex');
  }

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}