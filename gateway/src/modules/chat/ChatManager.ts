import {
    ChatMessage,
    chatMessage,
    ChatSession,
    chatSession,
    NewChatMessage,
    NewChatSession,
    ORM,
} from '@/db/orm';
import { GoogleGenAI, Chat as GeminiChat } from '@google/genai';
import { and, desc, eq, SQL } from 'drizzle-orm';
import {
    CreateChatSessionParams,
    ReadAllChatSessionsWSResponse,
    ReadAllChatSessionsParams,
    ReadAllChatMessagesParams,
    ReadAllChatMessagesWSResponse,
    CreateChatSessionWSResponse,
    ProcessUserChatMessageParams,
    CreateChatMessageWSResponse,
    ModelChatMessageWSStreamingResponse,
    ModelChatMessageWSStreamEndResponse,
} from '@/modules/chat/schema';
import { ForbiddenError, InternalServerError } from '@/utils/errors';
import { sendWSEvent } from '@/utils/misc';
import { WSServerEventType } from '@/types/core';
import { WSDeps } from '@/types/misc';

export type ChatSessionId = string;
export interface ChatSessionDetail {
    isGeneratingContent: boolean;
    chatSession: ChatSession;
    chatMessages: ChatMessage[];
    geminiChat?: GeminiChat;
}

export class ChatManager {
    private orm: ORM;
    private gemini: GoogleGenAI;
    private readonly apiKey = 'AIzaSyDjAh8DoqCeOvKHBQ7jhFfpICb94yxAG3w';
    chatSessionDetailMap: Map<ChatSessionId, ChatSessionDetail> = new Map();

    constructor(
        orm: ORM,
        private readonly userDetails: { userId: string },
    ) {
        this.orm = orm;
        this.gemini = new GoogleGenAI({ apiKey: this.apiKey });
    }

    async createChatSession(params: CreateChatSessionParams, deps: WSDeps): Promise<boolean> {
        try {
            const { userId, title } = params;
            const now = new Date();
            const newChatSession: NewChatSession = {
                userId,
                title: title ?? `A Chat Session`,
                createdAt: now,
                updatedAt: now,
            };

            const [createdChatSession] = await this.orm.db
                .insert(chatSession)
                .values(newChatSession)
                .returning()
                .execute();

            const chatSessionDetail: ChatSessionDetail = {
                isGeneratingContent: false,
                chatSession: createdChatSession,
                chatMessages: [],
                geminiChat: this.gemini.chats.create({
                    model: 'gemini-2.5-flash',
                    history: [],
                    config: {},
                }),
            };

            this.chatSessionDetailMap.set(createdChatSession.id, chatSessionDetail);

            const transformedChatSession: CreateChatSessionWSResponse = {
                id: createdChatSession.id,
                title: createdChatSession.title,
                createdAt: createdChatSession.createdAt,
                updatedAt: createdChatSession.updatedAt,
            };

            sendWSEvent(
                WSServerEventType.CREATE_CHAT_SESSION_RESPONSE,
                transformedChatSession satisfies CreateChatSessionWSResponse,
                deps,
            );
            return true;
        } catch (error) {
            console.error('Error creating chat session:', error);
            throw error;
        }
    }

    async readAllChatSessions(params: ReadAllChatSessionsParams, deps: WSDeps): Promise<boolean> {
        try {
            const conditions: SQL[] = [eq(chatSession.userId, this.userDetails.userId)];

            const chatSessions =
                (await this.orm.db
                    .select()
                    .from(chatSession)
                    .where(and(...conditions))
                    .orderBy(desc(chatSession.updatedAt))
                    .execute()) ?? [];

            for (const chatSession of chatSessions) {
                const chatSessionDetail: ChatSessionDetail = {
                    isGeneratingContent: false,
                    chatSession,
                    chatMessages: [],
                };
                this.chatSessionDetailMap.set(chatSession.id, chatSessionDetail);
            }

            const transformedChatSessions: ReadAllChatSessionsWSResponse = chatSessions.map(
                (session) => ({
                    id: session.id,
                    title: session.title,
                    createdAt: session.createdAt,
                    updatedAt: session.updatedAt,
                }),
            );

            sendWSEvent(
                WSServerEventType.READ_ALL_CHAT_SESSIONS_RESPONSE,
                transformedChatSessions satisfies ReadAllChatSessionsWSResponse,
                deps,
            );
            return true;
        } catch (error) {
            console.error('Error fetching chat session:', error);
            throw error;
        }
    }

