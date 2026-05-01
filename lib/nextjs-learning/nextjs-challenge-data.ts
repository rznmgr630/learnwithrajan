import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDay, RoadmapDayDetail, RoadmapWeek } from "@/lib/challenge-data";
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
import { nextjsDayTitle, nextjsTags, nextjsWeekTitle } from "@/lib/nextjs-learning/nextjs-roadmap-i18n";

export const NEXTJS_CURRENT_DAY = 1;

export const NEXTJS_TOTAL_DAYS = 10;

const NEXTJS_DAY_DETAILS: Record<number, RoadmapDayDetail> = {
  1: NEXTJS_DAY_1_DETAIL,
  2: NEXTJS_DAY_2_DETAIL,
  3: NEXTJS_DAY_3_DETAIL,
  4: NEXTJS_DAY_4_DETAIL,
  5: NEXTJS_DAY_5_DETAIL,
  6: NEXTJS_DAY_6_DETAIL,
  7: NEXTJS_DAY_7_DETAIL,
  8: NEXTJS_DAY_8_DETAIL,
  9: NEXTJS_DAY_9_DETAIL,
  10: NEXTJS_DAY_10_DETAIL,
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
    id: "nextjs-w1",
    title: nextjsWeekTitle("nextjs-w1"),
    dotClass: "bg-[var(--accent)]",
    days: [nextjsDayRow(1, ["intro", "appRouter"]), nextjsDayRow(2, ["routing", "appRouter"])],
  },
  {
    id: "nextjs-w2",
    title: nextjsWeekTitle("nextjs-w2"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_72%,#60a5fa)]",
    days: [nextjsDayRow(3, ["conventions", "routing"]), nextjsDayRow(4, ["layouts", "metadata"])],
  },
  {
    id: "nextjs-w3",
    title: nextjsWeekTitle("nextjs-w3"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_65%,#34d399)]",
    days: [nextjsDayRow(5, ["navigation", "ux"]), nextjsDayRow(6, ["ux", "appRouter"])],
  },
  {
    id: "nextjs-w4",
    title: nextjsWeekTitle("nextjs-w4"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_58%,#fb923c)]",
    days: [nextjsDayRow(7, ["errors", "appRouter"]), nextjsDayRow(8, ["advanced", "routing"])],
  },
  {
    id: "nextjs-w5",
    title: nextjsWeekTitle("nextjs-w5"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_52%,#a78bfa)]",
    days: [nextjsDayRow(9, ["api", "data"]), nextjsDayRow(10, ["edge", "data"])],
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
