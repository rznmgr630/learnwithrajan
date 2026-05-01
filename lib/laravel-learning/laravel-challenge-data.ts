import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDay, RoadmapDayDetail, RoadmapWeek } from "@/lib/challenge-data";
import { LARAVEL_DAY_1_DETAIL } from "@/lib/laravel-learning/laravel-day-1-detail";
import { LARAVEL_DAY_2_DETAIL } from "@/lib/laravel-learning/laravel-day-2-detail";
import { LARAVEL_DAY_3_DETAIL } from "@/lib/laravel-learning/laravel-day-3-detail";
import { LARAVEL_DAY_4_DETAIL } from "@/lib/laravel-learning/laravel-day-4-detail";
import { LARAVEL_DAY_5_DETAIL } from "@/lib/laravel-learning/laravel-day-5-detail";
import { LARAVEL_DAY_6_DETAIL } from "@/lib/laravel-learning/laravel-day-6-detail";
import { LARAVEL_DAY_7_DETAIL } from "@/lib/laravel-learning/laravel-day-7-detail";
import { LARAVEL_DAY_8_DETAIL } from "@/lib/laravel-learning/laravel-day-8-detail";
import { LARAVEL_DAY_9_DETAIL } from "@/lib/laravel-learning/laravel-day-9-detail";
import { LARAVEL_DAY_10_DETAIL } from "@/lib/laravel-learning/laravel-day-10-detail";
import { LARAVEL_DAY_11_DETAIL } from "@/lib/laravel-learning/laravel-day-11-detail";
import { LARAVEL_DAY_12_DETAIL } from "@/lib/laravel-learning/laravel-day-12-detail";
import { LARAVEL_DAY_13_DETAIL } from "@/lib/laravel-learning/laravel-day-13-detail";
import { LARAVEL_DAY_14_DETAIL } from "@/lib/laravel-learning/laravel-day-14-detail";
import { laravelDayTitle, laravelTags, laravelWeekTitle } from "@/lib/laravel-learning/laravel-roadmap-i18n";

export const LARAVEL_CURRENT_DAY = 1;

export const LARAVEL_TOTAL_DAYS = 14;

const LARAVEL_DAY_DETAILS: Record<number, RoadmapDayDetail> = {
  1: LARAVEL_DAY_1_DETAIL,
  2: LARAVEL_DAY_2_DETAIL,
  3: LARAVEL_DAY_3_DETAIL,
  4: LARAVEL_DAY_4_DETAIL,
  5: LARAVEL_DAY_5_DETAIL,
  6: LARAVEL_DAY_6_DETAIL,
  7: LARAVEL_DAY_7_DETAIL,
  8: LARAVEL_DAY_8_DETAIL,
  9: LARAVEL_DAY_9_DETAIL,
  10: LARAVEL_DAY_10_DETAIL,
  11: LARAVEL_DAY_11_DETAIL,
  12: LARAVEL_DAY_12_DETAIL,
  13: LARAVEL_DAY_13_DETAIL,
  14: LARAVEL_DAY_14_DETAIL,
};

function laravelDayRow(day: number, tagSlugs: [string, string]): RoadmapDay {
  return {
    day,
    title: laravelDayTitle(day),
    tags: laravelTags(tagSlugs),
    detail: LARAVEL_DAY_DETAILS[day],
  };
}

export const LARAVEL_ROADMAP_WEEKS: RoadmapWeek[] = [
  {
    id: "laravel-w1",
    title: laravelWeekTitle("laravel-w1"),
    dotClass: "bg-[var(--accent)]",
    days: [laravelDayRow(1, ["foundation", "tooling"]), laravelDayRow(2, ["routing", "http"])],
  },
  {
    id: "laravel-w2",
    title: laravelWeekTitle("laravel-w2"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_72%,#f472b6)]",
    days: [laravelDayRow(3, ["controllers", "responses"]), laravelDayRow(4, ["blade", "views"])],
  },
  {
    id: "laravel-w3",
    title: laravelWeekTitle("laravel-w3"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_65%,#34d399)]",
    days: [laravelDayRow(5, ["validation", "forms"]), laravelDayRow(6, ["middleware", "requests"])],
  },
  {
    id: "laravel-w4",
    title: laravelWeekTitle("laravel-w4"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_58%,#fb923c)]",
    days: [
      laravelDayRow(7, ["eloquent", "database"]),
      laravelDayRow(8, ["session", "caching"]),
      laravelDayRow(9, ["relations", "eloquent"]),
    ],
  },
  {
    id: "laravel-w5",
    title: laravelWeekTitle("laravel-w5"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_52%,#38bdf8)]",
    days: [
      laravelDayRow(10, ["mail", "foundation"]),
      laravelDayRow(11, ["auth", "foundation"]),
      laravelDayRow(12, ["authorization", "api"]),
    ],
  },
  {
    id: "laravel-w6",
    title: laravelWeekTitle("laravel-w6"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_46%,#a78bfa)]",
    days: [laravelDayRow(13, ["queues", "events"]), laravelDayRow(14, ["testing", "pest"])],
  },
];

export function getAllLaravelRoadmapDays(): RoadmapDay[] {
  return LARAVEL_ROADMAP_WEEKS.flatMap((w) => w.days).sort((a, b) => a.day - b.day);
}

export function getLaravelRoadmapDayContext(dayNumber: number): { weekTitle: LocalizedString; day: RoadmapDay } | null {
  for (const week of LARAVEL_ROADMAP_WEEKS) {
    const day = week.days.find((d) => d.day === dayNumber);
    if (day) return { weekTitle: week.title, day };
  }
  return null;
}

const LARAVEL_DEFAULT_DETAIL_BULLETS: LocalizedString[] = [
  {
    en: "Summarize this day's topic in one sentence without opening the notes.",
    np: "नोट नखोली यो दिनको विषय एक वाक्यमा।",
    jp: "ノートを見ずに今日のテーマを一文で言えるようにする。",
  },
];

export function resolveLaravelDayDetail(day: RoadmapDay): RoadmapDayDetail {
  if (day.detail) return day.detail;
  return {
    bullets: [...LARAVEL_DEFAULT_DETAIL_BULLETS],
  };
}

export function seedLaravelCompletedDayNumbers(): Set<number> {
  const done = new Set<number>();
  for (let d = 1; d < LARAVEL_CURRENT_DAY; d += 1) done.add(d);
  return done;
}
