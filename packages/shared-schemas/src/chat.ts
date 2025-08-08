import { z } from 'zod';

// ---------------------------------------------------------------------------------------------------
// ------------------------------------ CREATE CHAT SESSION SCHEMA -----------------------------------
// ---------------------------------------------------------------------------------------------------
export const createChatSessionWSRequestSchema = z.strictObject({
    title: z.string().optional(),
});
export type CreateChatSessionWSRequest = z.infer<typeof createChatSessionWSRequestSchema>;
export type CreateChatSessionParams = CreateChatSessionWSRequest & {
    userId: string;
};

export const createChatSessionWSResponseSchema = z.strictObject({
    id: z.string(),
    title: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type CreateChatSessionWSResponse = z.infer<typeof createChatSessionWSResponseSchema>;
// ---------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------
// ------------------------------------ READ ALL CHAT SESSIONS SCHEMA --------------------------------
// ---------------------------------------------------------------------------------------------------
export const readAllChatSessionsWSRequestSchema = z.strictObject({});
export type ReadAllChatSessionsWSRequest = z.infer<typeof readAllChatSessionsWSRequestSchema>;
export type ReadAllChatSessionsParams = ReadAllChatSessionsWSRequest;

export const readAllChatSessionsWSResponseSchema = z.array(
    z.strictObject({
        id: z.string(),
        title: z.string(),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
    }),
);
export type ReadAllChatSessionsWSResponse = z.infer<typeof readAllChatSessionsWSResponseSchema>;
// ---------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------
// ------------------------------------ PROCESS USER CHAT MESSAGE SCHEMA -------------------------------
// ---------------------------------------------------------------------------------------------------
export const processUserChatMessageWSRequestSchema = z.strictObject({
    chatSessionId: z.string(),
    content: z.string(),
});
export type ProcessUserChatMessageWSRequest = z.infer<typeof processUserChatMessageWSRequestSchema>;
export type ProcessUserChatMessageParams = ProcessUserChatMessageWSRequest;

export const createChatMessageWSResponseSchema = z.strictObject({
    id: z.string(),
    chatSessionId: z.string(),
    role: z.enum(['user', 'model', 'system']),
    content: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type CreateChatMessageWSResponse = z.infer<typeof createChatMessageWSResponseSchema>;

export const modelChatMessageWSStreamingResponseSchema = z.strictObject({
    id: z.string(),
    chunkNumber: z.number(),
    chatSessionId: z.string(),
    role: z.enum(['user', 'model', 'system']),
    content: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type ModelChatMessageWSStreamingResponse = z.infer<
    typeof modelChatMessageWSStreamingResponseSchema
>;

export const modelChatMessageStreamEndWSResponseSchema = z.strictObject({
    id: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type ModelChatMessageWSStreamEndResponse = z.infer<
    typeof modelChatMessageStreamEndWSResponseSchema
>;
// ---------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------
// ------------------------------------ READ ALL CHAT MESSAGES SCHEMA ---------------------------------
// ---------------------------------------------------------------------------------------------------
export const readAllChatMessagesWSRequestSchema = z.strictObject({
    chatSessionId: z.string(),
});
export type ReadAllChatMessagesWSRequest = z.infer<typeof readAllChatMessagesWSRequestSchema>;
export const readAllChatMessagesWSResponseSchema = z.array(
    z.strictObject({
        id: z.string(),
        chatSessionId: z.string(),
        role: z.enum(['user', 'model', 'system']),
        content: z.string(),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
    }),
);
export type ReadAllChatMessagesWSResponse = z.infer<typeof readAllChatMessagesWSResponseSchema>;
export type ReadAllChatMessagesParams = z.infer<typeof readAllChatMessagesWSRequestSchema>;
// ---------------------------------------------------------------------------------------------------