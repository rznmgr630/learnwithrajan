import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDay, RoadmapDayDetail, RoadmapWeek } from "@/lib/challenge-data";
import { NODEJS_DAY_1_DETAIL } from "@/lib/nodejs-learning/nodejs-day-1-detail";
import { NODEJS_DAY_2_DETAIL } from "@/lib/nodejs-learning/nodejs-day-2-detail";
import { NODEJS_DAY_3_DETAIL } from "@/lib/nodejs-learning/nodejs-day-3-detail";
import { NODEJS_DAY_4_DETAIL } from "@/lib/nodejs-learning/nodejs-day-4-detail";
import { NODEJS_DAY_5_DETAIL } from "@/lib/nodejs-learning/nodejs-day-5-detail";
import { NODEJS_DAY_6_DETAIL } from "@/lib/nodejs-learning/nodejs-day-6-detail";
import { NODEJS_DAY_7_DETAIL } from "@/lib/nodejs-learning/nodejs-day-7-detail";
import { NODEJS_DAY_8_DETAIL } from "@/lib/nodejs-learning/nodejs-day-8-detail";
import { NODEJS_DAY_9_DETAIL } from "@/lib/nodejs-learning/nodejs-day-9-detail";
import { NODEJS_DAY_10_DETAIL } from "@/lib/nodejs-learning/nodejs-day-10-detail";
import { NODEJS_DAY_11_DETAIL } from "@/lib/nodejs-learning/nodejs-day-11-detail";
import { NODEJS_DAY_12_DETAIL } from "@/lib/nodejs-learning/nodejs-day-12-detail";
import { NODEJS_DAY_13_DETAIL } from "@/lib/nodejs-learning/nodejs-day-13-detail";
import { NODEJS_DAY_14_DETAIL } from "@/lib/nodejs-learning/nodejs-day-14-detail";
import { nodejsDayTitle, nodejsTags, nodejsWeekTitle } from "@/lib/nodejs-learning/nodejs-roadmap-i18n";

export const NODEJS_CURRENT_DAY = 1;

export const NODEJS_TOTAL_DAYS = 14;

const NODEJS_DAY_DETAILS: Record<number, RoadmapDayDetail> = {
  1: NODEJS_DAY_1_DETAIL,
  2: NODEJS_DAY_2_DETAIL,
  3: NODEJS_DAY_3_DETAIL,
  4: NODEJS_DAY_4_DETAIL,
  5: NODEJS_DAY_5_DETAIL,
  6: NODEJS_DAY_6_DETAIL,
  7: NODEJS_DAY_7_DETAIL,
  8: NODEJS_DAY_8_DETAIL,
  9: NODEJS_DAY_9_DETAIL,
  10: NODEJS_DAY_10_DETAIL,
  11: NODEJS_DAY_11_DETAIL,
  12: NODEJS_DAY_12_DETAIL,
  13: NODEJS_DAY_13_DETAIL,
  14: NODEJS_DAY_14_DETAIL,
};

const DOT: Record<string, string> = {
  "nodejs-w1": "bg-green-600",
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
  { id: "nodejs-w1", title: nodejsWeekTitle("nodejs-w1"), dotClass: DOT["nodejs-w1"], days: [nodejsDayRow(1, ["fundamentals", "runtime"]), nodejsDayRow(2, ["modules", "core"])] },
  { id: "nodejs-w2", title: nodejsWeekTitle("nodejs-w2"), dotClass: DOT["nodejs-w2"], days: [nodejsDayRow(3, ["core", "http"]), nodejsDayRow(4, ["npm", "semver"])] },
  { id: "nodejs-w3", title: nodejsWeekTitle("nodejs-w3"), dotClass: DOT["nodejs-w3"], days: [nodejsDayRow(5, ["express", "http"]), nodejsDayRow(6, ["express", "validation"])] },
  { id: "nodejs-w4", title: nodejsWeekTitle("nodejs-w4"), dotClass: DOT["nodejs-w4"], days: [nodejsDayRow(7, ["async", "mongo"]), nodejsDayRow(8, ["mongo", "mongoose"])] },
  { id: "nodejs-w5", title: nodejsWeekTitle("nodejs-w5"), dotClass: DOT["nodejs-w5"], days: [nodejsDayRow(9, ["mongoose", "validation"]), nodejsDayRow(10, ["relations", "mongo"])] },
  { id: "nodejs-w6", title: nodejsWeekTitle("nodejs-w6"), dotClass: DOT["nodejs-w6"], days: [nodejsDayRow(11, ["auth", "jwt"]), nodejsDayRow(12, ["errors", "testing"])] },
  { id: "nodejs-w7", title: nodejsWeekTitle("nodejs-w7"), dotClass: DOT["nodejs-w7"], days: [nodejsDayRow(13, ["testing", "integration"]), nodejsDayRow(14, ["deploy", "atlas"])] },
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
