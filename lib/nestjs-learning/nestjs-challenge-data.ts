import type { RoadmapWeek } from "@/lib/challenge-data";

export const NESTJS_TOTAL_DAYS = 19;

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
    ],
  },
];
