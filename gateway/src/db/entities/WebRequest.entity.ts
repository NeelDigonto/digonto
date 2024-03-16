import { KV, NV } from '@/lib/misc';
import { Entity, PrimaryKey, Property } from '@mikro-orm/postgresql';

@Entity()
export class WebRequest {
  @PrimaryKey({ type: 'int' })
  id!: number;

  @Property({ type: 'text' })
  route: string;

  @Property({ type: 'jsonb' })
  headerKVs: KV[];

  @Property({ type: 'jsonb' })
  cookieNVs: NV[];

  @Property({ type: 'timestamptz' })
  createdAt: Date;

  constructor(dto: { route: string; headerKVs: KV[]; cookieNVs: NV[] }) {
    this.route = dto.route;
    this.headerKVs = dto.headerKVs;
    this.cookieNVs = dto.cookieNVs;

    const now = new Date();
    this.createdAt = now;
  }
}
