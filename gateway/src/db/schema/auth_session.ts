import { boolean, pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { user } from './user';
import { websocketSession } from './websocket_session';

export const authSession = pgTable('auth_session', {
    id: uuid('id').defaultRandom().primaryKey(),

    userId: uuid('user_id')
        .references(() => user.id, { onDelete: 'cascade' })
        .notNull(),

    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type AuthSession = typeof authSession.$inferSelect;
export type NewAuthSession = typeof authSession.$inferInsert;

export const authSessionRelations = relations(authSession, ({ one, many }) => ({
    user: one(user, {
        fields: [authSession.userId],
        references: [user.id],
    }),
    websocketSession: many(websocketSession),
}));
