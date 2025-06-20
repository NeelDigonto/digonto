import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { trace, type Tracer } from '@opentelemetry/api';
import { logger } from './logger.js';

let sdk: NodeSDK | null = null;

export const initTelemetry = async (): Promise<void> => {
  if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    logger.info('OpenTelemetry disabled - no endpoint configured');
    return;
  }

  try {
    const traceExporter = new OTLPTraceExporter({
      url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
      headers: process.env.OTEL_EXPORTER_OTLP_HEADERS
        ? JSON.parse(process.env.OTEL_EXPORTER_OTLP_HEADERS) as Record<string, string>
        : undefined,
    });

    sdk = new NodeSDK({
      resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: 'gateway',
        environment: process.env.NODE_ENV || 'development',
      }),
      spanProcessors: [new BatchSpanProcessor(traceExporter)],
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-fs': {
            enabled: false,
          },
        }),
      ],
    });

    await sdk.start();
    logger.info('OpenTelemetry initialized');
  } catch (error) {
    logger.error({ error }, 'Failed to initialize OpenTelemetry');
  }
};

export const shutdownTelemetry = async (): Promise<void> => {
  if (sdk) {
    try {
      await sdk.shutdown();
      logger.info('OpenTelemetry shut down');
    } catch (error) {
      logger.error({ error }, 'Error shutting down OpenTelemetry');
    }
  }
};

export const getTracer = (name: string): Tracer => {
  return trace.getTracer(name);
};