import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDay, RoadmapDayDetail, RoadmapWeek } from "@/lib/challenge-data";
import { NODEJS_DAY_12_DETAIL } from "@/lib/nodejs-learning/nodejs-day-12-detail";
import { NODEJS_DAY_13_DETAIL } from "@/lib/nodejs-learning/nodejs-day-13-detail";
import { NODEJS_DAY_14_DETAIL } from "@/lib/nodejs-learning/nodejs-day-14-detail";
import { NODEJS_DAY_15_DETAIL } from "@/lib/nodejs-learning/nodejs-day-15-detail";
import { NODEJS_DAY_16_DETAIL } from "@/lib/nodejs-learning/nodejs-day-16-detail";
import { NODEJS_DAY_17_DETAIL } from "@/lib/nodejs-learning/nodejs-day-17-detail";
import { NODEJS_DAY_18_DETAIL } from "@/lib/nodejs-learning/nodejs-day-18-detail";
import { NODEJS_DAY_19_DETAIL } from "@/lib/nodejs-learning/nodejs-day-19-detail";
import { NODEJS_DAY_20_DETAIL } from "@/lib/nodejs-learning/nodejs-day-20-detail";
import { NODEJS_DAY_21_DETAIL } from "@/lib/nodejs-learning/nodejs-day-21-detail";
import { NODEJS_DAY_22_DETAIL } from "@/lib/nodejs-learning/nodejs-day-22-detail";
import { NODEJS_DAY_23_DETAIL } from "@/lib/nodejs-learning/nodejs-day-23-detail";
import { NODEJS_DAY_24_DETAIL } from "@/lib/nodejs-learning/nodejs-day-24-detail";
import { nodejsDayTitle, nodejsTags, nodejsWeekTitle } from "@/lib/nodejs-learning/nodejs-roadmap-i18n";

export const NODEJS_CURRENT_DAY = 1;

export const NODEJS_TOTAL_DAYS = 24;

const NODEJS_DAY_DETAILS: Record<number, RoadmapDayDetail> = {
  12: NODEJS_DAY_12_DETAIL,
  13: NODEJS_DAY_13_DETAIL,
  14: NODEJS_DAY_14_DETAIL,
  15: NODEJS_DAY_15_DETAIL,
  16: NODEJS_DAY_16_DETAIL,
  17: NODEJS_DAY_17_DETAIL,
  18: NODEJS_DAY_18_DETAIL,
  19: NODEJS_DAY_19_DETAIL,
  20: NODEJS_DAY_20_DETAIL,
  21: NODEJS_DAY_21_DETAIL,
  22: NODEJS_DAY_22_DETAIL,
  23: NODEJS_DAY_23_DETAIL,
  24: NODEJS_DAY_24_DETAIL,
};

const DOT: Record<string, string> = {
  "nodejs-w0": "bg-[color-mix(in_oklab,var(--accent)_45%,#94a3b8)]",
  "nodejs-w1": "bg-green-600",
  "nodejs-p2": "bg-emerald-500",
  "nodejs-w2": "bg-emerald-600",
  "nodejs-w3": "bg-teal-600",
  "nodejs-w4": "bg-cyan-600",
  "nodejs-w5": "bg-sky-600",
  "nodejs-w6": "bg-indigo-600",
  "nodejs-w7": "bg-[var(--accent)]",
};

function nodejsDayRow(day: number, tagSlugs: [string, string]): RoadmapDay {
  return {
    day,
    title: nodejsDayTitle(day),
    tags: nodejsTags(tagSlugs),
    detail: NODEJS_DAY_DETAILS[day],
  };
}

