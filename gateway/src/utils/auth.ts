import { authSession, NewAuthSession, NewUser, ORM, user } from '@/db/orm';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

export async function assertDefaultUserInDB(orm: ORM) {
    const [defaultUser] = await orm.db
        .select()
        .from(user)
        .where(eq(user.name, 'Anonymous'))
        .execute();

    if (!defaultUser) {
        const newUser: NewUser = {
            id: randomUUID(),

            name: 'Anonymous',
            userName: `anonymous-${randomUUID()}`,
            avatarUrl: null,
            bio: '',

            email: ``,
            emailVerified: false,
            emailVerifiedAt: null,

            isActive: true,
            isSuspended: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const [insertedUser] = await orm.db.insert(user).values(newUser).returning().execute();

        const newAuthSession: NewAuthSession = {
            id: randomUUID(),
            userId: insertedUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiration
        };

        // const [insertedAuthSession] =
        await orm.db.insert(authSession).values(newAuthSession).returning().execute();
    }
}
