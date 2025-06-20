import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { serve } from '@hono/node-server';
import type { Server } from 'node:http';
import { createApp } from '../../src/app.js';

describe('API E2E Tests', () => {
  let server: Server;
  let baseUrl: string;
  
  beforeAll(async () => {
    const app = createApp();
    const port = 4001;
    
    server = serve({
      fetch: app.fetch,
      port,
    });
    
    baseUrl = `http://localhost:${port}`;
    
    // Wait for server to be ready
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
  
  afterAll(() => {
    server.close();
  });
  
  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const res = await fetch(`${baseUrl}/health`);
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toHaveProperty('status', 'healthy');
      expect(data).toHaveProperty('timestamp');
    });
  });
  
  describe('Metrics', () => {
    it('should return prometheus metrics', async () => {
      const res = await fetch(`${baseUrl}/metrics`);
      const text = await res.text();
      
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('text/plain');
      expect(text).toContain('# HELP');
      expect(text).toContain('# TYPE');
    });
  });
  
  describe('CORS', () => {
    it('should handle preflight requests', async () => {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'GET',
        },
      });
      
      expect(res.status).toBe(204);
      expect(res.headers.get('access-control-allow-origin')).toBe('http://localhost:3000');
      expect(res.headers.get('access-control-allow-methods')).toContain('GET');
    });
  });
  
  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await fetch(`${baseUrl}/unknown-route`);
      const data = await res.json();
      
      expect(res.status).toBe(404);
      expect(data).toHaveProperty('error', 'Not found');
    });
  });
});