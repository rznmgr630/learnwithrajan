import type { RoadmapWeek } from "@/lib/challenge-data";

export const NESTJS_TOTAL_DAYS = 1;

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
    ],
  },
];
