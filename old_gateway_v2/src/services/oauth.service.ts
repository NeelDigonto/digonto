import { SignJWT, jwtVerify } from 'jose';
import { randomBytes } from 'crypto';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export interface OAuthProvider {
  name: string;
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  clientId: string;
  clientSecret: string;
  scope: string;
}

export interface OAuthUserInfo {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export class OAuthService {
  private static readonly providers: Map<string, OAuthProvider> = new Map();
  private static readonly stateSecret = new TextEncoder().encode(env.SESSION_SECRET);
  
  static {
    // Initialize OAuth providers
    if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
      this.providers.set('google', {
        name: 'google',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        scope: 'openid email profile',
      });
    }
    
    if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
      this.providers.set('github', {
        name: 'github',
        authUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        userInfoUrl: 'https://api.github.com/user',
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        scope: 'read:user user:email',
      });
    }
  }
  
  static getProvider(name: string): OAuthProvider | undefined {
    return this.providers.get(name);
  }
  
  static getProviders(): string[] {
    return Array.from(this.providers.keys());
  }
  
  static async createState(provider: string): Promise<string> {
    const nonce = randomBytes(16).toString('hex');
    
    const jwt = await new SignJWT({ provider, nonce })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10m')
      .setIssuedAt()
      .sign(this.stateSecret);
    
    return jwt;
  }
  
  static async verifyState(state: string): Promise<{ provider: string; nonce: string } | null> {
    try {
      const { payload } = await jwtVerify(state, this.stateSecret);
      return payload as { provider: string; nonce: string };
    } catch (error) {
      logger.error({ error }, 'Failed to verify OAuth state');
      return null;
    }
  }
  
  static getAuthUrl(provider: OAuthProvider, state: string): string {
    const params = new URLSearchParams({
      client_id: provider.clientId,
      redirect_uri: env.OAUTH_REDIRECT_URL,
      response_type: 'code',
      scope: provider.scope,
      state,
    });
    
    return `${provider.authUrl}?${params.toString()}`;
  }
  
  static async exchangeCodeForToken(
    provider: OAuthProvider,
    code: string
  ): Promise<{ access_token: string; token_type: string }> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: env.OAUTH_REDIRECT_URL,
      client_id: provider.clientId,
      client_secret: provider.clientSecret,
    });
    
    const response = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: params.toString(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to exchange code: ${response.statusText}`);
    }
    
    return response.json() as Promise<{ access_token: string; token_type: string }>;
  }
  
  static async getUserInfo(provider: OAuthProvider, accessToken: string): Promise<OAuthUserInfo> {
    const response = await fetch(provider.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.statusText}`);
    }
    
    const data = await response.json() as Record<string, unknown>;
    
    // Map provider-specific fields to common format
    if (provider.name === 'google') {
      return {
        id: data.id as string,
        email: data.email as string,
        name: data.name as string | undefined,
        picture: data.picture as string | undefined,
      };
    } else if (provider.name === 'github') {
      return {
        id: String(data.id),
        email: data.email as string,
        name: data.name as string | undefined,
        picture: data.avatar_url as string | undefined,
      };
    }
    
    throw new Error(`Unknown provider: ${provider.name}`);
  }
}