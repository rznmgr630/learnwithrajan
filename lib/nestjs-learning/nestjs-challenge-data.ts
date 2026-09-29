import type { RoadmapWeek } from "@/lib/challenge-data";

export const NESTJS_TOTAL_DAYS = 4;

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
    ],
  },
];
