import {
    ClientErrorStatusCode,
    ContentfulStatusCode,
    ServerErrorStatusCode,
} from 'hono/utils/http-status';

import {
    createChatMessageWSResponse,
    createChatSessionWSRequestSchema,
    createChatSessionWSResponseSchema,
    processUserChatMessageWSRequestSchema,
    readAllChatMessagesWSRequestSchema,
    readAllChatMessagesWSResponseSchema,
    readAllChatSessionsWSRequestSchema,
    readAllChatSessionsWSResponseSchema,
} from '../modules/chat/schema';
import { z } from 'zod';

export enum WSClientEventType {
    CREATE_CHAT_SESSION = 'CREATE_CHAT_SESSION',
    READ_ALL_CHAT_SESSIONS = 'READ_ALL_CHAT_SESSIONS',
    PROCESS_USER_CHAT_MESSAGE = 'PROCESS_USER_CHAT_MESSAGE',
    READ_ALL_CHAT_MESSAGES = 'READ_ALL_CHAT_MESSAGES',
}

export enum WSServerEventType {
    CREATE_CHAT_SESSION_RESPONSE = 'CREATE_CHAT_SESSION_RESPONSE',
    READ_ALL_CHAT_SESSIONS_RESPONSE = 'READ_ALL_CHAT_SESSIONS_RESPONSE',
    CREATE_CHAT_MESSAGE_RESPONSE = 'CREATE_CHAT_MESSAGE_RESPONSE',
    MODEL_CHAT_MESSAGE_STREAMING_RESPONSE = 'MODEL_CHAT_MESSAGE_STREAMING_RESPONSE',
    READ_ALL_CHAT_MESSAGES_RESPONSE = 'READ_ALL_CHAT_MESSAGES_RESPONSE',
}

export const clientSchemaMap = {
    [WSClientEventType.CREATE_CHAT_SESSION]: createChatSessionWSRequestSchema,
    [WSClientEventType.READ_ALL_CHAT_SESSIONS]: readAllChatSessionsWSRequestSchema,
    [WSClientEventType.PROCESS_USER_CHAT_MESSAGE]: processUserChatMessageWSRequestSchema,
    [WSClientEventType.READ_ALL_CHAT_MESSAGES]: readAllChatMessagesWSRequestSchema,
} as const;

export const serverSchemaMap = {
    [WSServerEventType.CREATE_CHAT_SESSION_RESPONSE]: createChatSessionWSResponseSchema,
    [WSServerEventType.READ_ALL_CHAT_SESSIONS_RESPONSE]: readAllChatSessionsWSResponseSchema,
    [WSServerEventType.CREATE_CHAT_MESSAGE_RESPONSE]: createChatMessageWSResponse,
    [WSServerEventType.MODEL_CHAT_MESSAGE_STREAMING_RESPONSE]:
        processUserChatMessageWSRequestSchema,
    [WSServerEventType.READ_ALL_CHAT_MESSAGES_RESPONSE]: readAllChatMessagesWSResponseSchema,
} as const;

export const rootWSClientRequestSchema = z
    .discriminatedUnion('type', [
        z.object({
            type: z.literal(WSClientEventType.CREATE_CHAT_SESSION),
            data: clientSchemaMap[WSClientEventType.CREATE_CHAT_SESSION],
        }),
        z.object({
            type: z.literal(WSClientEventType.READ_ALL_CHAT_SESSIONS),
            data: clientSchemaMap[WSClientEventType.READ_ALL_CHAT_SESSIONS],
        }),
        z.object({
            type: z.literal(WSClientEventType.PROCESS_USER_CHAT_MESSAGE),
            data: clientSchemaMap[WSClientEventType.PROCESS_USER_CHAT_MESSAGE],
        }),
        z.object({
            type: z.literal(WSClientEventType.READ_ALL_CHAT_MESSAGES),
            data: clientSchemaMap[WSClientEventType.READ_ALL_CHAT_MESSAGES],
        }),
    ])
    .and(
        z.object({
            id: z.string().uuid(),
            referenceId: z.string().uuid().optional(), // Optional reference ID for tracking
            timestamp: z.string().datetime(),
        }),
    );

export type RootWSClientRequest = z.infer<typeof rootWSClientRequestSchema>;

export const rootWSServerResponseSchema = z
    .strictObject({
        id: z.string().uuid(),
        referenceId: z.string().uuid().optional(), // Optional reference ID for tracking
        timestamp: z.string().datetime(),
        error: z
            .strictObject({
                code: z.enum(['NOT_FOUND', 'INVALID_REQUEST', 'INTERNAL_ERROR']),
                message: z.string(),
            })
            .nullable(), // Optional error field
    })
    .and(
        z.discriminatedUnion('type', [
            z.strictObject({
                type: z.literal(WSServerEventType.CREATE_CHAT_SESSION_RESPONSE),
                data: serverSchemaMap[WSServerEventType.CREATE_CHAT_SESSION_RESPONSE],
            }),
            z.strictObject({
                type: z.literal(WSServerEventType.READ_ALL_CHAT_SESSIONS_RESPONSE),
                data: serverSchemaMap[WSServerEventType.READ_ALL_CHAT_SESSIONS_RESPONSE],
            }),
            z.strictObject({
                type: z.literal(WSServerEventType.CREATE_CHAT_MESSAGE_RESPONSE),
                data: serverSchemaMap[WSServerEventType.CREATE_CHAT_MESSAGE_RESPONSE],
            }),
            z.strictObject({
                type: z.literal(WSServerEventType.MODEL_CHAT_MESSAGE_STREAMING_RESPONSE),
                data: serverSchemaMap[WSServerEventType.MODEL_CHAT_MESSAGE_STREAMING_RESPONSE],
            }),
            z.strictObject({
                type: z.literal(WSServerEventType.READ_ALL_CHAT_MESSAGES_RESPONSE),
                data: serverSchemaMap[WSServerEventType.READ_ALL_CHAT_MESSAGES_RESPONSE],
            }),
        ]),
    );
export type RootWSServerResponse = z.infer<typeof rootWSServerResponseSchema>;

export interface HTTPErrorResponseJson {
    success: false;
    code: ClientErrorStatusCode | ServerErrorStatusCode;
    message: string;
    data: object | null;
}
