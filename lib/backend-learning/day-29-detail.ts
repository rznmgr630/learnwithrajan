import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_29_DETAIL = {
  overview: [
    "Day 29 is your capstone. Every topic from the past four weeks — HTTP, databases, auth, Docker, CI/CD, observability, security, caching — comes together into one production-ready service. The goal is not to learn something new but to verify that you can apply everything you have learned from a blank directory to a running, monitored, secure service.",
    "Work through the pre-ship checklist, then build and deploy the capstone API. Each checklist item points back to a specific day in the course — if anything is unclear, that is a signal of what to revisit before moving on.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "FqUmAS_GZfQ", title: "Node.js & Express REST API + Docker Tutorial" },
      ],
    },
    {
      title: "Production-ready service checklist",
      blocks: [
        {
          type: "table",
          caption: "Every item in this checklist corresponds to content from days 1–28 — check each one off before shipping.",
          headers: ["Area", "Checklist item", "Day covered"],
          rows: [
            ["HTTP & API design", "All routes use correct HTTP methods and status codes. No verb-based paths like /getUser.", "Day 1"],
            ["Configuration", "All secrets and env vars are loaded from environment, not hardcoded. App exits on startup if required vars are missing.", "Day 20"],
            ["Authentication", "Passwords are hashed with bcrypt. JWTs specify algorithm explicitly and have short TTL. Rate limiting on login endpoint.", "Days 11, 26"],
            ["Authorization", "Every protected route checks that the user has permission for that specific resource (not just that they are logged in).", "Days 11, 25"],
            ["Validation", "Every request body and query parameter is validated with Zod or Joi at the route level. Unknown fields are stripped.", "Day 9"],
            ["Error handling", "A central error handler returns consistent error shapes. Stack traces never reach the client in production.", "Day 12"],
            ["Logging", "Structured JSON logging (pino). Every log line includes a correlation ID. No secrets or PII in logs.", "Day 7, 23"],
            ["Database", "Using a connection pool. FK columns have indexes. Migrations use the expand-contract pattern. Connection string is in env.", "Days 3, 9, 10"],
            ["Security headers", "helmet() is applied. Rate limiting is configured. CORS is allowlisted to specific origins only.", "Days 25, 26"],
            ["Health check", "GET /health returns 200 quickly (no DB call). GET /ready checks all dependencies. Used by load balancer.", "Day 8"],
            ["Graceful shutdown", "SIGTERM handler drains in-flight requests, closes DB connections, and exits cleanly within 30 seconds.", "Days 14, 15"],
            ["Container", "Multi-stage Dockerfile. Runs as non-root user. Pinned base image. HEALTHCHECK instruction included.", "Day 16"],
            ["CI/CD", "Pipeline runs lint → type-check → tests → build → deploy. Tests must pass before any deploy. Secrets in CI environment secrets.", "Day 17"],
            ["Monitoring", "HTTP request rate, error rate, and p99 latency exported as Prometheus metrics. Alert fires if error rate > 1%.", "Day 22"],
            ["Distributed tracing", "OpenTelemetry auto-instrumentation enabled. Correlation ID propagated across services.", "Day 23"],
          ],
        },
      ],
    },
    {
      title: "Production service structure",
      blocks: [
        {
          type: "code",
          title: "Recommended folder layout for a production Node.js API",
          code: `src/
├── config.ts           ← validated env vars (Zod schema — fail fast on startup)
├── server.ts           ← creates Express app, registers middleware and routes
├── index.ts            ← starts the server, handles SIGTERM graceful shutdown
│
├── routes/
│   ├── users.ts        ← /api/users route handlers
│   ├── orders.ts       ← /api/orders route handlers
│   └── health.ts       ← /health and /ready endpoints
│
├── services/
│   ├── user-service.ts ← business logic (does not know about HTTP)
│   └── order-service.ts
│
├── db/
│   ├── client.ts       ← database connection pool
│   └── migrations/     ← numbered migration files (up/down)
│
├── middleware/
│   ├── auth.ts         ← JWT verification middleware
│   ├── validate.ts     ← reusable Zod validation middleware factory
│   ├── logger.ts       ← request logger with correlation ID
│   └── error-handler.ts ← central Express error handler (4-argument form)
│
├── schemas/
│   ├── user.ts         ← Zod schemas for user input
│   └── order.ts        ← Zod schemas for order input
│
└── lib/
    ├── metrics.ts      ← Prometheus counters, histograms
    └── tracing.ts      ← OpenTelemetry SDK initialization

# Rule: routes orchestrate, services contain business logic,
# db/ handles persistence. Nothing leaks across these boundaries.`,
        },
        {
          type: "paragraph",
          text: "The key discipline is keeping layers separate: routes know about HTTP (req, res), services know about business rules (create user, process order), and the database layer knows about persistence (SQL queries, connection pools). When a service function needs to call another service, it imports it directly — it does not go through the HTTP layer. This makes unit testing clean because you can test a service function without spinning up an HTTP server.",
        },
      ],
    },
    {
      title: "Wiring it together — the startup sequence",
      blocks: [
        {
          type: "code",
          title: "index.ts — production startup with graceful shutdown",
          code: `// index.ts — the entry point
// Import tracing FIRST so instrumentation wraps everything else
import "./lib/tracing";

import { config } from "./config";          // validate env vars — exit if invalid
import { db } from "./db/client";           // create connection pool
import { createApp } from "./server";       // build Express app
import { logger } from "./middleware/logger";

async function main() {
  // 1. Verify database is reachable before accepting traffic
  try {
    await db.raw("SELECT 1");
    logger.info("Database connected");
  } catch (err) {
    logger.fatal({ err }, "Database connection failed on startup — exiting");
    process.exit(1);
  }

  // 2. Start the HTTP server
  const app = createApp();
  const server = app.listen(config.PORT, () => {
    logger.info({ port: config.PORT, env: config.NODE_ENV }, "Server started");
  });

  // 3. Graceful shutdown — drain requests before exiting
  const shutdown = (signal: string) => {
    logger.info({ signal }, "Shutdown signal received");
    server.close(async () => {
      await db.destroy();       // close all DB connections
      logger.info("Server closed cleanly");
      process.exit(0);
    });
    // Force exit if drain takes too long
    setTimeout(() => {
      logger.error("Drain timeout — forcing exit");
      process.exit(1);
    }, 25_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT",  () => shutdown("SIGINT"));
}

main();`,
        },
        {
          type: "code",
          title: "server.ts — middleware stack in the correct order",
          code: `import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { requestLogger } from "./middleware/logger";
import { errorHandler } from "./middleware/error-handler";
import { register } from "prom-client";
import usersRouter from "./routes/users";
import ordersRouter from "./routes/orders";
import healthRouter from "./routes/health";

export function createApp() {
  const app = express();

  // ── Security middleware (before everything) ────────────────────────────────
  app.use(helmet());                          // security headers
  app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(","), credentials: true }));
  app.use(rateLimit({ windowMs: 60_000, max: 200 }));  // global rate limit

  // ── Request parsing ────────────────────────────────────────────────────────
  app.use(express.json({ limit: "1mb" }));    // parse JSON bodies
  app.use(express.urlencoded({ extended: false }));

  // ── Logging (after parsing, captures body size) ───────────────────────────
  app.use(requestLogger);

  // ── Routes ────────────────────────────────────────────────────────────────
  app.use("/health", healthRouter);           // no auth on health check
  app.use("/metrics", async (_req, res) => {  // Prometheus scrape endpoint
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  });
  app.use("/api/users",  usersRouter);
  app.use("/api/orders", ordersRouter);

  // ── Error handler (must be last, after all routes) ────────────────────────
  app.use(errorHandler);

  return app;
}`,
        },
      ],
    },
    {
      title: "Capstone project brief",
      blocks: [
        {
          type: "paragraph",
          text: "Build and ship a URL shortener API — it is small enough to complete in one day but touches every production concern covered in the course. The service takes a long URL and returns a short code; visiting the short code redirects to the original URL. Analytics track how many times each link was clicked.",
        },
        {
          type: "list",
          variant: "number",
          items: [
            "POST /api/links — create a short link (requires auth). Body: { url, customSlug? }. Returns the short code and full short URL. Validate the URL is a valid HTTPS URL.",
            "GET /:code — redirect to the original URL (public). Increment a click counter atomically. Return 301 for permanent links, 302 for temporary. Return 404 with a JSON error if the code does not exist.",
            "GET /api/links — list the authenticated user's links with click counts (requires auth, paginated).",
            "DELETE /api/links/:id — delete a link owned by the authenticated user (requires auth + ownership check).",
            "GET /health and GET /ready — health check endpoints used by the load balancer.",
            "Instrument the redirect endpoint with a Prometheus counter (redirects_total labeled by code) and a histogram for redirect latency.",
            "Write a Dockerfile, a docker-compose.yml with the app and a PostgreSQL database, and a GitHub Actions CI workflow that runs tests and builds the image.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "How do I know when a service is truly production-ready?",
      tag: "Production readiness",
      answer: [
        "Production readiness is not a binary state — it is a set of concerns addressed well enough for your current scale and risk tolerance. A rough test: could someone who has never seen the codebase debug an incident at 3am using only the runbook, logs, and dashboards? If yes, you are in good shape.",
        "Minimum production readiness: secrets not in code, structured logging with correlation IDs, a health check endpoint, graceful shutdown handling SIGTERM, a working CI pipeline that blocks deploys on test failures, and at least one alert that fires before users start complaining.",
      ].join("\n\n"),
    },
    {
      question: "Should routes contain business logic?",
      tag: "Architecture",
      answer: [
        "No. Route handlers should do three things only: parse and validate the request, call a service function, and format the response. Business logic belongs in service functions, which can be tested without an HTTP server.",
        "If your route handler is more than 20 lines or contains conditional logic beyond input validation, extract the logic into a service function. The test for this: can you call the core logic from a unit test without going through Express? If not, it is in the wrong place.",
      ].join("\n\n"),
    },
    {
      question: "What order should middleware run in?",
      tag: "Express middleware",
      answer: [
        "Security middleware first (helmet, CORS, rate limiting) — reject bad requests before doing any work. Then request parsing (express.json) — you need to parse the body before you can validate or log it. Then logging — after parsing so you can include body size. Then routes. Error handler last — it must come after all routes so next(err) from any route reaches it.",
        "A wrong order causes subtle bugs: if express.json() runs after your validation middleware, req.body is always undefined. If helmet() runs after your routes, some responses are already sent without security headers.",
      ].join("\n\n"),
    },
    {
      question: "How do I test the graceful shutdown behavior?",
      tag: "Testing",
      answer: [
        "Start the server, send a request with an artificial delay (setTimeout in the handler), and then send SIGTERM to the process before the response completes. A correct graceful shutdown lets the in-flight request finish and then exits. An incorrect one drops the request mid-response.",
        "In practice: curl the slow endpoint in one terminal, then in another terminal run kill -15 <pid>. Watch the first curl — it should complete successfully. The server should then exit. If the curl gets a connection reset, the shutdown is not graceful.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Build the URL shortener API using the checklist as a guide — implement all five endpoints, instrument with Prometheus, write a Dockerfile, and deploy it with a GitHub Actions CI workflow.",
    "Verify every item in the production checklist is implemented: run npm audit, curl /health and /ready, test SIGTERM handling, confirm all secrets come from environment variables.",
    "Write at least three integration tests using supertest: one for the happy path (create → redirect), one for a 404 on an unknown code, and one that verifies a user cannot delete another user's link.",
  ],
} satisfies RoadmapDayDetail;
