import type { RoadmapWeek } from "@/lib/challenge-data";

export const NESTJS_TOTAL_DAYS = 9;

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
      { day: 7, title: { en: "NestJS Project Structure", np: "NestJS Project Structure", jp: "NestJS Project Structure" }, tags: [{ slug: "structure", label: { en: "structure", np: "structure", jp: "structure" } }, { slug: "structure", label: { en: "structure", np: "structure", jp: "structure" } }] },
      { day: 8, title: { en: "Controllers", np: "Controllers", jp: "Controllers" }, tags: [{ slug: "controllers", label: { en: "controllers", np: "controllers", jp: "controllers" } }, { slug: "routes", label: { en: "routes", np: "routes", jp: "routes" } }] },
      { day: 9, title: { en: "Providers & Services", np: "Providers & Services", jp: "Providers & Services" }, tags: [{ slug: "providers", label: { en: "providers", np: "providers", jp: "providers" } }, { slug: "services", label: { en: "services", np: "services", jp: "services" } }] },
    ],
  },
];
