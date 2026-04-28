import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_7_DETAIL = {
  overview: [
    "Good error handling and logging are the difference between debugging a production incident in 5 minutes and spending 2 hours grepping through noisy logs. Logs are for humans and machines — structured JSON logs can be queried; correlation IDs tie a request across every service it touches.",
    "Day 7 covers structured logging setup (Winston/Zap), log levels and when to use each, correlation IDs across the request lifecycle, error classification (client vs transient vs bug), global error handlers, and alerting on symptoms rather than process crashes.",
  ],
  sections: [
    {
      title: "Raw logs vs structured logs",
      blocks: [
        {
          type: "diagram",
          id: "log-correlation",
        },
        {
          type: "table",
          headers: ["", "Plain text log", "Structured JSON log"],
          rows: [
            [
              "Example",
              "ERROR: user 42 not found at 14:02:33",
              '{"level":"error","msg":"user not found","userId":"42","correlationId":"req_abc","ts":"2024-01-15T14:02:33Z"}',
            ],
            [
              "Queryable?",
              "Only with grep/regex",
              "Yes — filter by any field in Loki, Datadog, CloudWatch Insights",
            ],
            [
              "Alerting",
              "Hard to extract numbers",
              "Easy — count by level, code, route",
            ],
            ["Parsing", "Fragile regex", "Schema-defined, zero ambiguity"],
          ],
        },
        {
          type: "code",
          title: "Winston structured logger setup",
          code: `import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),       // structured JSON output
  ),
  transports: [new winston.transports.Console()],
});

// Usage: always include context fields
logger.info("user created", { userId: user.id, email: user.email });
logger.error("payment failed", { orderId, reason: err.message, stack: err.stack });`,
        },
      ],
    },
    {
      title: "Log levels — when to use each",
      blocks: [
        {
          type: "table",
          headers: ["Level", "When to use", "Alert on it?"],
          rows: [
            [
              "error",
              "Unexpected failure — requires investigation or recovery",
              "Yes",
            ],
            [
              "warn",
              "Unexpected but handled — degraded behaviour, retry succeeded, deprecated call",
              "Maybe (track trend)",
            ],
            [
              "info",
              "Notable lifecycle events — server started, request completed, job finished",
              "No",
            ],
            [
              "debug",
              "Developer detail — query params, cache decisions, branch taken",
              "No (off in production)",
            ],
            [
              "trace",
              "Very fine-grained — per-row DB iteration, byte-level protocol",
              "No (off in production)",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "In production, run at info level by default. Add a flag or environment variable to toggle debug per-service without a redeploy. Never log at debug in a hot path — even if the transport is discarding it, string interpolation and JSON serialisation still cost CPU.",
        },
      ],
    },
    {
      title: "Correlation IDs across services",
      blocks: [
        {
          type: "paragraph",
          text: "A correlation ID (also called request ID or trace ID) is a unique identifier generated at the edge of your system — typically in an API gateway or the first middleware that handles a request. Every downstream service call and log line includes this ID. When an error surfaces, you search for the ID and instantly see the entire request timeline across all services.",
        },
        {
          type: "code",
          title: "Correlation ID middleware (Express)",
          code: `import { randomUUID } from "crypto";
import { AsyncLocalStorage } from "async_hooks";

export const requestContext = new AsyncLocalStorage<{ correlationId: string }>();

export function correlationMiddleware(req: Request, res: Response, next: NextFunction) {
  const correlationId =
    (req.headers["x-correlation-id"] as string) ?? randomUUID();

  res.set("x-correlation-id", correlationId);

  requestContext.run({ correlationId }, () => next());
}

// In logger — automatically include correlationId on every log
export function log(level: string, msg: string, meta?: object) {
  const ctx = requestContext.getStore();
  logger[level](msg, { correlationId: ctx?.correlationId, ...meta });
}`,
        },
        {
          type: "list",
          items: [
            "Accept X-Correlation-Id from upstream services if present; generate a new UUID if absent.",
            "Forward the ID in every outbound HTTP call (Axios interceptor, fetch wrapper).",
            "Include it in every log line — use AsyncLocalStorage in Node.js to avoid threading it manually through every function.",
            "Return it in the response header so clients can include it in bug reports.",
          ],
        },
      ],
    },
    {
      title: "Error classification",
      blocks: [
        {
          type: "diagram",
          id: "error-classification",
        },
        {
          type: "table",
          headers: [
            "Class",
            "HTTP range",
            "Should the client retry?",
            "Action",
          ],
          rows: [
            [
              "Client error",
              "4xx",
              "No (except 429 — rate limited)",
              "Return descriptive error; log at warn or info",
            ],
            [
              "Transient / infrastructure error",
              "503, 502, 504",
              "Yes — with exponential backoff + jitter",
              "Log at warn; alert if sustained",
            ],
            [
              "Bug / unexpected error",
              "500",
              "No (retrying a bug just hammers the system)",
              "Log at error with full stack; alert immediately",
            ],
            [
              "Timeout",
              "504 / client timeout",
              "Yes — with budget",
              "Log with elapsed time; check slow query logs",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "Classify errors as close to the source as possible — wrap third-party SDK errors in your own typed error classes so you retain the classification even after the call stack unwinds.",
        },
      ],
    },
    {
      title: "Global error handler",
      blocks: [
        {
          type: "code",
          title: "Express global error handler with error codes",
          code: `// Custom typed error base class
export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly statusCode: number,
    message: string,
    public readonly isOperational = true, // operational vs programmer error
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Global error handler (must be last middleware registered)
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError && err.isOperational) {
    logger.warn("operational error", {
      code: err.code,
      status: err.statusCode,
      msg: err.message,
      correlationId: res.get("x-correlation-id"),
    });
    return res.status(err.statusCode).json({
      type: \`https://errors.example.com/\${err.code}\`,
      title: err.message,
      status: err.statusCode,
    });
  }

  // Programmer error — log full stack, return generic 500
  logger.error("unhandled error", {
    err,
    correlationId: res.get("x-correlation-id"),
  });
  res.status(500).json({ title: "Internal server error", status: 500 });
});`,
        },
        {
          type: "list",
          items: [
            "Distinguish operational errors (expected: not found, validation failed) from programmer errors (unexpected: null dereference, missing env var).",
            "Operational errors get a structured response; programmer errors get a generic 500 to avoid leaking internals.",
            "Always log the correlationId on errors so you can trace the full request.",
            "Never swallow errors silently — at minimum log them, even if you return a fallback response.",
          ],
        },
      ],
    },
    {
      title: "Structured JSON logging with Zap (Go)",
      blocks: [
        {
          type: "code",
          title: "Zap logger setup",
          code: `package main

import "go.uber.org/zap"

func main() {
    logger, _ := zap.NewProduction() // JSON output by default
    defer logger.Sync()

    // Structured fields — never fmt.Sprintf into the message
    logger.Info("user created",
        zap.String("userId", userID),
        zap.String("correlationId", correlationID),
    )

    logger.Error("payment failed",
        zap.String("orderId", orderID),
        zap.Error(err),
    )
}`,
        },
        {
          type: "paragraph",
          text: "Zap uses a zero-allocation design — fields are passed as typed key-value pairs rather than string-formatted. This keeps hot-path logging overhead minimal. Use zap.SugaredLogger for development convenience; zap.Logger in production for performance.",
        },
      ],
    },
    {
      title: "Alerting on symptoms, not just crashes",
      blocks: [
        {
          type: "table",
          headers: ["Bad alert (cause-based)", "Better alert (symptom-based)"],
          rows: [
            ["Process crashed", "Error rate > 1% for 5 minutes"],
            ["CPU > 90%", "p99 response latency > 2 s"],
            [
              "Redis disconnected",
              "Successful request rate dropped > 10% vs baseline",
            ],
            ["DB connection pool exhausted", "Checkout success rate < 99.5%"],
          ],
        },
        {
          type: "paragraph",
          text: "Cause-based alerts fire even when users are unaffected (a pod restart that completes in 2 seconds triggers a process crash alert but no user sees an error). Symptom-based alerts fire only when users are experiencing degraded service. This is the RED method: track Request Rate, Error rate, and Duration for every service boundary.",
        },
        {
          type: "list",
          items: [
            "Define SLIs (Service Level Indicators) from user-visible signals: availability, latency percentiles, error rate.",
            "Set SLOs (Service Level Objectives) as thresholds on those SLIs (e.g., 99.9% of requests succeed).",
            "Alert on error budget burn rate, not individual events — a spike that lasts 5 minutes is more urgent than a steady 0.1% error rate.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is structured logging and why does it matter?",
      tag: "Structured logging",
      answer: [
        'Structured logging means emitting log records as machine-readable key-value pairs (typically JSON) rather than free-form text strings. Instead of \'ERROR: user 42 failed to pay\', you emit {"level":"error","userId":"42","event":"payment_failed","reason":"card_declined"}.',
        "The payoff: you can filter, aggregate, and alert on any field in your logging platform. Find all errors for a specific userId, count error codes over time, or alert when payment_failed rate exceeds a threshold — none of this is feasible with plain text logs.",
      ].join("\n\n"),
      callout:
        "One common mistake: embedding structured data as a string inside the message field. Put context fields as top-level fields, not interpolated into the message string.",
    },
    {
      question:
        "What is a correlation ID and how does it work across microservices?",
      tag: "Correlation IDs",
      answer: [
        "A correlation ID is a unique UUID generated at the entry point of a request (API gateway or first service). Every subsequent service call includes this ID in a request header (X-Correlation-Id). Every log line emitted during that request includes the same ID as a field.",
        "When an error occurs in Service C, you search your log aggregator for that correlation ID and instantly see every log line from Services A, B, and C in chronological order — the complete request timeline across the entire system.",
      ].join("\n\n"),
    },
    {
      question: "What is AsyncLocalStorage and why is it useful for logging?",
      tag: "Node.js",
      answer: [
        "AsyncLocalStorage (from Node's async_hooks module) provides storage that is automatically propagated across the entire async call graph of a request — similar to thread-local storage in threaded languages. You store the correlationId at the start of a request, and any code running within that async context can retrieve it without being passed the ID explicitly.",
        "Without it, you would need to thread the correlationId as a parameter through every function call. With it, your logger can silently include correlationId on every log line by reading from the store.",
      ].join("\n\n"),
    },
    {
      question:
        "What is the difference between an operational error and a programmer error?",
      tag: "Error classification",
      answer: [
        "An operational error is an expected failure that can happen even in a correct program: a user provides invalid input, a downstream service is temporarily unavailable, a record is not found. These are part of normal system operation and should return a descriptive, user-facing error response.",
        "A programmer error is a bug: accessing a property on null, calling a function with the wrong argument type, an unhandled promise rejection. These indicate a coding defect and should be logged with a full stack trace and alert the on-call engineer. Returning a generic 500 is correct — you do not want to expose implementation details.",
      ].join("\n\n"),
    },
    {
      question: "What log level should I use for expected errors like 404s?",
      tag: "Log levels",
      answer: [
        "Log 404s at info or warn, not error. A 404 is a client mistake — the resource simply does not exist or the URL is wrong. Logging it at error pollutes your error dashboards and drowns out real errors. The same applies to 400 Bad Request and 401 Unauthorised.",
        "Reserve error level for things that require an engineer's attention: unexpected exceptions, database failures, third-party API outages, data corruption. If your error rate alert fires, every entry should be something a human needs to investigate.",
      ].join("\n\n"),
    },
    {
      question: "Should I log request and response bodies?",
      tag: "Structured logging",
      answer: [
        "Generally no — request and response bodies can contain passwords, tokens, credit card numbers, and PII. Log structured fields extracted from the body (user ID, action type, resource ID) but not the raw body.",
        "For debugging, use redaction middleware that strips known-sensitive fields (password, token, card_number) before logging the remainder. In high-security environments, log only that a request was made, not its content.",
      ].join("\n\n"),
      callout:
        "Never log Authorization headers, Set-Cookie headers, or any field whose name contains password, secret, token, or key.",
    },
    {
      question: "What is the RED method for alerting?",
      tag: "Alerting",
      answer: [
        "RED stands for Rate (requests per second), Errors (error rate as a percentage of total requests), and Duration (latency distribution — p50, p95, p99). These three metrics, tracked per service or per endpoint, give you a complete picture of user-facing health.",
        "An increase in Errors or Duration directly maps to user pain. Rate is useful for capacity planning and detecting traffic anomalies. Alert on Errors and Duration thresholds rather than infrastructure metrics like CPU or memory.",
      ].join("\n\n"),
    },
    {
      question: "What is the difference between logs, metrics, and traces?",
      tag: "Observability",
      answer: [
        "Logs are discrete events with context fields — each line describes what happened at a point in time. Metrics are numeric time series aggregated over intervals (request count, p99 latency, error rate). Traces are end-to-end records of a single request's journey through multiple services, showing spans and their durations.",
        "Logs help you understand what happened. Metrics tell you when something changed and how much it changed. Traces show you where in the system time was spent. Ideally all three are linked via correlation IDs so you can move from a metric anomaly to a trace to the relevant log lines.",
      ].join("\n\n"),
    },
    {
      question: "How should I handle unhandled promise rejections in Node.js?",
      tag: "Node.js",
      answer: [
        "Register global handlers for both unhandledRejection and uncaughtException. For uncaughtException, log the error and exit — the process is in an unknown state and continuing is dangerous. For unhandledRejection, log it and consider whether to exit depending on severity.",
        "In production, use a process manager (systemd, Kubernetes, PM2) to restart the process automatically after a crash. The goal is fast, logged, graceful shutdown — not silent continuation.",
      ].join("\n\n"),
      callout:
        "process.on('unhandledRejection', (reason) => { logger.error('unhandled rejection', { reason }); process.exit(1); });",
    },
    {
      question: "Why should I not use console.log in production?",
      tag: "Structured logging",
      answer: [
        "console.log outputs plain text with no level, no timestamp, and no structured fields. It cannot be filtered, aggregated, or reliably redirected. It has no concept of log levels — you cannot turn off debug output without code changes. It does not support redaction of sensitive fields.",
        "Replace it with a logger library (Winston, Pino for Node.js; Zap, slog for Go) that emits JSON, supports levels, and can be configured from environment variables without code changes.",
      ].join("\n\n"),
    },
    {
      question: "What makes a good error response for API consumers?",
      tag: "Error responses",
      answer: [
        "Follow RFC 9457 (Problem Details for HTTP APIs): return a JSON object with type (a URI identifying the error class), title (human-readable summary), status (HTTP status code), detail (request-specific explanation), and instance (URI identifying this specific occurrence). Include a correlationId field for support lookup.",
        'Be specific for client errors ("email field must be a valid email address") and generic for server errors ("internal server error" with a correlationId). Never return a stack trace to external clients.',
      ].join("\n\n"),
    },
    {
      question:
        "How do I alert on error budget burn rate rather than raw error rate?",
      tag: "Alerting",
      answer: [
        "An error budget is the allowable number of errors over a window given your SLO (e.g., 99.9% availability = 0.1% errors = ~43 minutes of downtime per month). Burn rate is how fast you are consuming that budget relative to normal pace. A burn rate of 1 = consuming budget at exactly the rate your SLO allows.",
        "Alert when the burn rate over the last hour is > 14x (your monthly budget at this rate would be consumed in 2 days). This avoids alert fatigue from isolated transient spikes while catching sustained degradation early.",
      ].join("\n\n"),
    },
  ],
} satisfies RoadmapDayDetail;