    async processUserChatMessage(
        params: ProcessUserChatMessageParams,
        deps: WSDeps,
    ): Promise<boolean> {
        try {
            const { chatSessionId, content } = params;

            const chatSessionDetail = this.chatSessionDetailMap.get(chatSessionId);
            if (!chatSessionDetail) {
                throw new ForbiddenError('Chat session not found');
            }

            if (!chatSessionDetail.geminiChat) {
                // throw new InternalServerError(`Gemini chat not found for session ${chatSessionId}`);
                chatSessionDetail.geminiChat = this.gemini.chats.create({
                    model: 'gemini-2.5-flash',
                    history: chatSessionDetail.chatMessages.map((message) => ({
                        role: message.role,
                        content: message.content,
                    })),
                    config: {},
                });
            }

            const geminiChat = chatSessionDetail.geminiChat;

            const newUserChatMessage: NewChatMessage = {
                chatSessionId,
                role: 'user',
                content,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            let finalChatMessageContent = '';
            const newModelChatMessage: NewChatMessage = {
                chatSessionId,
                role: 'model',
                content: finalChatMessageContent,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const [createdUserChatMessage, createdModelChatMessage] = await this.orm.db
                .insert(chatMessage)
                .values([newUserChatMessage, newModelChatMessage])
                .returning()
                .execute();

            sendWSEvent(
                WSServerEventType.CREATE_CHAT_MESSAGE_RESPONSE,
                createdUserChatMessage satisfies CreateChatMessageWSResponse,
                deps,
            );

            sendWSEvent(
                WSServerEventType.CREATE_CHAT_MESSAGE_RESPONSE,
                createdModelChatMessage satisfies CreateChatMessageWSResponse,
                deps,
            );

            chatSessionDetail.isGeneratingContent = true;

            const responseStream = await geminiChat.sendMessageStream({
                message: content,
                config: {},
            });

            let chunkNumber = 0;
            for await (const chunk of responseStream) {
                if (chunk.text) {
                    const modelChatMessageChunk: ModelChatMessageWSStreamingResponse = {
                        id: createdModelChatMessage.id,
                        chunkNumber: chunkNumber++,
                        chatSessionId: createdModelChatMessage.chatSessionId,
                        role: 'model',
                        content: chunk.text,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    finalChatMessageContent += chunk.text;

                    sendWSEvent(
                        WSServerEventType.MODEL_CHAT_MESSAGE_STREAMING_RESPONSE,
                        modelChatMessageChunk satisfies ModelChatMessageWSStreamingResponse,
                        deps,
                    );
                }
            }

            sendWSEvent(
                WSServerEventType.MODEL_CHAT_MESSAGE_STREAM_END,
                {
                    id: createdModelChatMessage.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } satisfies ModelChatMessageWSStreamEndResponse,
                deps,
            );

            await this.orm.db
                .update(chatMessage)
                .set({
                    content: finalChatMessageContent,
                    updatedAt: new Date(),
                })
                .where(eq(chatMessage.id, createdModelChatMessage.id))
                .execute();

            chatSessionDetail.isGeneratingContent = false;

            return true;
        } catch (error) {
            console.error('Error creating chat message:', error);
            throw error;
        }
    }

    async readAllChatMessages(params: ReadAllChatMessagesParams, deps: WSDeps): Promise<boolean> {
        try {
            const { chatSessionId } = params;

            const chatSessionDetail = this.chatSessionDetailMap.get(chatSessionId);
            if (!chatSessionDetail) {
                throw new ForbiddenError('Chat session not found');
            }

            const conditions: SQL[] = [
                eq(chatMessage.chatSessionId, chatSessionId),
                eq(chatSession.userId, this.userDetails.userId),
            ];

            const chatMessages =
                (await this.orm.db
                    .select()
                    .from(chatMessage)
                    .leftJoin(chatSession, eq(chatMessage.chatSessionId, chatSession.id))
                    .where(and(...conditions))
                    .execute()) ?? [];

            if (chatMessages.length) {
                chatSessionDetail.chatMessages = chatMessages.map((_) => _.chat_message);
                chatSessionDetail.geminiChat = this.gemini.chats.create({
                    model: 'gemini-2.5-flash',
                    history: chatSessionDetail.chatMessages
                        .filter((chatMessage) => chatMessage.role !== 'system')
                        .map((message) => ({
                            role: message.role,
                            parts: [{ text: message.content }],
                        })),
                    config: {},
                });
            }

            sendWSEvent(
                WSServerEventType.READ_ALL_CHAT_MESSAGES_RESPONSE,
                chatSessionDetail.chatMessages satisfies ReadAllChatMessagesWSResponse,
                deps,
            );

            return true;
        } catch (error) {
            console.error('Error fetching chat messages:', error);
            throw error;
        }
    }
}
