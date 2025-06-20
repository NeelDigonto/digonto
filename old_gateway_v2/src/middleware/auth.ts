import type { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { getEM } from '../db/database.js';
import { Session } from '../db/entities/Session.entity.js';
import type { User } from '../db/entities/User.entity.js';

export type AuthContext = {
  user?: User;
  session?: Session;
};

declare module 'hono' {
  interface ContextVariableMap {
    auth: AuthContext;
  }
}

export const authMiddleware = createMiddleware(async (c: Context, next: Next) => {
  const sessionId = getCookie(c, 'sessionId');
  
  if (!sessionId) {
    c.set('auth', {});
    return next();
  }

  try {
    const em = getEM();
    const session = await em.findOne(Session, { id: sessionId }, { populate: ['user'] });
    
    if (!session || session.isExpired()) {
      c.set('auth', {});
      return next();
    }
    
    // Update last accessed time
    session.lastAccessedAt = new Date();
    await em.flush();
    
    c.set('auth', {
      user: session.user,
      session,
    });
  } catch (error) {
    c.set('auth', {});
  }
  
  return next();
});

export const requireAuth = createMiddleware(async (c: Context, next: Next) => {
  const { user } = c.get('auth');
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  return next();
});