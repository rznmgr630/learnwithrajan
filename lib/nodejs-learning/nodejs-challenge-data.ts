import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDay, RoadmapDayDetail, RoadmapWeek } from "@/lib/challenge-data";
import { NODEJS_DAY_26_DETAIL } from "@/lib/nodejs-learning/nodejs-day-26-detail";
import { NODEJS_DAY_27_DETAIL } from "@/lib/nodejs-learning/nodejs-day-27-detail";
import { NODEJS_DAY_28_DETAIL } from "@/lib/nodejs-learning/nodejs-day-28-detail";
import { NODEJS_DAY_29_DETAIL } from "@/lib/nodejs-learning/nodejs-day-29-detail";
import { NODEJS_DAY_30_DETAIL } from "@/lib/nodejs-learning/nodejs-day-30-detail";
import { NODEJS_DAY_31_DETAIL } from "@/lib/nodejs-learning/nodejs-day-31-detail";
import { NODEJS_DAY_32_DETAIL } from "@/lib/nodejs-learning/nodejs-day-32-detail";
import { NODEJS_DAY_33_DETAIL } from "@/lib/nodejs-learning/nodejs-day-33-detail";
import { NODEJS_DAY_34_DETAIL } from "@/lib/nodejs-learning/nodejs-day-34-detail";
import { NODEJS_DAY_35_DETAIL } from "@/lib/nodejs-learning/nodejs-day-35-detail";
import { NODEJS_DAY_36_DETAIL } from "@/lib/nodejs-learning/nodejs-day-36-detail";
import { NODEJS_DAY_37_DETAIL } from "@/lib/nodejs-learning/nodejs-day-37-detail";
import { NODEJS_DAY_38_DETAIL } from "@/lib/nodejs-learning/nodejs-day-38-detail";
import { nodejsDayTitle, nodejsTags, nodejsWeekTitle } from "@/lib/nodejs-learning/nodejs-roadmap-i18n";

export const NODEJS_CURRENT_DAY = 1;

export const NODEJS_TOTAL_DAYS = 38;

const NODEJS_DAY_DETAILS: Record<number, RoadmapDayDetail> = {
  26: NODEJS_DAY_26_DETAIL,
  27: NODEJS_DAY_27_DETAIL,
  28: NODEJS_DAY_28_DETAIL,
  29: NODEJS_DAY_29_DETAIL,
  30: NODEJS_DAY_30_DETAIL,
  31: NODEJS_DAY_31_DETAIL,
  32: NODEJS_DAY_32_DETAIL,
  33: NODEJS_DAY_33_DETAIL,
  34: NODEJS_DAY_34_DETAIL,
  35: NODEJS_DAY_35_DETAIL,
  36: NODEJS_DAY_36_DETAIL,
  37: NODEJS_DAY_37_DETAIL,
  38: NODEJS_DAY_38_DETAIL,
};

const DOT: Record<string, string> = {
  "nodejs-w0": "bg-[color-mix(in_oklab,var(--accent)_45%,#94a3b8)]",
  "nodejs-w1": "bg-green-600",
  "nodejs-p2": "bg-emerald-500",
  "nodejs-p3": "bg-teal-500",
  "nodejs-p4": "bg-cyan-500",
  "nodejs-p5": "bg-sky-500",
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
    id: "nodejs-p3",
    title: nodejsWeekTitle("nodejs-p3"),
    dotClass: DOT["nodejs-p3"],
    days: [
      nodejsDayRow(12, ["npm", "tooling"]),
      nodejsDayRow(13, ["testing", "tooling"]),
      nodejsDayRow(14, ["tooling", "errors"]),
    ],
  },
  {
    id: "nodejs-p4",
    title: nodejsWeekTitle("nodejs-p4"),
    dotClass: DOT["nodejs-p4"],
    days: [
      nodejsDayRow(15, ["fastify", "http"]),
      nodejsDayRow(16, ["validation", "fastify"]),
      nodejsDayRow(17, ["database", "sql"]),
      nodejsDayRow(18, ["auth", "jwt"]),
      nodejsDayRow(19, ["auth", "errors"]),
    ],
  },
  {
    id: "nodejs-p5",
    title: nodejsWeekTitle("nodejs-p5"),
    dotClass: DOT["nodejs-p5"],
    days: [
      nodejsDayRow(20, ["config", "tooling"]),
      nodejsDayRow(21, ["observability", "runtime"]),
      nodejsDayRow(22, ["errors", "runtime"]),
      nodejsDayRow(23, ["caching", "redis"]),
      nodejsDayRow(24, ["jobs", "redis"]),
      nodejsDayRow(25, ["realtime", "http"]),
    ],
  },
  {
    id: "nodejs-w2",
    title: nodejsWeekTitle("nodejs-w2"),
    dotClass: DOT["nodejs-w2"],
    days: [
      nodejsDayRow(26, ["modules", "core"]),
      nodejsDayRow(27, ["core", "http"]),
      nodejsDayRow(28, ["npm", "semver"]),
    ],
  },
  { id: "nodejs-w3", title: nodejsWeekTitle("nodejs-w3"), dotClass: DOT["nodejs-w3"], days: [nodejsDayRow(29, ["express", "http"]), nodejsDayRow(30, ["express", "validation"])] },
  { id: "nodejs-w4", title: nodejsWeekTitle("nodejs-w4"), dotClass: DOT["nodejs-w4"], days: [nodejsDayRow(31, ["async", "mongo"]), nodejsDayRow(32, ["mongo", "mongoose"])] },
  { id: "nodejs-w5", title: nodejsWeekTitle("nodejs-w5"), dotClass: DOT["nodejs-w5"], days: [nodejsDayRow(33, ["mongoose", "validation"]), nodejsDayRow(34, ["relations", "mongo"])] },
  { id: "nodejs-w6", title: nodejsWeekTitle("nodejs-w6"), dotClass: DOT["nodejs-w6"], days: [nodejsDayRow(35, ["auth", "jwt"]), nodejsDayRow(36, ["errors", "testing"])] },
  { id: "nodejs-w7", title: nodejsWeekTitle("nodejs-w7"), dotClass: DOT["nodejs-w7"], days: [nodejsDayRow(37, ["testing", "integration"]), nodejsDayRow(38, ["deploy", "atlas"])] },
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
