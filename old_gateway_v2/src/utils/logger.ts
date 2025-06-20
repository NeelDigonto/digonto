import pino from 'pino';
import type { Logger } from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

export const createLogger = (name: string): Logger => {
  return pino({
    name,
    level: process.env.LOG_LEVEL || 'info',
    transport: isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'HH:MM:ss.l',
          },
        }
      : undefined,
    formatters: {
      level: (label) => ({ level: label }),
    },
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        headers: req.headers,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
        headers: res.headers,
      }),
      err: pino.stdSerializers.err,
    },
  });
};

export const logger = createLogger('gateway');