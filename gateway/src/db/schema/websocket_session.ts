import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { authSession } from './auth_session';

export const websocketSession = pgTable('websocket_session', {
    id: uuid('id').defaultRandom().primaryKey(),

    authSession: uuid('auth_session_id')
        .references(() => authSession.id, { onDelete: 'cascade' })
        .notNull(),

    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
    leftAt: timestamp('left_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type WebsocketSession = typeof websocketSession.$inferSelect;
export type NewWebsocketSession = typeof websocketSession.$inferInsert;

export const websocketSessionRelations = relations(websocketSession, ({ one }) => ({
    authSession: one(authSession, {
        fields: [websocketSession.authSession],
        references: [authSession.id],
    }),
}));
