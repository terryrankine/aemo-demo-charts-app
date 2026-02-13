/**
 * Optional OpenTelemetry instrumentation.
 * Only initializes if VITE_OTLP_ENDPOINT is set.
 * Traces fetch requests to the AEMO API automatically.
 */

const OTLP_ENDPOINT = import.meta.env.VITE_OTLP_ENDPOINT as string | undefined;

export async function initTelemetry(): Promise<void> {
  if (!OTLP_ENDPOINT) return;

  const { WebTracerProvider, BatchSpanProcessor } = await import('@opentelemetry/sdk-trace-web');
  const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
  const { FetchInstrumentation } = await import('@opentelemetry/instrumentation-fetch');
  const { registerInstrumentations } = await import('@opentelemetry/instrumentation');
  const otelResources = await import('@opentelemetry/resources');

  const resource = otelResources.defaultResource().merge(
    otelResources.resourceFromAttributes({ 'service.name': 'aemovis' }),
  );
  const exporter = new OTLPTraceExporter({ url: `${OTLP_ENDPOINT}/v1/traces` });
  const provider = new WebTracerProvider({
    spanProcessors: [new BatchSpanProcessor(exporter)],
    resource,
  });

  provider.register();

  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: [/\/api\//],
      }),
    ],
  });
}
