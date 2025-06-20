import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { getEM } from '../db/database.js';
import { User } from '../db/entities/User.entity.js';
import { OAuthService } from '../services/oauth.service.js';
import { SessionService } from '../services/session.service.js';
import { authMiddleware, requireAuth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const authRoutes = new Hono();

// Apply auth middleware to all routes
authRoutes.use('*', authMiddleware);

// Get current user
authRoutes.get('/me', (c) => {
  const { user } = c.get('auth');
  
  if (!user) {
    return c.json({ user: null });
  }
  
  return c.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
  });
});

// List available OAuth providers
authRoutes.get('/providers', (c) => {
  const providers = OAuthService.getProviders();
  return c.json({ providers });
});

// Initiate OAuth flow
const initiateSchema = z.object({
  provider: z.string(),
});

authRoutes.get('/oauth/:provider', zValidator('param', initiateSchema), async (c) => {
  const { provider: providerName } = c.req.valid('param');
  
  const provider = OAuthService.getProvider(providerName);
  if (!provider) {
    return c.json({ error: 'Invalid provider' }, 400);
  }
  
  const state = await OAuthService.createState(providerName);
  const authUrl = OAuthService.getAuthUrl(provider, state);
  
  return c.redirect(authUrl);
});

// OAuth callback
const callbackSchema = z.object({
  code: z.string(),
  state: z.string(),
});

authRoutes.get('/callback', zValidator('query', callbackSchema), async (c) => {
  const { code, state } = c.req.valid('query');
  
  try {
    // Verify state
    const stateData = await OAuthService.verifyState(state);
    if (!stateData) {
      return c.json({ error: 'Invalid state' }, 400);
    }
    
    // Get provider
    const provider = OAuthService.getProvider(stateData.provider);
    if (!provider) {
      return c.json({ error: 'Invalid provider' }, 400);
    }
    
    // Exchange code for token
    const tokenData = await OAuthService.exchangeCodeForToken(provider, code);
    
    // Get user info
    const userInfo = await OAuthService.getUserInfo(provider, tokenData.access_token);
    
    // Find or create user
    const em = getEM();
    let user = await em.findOne(User, {
      provider: provider.name,
      providerId: userInfo.id,
    });
    
    if (!user) {
      user = new User();
      user.email = userInfo.email;
      user.name = userInfo.name;
      user.picture = userInfo.picture;
      user.provider = provider.name;
      user.providerId = userInfo.id;
      await em.persistAndFlush(user);
    } else {
      // Update user info
      user.email = userInfo.email;
      user.name = userInfo.name || user.name;
      user.picture = userInfo.picture || user.picture;
      await em.flush();
    }
    
    // Create session
    const session = await SessionService.createSession(user);
    SessionService.setSessionCookie(c, session.id);
    
    // Redirect to frontend
    return c.redirect('/');
  } catch (error) {
    logger.error({ error }, 'OAuth callback error');
    return c.json({ error: 'Authentication failed' }, 500);
  }
});

// Logout
authRoutes.post('/logout', requireAuth, async (c) => {
  const { session } = c.get('auth');
  
  if (session) {
    await SessionService.destroySession(session.id);
  }
  
  SessionService.clearSessionCookie(c);
  
  return c.json({ success: true });
});

export { authRoutes };