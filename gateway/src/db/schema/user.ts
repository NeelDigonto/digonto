import { boolean, pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { authSession } from './auth_session';

export const user = pgTable('user', {
    id: uuid('id').defaultRandom().primaryKey(),

    name: text('name').notNull(),
    userName: text('username').notNull().unique(),
    avatarUrl: text('avatar_url'),
    bio: text('bio').notNull(),

    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),

    passwordHash: text('password_hash'),

    isActive: boolean('is_active').default(false).notNull(),
    isSuspended: boolean('is_suspended').default(false).notNull(),
    suspendedAt: timestamp('suspended_at', { withTimezone: true }),
    suspensionReason: text('suspension_reason'),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export const userRelations = relations(user, ({ many }) => ({
    authSession: many(authSession),
}));
