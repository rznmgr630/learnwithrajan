import type { RoadmapWeek } from "@/lib/challenge-data";

export const NESTJS_TOTAL_DAYS = 60;

export const NESTJS_ROADMAP_WEEKS: RoadmapWeek[] = [
  {
    id: "nestjs-phase-0",
    title: {
      en: "Phase 0 — Backend & TypeScript Foundations",
      np: "Phase 0 — ब्याकएन्ड र TypeScript आधार",
      jp: "Phase 0 — バックエンドとTypeScriptの基礎",
    },
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_45%,#94a3b8)]",
    days: [
      {
        day: 1,
        title: {
          en: "Node.js foundations for NestJS",
          np: "NestJS का लागि Node.js आधार",
          jp: "NestJSのためのNode.js基礎",
        },
        tags: [
          { slug: "nodejs", label: { en: "Node.js", np: "Node.js", jp: "Node.js" } },
          { slug: "foundations", label: { en: "foundations", np: "आधार", jp: "基礎" } },
        ],
      },
      { day: 2, title: { en: "TypeScript for NestJS", np: "NestJS का लागि TypeScript", jp: "NestJSのためのTypeScript" }, tags: [{ slug: "typescript", label: { en: "TypeScript", np: "TypeScript", jp: "TypeScript" } }, { slug: "foundations", label: { en: "foundations", np: "आधार", jp: "基礎" } }] },
      { day: 3, title: { en: "Advanced TypeScript", np: "उन्नत TypeScript", jp: "高度なTypeScript" }, tags: [{ slug: "typescript", label: { en: "TypeScript", np: "TypeScript", jp: "TypeScript" } }, { slug: "advanced", label: { en: "advanced", np: "उन्नत", jp: "応用" } }] },
      { day: 4, title: { en: "HTTP Fundamentals", np: "HTTP आधार", jp: "HTTPの基礎" }, tags: [{ slug: "http", label: { en: "HTTP", np: "HTTP", jp: "HTTP" } }, { slug: "foundations", label: { en: "foundations", np: "आधार", jp: "基礎" } }] },
      { day: 5, title: { en: "REST API Fundamentals", np: "REST API आधार", jp: "REST APIの基礎" }, tags: [{ slug: "rest", label: { en: "REST", np: "REST", jp: "REST" } }, { slug: "api", label: { en: "API", np: "API", jp: "API" } }] },
    ],
  },
  {
    id: "nestjs-phase-1",
    title: {
      en: "Phase 1 — NestJS Fundamentals",
      np: "Phase 1 — NestJS आधार",
      jp: "Phase 1 — NestJSの基礎",
    },
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_65%,#22c55e)]",
    days: [
      { day: 6, title: { en: "What NestJS Is", np: "NestJS के हो", jp: "NestJSとは" }, tags: [{ slug: "nestjs", label: { en: "NestJS", np: "NestJS", jp: "NestJS" } }, { slug: "fundamentals", label: { en: "fundamentals", np: "आधार", jp: "基礎" } }] },
      { day: 7, title: { en: "NestJS Project Structure", np: "NestJS Project Structure", jp: "NestJS Project Structure" }, tags: [{ slug: "structure", label: { en: "structure", np: "structure", jp: "structure" } }, { slug: "cli", label: { en: "CLI", np: "CLI", jp: "CLI" } }] },
      { day: 8, title: { en: "Controllers", np: "Controllers", jp: "Controllers" }, tags: [{ slug: "controllers", label: { en: "controllers", np: "controllers", jp: "controllers" } }, { slug: "routes", label: { en: "routes", np: "routes", jp: "routes" } }] },
      { day: 9, title: { en: "Providers & Services", np: "Providers & Services", jp: "Providers & Services" }, tags: [{ slug: "providers", label: { en: "providers", np: "providers", jp: "providers" } }, { slug: "services", label: { en: "services", np: "services", jp: "services" } }] },
      { day: 10, title: { en: "Modules", np: "Modules", jp: "Modules" }, tags: [{ slug: "modules", label: { en: "modules", np: "modules", jp: "modules" } }, { slug: "fundamentals", label: { en: "fundamentals", np: "fundamentals", jp: "fundamentals" } }] },
      { day: 11, title: { en: "Dependency Injection", np: "Dependency Injection", jp: "Dependency Injection" }, tags: [{ slug: "dependency-injection", label: { en: "dependency-injection", np: "dependency-injection", jp: "dependency-injection" } }, { slug: "fundamentals", label: { en: "fundamentals", np: "fundamentals", jp: "fundamentals" } }] },
      { day: 12, title: { en: "Request Lifecycle", np: "Request Lifecycle", jp: "Request Lifecycle" }, tags: [{ slug: "lifecycle", label: { en: "lifecycle", np: "lifecycle", jp: "lifecycle" } }, { slug: "request", label: { en: "request", np: "request", jp: "request" } }] },
      { day: 13, title: { en: "DTOs", np: "DTOs", jp: "DTOs" }, tags: [{ slug: "dto", label: { en: "dto", np: "dto", jp: "dto" } }, { slug: "validation", label: { en: "validation", np: "validation", jp: "validation" } }] },
      { day: 14, title: { en: "Validation & Pipes", np: "Validation & Pipes", jp: "Validation & Pipes" }, tags: [{ slug: "validation", label: { en: "validation", np: "validation", jp: "validation" } }, { slug: "pipes", label: { en: "pipes", np: "pipes", jp: "pipes" } }] },
      { day: 15, title: { en: "NestJS Fundamentals Project", np: "NestJS Fundamentals Project", jp: "NestJS Fundamentals Project" }, tags: [{ slug: "project", label: { en: "project", np: "project", jp: "project" } }, { slug: "fundamentals", label: { en: "fundamentals", np: "fundamentals", jp: "fundamentals" } }] },
    ],
  },
  {
    id: "nestjs-phase-2",
    title: {
      en: "Phase 2 — Request Lifecycle & Application Architecture",
      np: "Phase 2 — अनुरोध जीवनचक्र र एप्लिकेसन आर्किटेक्चर",
      jp: "Phase 2 — リクエストライフサイクルとアプリケーションアーキテクチャ",
    },
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_75%,#f59e0b)]",
    days: [
      { day: 16, title: { en: "Middleware", np: "Middleware", jp: "Middleware" }, tags: [{ slug: "middleware", label: { en: "middleware", np: "middleware", jp: "middleware" } }, { slug: "lifecycle", label: { en: "lifecycle", np: "lifecycle", jp: "lifecycle" } }] },
      { day: 17, title: { en: "Guards", np: "Guards", jp: "Guards" }, tags: [{ slug: "guards", label: { en: "guards", np: "guards", jp: "guards" } }, { slug: "authorization", label: { en: "authorization", np: "authorization", jp: "authorization" } }] },
      { day: 18, title: { en: "Interceptors", np: "Interceptors", jp: "Interceptors" }, tags: [{ slug: "interceptors", label: { en: "interceptors", np: "interceptors", jp: "interceptors" } }, { slug: "lifecycle", label: { en: "lifecycle", np: "lifecycle", jp: "lifecycle" } }] },
      { day: 19, title: { en: "Exception Filters", np: "Exception Filters", jp: "Exception Filters" }, tags: [{ slug: "exceptions", label: { en: "exceptions", np: "exceptions", jp: "exceptions" } }, { slug: "filters", label: { en: "filters", np: "filters", jp: "filters" } }] },
      { day: 20, title: { en: "Execution Context", np: "Execution Context", jp: "Execution Context" }, tags: [{ slug: "execution-context", label: { en: "execution-context", np: "execution-context", jp: "execution-context" } }, { slug: "architecture", label: { en: "architecture", np: "architecture", jp: "architecture" } }] },
      { day: 21, title: { en: "Custom Decorators", np: "Custom Decorators", jp: "Custom Decorators" }, tags: [{ slug: "decorators", label: { en: "decorators", np: "decorators", jp: "decorators" } }, { slug: "metadata", label: { en: "metadata", np: "metadata", jp: "metadata" } }] },
      { day: 22, title: { en: "Configuration", np: "Configuration", jp: "Configuration" }, tags: [{ slug: "configuration", label: { en: "configuration", np: "configuration", jp: "configuration" } }, { slug: "environment", label: { en: "environment", np: "environment", jp: "environment" } }] },
      { day: 23, title: { en: "Application Bootstrap", np: "Application Bootstrap", jp: "Application Bootstrap" }, tags: [{ slug: "bootstrap", label: { en: "bootstrap", np: "bootstrap", jp: "bootstrap" } }, { slug: "architecture", label: { en: "architecture", np: "architecture", jp: "architecture" } }] },
      { day: 24, title: { en: "Lifecycle Events", np: "Lifecycle Events", jp: "Lifecycle Events" }, tags: [{ slug: "lifecycle", label: { en: "lifecycle", np: "lifecycle", jp: "lifecycle" } }, { slug: "shutdown", label: { en: "shutdown", np: "shutdown", jp: "shutdown" } }] },
      { day: 25, title: { en: "Architecture Project", np: "Architecture Project", jp: "Architecture Project" }, tags: [{ slug: "architecture", label: { en: "architecture", np: "architecture", jp: "architecture" } }, { slug: "project", label: { en: "project", np: "project", jp: "project" } }] },
    ],
  },
  {
    id: "nestjs-phase-3",
    title: {
      en: "Phase 3 — Database & Persistence",
      np: "Phase 3 — Database & Persistence",
      jp: "Phase 3 — Database & Persistence",
    },
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_85%,#8b5cf6)]",
    days: [
      { day: 26, title: { en: "PostgreSQL Fundamentals", np: "PostgreSQL Fundamentals", jp: "PostgreSQL Fundamentals" }, tags: [{ slug: "postgresql", label: { en: "PostgreSQL", np: "PostgreSQL", jp: "PostgreSQL" } }, { slug: "database", label: { en: "database", np: "database", jp: "database" } }] },
      { day: 27, title: { en: "TypeORM Fundamentals", np: "TypeORM Fundamentals", jp: "TypeORM Fundamentals" }, tags: [{ slug: "typeorm", label: { en: "TypeORM", np: "TypeORM", jp: "TypeORM" } }, { slug: "database", label: { en: "database", np: "database", jp: "database" } }] },
      { day: 28, title: { en: "Entity Relationships", np: "Entity Relationships", jp: "Entity Relationships" }, tags: [{ slug: "typeorm", label: { en: "TypeORM", np: "TypeORM", jp: "TypeORM" } }, { slug: "relationships", label: { en: "relationships", np: "relationships", jp: "relationships" } }] },
      { day: 29, title: { en: "Repository Pattern", np: "Repository Pattern", jp: "Repository Pattern" }, tags: [{ slug: "repository", label: { en: "repository", np: "repository", jp: "repository" } }, { slug: "architecture", label: { en: "architecture", np: "architecture", jp: "architecture" } }] },
      { day: 30, title: { en: "Advanced Queries", np: "Advanced Queries", jp: "Advanced Queries" }, tags: [{ slug: "queries", label: { en: "queries", np: "queries", jp: "queries" } }, { slug: "typeorm", label: { en: "TypeORM", np: "TypeORM", jp: "TypeORM" } }] },
      { day: 31, title: { en: "Database Migrations", np: "Database Migrations", jp: "Database Migrations" }, tags: [{ slug: "migrations", label: { en: "migrations", np: "migrations", jp: "migrations" } }, { slug: "database", label: { en: "database", np: "database", jp: "database" } }] },
      { day: 32, title: { en: "Transactions", np: "Transactions", jp: "Transactions" }, tags: [{ slug: "transactions", label: { en: "transactions", np: "transactions", jp: "transactions" } }, { slug: "database", label: { en: "database", np: "database", jp: "database" } }] },
      { day: 33, title: { en: "Database Performance", np: "Database Performance", jp: "Database Performance" }, tags: [{ slug: "performance", label: { en: "performance", np: "performance", jp: "performance" } }, { slug: "database", label: { en: "database", np: "database", jp: "database" } }] },
      { day: 34, title: { en: "Prisma", np: "Prisma", jp: "Prisma" }, tags: [{ slug: "prisma", label: { en: "Prisma", np: "Prisma", jp: "Prisma" } }, { slug: "database", label: { en: "database", np: "database", jp: "database" } }] },
      { day: 35, title: { en: "Persistence Architecture", np: "Persistence Architecture", jp: "Persistence Architecture" }, tags: [{ slug: "architecture", label: { en: "architecture", np: "architecture", jp: "architecture" } }, { slug: "persistence", label: { en: "persistence", np: "persistence", jp: "persistence" } }] },
    ],
  },
  {
    id: "nestjs-phase-4",
    title: { en: "Phase 4 — Authentication & Authorization", np: "Phase 4 — Authentication & Authorization", jp: "Phase 4 — Authentication & Authorization" },
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_90%,#ec4899)]",
    days: [
      { day: 36, title: { en: "Authentication Architecture", np: "Authentication Architecture", jp: "Authentication Architecture" }, tags: [] }, { day: 37, title: { en: "Passport", np: "Passport", jp: "Passport" }, tags: [] }, { day: 38, title: { en: "JWT", np: "JWT", jp: "JWT" }, tags: [] }, { day: 39, title: { en: "Password Security", np: "Password Security", jp: "Password Security" }, tags: [] }, { day: 40, title: { en: "RBAC", np: "RBAC", jp: "RBAC" }, tags: [] }, { day: 41, title: { en: "ABAC", np: "ABAC", jp: "ABAC" }, tags: [] }, { day: 42, title: { en: "OAuth 2.0", np: "OAuth 2.0", jp: "OAuth 2.0" }, tags: [] }, { day: 43, title: { en: "OpenID Connect", np: "OpenID Connect", jp: "OpenID Connect" }, tags: [] }, { day: 44, title: { en: "Authentication Security", np: "Authentication Security", jp: "Authentication Security" }, tags: [] }, { day: 45, title: { en: "Authentication Project", np: "Authentication Project", jp: "Authentication Project" }, tags: [] },
    ],
  },
  { id: "nestjs-phase-5", title: { en: "Phase 5 — Production REST API Engineering", np: "Phase 5 — Production REST API Engineering", jp: "Phase 5 — Production REST API Engineering" }, dotClass: "bg-[var(--accent)]", days: [{ day: 46, title: { en: "API Architecture", np: "API Architecture", jp: "API Architecture" }, tags: [] }, { day: 47, title: { en: "Pagination", np: "Pagination", jp: "Pagination" }, tags: [] }, { day: 48, title: { en: "Filtering & Searching", np: "Filtering & Searching", jp: "Filtering & Searching" }, tags: [] }, { day: 49, title: { en: "API Versioning", np: "API Versioning", jp: "API Versioning" }, tags: [] }, { day: 50, title: { en: "OpenAPI & Swagger", np: "OpenAPI & Swagger", jp: "OpenAPI & Swagger" }, tags: [] }, { day: 51, title: { en: "Error Handling", np: "Error Handling", jp: "Error Handling" }, tags: [] }, { day: 52, title: { en: "Idempotency", np: "Idempotency", jp: "Idempotency" }, tags: [] }, { day: 53, title: { en: "Rate Limiting", np: "Rate Limiting", jp: "Rate Limiting" }, tags: [] }, { day: 54, title: { en: "Caching", np: "Caching", jp: "Caching" }, tags: [] }, { day: 55, title: { en: "Production REST API Project", np: "Production REST API Project", jp: "Production REST API Project" }, tags: [] }] },
  { id: "nestjs-phase-6", title: { en: "Phase 6 — Redis, Caching & Background Jobs", np: "Phase 6 — Redis, Caching & Background Jobs", jp: "Phase 6 — Redis, Caching & Background Jobs" }, dotClass: "bg-[color-mix(in_oklab,var(--accent)_70%,#ef4444)]", days: [{ day: 56, title: { en: "Advanced Redis: Pub/Sub, Streams, Lua Scripting & Redlock", np: "Advanced Redis: Pub/Sub, Streams, Lua Scripting & Redlock", jp: "Advanced Redis: Pub/Sub, Streams, Lua Scripting & Redlock" }, tags: [] }, { day: 57, title: { en: "Redis + NestJS: Caching, Invalidations & Architecture", np: "Redis + NestJS: Caching, Invalidations & Architecture", jp: "Redis + NestJS: Caching, Invalidations & Architecture" }, tags: [] }, { day: 58, title: { en: "Message Queues & Background Processing with BullMQ", np: "Message Queues & Background Processing with BullMQ", jp: "Message Queues & Background Processing with BullMQ" }, tags: [] }, { day: 59, title: { en: "Deep Dive into BullMQ: States, Lifecycle & Advanced Scheduling", np: "Deep Dive into BullMQ: States, Lifecycle & Advanced Scheduling", jp: "Deep Dive into BullMQ: States, Lifecycle & Advanced Scheduling" }, tags: [] }, { day: 60, title: { en: "Background Processing Capstone Project", np: "Background Processing Capstone Project", jp: "Background Processing Capstone Project" }, tags: [] }] },
];
