import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDay, RoadmapDayDetail, RoadmapWeek } from "@/lib/challenge-data";
import { LARAVEL_DAY_10_DETAIL } from "@/lib/laravel-learning/laravel-day-10-detail";
import { LARAVEL_DAY_11_DETAIL } from "@/lib/laravel-learning/laravel-day-11-detail";
import { LARAVEL_DAY_12_DETAIL } from "@/lib/laravel-learning/laravel-day-12-detail";
import { LARAVEL_DAY_13_DETAIL } from "@/lib/laravel-learning/laravel-day-13-detail";
import { LARAVEL_DAY_14_DETAIL } from "@/lib/laravel-learning/laravel-day-14-detail";
import { LARAVEL_DAY_15_DETAIL } from "@/lib/laravel-learning/laravel-day-15-detail";
import { LARAVEL_DAY_16_DETAIL } from "@/lib/laravel-learning/laravel-day-16-detail";
import { LARAVEL_DAY_17_DETAIL } from "@/lib/laravel-learning/laravel-day-17-detail";
import { LARAVEL_DAY_18_DETAIL } from "@/lib/laravel-learning/laravel-day-18-detail";
import { LARAVEL_DAY_19_DETAIL } from "@/lib/laravel-learning/laravel-day-19-detail";
import { LARAVEL_DAY_20_DETAIL } from "@/lib/laravel-learning/laravel-day-20-detail";
import { LARAVEL_DAY_21_DETAIL } from "@/lib/laravel-learning/laravel-day-21-detail";
import { LARAVEL_DAY_22_DETAIL } from "@/lib/laravel-learning/laravel-day-22-detail";
import { LARAVEL_DAY_23_DETAIL } from "@/lib/laravel-learning/laravel-day-23-detail";
import { LARAVEL_DAY_24_DETAIL } from "@/lib/laravel-learning/laravel-day-24-detail";
import { LARAVEL_DAY_25_DETAIL } from "@/lib/laravel-learning/laravel-day-25-detail";
import { LARAVEL_DAY_26_DETAIL } from "@/lib/laravel-learning/laravel-day-26-detail";
import { laravelDayTitle, laravelTags, laravelWeekTitle } from "@/lib/laravel-learning/laravel-roadmap-i18n";

export const LARAVEL_CURRENT_DAY = 1;

export const LARAVEL_TOTAL_DAYS = 26;

const LARAVEL_DAY_DETAILS: Record<number, RoadmapDayDetail> = {
  10: LARAVEL_DAY_10_DETAIL,
  11: LARAVEL_DAY_11_DETAIL,
  12: LARAVEL_DAY_12_DETAIL,
  13: LARAVEL_DAY_13_DETAIL,
  14: LARAVEL_DAY_14_DETAIL,
  15: LARAVEL_DAY_15_DETAIL,
  16: LARAVEL_DAY_16_DETAIL,
  17: LARAVEL_DAY_17_DETAIL,
  18: LARAVEL_DAY_18_DETAIL,
  19: LARAVEL_DAY_19_DETAIL,
  20: LARAVEL_DAY_20_DETAIL,
  21: LARAVEL_DAY_21_DETAIL,
  22: LARAVEL_DAY_22_DETAIL,
  23: LARAVEL_DAY_23_DETAIL,
  24: LARAVEL_DAY_24_DETAIL,
  25: LARAVEL_DAY_25_DETAIL,
  26: LARAVEL_DAY_26_DETAIL,
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
    id: "laravel-w0",
    title: laravelWeekTitle("laravel-w0"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_45%,#94a3b8)]",
    days: [laravelDayRow(0, ["foundation", "tooling"])],
  },
  {
    id: "laravel-w1",
    title: laravelWeekTitle("laravel-w1"),
    dotClass: "bg-[var(--accent)]",
    days: [
      laravelDayRow(1, ["foundation", "tooling"]),
      laravelDayRow(2, ["foundation", "tooling"]),
      laravelDayRow(3, ["foundation", "http"]),
      laravelDayRow(4, ["foundation", "advanced"]),
    ],
  },
  {
    id: "laravel-w1b",
    title: laravelWeekTitle("laravel-w1b"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_86%,#818cf8)]",
    days: [
      laravelDayRow(5, ["routing", "http"]),
      laravelDayRow(6, ["middleware", "requests"]),
      laravelDayRow(7, ["controllers", "responses"]),
      laravelDayRow(8, ["blade", "views"]),
      laravelDayRow(9, ["validation", "forms"]),
      laravelDayRow(10, ["session", "cookies"]),
    ],
  },
  {
    id: "laravel-w4",
    title: laravelWeekTitle("laravel-w4"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_58%,#fb923c)]",
    days: [
      laravelDayRow(11, ["eloquent", "database"]),
      laravelDayRow(12, ["session", "caching"]),
      laravelDayRow(13, ["relations", "eloquent"]),
    ],
  },
  {
    id: "laravel-w5",
    title: laravelWeekTitle("laravel-w5"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_52%,#38bdf8)]",
    days: [
      laravelDayRow(14, ["mail", "foundation"]),
      laravelDayRow(15, ["auth", "foundation"]),
      laravelDayRow(16, ["authorization", "api"]),
    ],
  },
  {
    id: "laravel-w6",
    title: laravelWeekTitle("laravel-w6"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_46%,#a78bfa)]",
    days: [
      laravelDayRow(17, ["queues", "events"]),
      laravelDayRow(18, ["testing", "pest"]),
      laravelDayRow(19, ["sanctum", "rest-api"]),
    ],
  },
  {
    id: "laravel-w7",
    title: laravelWeekTitle("laravel-w7"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_40%,#f87171)]",
    days: [
      laravelDayRow(20, ["advanced-eloquent", "eloquent"]),
      laravelDayRow(21, ["security", "middleware"]),
      laravelDayRow(22, ["artisan", "foundation"]),
      laravelDayRow(23, ["broadcasting", "events"]),
    ],
  },
  {
    id: "laravel-w8",
    title: laravelWeekTitle("laravel-w8"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_34%,#4ade80)]",
    days: [
      laravelDayRow(24, ["livewire", "inertia"]),
      laravelDayRow(25, ["performance", "redis"]),
      laravelDayRow(26, ["deployment", "devops"]),
    ],
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
