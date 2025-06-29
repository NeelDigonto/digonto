import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';

export const chatSession = pgTable('chat_session', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    userId: uuid('user_id')
        .references(() => user.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const chatSessionRelations = relations(chatSession, ({ one, many }) => ({
    user: one(user, {
        fields: [chatSession.userId],
        references: [user.id],
    }),
    messages: many(chatMessage),
}));

export type ChatSession = typeof chatSession.$inferSelect;
export type NewChatSession = typeof chatSession.$inferInsert;

export const chatMessageRole = pgEnum('chat_message_role', ['user', 'model', 'system']);

export const chatMessage = pgTable('chat_message', {
    id: uuid('id').defaultRandom().primaryKey(),
    chatSessionId: uuid('chat_session_id')
        .references(() => chatSession.id, { onDelete: 'cascade' })
        .notNull(),
    role: chatMessageRole('role').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const chatMessageRelations = relations(chatMessage, ({ one }) => ({
    chatSession: one(chatSession, {
        fields: [chatMessage.chatSessionId],
        references: [chatSession.id],
    }),
}));

export type ChatMessage = typeof chatMessage.$inferSelect;
export type NewChatMessage = typeof chatMessage.$inferInsert;
