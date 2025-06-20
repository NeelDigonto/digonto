import { randomBytes, createHmac } from 'crypto';
import type { Context } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import { getEM } from '../db/database.js';
import { Session } from '../db/entities/Session.entity.js';
import type { User } from '../db/entities/User.entity.js';
import { env, isProduction } from '../config/env.js';

export class SessionService {
  static async createSession(user: User, data?: Record<string, unknown>): Promise<Session> {
    const em = getEM();
    
    const session = new Session();
    session.user = user;
    session.expiresAt = new Date(Date.now() + env.SESSION_DURATION);
    session.data = data;
    
    await em.persistAndFlush(session);
    return session;
  }
  
  static setSessionCookie(c: Context, sessionId: string): void {
    const signature = this.signSessionId(sessionId);
    
    setCookie(c, 'sessionId', sessionId, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: env.SESSION_DURATION / 1000, // Convert to seconds
    });
    
    setCookie(c, 'sessionId.sig', signature, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: env.SESSION_DURATION / 1000,
    });
  }
  
  static clearSessionCookie(c: Context): void {
    deleteCookie(c, 'sessionId');
    deleteCookie(c, 'sessionId.sig');
  }
  
  static async destroySession(sessionId: string): Promise<void> {
    const em = getEM();
    await em.nativeDelete(Session, { id: sessionId });
  }
  
  static async cleanExpiredSessions(): Promise<number> {
    const em = getEM();
    const result = await em.nativeDelete(Session, {
      expiresAt: { $lt: new Date() },
    });
    return result;
  }
  
  private static signSessionId(sessionId: string): string {
    return createHmac('sha256', env.SESSION_SECRET)
      .update(sessionId)
      .digest('hex');
  }
  
  static verifySessionId(sessionId: string, signature: string): boolean {
    const expectedSignature = this.signSessionId(sessionId);
    return signature === expectedSignature;
  }
}