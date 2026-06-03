import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_22_DETAIL = {
  overview: [
    "You cannot fix what you cannot see. Observability is the practice of understanding what is happening inside your system from the data it produces. It has three pillars: metrics (numbers over time), logs (events with context), and traces (the path a request takes through multiple services). Good observability means you can answer questions about your system's behavior without deploying new code.",
    "Today focuses on the metrics pillar — how Prometheus collects and stores time-series data, the four core metric types, how to write useful alerts in PromQL, and why high-cardinality labels can make your monitoring system as slow as the system it is watching.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "h4Sl21AKiDg", title: "How Prometheus Monitoring Works" },
      ],
    },
    {
      title: "The three pillars of observability",
      blocks: [
        { type: "diagram", id: "devops-observability-pillars" },
        {
          type: "table",
          caption: "Each pillar answers a different question — all three together give you full visibility.",
          headers: ["Pillar", "What it tells you", "Best for", "Tools"],
          rows: [
            ["Metrics", "How many? How fast? How full? — numbers aggregated over time", "Alerting on trends, SLO tracking, capacity planning, dashboards", "Prometheus, CloudWatch, Datadog, StatsD"],
            ["Logs", "What happened at a specific moment in time, with context", "Debugging a specific error, auditing user actions, searching for patterns", "Elasticsearch (ELK), Grafana Loki, CloudWatch Logs, Splunk"],
            ["Traces", "Which services did this request touch and how long did each step take?", "Finding slow database calls, diagnosing cross-service failures, understanding request flow", "Jaeger, Zipkin, AWS X-Ray, Honeycomb, Tempo"],
          ],
        },
      ],
    },
    {
      title: "Prometheus — pull-based metrics collection",
      blocks: [
        { type: "diagram", id: "devops-prometheus-architecture" },
        {
          type: "paragraph",
          text: "Prometheus works by scraping — it sends an HTTP GET to a /metrics endpoint on each of your services on a regular schedule (typically every 15 seconds). Your service exposes the current values of all its counters, gauges, and histograms in a plain text format. Prometheus stores these as time-series data and lets you query them with PromQL. This pull model means Prometheus controls the scrape rate and you can tell immediately if a target is down.",
        },
        {
          type: "code",
          title: "Instrumenting a Node.js app with prom-client",
          code: `import express from "express";
import { register, Counter, Histogram, collectDefaultMetrics } from "prom-client";

// Collect default Node.js metrics (heap, event loop lag, GC, etc.)
collectDefaultMetrics();

// Counter — only goes up; use for request counts, errors, retries
const httpRequests = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "path", "status"],
});

// Histogram — tracks value distribution; use for latency, payload size
const httpDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request latency in seconds",
  labelNames: ["method", "path", "status"],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

const app = express();

// Middleware: record every request
app.use((req, res, next) => {
  const end = httpDuration.startTimer();
  res.on("finish", () => {
    const labels = { method: req.method, path: req.route?.path ?? req.path, status: res.statusCode.toString() };
    httpRequests.inc(labels);
    end(labels);
  });
  next();
});

// Expose /metrics endpoint for Prometheus to scrape
app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(3000);`,
        },
      ],
    },
    {
      title: "The four metric types",
      blocks: [
        {
          type: "table",
          caption: "Pick the right type — using a Gauge when you need a Counter leads to silent data loss on restarts.",
          headers: ["Type", "What it measures", "Resets on restart?", "Example use case"],
          rows: [
            ["Counter", "A value that only ever goes up — cumulative total since the process started", "Yes — always starts at 0", "Total HTTP requests, total errors, total bytes sent"],
            ["Gauge", "A value that can go up or down — the current snapshot", "Yes — reflects current state", "Current active connections, memory usage, queue depth, CPU temperature"],
            ["Histogram", "Distribution of values across configurable buckets — also exposes count and sum", "Yes", "HTTP response time, request payload size, database query duration"],
            ["Summary", "Like Histogram but computes quantiles on the client side — more accurate but cannot be aggregated across instances", "Yes", "Single-instance latency percentiles where exact p99 matters more than federation"],
          ],
        },
        {
          type: "code",
          title: "PromQL — querying your metrics",
          code: `# Rate of requests per second over the last 5 minutes (use rate() on Counters)
rate(http_requests_total[5m])

# Error rate as a percentage
sum(rate(http_requests_total{status=~"5.."}[5m]))
/ sum(rate(http_requests_total[5m])) * 100

# p99 latency from a Histogram
histogram_quantile(0.99,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
)

# Number of pods in a Deployment (a Gauge — no need for rate())
kube_deployment_status_replicas_available{deployment="node-api"}

# Alert rule: fire if error rate > 1% for 5 minutes
groups:
  - name: api.rules
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m]))
          / sum(rate(http_requests_total[5m])) > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "API error rate above 1%"
          description: "Error rate is {{ $value | humanizePercentage }} for the past 5m"`,
        },
      ],
    },
    {
      title: "Labels and cardinality",
      blocks: [
        {
          type: "paragraph",
          text: "Labels are key-value pairs attached to a metric that let you slice the data — for example, grouping error rates by HTTP method, path, and status code. Every unique combination of label values creates a separate time-series. This is cardinality. A metric with three labels each having 10 possible values has up to 1000 time-series. If you add a label like user_id with millions of unique values, you create millions of time-series and Prometheus runs out of memory. Keep label values low-cardinality: status code (handful of values), HTTP method (5 values), service name (tens of values). Never use request IDs, user IDs, or timestamps as labels.",
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "Good labels: method (GET, POST, DELETE), status (200, 404, 500), service (api, worker, cron), environment (prod, staging).",
            "Bad labels: user_id, request_id, email, IP address — these have too many unique values and will explode your cardinality.",
            "Use a Histogram rather than recording every individual latency value as a separate metric.",
            "Run promtool check rules against your alert rules before deploying — it catches PromQL syntax errors before they silence your alerts.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is the difference between push-based and pull-based metrics collection?",
      tag: "Prometheus",
      answer: [
        "Pull-based (Prometheus model): the monitoring server sends HTTP requests to each service's /metrics endpoint on a schedule. You know immediately if a target is down because the scrape fails. Easy to debug — curl /metrics shows exactly what Prometheus sees.",
        "Push-based (StatsD, InfluxDB, Datadog agent model): services send metrics to a central collector. Works better for short-lived jobs (like Lambda functions or batch scripts) that might exit before a pull scrape arrives. More complex to debug because you cannot easily verify what the collector received.",
      ].join("\n\n"),
      callout: "Prometheus pull is the default for long-running services. Use pushgateway for batch jobs.",
    },
    {
      question: "What is cardinality and why does high cardinality break Prometheus?",
      tag: "Cardinality",
      answer: [
        "Cardinality is the total number of unique time-series stored in Prometheus — calculated as the product of all unique values for each label combination. Prometheus keeps all active time-series in memory. If you add a label with 1 million unique values (like user_id), you create 1 million separate time-series for every metric that uses it. This exhausts memory and slows every query.",
        "Keep labels to a small, bounded set of values. If you need to trace individual user behavior, use logs or traces — not metrics labels.",
      ].join("\n\n"),
    },
    {
      question: "When should I alert on symptoms vs causes?",
      tag: "Alerting",
      answer: [
        "Alert on symptoms (what users experience): high error rate, high latency, service unavailable. These are always worth waking someone up for. Symptom-based alerts are reliable — if users are affected, the alert fires.",
        "Avoid alerting on causes (what is internally wrong): high CPU, memory pressure, disk filling. These are often false alarms — a process can use 90% CPU and still be serving users fine. Use cause-based metrics for dashboards and capacity planning, not paging alerts.",
      ].join("\n\n"),
      callout: "Page on symptoms, investigate causes. Never wake someone at 3am for high CPU if users are not affected.",
    },
    {
      question: "What is the difference between Counter and Gauge?",
      tag: "Metric types",
      answer: [
        "A Counter only ever increases — it represents a running total since the process started. Use rate() or increase() in PromQL to get the per-second rate or change over a time window. Counters reset to 0 when the process restarts, which is why you always use rate() rather than the raw value.",
        "A Gauge represents the current value — it can go up or down. Use it directly in PromQL without rate(). Examples: number of active database connections, current memory usage, queue depth. If a Gauge shows 500 connections right now, that is the actual current count.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Install Prometheus locally, add prom-client to a Node.js app, expose /metrics, and verify Prometheus is scraping it by checking Status → Targets in the Prometheus UI.",
    "Write a PromQL alert rule that fires when the HTTP 5xx error rate exceeds 1% for 5 consecutive minutes — test it by intentionally returning errors.",
    "Explain in one sentence why you should never use user_id as a Prometheus label.",
  ],
} satisfies RoadmapDayDetail;
