import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { authRoutes } from '../../src/routes/auth.routes.js';
import { authMiddleware } from '../../src/middleware/auth.js';
import { getEM } from '../../src/db/database.js';
import { User } from '../../src/db/entities/User.entity.js';
import { Session } from '../../src/db/entities/Session.entity.js';
import { SessionService } from '../../src/services/session.service.js';

describe('Auth Routes', () => {
  let app: Hono;
  
  beforeEach(() => {
    app = new Hono();
    app.use('*', authMiddleware);
    app.route('/', authRoutes);
  });
  
  describe('GET /me', () => {
    it('should return null user when not authenticated', async () => {
      const res = await app.request('/me');
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toEqual({ user: null });
    });
    
    it('should return user when authenticated', async () => {
      // Create test user and session
      const em = getEM();
      const user = new User();
      user.email = 'test@example.com';
      user.name = 'Test User';
      user.provider = 'google';
      user.providerId = '123456';
      
      await em.persistAndFlush(user);
      
      const session = await SessionService.createSession(user);
      
      // Make request with session cookie
      const res = await app.request('/me', {
        headers: {
          Cookie: `sessionId=${session.id}`,
        },
      });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data.user).toMatchObject({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    });
  });
  
  describe('GET /providers', () => {
    it('should return list of available providers', async () => {
      const res = await app.request('/providers');
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toHaveProperty('providers');
      expect(Array.isArray(data.providers)).toBe(true);
    });
  });
  
  describe('POST /logout', () => {
    it('should require authentication', async () => {
      const res = await app.request('/logout', {
        method: 'POST',
      });
      
      expect(res.status).toBe(401);
    });
    
    it('should destroy session when authenticated', async () => {
      // Create test user and session
      const em = getEM();
      const user = new User();
      user.email = 'test@example.com';
      user.provider = 'google';
      user.providerId = '123456';
      
      await em.persistAndFlush(user);
      
      const session = await SessionService.createSession(user);
      
      // Make logout request
      const res = await app.request('/logout', {
        method: 'POST',
        headers: {
          Cookie: `sessionId=${session.id}`,
        },
      });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toEqual({ success: true });
      
      // Verify session was destroyed
      const deletedSession = await em.findOne(Session, { id: session.id });
      expect(deletedSession).toBeNull();
    });
  });
});