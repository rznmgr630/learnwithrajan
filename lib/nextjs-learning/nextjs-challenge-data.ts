import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDay, RoadmapDayDetail, RoadmapWeek } from "@/lib/challenge-data";
import { NEXTJS_DAY_0_DETAIL } from "@/lib/nextjs-learning/nextjs-day-0-detail";
import { NEXTJS_DAY_1_DETAIL } from "@/lib/nextjs-learning/nextjs-day-1-detail";
import { NEXTJS_DAY_2_DETAIL } from "@/lib/nextjs-learning/nextjs-day-2-detail";
import { NEXTJS_DAY_3_DETAIL } from "@/lib/nextjs-learning/nextjs-day-3-detail";
import { NEXTJS_DAY_4_DETAIL } from "@/lib/nextjs-learning/nextjs-day-4-detail";
import { NEXTJS_DAY_5_DETAIL } from "@/lib/nextjs-learning/nextjs-day-5-detail";
import { NEXTJS_DAY_6_DETAIL } from "@/lib/nextjs-learning/nextjs-day-6-detail";
import { NEXTJS_DAY_7_DETAIL } from "@/lib/nextjs-learning/nextjs-day-7-detail";
import { NEXTJS_DAY_8_DETAIL } from "@/lib/nextjs-learning/nextjs-day-8-detail";
import { NEXTJS_DAY_9_DETAIL } from "@/lib/nextjs-learning/nextjs-day-9-detail";
import { NEXTJS_DAY_10_DETAIL } from "@/lib/nextjs-learning/nextjs-day-10-detail";
import { NEXTJS_DAY_11_DETAIL } from "@/lib/nextjs-learning/nextjs-day-11-detail";
import { nextjsDayTitle, nextjsTags, nextjsWeekTitle } from "@/lib/nextjs-learning/nextjs-roadmap-i18n";

export const NEXTJS_CURRENT_DAY = 1;

export const NEXTJS_TOTAL_DAYS = 21;

const NEXTJS_DAY_DETAILS: Record<number, RoadmapDayDetail> = {
  0: NEXTJS_DAY_0_DETAIL,
  11: NEXTJS_DAY_1_DETAIL, 12: NEXTJS_DAY_2_DETAIL, 13: NEXTJS_DAY_3_DETAIL,
  14: NEXTJS_DAY_4_DETAIL, 15: NEXTJS_DAY_5_DETAIL, 16: NEXTJS_DAY_6_DETAIL,
  17: NEXTJS_DAY_7_DETAIL, 18: NEXTJS_DAY_8_DETAIL, 19: NEXTJS_DAY_9_DETAIL,
  20: NEXTJS_DAY_10_DETAIL, 21: NEXTJS_DAY_11_DETAIL,
};

function nextjsDayRow(day: number, tagSlugs: [string, string]): RoadmapDay {
  return {
    day,
    title: nextjsDayTitle(day),
    tags: nextjsTags(tagSlugs),
    detail: NEXTJS_DAY_DETAILS[day],
  };
}

export const NEXTJS_ROADMAP_WEEKS: RoadmapWeek[] = [
  {
    id: "nextjs-phase-0",
    title: nextjsWeekTitle("nextjs-phase-0"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_45%,#94a3b8)]",
    days: [nextjsDayRow(0, ["prerequisites", "web-fundamentals"])],
  },
  {
    id: "nextjs-phase-1",
    title: nextjsWeekTitle("nextjs-phase-1"),
    dotClass: "bg-[var(--accent)]",
    days: [
      nextjsDayRow(1, ["intro", "setup"]),
      nextjsDayRow(2, ["routing", "layouts"]),
      nextjsDayRow(3, ["styling", "tailwind"]),
      nextjsDayRow(4, ["routing", "layouts"]),
      nextjsDayRow(5, ["layouts", "error-handling"]),
    ],
  },
  {
    id: "nextjs-phase-2",
    title: nextjsWeekTitle("nextjs-phase-2"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_65%,#34d399)]",
    days: [
      nextjsDayRow(6, ["server-components", "rendering"]),
      nextjsDayRow(7, ["data-fetching", "caching"]),
      nextjsDayRow(8, ["forms", "server-actions"]),
      nextjsDayRow(9, ["auth", "next-auth"]),
      nextjsDayRow(10, ["api-routes", "zod"]),
    ],
  },
  {
    id: "nextjs-existing-course",
    title: nextjsWeekTitle("nextjs-existing-course"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_52%,#a78bfa)]",
    days: [
      nextjsDayRow(11, ["intro", "setup"]), nextjsDayRow(12, ["server-components", "rendering"]),
      nextjsDayRow(13, ["styling", "tailwind"]), nextjsDayRow(14, ["routing", "layouts"]),
      nextjsDayRow(15, ["navigation", "error-handling"]), nextjsDayRow(16, ["api-routes", "zod"]),
      nextjsDayRow(17, ["prisma", "database"]), nextjsDayRow(18, ["upload", "cloudinary"]),
      nextjsDayRow(19, ["auth", "next-auth"]), nextjsDayRow(20, ["email", "optimization"]),
      nextjsDayRow(21, ["deployment", "vercel"]),
    ],
  },
];

export function getAllNextjsRoadmapDays(): RoadmapDay[] {
  return NEXTJS_ROADMAP_WEEKS.flatMap((w) => w.days).sort((a, b) => a.day - b.day);
}

export function getNextjsRoadmapDayContext(dayNumber: number): { weekTitle: LocalizedString; day: RoadmapDay } | null {
  for (const week of NEXTJS_ROADMAP_WEEKS) {
    const day = week.days.find((d) => d.day === dayNumber);
    if (day) return { weekTitle: week.title, day };
  }
  return null;
}

const NEXTJS_DEFAULT_DETAIL_BULLETS: LocalizedString[] = [
  {
    en: "Explain this day in one sentence from memory.",
    np: "यो दिन एक वाक्यमा स्मरणबाट।",
    jp: "この日のテーマを一文で言えるようにする。",
  },
];

export function resolveNextjsDayDetail(day: RoadmapDay): RoadmapDayDetail {
  if (day.detail) return day.detail;
  return {
    bullets: [...NEXTJS_DEFAULT_DETAIL_BULLETS],
  };
}

export function seedNextjsCompletedDayNumbers(): Set<number> {
  const done = new Set<number>();
  for (let d = 1; d < NEXTJS_CURRENT_DAY; d += 1) done.add(d);
  return done;
}
