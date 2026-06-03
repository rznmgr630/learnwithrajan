import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_30_DETAIL = {
  overview: [
    "Day 30 is about the work that goes around the code — the decisions you record, the documentation you write, and the story you tell about what you have built. Architecture Decision Records (ADRs) give your future self and your teammates the context behind every significant technical choice. Good documentation is what lets a new engineer contribute in their first week instead of their third month.",
    "Today covers how to write ADRs, how to document an API with OpenAPI/Swagger, what a strong backend portfolio looks like, and where to go next — the tracks you can follow once you have finished this course.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "mAG6S-MzINs", title: "What Is An Architecture Decision Record (ADR)?" },
      ],
    },
    {
      title: "Architecture Decision Records",
      blocks: [
        {
          type: "paragraph",
          text: "An Architecture Decision Record (ADR) is a short document that captures an important technical decision — what was decided, why it was decided, and what alternatives were considered. The most common question on a codebase is 'why is this done this way?' ADRs answer that question before someone asks it. They are checked into the repository alongside the code they describe, so the decision and the context that drove it stay together.",
        },
        {
          type: "code",
          title: "ADR template — the Michael Nygard format (the most widely used)",
          code: `# ADR-001: Use PostgreSQL as the primary database

**Date:** 2024-01-15
**Status:** Accepted
**Deciders:** Alice (Tech Lead), Bob (Backend), Carol (DevOps)

## Context

We need a primary data store for the URL shortener service. The service needs:
- Reliable ACID transactions (click counts must be accurate)
- Full-text and pattern queries on URLs
- Fast reads on the redirect hot path (target: < 10ms p99)
- A team that already has PostgreSQL operational knowledge

## Decision

We will use PostgreSQL 16 on AWS RDS Multi-AZ.

## Consequences

**Good:**
- Team already knows PostgreSQL — no learning curve for operations
- Strong ACID guarantees mean click counts are always correct
- Excellent index support (B-tree for exact lookups, GIN for URL search)
- RDS handles backups, patching, and failover automatically

**Bad:**
- Adds a managed database cost (~$150/month for the dev instance)
- Read replicas require code changes for read-write routing (Day 12 pattern)

## Alternatives considered

1. **MongoDB** — rejected: the data is relational (users own links, links have clicks); a document model adds complexity without benefit.
2. **DynamoDB** — rejected: our team has no DynamoDB experience; single-table design would need significant upfront investment.
3. **SQLite (for simplicity)** — rejected: does not support concurrent writes from multiple API instances.`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "Store ADRs in a docs/decisions/ or adr/ folder at the root of the repository. Number them sequentially (ADR-001, ADR-002). Never delete or edit old ADRs — if a decision is superseded, mark it as superseded and write a new ADR.",
            "Write an ADR for decisions that are hard to reverse: database choice, authentication strategy, message queue selection, API versioning approach, monorepo vs polyrepo. Skip ADRs for reversible tactical choices.",
            "The status field matters: Proposed (under discussion), Accepted (in use), Deprecated (still in use but no longer recommended), Superseded (replaced by a later ADR).",
            "Keep ADRs short — a good ADR fits on one page. The goal is capturing the thinking at the time of the decision, not writing a design document. Future readers want context, not a novel.",
          ],
        },
      ],
    },
    {
      title: "API documentation with OpenAPI",
      blocks: [
        {
          type: "paragraph",
          text: "OpenAPI (formerly Swagger) is the standard for describing REST APIs in a machine-readable format. An OpenAPI spec describes every endpoint, its parameters, request bodies, response schemas, and authentication requirements. From the spec you can generate interactive documentation (Swagger UI), client SDKs, mock servers, and integration tests. The alternative — keeping docs in a wiki that drifts from the actual API — is a maintenance burden and a source of confusion.",
        },
        {
          type: "code",
          title: "Swagger UI setup with swagger-jsdoc in Express",
          code: `import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const spec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "URL Shortener API",
      version: "1.0.0",
      description: "Create and manage short links",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"],  // reads JSDoc comments from route files
});

// Mount Swagger UI at /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

// ─── Route documentation example ─────────────────────────────────────────────
// In src/routes/links.ts:

/**
 * @openapi
 * /api/links:
 *   post:
 *     summary: Create a short link
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [url]
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/very/long/path
 *               customSlug:
 *                 type: string
 *                 pattern: '^[a-z0-9-]{3,20}$'
 *                 example: my-link
 *     responses:
 *       201:
 *         description: Short link created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Link'
 *       400:
 *         description: Invalid URL or slug already taken
 *       401:
 *         description: Not authenticated
 */
router.post("/", authenticate, validate(createLinkSchema), createLink);`,
        },
        {
          type: "table",
          headers: ["Documentation approach", "Pros", "Cons", "Best for"],
          rows: [
            ["JSDoc comments in route files (swagger-jsdoc)", "Docs stay close to code — easier to keep in sync; one source of truth per route", "Verbose JSDoc comments clutter route files; requires discipline to update on every change", "Small to medium APIs where you want docs auto-generated from existing code"],
            ["Code-first with tsoa or NestJS decorators", "Fully automated — types and decorators generate both runtime validation and the OpenAPI spec", "Opinionated framework setup; harder to add to an existing Express app", "Greenfield TypeScript APIs where you want types, validation, and docs from one source"],
            ["Spec-first (write openapi.yaml manually)", "The spec is the contract — build the API to match it; easy to share with frontend teams before building", "Manual maintenance; spec and code can drift; more upfront work", "APIs consumed by external parties where the contract must be agreed before implementation"],
            ["Postman collection (no OpenAPI)", "Easy to create; great for manual testing; can be auto-published", "Not machine-readable for code generation; hard to version-control meaningfully", "Internal APIs or prototypes where SDKs and strict contracts are not needed"],
          ],
        },
      ],
    },
    {
      title: "Writing a strong README",
      blocks: [
        {
          type: "paragraph",
          text: "The README is the first thing anyone reads about your project — a recruiter, an open-source contributor, or a new team member on their first day. A good README answers five questions in the first thirty seconds: what does this do, who is it for, how do I run it, how do I deploy it, and how do I contribute?",
        },
        {
          type: "code",
          title: "README structure for a backend API project",
          code: `# URL Shortener API

A production-ready REST API for creating and tracking short links.
Built with Node.js, Express, PostgreSQL, and Docker.

## Features
- Create short links with optional custom slugs
- Track click counts per link
- JWT authentication with refresh token rotation
- Rate limiting (100 requests/minute per IP)
- OpenAPI documentation at /docs

## Quick start

\`\`\`bash
# 1. Clone and install
git clone https://github.com/yourname/url-shortener
cd url-shortener && npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env and add DATABASE_URL, JWT_SECRET, etc.

# 3. Start with Docker Compose (includes PostgreSQL)
docker compose up

# 4. Run migrations
npm run db:migrate

# 5. The API is live at http://localhost:3000
# Swagger docs at http://localhost:3000/docs
\`\`\`

## Architecture
- **Runtime:** Node.js 20, Express 5
- **Database:** PostgreSQL 16 (connection pooling via pg)
- **Auth:** JWT (HS256, 15m access + 7d refresh token)
- **Caching:** Redis for rate limiting counters
- **Monitoring:** Prometheus metrics at /metrics, pino structured logging
- See docs/decisions/ for Architecture Decision Records

## API reference
Full OpenAPI spec: [http://localhost:3000/docs](http://localhost:3000/docs)

| Method | Path             | Auth | Description               |
|--------|------------------|------|---------------------------|
| POST   | /api/links       | ✅   | Create a short link       |
| GET    | /:code           | ❌   | Redirect to original URL  |
| GET    | /api/links       | ✅   | List your links           |
| DELETE | /api/links/:id   | ✅   | Delete a link             |
| GET    | /health          | ❌   | Liveness check            |

## Running tests
\`\`\`bash
npm test                  # unit + integration tests
npm run test:coverage     # with coverage report (target: 80% lines)
\`\`\`

## Deployment
The service is containerized. See the CI/CD pipeline in .github/workflows/ci.yml.
Requires: DATABASE_URL, JWT_SECRET, REDIS_URL, PORT in the environment.`,
        },
      ],
    },
    {
      title: "Your portfolio story",
      blocks: [
        {
          type: "paragraph",
          text: "A backend portfolio is not just a list of projects — it is evidence that you can think about systems, make deliberate decisions, and ship things that work under real conditions. Recruiters and senior engineers look for three things: that you understand the trade-offs you made, that you know how your system fails and how to recover, and that you can explain the technical decisions in plain language.",
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "For each project, write one paragraph explaining the hardest technical decision you made and why. Not 'I used PostgreSQL' — 'I chose PostgreSQL over DynamoDB because the data has many-to-many relationships and our team has no DynamoDB experience. We would have needed a complex single-table design that would be hard to maintain.' That paragraph is worth more than a feature list.",
            "Include the things that went wrong and how you fixed them. Showing a post-mortem or an explanation of a bug you debugged signals maturity far more than a polished feature list.",
            "Link to the ADRs. A repository with docs/decisions/ full of thoughtful ADRs stands out immediately — very few junior portfolios have them.",
            "Demonstrate observability. A screenshot of a Grafana dashboard showing your service metrics, or a Prometheus alert rule, shows you built for operations — not just for localhost.",
            "Keep it running. A recruiter who clicks your live demo link and gets a 504 will not give you the benefit of the doubt. Use a free tier (Railway, Render, Fly.io) to keep at least one project live.",
          ],
        },
      ],
    },
    {
      title: "What to learn next",
      blocks: [
        {
          type: "table",
          caption: "Pick the track that matches where you want to go — do not try to go in all directions at once.",
          headers: ["Track", "Why", "Starting point"],
          rows: [
            ["TypeScript mastery", "Catch type errors at compile time; required at most companies; better IDE support. Dramatically reduces the class of runtime bugs.", "Add tsconfig.json and strict mode to your capstone project; fix every type error; add Zod for full type-safe validation"],
            ["System design", "The skill that unlocks senior engineering roles. Understanding how to design distributed systems at scale is what separates mid-level from senior.", "Read 'Designing Data-Intensive Applications' by Martin Kleppmann. Practice system design questions (design Twitter, URL shortener at 10B requests/day)."],
            ["AWS in depth", "Cloud is where backend runs. Deep AWS knowledge (IAM, VPC, ECS, RDS, ElastiCache, SQS, Lambda) is required for senior backend and all DevOps roles.", "AWS Solutions Architect Associate certification. Build the capstone project on AWS instead of Docker Compose."],
            ["gRPC and microservices", "Learn how services communicate in large engineering orgs — Protobuf contracts, service meshes, event-driven architectures with Kafka or NATS.", "Build a second service that calls the URL shortener via gRPC instead of REST. Add a Kafka producer for the click event."],
            ["Database internals", "Understanding how PostgreSQL executes queries, how MVCC works, and how indexes are built lets you fix performance issues that tools cannot diagnose.", "Read the PostgreSQL documentation cover to cover. Work through 'Use The Index, Luke'. Profile your capstone database with pg_stat_statements."],
            ["SRE and platform engineering", "Build the infrastructure layer — Kubernetes operators, service meshes, internal developer platforms, observability pipelines.", "Get Kubernetes certified (CKA). Contribute to an open-source Kubernetes project. Read 'Site Reliability Engineering' (Google SRE book — free online)."],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What should I write an ADR for and what should I skip?",
      tag: "ADRs",
      answer: [
        "Write an ADR for decisions that are significant, hard to reverse, and have real alternatives that were genuinely considered: choosing a database, picking an authentication strategy, deciding on a monorepo vs multi-repo structure, selecting a message queue, choosing a deployment platform.",
        "Skip ADRs for decisions that are trivially reversible, have no real alternatives, or are industry defaults (using npm over other package managers when there is no real debate, picking Express because the team knows it and there was no other contender). The test: if someone reads this ADR in two years, will the context it provides be valuable?",
      ].join("\n\n"),
      callout: "One well-written ADR per quarter is better than twenty skimpy ones. Quality over quantity.",
    },
    {
      question: "What is the difference between OpenAPI 2.0 (Swagger) and OpenAPI 3.0?",
      tag: "API documentation",
      answer: [
        "Swagger 2.0 and OpenAPI 3.0 describe the same concept — a machine-readable REST API specification — but OpenAPI 3.0 has a cleaner structure: a separate components section for reusable schemas, better support for multiple servers, improved content negotiation, and links between operations. If you are starting a new project, always use OpenAPI 3.0.",
        "The tooling (Swagger UI, code generators) supports both versions. The spec is JSON or YAML — store it in the repository at docs/openapi.yaml or generate it from code annotations with swagger-jsdoc.",
      ].join("\n\n"),
    },
    {
      question: "How long should a README be?",
      tag: "Documentation",
      answer: [
        "Long enough to answer the five core questions (what, who, how to run, how to deploy, how to contribute) and short enough that someone reads the whole thing. For a typical backend API project, that is usually 100–300 lines.",
        "The most common mistake is a README that is just a list of technologies with no explanation of how to actually run the project. The second most common mistake is a README so long that it gets ignored. If you have extensive docs, link to them from the README rather than embedding everything.",
      ].join("\n\n"),
    },
    {
      question: "How do I present a backend project if I do not have a frontend?",
      tag: "Portfolio",
      answer: [
        "A backend project without a frontend is completely normal — many backend engineers build API-only systems. Present it with: a clear README with the API endpoints table, a live Swagger UI demo (deploy the /docs endpoint), a Postman collection that shows working requests, and a short demo video (2–3 minutes) of you calling the API and explaining the interesting technical decisions.",
        "If you want to add a minimal frontend, tools like Insomnia, Postman, or a simple curl-based shell script can demonstrate the API without building a full UI. Alternatively, write a short CLI tool in Node.js that calls your API — that itself demonstrates backend skills.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Write at least two ADRs for your capstone project — one for the database choice and one for the authentication strategy. Store them in docs/decisions/.",
    "Add Swagger UI to your capstone API using swagger-jsdoc. Document all five endpoints with request bodies, response schemas, and authentication requirements. Verify the /docs page renders correctly.",
    "Update your capstone README to include: a one-paragraph project description, the quick start commands, the API endpoint table, and a section explaining the hardest technical decision you made and why.",
  ],
} satisfies RoadmapDayDetail;
