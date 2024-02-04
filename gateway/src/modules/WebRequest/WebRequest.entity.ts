import { WebRequestMetadataVT, WebRequestVT } from '@/schema';
import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';
import { DeepPick, PickProperties, StrictExtract } from 'ts-essentials';

@Entity()
export class WebRequest {
  @PrimaryKey({ type: 'integer' })
  id!: number;

  @Property({ type: 'text' })
  route = '/';

  @Property({ type: 'timestamptz' })
  createdAt = new Date();

  @Property({ type: 'jsonb' })
  requestMetadata!: WebRequestMetadataVT;
}