export const NODEJS_ROADMAP_WEEKS: RoadmapWeek[] = [
  { id: "nodejs-w0", title: nodejsWeekTitle("nodejs-w0"), dotClass: DOT["nodejs-w0"], days: [nodejsDayRow(0, ["prereq", "js"])] },
  {
    id: "nodejs-w1",
    title: nodejsWeekTitle("nodejs-w1"),
    dotClass: DOT["nodejs-w1"],
    days: [
      nodejsDayRow(1, ["fundamentals", "runtime"]),
      nodejsDayRow(2, ["modules", "fundamentals"]),
      nodejsDayRow(3, ["async", "runtime"]),
      nodejsDayRow(4, ["errors", "runtime"]),
      nodejsDayRow(5, ["typescript", "tooling"]),
    ],
  },
  {
    id: "nodejs-p2",
    title: nodejsWeekTitle("nodejs-p2"),
    dotClass: DOT["nodejs-p2"],
    days: [
      nodejsDayRow(6, ["core", "files"]),
      nodejsDayRow(7, ["core", "binary"]),
      nodejsDayRow(8, ["core", "streams"]),
      nodejsDayRow(9, ["events", "core"]),
      nodejsDayRow(10, ["http", "core"]),
      nodejsDayRow(11, ["process", "runtime"]),
    ],
  },
  {
    id: "nodejs-w2",
    title: nodejsWeekTitle("nodejs-w2"),
    dotClass: DOT["nodejs-w2"],
    days: [
      nodejsDayRow(12, ["modules", "core"]),
      nodejsDayRow(13, ["core", "http"]),
      nodejsDayRow(14, ["npm", "semver"]),
    ],
  },
  { id: "nodejs-w3", title: nodejsWeekTitle("nodejs-w3"), dotClass: DOT["nodejs-w3"], days: [nodejsDayRow(15, ["express", "http"]), nodejsDayRow(16, ["express", "validation"])] },
  { id: "nodejs-w4", title: nodejsWeekTitle("nodejs-w4"), dotClass: DOT["nodejs-w4"], days: [nodejsDayRow(17, ["async", "mongo"]), nodejsDayRow(18, ["mongo", "mongoose"])] },
  { id: "nodejs-w5", title: nodejsWeekTitle("nodejs-w5"), dotClass: DOT["nodejs-w5"], days: [nodejsDayRow(19, ["mongoose", "validation"]), nodejsDayRow(20, ["relations", "mongo"])] },
  { id: "nodejs-w6", title: nodejsWeekTitle("nodejs-w6"), dotClass: DOT["nodejs-w6"], days: [nodejsDayRow(21, ["auth", "jwt"]), nodejsDayRow(22, ["errors", "testing"])] },
  { id: "nodejs-w7", title: nodejsWeekTitle("nodejs-w7"), dotClass: DOT["nodejs-w7"], days: [nodejsDayRow(23, ["testing", "integration"]), nodejsDayRow(24, ["deploy", "atlas"])] },
];

export function getAllNodejsRoadmapDays(): RoadmapDay[] {
  return NODEJS_ROADMAP_WEEKS.flatMap((w) => w.days).sort((a, b) => a.day - b.day);
}

export function getNodejsRoadmapDayContext(dayNumber: number): { weekTitle: LocalizedString; day: RoadmapDay } | null {
  for (const week of NODEJS_ROADMAP_WEEKS) {
    const day = week.days.find((d) => d.day === dayNumber);
    if (day) return { weekTitle: week.title, day };
  }
  return null;
}

const NODEJS_DEFAULT_DETAIL_BULLETS: LocalizedString[] = [
  {
    en: "Summarize this day’s topic in one sentence before expanding your notes.",
    np: "नोट विस्तार गर्नुअघि एक वाक्यमा सारांश।",
    jp: "ノートを広げる前に、今日のテーマを一文で言えるようにする。",
  },
];

export function resolveNodejsDayDetail(day: RoadmapDay): RoadmapDayDetail {
  if (day.detail) return day.detail;
  return {
    bullets: [...NODEJS_DEFAULT_DETAIL_BULLETS],
  };
}

export function seedNodejsCompletedDayNumbers(): Set<number> {
  const done = new Set<number>();
  for (let d = 1; d < NODEJS_CURRENT_DAY; d += 1) done.add(d);
  return done;
}
