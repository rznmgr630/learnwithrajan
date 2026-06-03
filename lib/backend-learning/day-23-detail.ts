import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_23_DETAIL = {
  overview: [
    "Metrics tell you something is wrong. Logs tell you what happened. Traces tell you where it happened across multiple services and why it was slow. All three are needed to debug a production incident quickly — metrics show the error spike, logs show the exception message, and traces show exactly which database call or downstream service was the culprit.",
    "Today covers structured logging (why JSON beats plain text), log aggregation with tools like the ELK stack and Grafana Loki, and distributed tracing with OpenTelemetry — the open standard for instrumentation that works across languages and works with any backend.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "fzny5uUaAeY", title: "Grafana & Prometheus — Beautiful Dashboards" },
      ],
    },
    {
      title: "Structured logging",
      blocks: [
        {
          type: "paragraph",
          text: "A structured log is a JSON object per line, not a human-readable string. JSON logs can be parsed, filtered, and aggregated by machines. A plain text log like 'Error processing order 123 for user 456' is readable but unsearchable at scale — you cannot filter for all errors for user 456 without fragile regex. A structured log with fields order_id, user_id, and level makes that filter trivial.",
        },
        {
          type: "code",
          title: "Structured logging with pino in Node.js",
          code: `import pino from "pino";

// pino outputs one JSON line per log call — fast and parseable
const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  // In production: pipe to log aggregator (no pretty-print)
  // In development: use pino-pretty for readable output
  transport: process.env.NODE_ENV === "development"
    ? { target: "pino-pretty" }
    : undefined,
});

// Create a child logger with request context — every log from this handler
// automatically includes requestId, userId, and method
export function createRequestLogger(req: Request) {
  return logger.child({
    requestId: req.headers["x-request-id"] ?? crypto.randomUUID(),
    method: req.method,
    path: req.path,
    userId: req.user?.id,
  });
}

// Usage in a route handler
app.post("/api/orders", async (req, res) => {
  const log = createRequestLogger(req);
  log.info("Creating order");

  try {
    const order = await createOrder(req.body);
    log.info({ orderId: order.id, total: order.total }, "Order created successfully");
    res.status(201).json(order);
  } catch (err) {
    log.error({ err, body: req.body }, "Failed to create order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Output (production JSON):
// {"level":30,"time":1700000000,"requestId":"uuid","method":"POST","path":"/api/orders","userId":42,"msg":"Creating order"}
// {"level":30,"time":1700000010,"requestId":"uuid","orderId":99,"total":49.99,"msg":"Order created successfully"}`,
        },
        {
          type: "table",
          headers: ["Log level", "When to use", "Examples"],
          rows: [
            ["error", "Something failed and needs immediate attention", "Unhandled exceptions, database connection lost, critical business rule violated"],
            ["warn", "Something unexpected happened but the system recovered", "Retried a request after a transient failure, deprecated API called, slow query above threshold"],
            ["info", "Normal events worth recording for audit or debugging", "Request received, order created, user logged in, background job started"],
            ["debug", "Detailed internal state useful during development", "SQL query text, response body, intermediate calculation values — disable in production"],
          ],
        },
      ],
    },
    {
      title: "Log aggregation — collecting logs from many services",
      blocks: [
        {
          type: "table",
          caption: "All three approaches let you search across services — pick based on your stack and team size.",
          headers: ["Stack", "Components", "Best for", "Indexing model"],
          rows: [
            ["ELK (Elasticsearch, Logstash, Kibana)", "Logstash or Filebeat ships logs → Elasticsearch indexes → Kibana queries", "Full-text search across large volumes; complex query patterns; existing Elasticsearch team", "Full inverted index — every field is searchable; expensive storage"],
            ["Grafana Loki", "Promtail or Alloy ships logs → Loki stores → Grafana queries with LogQL", "Teams already using Grafana + Prometheus; cost-sensitive; Kubernetes environments", "Labels only — index just labels, not log content; cheap storage; slower full-text search"],
            ["AWS CloudWatch Logs", "CloudWatch agent or Lambda built-in → CloudWatch Logs Insights queries", "AWS-native deployments; no extra infrastructure to manage; Lambda functions", "Managed; pay per ingestion and query; good for moderate volumes"],
          ],
        },
        { type: "diagram", id: "log-correlation" },
        {
          type: "paragraph",
          text: "A correlation ID (also called a trace ID or request ID) is a unique string generated at the start of every incoming request and included in every log line, metric label, and outgoing request header for that request. When an incident happens, you search for the correlation ID and instantly see every log line from every service that touched that request — without having to grep through timestamps or piece together events manually.",
        },
      ],
    },
    {
      title: "Distributed tracing & OpenTelemetry",
      blocks: [
        {
          type: "paragraph",
          text: "A trace is a record of the complete journey a request took through your system. It is made up of spans — one span per operation (HTTP handler, database query, cache lookup, downstream service call). Each span has a start time, duration, name, status, and any attributes you attach. Spans from different services are linked by a shared trace ID that travels in request headers. When you view a trace, you see a waterfall diagram showing exactly where time was spent.",
        },
        {
          type: "code",
          title: "OpenTelemetry tracing setup in Node.js",
          code: `// tracing.ts — import this BEFORE any other module
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const sdk = new NodeSDK({
  // Export traces to Jaeger, Tempo, or any OTLP-compatible backend
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? "http://localhost:4318/v1/traces",
  }),
  // Auto-instrument: Express, HTTP, pg, mongoose, redis, grpc, etc.
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
process.on("SIGTERM", () => sdk.shutdown());

// With auto-instrumentation active, every Express handler, outgoing HTTP request,
// and database call is automatically traced — no manual span creation needed for common operations.

// For custom spans (e.g. a business logic operation):
import { trace } from "@opentelemetry/api";

async function processOrder(orderId: string) {
  const tracer = trace.getTracer("order-service");

  return tracer.startActiveSpan("processOrder", async (span) => {
    try {
      span.setAttribute("order.id", orderId);

      const order = await db.orders.findById(orderId);
      span.setAttribute("order.total", order.total);

      await chargeCustomer(order);
      await sendConfirmationEmail(order);

      span.setStatus({ code: SpanStatusCode.OK });
      return order;
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw err;
    } finally {
      span.end();
    }
  });
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "OpenTelemetry (OTel) is the open-source standard for instrumentation — use it and you can switch backends (Jaeger, Tempo, Honeycomb, Datadog) without changing your app code.",
            "Auto-instrumentation handles Express, HTTP, PostgreSQL, MongoDB, Redis, and gRPC automatically — you get traces for free without touching application code.",
            "The W3C traceparent header (e.g. 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01) propagates the trace context between services. Any OTel-instrumented service that receives this header automatically links its spans to the same trace.",
            "Sampling: tracing every request at high traffic is expensive. Use head-based sampling (decide at the entry point: sample 10% of requests) or tail-based sampling (decide after the trace completes: always sample slow or error traces).",
          ],
        },
      ],
    },
    {
      title: "Alerting with Alertmanager",
      blocks: [
        { type: "diagram", id: "devops-alertmanager-architecture" },
        {
          type: "table",
          headers: ["Alert routing concept", "What it does", "Why it matters"],
          rows: [
            ["Grouping", "Bundle related alerts into one notification — e.g. all alerts for the same service", "Prevents alert storms where 50 individual alerts fire for the same root cause"],
            ["Inhibition", "Suppress child alerts when a parent alert is already firing — e.g. silence pod alerts when the whole node is down", "Avoids noise when the root cause alert is already being handled"],
            ["Silencing", "Temporarily mute alerts during a planned maintenance window", "Prevents on-call engineers from being paged during expected downtime"],
            ["Routing", "Send alerts to different channels based on labels — critical alerts to PagerDuty, warning alerts to Slack", "Ensures the right person gets the right alert through the right channel"],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is the difference between logs and traces?",
      tag: "Observability pillars",
      answer: [
        "Logs are discrete events — each line describes something that happened at a point in time, in one service. Logs are great for detailed debugging but they do not show you how services are connected or where time was spent across a request.",
        "Traces follow a single request across all the services it touched. A trace contains spans — each span is one operation (a database query, an HTTP call, a cache lookup). Traces answer 'why was this request slow?' by showing you a waterfall of every step and its duration. Both are needed: logs for the detail, traces for the full picture.",
      ].join("\n\n"),
    },
    {
      question: "Why is structured logging better than console.log?",
      tag: "Logging",
      answer: [
        "console.log produces unstructured strings that are difficult to parse at scale. You cannot reliably filter for all logs where user_id = 42 or order_total > 1000 without fragile regex. Structured JSON logs have consistent fields that log aggregation tools (Elasticsearch, Loki, CloudWatch Insights) can index and query efficiently.",
        "Structured logging also enforces consistency across your codebase — every developer uses the same log format, making log analysis predictable and fast during incidents.",
      ].join("\n\n"),
    },
    {
      question: "What is a span in distributed tracing?",
      tag: "Distributed tracing",
      answer: [
        "A span is the record of one unit of work in a distributed trace. It has a name, start time, duration, parent span ID (to build the hierarchy), status (ok or error), and any attributes you attach (like order.id or db.statement). All spans with the same trace ID form a single distributed trace.",
        "Viewing a trace as a waterfall shows all the spans nested under each other — you can immediately see that the HTTP handler took 800ms total, 700ms of which was a single database query. That tells you exactly where to optimize.",
      ].join("\n\n"),
    },
    {
      question: "How do correlation IDs help during incidents?",
      tag: "Correlation IDs",
      answer: [
        "When a user reports an error, they give you a timestamp and maybe an error message. Without a correlation ID, you have to search through logs from multiple services, guess at the right time window, and try to match events across services by hand.",
        "With a correlation ID, the user gives you their request ID (or you find it in the error response). You search for that ID in your log aggregator and instantly see every log line from every service that processed that request — in order, with full context. Incidents that took an hour to diagnose can take minutes.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Add pino structured logging to a Node.js app, create a request logger child with a correlation ID, and verify every log line includes the requestId field.",
    "Set up OpenTelemetry auto-instrumentation in a Node.js Express app and export traces to a local Jaeger instance — verify you can see a complete trace including database calls.",
    "Write a Grafana Loki LogQL query that finds all log lines with level=error in the last hour, grouped by service name.",
  ],
} satisfies RoadmapDayDetail;
