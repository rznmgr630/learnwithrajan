import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDay, RoadmapDayDetail, RoadmapWeek } from "@/lib/challenge-data";
import { LARAVEL_DAY_18_DETAIL } from "@/lib/laravel-learning/laravel-day-18-detail";
import { LARAVEL_DAY_32_DETAIL } from "@/lib/laravel-learning/laravel-day-32-detail";
import { LARAVEL_DAY_33_DETAIL } from "@/lib/laravel-learning/laravel-day-33-detail";
import { LARAVEL_DAY_34_DETAIL } from "@/lib/laravel-learning/laravel-day-34-detail";
import { LARAVEL_DAY_35_DETAIL } from "@/lib/laravel-learning/laravel-day-35-detail";
import { LARAVEL_DAY_36_DETAIL } from "@/lib/laravel-learning/laravel-day-36-detail";
import { LARAVEL_DAY_37_DETAIL } from "@/lib/laravel-learning/laravel-day-37-detail";
import { LARAVEL_DAY_38_DETAIL } from "@/lib/laravel-learning/laravel-day-38-detail";
import { LARAVEL_DAY_39_DETAIL } from "@/lib/laravel-learning/laravel-day-39-detail";
import { LARAVEL_DAY_40_DETAIL } from "@/lib/laravel-learning/laravel-day-40-detail";
import { LARAVEL_DAY_41_DETAIL } from "@/lib/laravel-learning/laravel-day-41-detail";
import { LARAVEL_DAY_42_DETAIL } from "@/lib/laravel-learning/laravel-day-42-detail";
import { LARAVEL_DAY_43_DETAIL } from "@/lib/laravel-learning/laravel-day-43-detail";
import { LARAVEL_DAY_44_DETAIL } from "@/lib/laravel-learning/laravel-day-44-detail";
import { laravelDayTitle, laravelTags, laravelWeekTitle } from "@/lib/laravel-learning/laravel-roadmap-i18n";

export const LARAVEL_CURRENT_DAY = 1;

export const LARAVEL_TOTAL_DAYS = 44;

const LARAVEL_DAY_DETAILS: Record<number, RoadmapDayDetail> = {
  18: LARAVEL_DAY_18_DETAIL,
  32: LARAVEL_DAY_32_DETAIL,
  33: LARAVEL_DAY_33_DETAIL,
  34: LARAVEL_DAY_34_DETAIL,
  35: LARAVEL_DAY_35_DETAIL,
  36: LARAVEL_DAY_36_DETAIL,
  37: LARAVEL_DAY_37_DETAIL,
  38: LARAVEL_DAY_38_DETAIL,
  39: LARAVEL_DAY_39_DETAIL,
  40: LARAVEL_DAY_40_DETAIL,
  41: LARAVEL_DAY_41_DETAIL,
  42: LARAVEL_DAY_42_DETAIL,
  43: LARAVEL_DAY_43_DETAIL,
  44: LARAVEL_DAY_44_DETAIL,
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
      laravelDayRow(11, ["errors", "logging"]),
    ],
  },
  {
    id: "laravel-w4",
    title: laravelWeekTitle("laravel-w4"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_58%,#fb923c)]",
    days: [
      laravelDayRow(12, ["database", "transactions"]),
      laravelDayRow(13, ["database", "pagination"]),
      laravelDayRow(14, ["eloquent", "database"]),
      laravelDayRow(15, ["relations", "eloquent"]),
      laravelDayRow(16, ["advanced-eloquent", "resources"]),
      laravelDayRow(17, ["database", "factories"]),
      laravelDayRow(18, ["session", "caching"]),
    ],
  },
  {
    id: "laravel-w5",
    title: laravelWeekTitle("laravel-w5"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_52%,#38bdf8)]",
    days: [
      laravelDayRow(19, ["auth", "security"]),
      laravelDayRow(20, ["authorization", "security"]),
      laravelDayRow(21, ["security", "middleware"]),
      laravelDayRow(22, ["storage", "api"]),
    ],
  },
  {
    id: "laravel-w5b",
    title: laravelWeekTitle("laravel-w5b"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_49%,#22d3ee)]",
    days: [
      laravelDayRow(23, ["sanctum", "rest-api"]),
      laravelDayRow(24, ["livewire", "inertia"]),
      laravelDayRow(25, ["i18n", "collections"]),
    ],
  },
  {
    id: "laravel-w5c",
    title: laravelWeekTitle("laravel-w5c"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_43%,#c084fc)]",
    days: [
      laravelDayRow(26, ["queues", "jobs"]),
      laravelDayRow(27, ["events", "mail"]),
      laravelDayRow(28, ["broadcasting", "events"]),
    ],
  },
  {
    id: "laravel-w5d",
    title: laravelWeekTitle("laravel-w5d"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_41%,#fbbf24)]",
    days: [
      laravelDayRow(29, ["testing", "pest"]),
      laravelDayRow(30, ["artisan", "tooling"]),
    ],
  },
  {
    id: "laravel-w5e",
    title: laravelWeekTitle("laravel-w5e"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_39%,#34d399)]",
    days: [
      laravelDayRow(31, ["ai", "agents"]),
    ],
  },
  {
    id: "laravel-w6",
    title: laravelWeekTitle("laravel-w6"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_46%,#a78bfa)]",
    days: [
      laravelDayRow(32, ["mail", "foundation"]),
      laravelDayRow(33, ["auth", "foundation"]),
      laravelDayRow(34, ["authorization", "api"]),
      laravelDayRow(35, ["queues", "events"]),
      laravelDayRow(36, ["testing", "pest"]),
      laravelDayRow(37, ["sanctum", "rest-api"]),
    ],
  },
  {
    id: "laravel-w7",
    title: laravelWeekTitle("laravel-w7"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_40%,#f87171)]",
    days: [
      laravelDayRow(38, ["advanced-eloquent", "eloquent"]),
      laravelDayRow(39, ["security", "middleware"]),
      laravelDayRow(40, ["artisan", "foundation"]),
      laravelDayRow(41, ["broadcasting", "events"]),
    ],
  },
  {
    id: "laravel-w8",
    title: laravelWeekTitle("laravel-w8"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_34%,#4ade80)]",
    days: [
      laravelDayRow(42, ["livewire", "inertia"]),
      laravelDayRow(43, ["performance", "redis"]),
      laravelDayRow(44, ["deployment", "devops"]),
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
