import { ORM } from '@/db/orm';
import { Logger } from '@/utils/logger';

export enum WSServerEventType {}

export enum WSClientEventType {
    CREATE_CHAT = 'CREATE_CHAT',
    USER_MESSAGE = 'USER_MESSAGE',
}

export interface WSServerEvent<T = object> {
    timestamp: string;
    uid: string;
    type: WSServerEventType;
    data: T;
}

export interface WSClientEvent<T = object> {
    timestamp: string;
    uid: string;
    type: WSClientEventType;
    data: T;
}

export interface AllDeps {
    logger: Logger;
    orm: ORM;
}

export type Deps<K extends keyof AllDeps = 'logger'> = Pick<AllDeps, 'logger' | K>;
