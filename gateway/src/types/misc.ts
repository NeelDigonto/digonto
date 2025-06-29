import { ORM } from '@/db/orm';
import { Logger } from '@/utils/logger';
import { IncomingMessage } from 'http';
import { SetRequired } from 'type-fest';
import { WebSocket } from 'ws';

export interface AllDeps {
    logger: Logger;
    orm: ORM;
}

export type Deps<K extends keyof AllDeps = 'logger'> = Pick<AllDeps, 'logger' | K>;

export type NascentRequest = IncomingMessage & {
    sessionId?: string;
    requiresSetCookie?: boolean; // Indicates if the response should set a cookie
};

export type AuthenticatedRequest = SetRequired<NascentRequest, 'sessionId'> & {
    // user: User;
    // authSession: AuthSession;
};

export interface WSDeps {
    eventReferenceId?: string;
    ws: WebSocket;
}
