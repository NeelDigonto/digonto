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
import { and, eq, SQL } from 'drizzle-orm';
import {
    CreateChatSessionParams,
    ReadAllChatSessionsWSResponse,
    ReadAllChatSessionsParams,
    ReadAllChatMessagesParams,
    ReadAllChatMessagesWSResponse,
    CreateChatSessionWSResponse,
    ProcessUserChatMessageParams,
    createChatMessageWSResponse,
    ModelChatMessageWSStreamingResponse,
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

            sendWSEvent(
                WSServerEventType.CREATE_CHAT_SESSION_RESPONSE,
                createdChatSession satisfies CreateChatSessionWSResponse,
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
                    .execute()) ?? [];

            for (const chatSession of chatSessions) {
                const chatSessionDetail: ChatSessionDetail = {
                    isGeneratingContent: false,
                    chatSession,
                    chatMessages: [],
                };
                this.chatSessionDetailMap.set(chatSession.id, chatSessionDetail);
            }

            sendWSEvent(
                WSServerEventType.READ_ALL_CHAT_SESSIONS_RESPONSE,
                chatSessions satisfies ReadAllChatSessionsWSResponse,
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

            const geminiChat = chatSessionDetail.geminiChat;
            if (!geminiChat) {
                throw new InternalServerError(`Gemini chat not found for session ${chatSessionId}`);
            }

            const newChatMessage: NewChatMessage = {
                chatSessionId,
                role: 'user',
                content,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const [createdChatMessage] = await this.orm.db
                .insert(chatMessage)
                .values(newChatMessage)
                .returning()
                .execute();

            sendWSEvent(
                WSServerEventType.CREATE_CHAT_MESSAGE_RESPONSE,
                createdChatMessage satisfies createChatMessageWSResponse,
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
                        id: createdChatMessage.id,
                        chunkNumber: chunkNumber++,
                        chatSessionId: createdChatMessage.chatSessionId,
                        role: 'model',
                        content: chunk.text,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    sendWSEvent(
                        WSServerEventType.MODEL_CHAT_MESSAGE_STREAMING_RESPONSE,
                        modelChatMessageChunk satisfies ModelChatMessageWSStreamingResponse,
                        deps,
                    );
                }
            }

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
                    .where(and(...conditions))
                    .execute()) ?? [];

            if (chatMessages.length) {
                chatSessionDetail.chatMessages = chatMessages;
                chatSessionDetail.geminiChat = this.gemini.chats.create({
                    model: 'gemini-2.5-flash',
                    history: chatMessages
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
                chatMessages satisfies ReadAllChatMessagesWSResponse,
                deps,
            );

            return true;
        } catch (error) {
            console.error('Error fetching chat messages:', error);
            throw error;
        }
    }
}
