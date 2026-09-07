import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDay, RoadmapDayDetail, RoadmapWeek } from "@/lib/challenge-data";
import { nodejsDayTitle, nodejsTags, nodejsWeekTitle } from "@/lib/nodejs-learning/nodejs-roadmap-i18n";

export const NODEJS_CURRENT_DAY = 1;

export const NODEJS_TOTAL_DAYS = 30;

const DOT: Record<string, string> = {
  "nodejs-w0": "bg-[color-mix(in_oklab,var(--accent)_45%,#94a3b8)]",
  "nodejs-w1": "bg-green-600",
  "nodejs-p2": "bg-emerald-500",
  "nodejs-p3": "bg-teal-500",
  "nodejs-p4": "bg-cyan-500",
  "nodejs-p5": "bg-sky-500",
  "nodejs-p6": "bg-indigo-500",
};

function nodejsDayRow(day: number, tagSlugs: [string, string]): RoadmapDay {
  return {
    day,
    title: nodejsDayTitle(day),
    tags: nodejsTags(tagSlugs),
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
    id: "nodejs-p6",
    title: nodejsWeekTitle("nodejs-p6"),
    dotClass: DOT["nodejs-p6"],
    days: [
      nodejsDayRow(26, ["performance", "runtime"]),
      nodejsDayRow(27, ["docker", "deploy"]),
      nodejsDayRow(28, ["deploy", "ci"]),
      nodejsDayRow(29, ["architecture", "testing"]),
      nodejsDayRow(30, ["runtime", "upgrade"]),
    ],
  },
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
