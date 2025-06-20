import { prometheus } from '@hono/prometheus';

export const { printMetrics, registerMetrics } = prometheus({
  path: '/metrics',
  collectDefaultMetrics: true,
});