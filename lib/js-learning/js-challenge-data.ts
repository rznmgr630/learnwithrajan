import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDay, RoadmapDayDetail, RoadmapWeek } from "@/lib/challenge-data";
import { jsDayTitle, jsTags, jsWeekTitle } from "@/lib/js-learning/js-roadmap-i18n";
import { JS_DAY_1_DETAIL } from "@/lib/js-learning/js-day-1-detail";
import { JS_DAY_2_DETAIL } from "@/lib/js-learning/js-day-2-detail";
import { JS_DAY_3_DETAIL } from "@/lib/js-learning/js-day-3-detail";
import { JS_DAY_4_DETAIL } from "@/lib/js-learning/js-day-4-detail";
import { JS_DAY_5_DETAIL } from "@/lib/js-learning/js-day-5-detail";
import { JS_DAY_6_DETAIL } from "@/lib/js-learning/js-day-6-detail";
import { JS_DAY_7_DETAIL } from "@/lib/js-learning/js-day-7-detail";
import { JS_DAY_8_DETAIL } from "@/lib/js-learning/js-day-8-detail";
import { JS_DAY_9_DETAIL } from "@/lib/js-learning/js-day-9-detail";
import { JS_DAY_10_DETAIL } from "@/lib/js-learning/js-day-10-detail";
import { JS_DAY_11_DETAIL } from "@/lib/js-learning/js-day-11-detail";
import { JS_DAY_12_DETAIL } from "@/lib/js-learning/js-day-12-detail";
import { JS_DAY_13_DETAIL } from "@/lib/js-learning/js-day-13-detail";
import { JS_DAY_14_DETAIL } from "@/lib/js-learning/js-day-14-detail";
import { JS_DAY_15_DETAIL } from "@/lib/js-learning/js-day-15-detail";
import { JS_DAY_16_DETAIL } from "@/lib/js-learning/js-day-16-detail";
import { JS_DAY_17_DETAIL } from "@/lib/js-learning/js-day-17-detail";
import { JS_DAY_18_DETAIL } from "@/lib/js-learning/js-day-18-detail";
import { JS_DAY_19_DETAIL } from "@/lib/js-learning/js-day-19-detail";
import { JS_DAY_20_DETAIL } from "@/lib/js-learning/js-day-20-detail";

export const JS_CURRENT_DAY = 1;
export const JS_TOTAL_DAYS = 25;

const JS_DAY_DETAILS: Record<number, RoadmapDayDetail> = {
  1:  JS_DAY_1_DETAIL,
  2:  JS_DAY_2_DETAIL,
  3:  JS_DAY_3_DETAIL,
  4:  JS_DAY_4_DETAIL,
  5:  JS_DAY_5_DETAIL,
  6:  JS_DAY_6_DETAIL,
  7:  JS_DAY_7_DETAIL,
  8:  JS_DAY_8_DETAIL,
  9:  JS_DAY_9_DETAIL,
  10: JS_DAY_10_DETAIL,
  11: JS_DAY_11_DETAIL,
  12: JS_DAY_12_DETAIL,
  13: JS_DAY_13_DETAIL,
  14: JS_DAY_14_DETAIL,
  15: JS_DAY_15_DETAIL,
  16: JS_DAY_16_DETAIL,
  17: JS_DAY_17_DETAIL,
  18: JS_DAY_18_DETAIL,
  19: JS_DAY_19_DETAIL,
  20: JS_DAY_20_DETAIL,
};

const DOT: Record<string, string> = {
  "js-w1":  "bg-yellow-500",
  "js-w2":  "bg-amber-500",
  "js-w3":  "bg-orange-500",
  "js-w4":  "bg-red-500",
  "js-w5":  "bg-rose-500",
  "js-w6":  "bg-pink-500",
  "js-w7":  "bg-purple-500",
  "js-w8":  "bg-violet-500",
  "js-w9":  "bg-indigo-500",
  "js-w10": "bg-blue-500",
  "js-w11": "bg-sky-500",
  "js-w12": "bg-teal-500",
  "js-w13": "bg-[var(--accent)]",
};

function jsDayRow(day: number, tagSlugs: [string, string]): RoadmapDay {
  return {
    day,
    title: jsDayTitle(day),
    tags: jsTags(tagSlugs),
    detail: JS_DAY_DETAILS[day],
  };
}

export const JS_ROADMAP_WEEKS: RoadmapWeek[] = [
  // Week 1 — Core Syntax
  {
    id: "js-w1",
    title: jsWeekTitle("js-w1"),
    dotClass: DOT["js-w1"],
    days: [
      jsDayRow(1, ["fundamentals", "types"]),
      jsDayRow(2, ["fundamentals", "functions"]),
    ],
  },
  // Week 2 — Functions
  {
    id: "js-w2",
    title: jsWeekTitle("js-w2"),
    dotClass: DOT["js-w2"],
    days: [
      jsDayRow(3, ["scope", "hoisting"]),
      jsDayRow(4, ["closures", "hof"]),
    ],
  },
  // Week 3 — Objects & Arrays
  {
    id: "js-w3",
    title: jsWeekTitle("js-w3"),
    dotClass: DOT["js-w3"],
    days: [
      jsDayRow(5, ["objects", "destructuring"]),
      jsDayRow(6, ["arrays", "fundamentals"]),
    ],
  },
  // Week 4 — this & OOP
  {
    id: "js-w4",
    title: jsWeekTitle("js-w4"),
    dotClass: DOT["js-w4"],
    days: [
      jsDayRow(7, ["this", "binding"]),
      jsDayRow(8, ["prototypes", "inheritance"]),
      jsDayRow(9, ["classes", "inheritance"]),
    ],
  },
  // Week 5 — Error Handling & Modules
  {
    id: "js-w5",
    title: jsWeekTitle("js-w5"),
    dotClass: DOT["js-w5"],
    days: [
      jsDayRow(10, ["errors", "modules"]),
    ],
  },
  // Week 6 — Async
  {
    id: "js-w6",
    title: jsWeekTitle("js-w6"),
    dotClass: DOT["js-w6"],
    days: [
      jsDayRow(11, ["async", "promises"]),
      jsDayRow(12, ["promises", "async"]),
    ],
  },
  // Week 7 — Event Loop
  {
    id: "js-w7",
    title: jsWeekTitle("js-w7"),
    dotClass: DOT["js-w7"],
    days: [
      jsDayRow(13, ["event-loop", "async"]),
      jsDayRow(14, ["event-loop", "nodejs"]),
    ],
  },
  // Week 8 — Browser APIs
  {
    id: "js-w8",
    title: jsWeekTitle("js-w8"),
    dotClass: DOT["js-w8"],
    days: [
      jsDayRow(15, ["dom", "browser"]),
      jsDayRow(16, ["browser", "async"]),
    ],
  },
  // Week 9 — Advanced Patterns
  {
    id: "js-w9",
    title: jsWeekTitle("js-w9"),
    dotClass: DOT["js-w9"],
    days: [
      jsDayRow(17, ["promises", "patterns"]),
      jsDayRow(18, ["generators", "advanced"]),
    ],
  },
  // Week 10 — Memory & Performance
  {
    id: "js-w10",
    title: jsWeekTitle("js-w10"),
    dotClass: DOT["js-w10"],
    days: [
      jsDayRow(19, ["memory", "advanced"]),
      jsDayRow(20, ["performance", "advanced"]),
    ],
  },
  // Week 11 — TypeScript
  {
    id: "js-w11",
    title: jsWeekTitle("js-w11"),
    dotClass: DOT["js-w11"],
    days: [
      jsDayRow(21, ["typescript", "advanced"]),
    ],
  },
  // Week 12 — Advanced JS
  {
    id: "js-w12",
    title: jsWeekTitle("js-w12"),
    dotClass: DOT["js-w12"],
    days: [
      jsDayRow(22, ["advanced", "patterns"]),
      jsDayRow(23, ["patterns", "advanced"]),
    ],
  },
  // Week 13 — Node.js Advanced & Senior
  {
    id: "js-w13",
    title: jsWeekTitle("js-w13"),
    dotClass: DOT["js-w13"],
    days: [
      jsDayRow(24, ["nodejs", "advanced"]),
      jsDayRow(25, ["internals", "performance"]),
    ],
  },
];

export function getAllJsRoadmapDays(): RoadmapDay[] {
  return JS_ROADMAP_WEEKS.flatMap((w) => w.days).sort((a, b) => a.day - b.day);
}

export function getJsRoadmapDayContext(dayNumber: number): { weekTitle: LocalizedString; day: RoadmapDay } | null {
  for (const week of JS_ROADMAP_WEEKS) {
    const day = week.days.find((d) => d.day === dayNumber);
    if (day) return { weekTitle: week.title, day };
  }
  return null;
}

const JS_DEFAULT_DETAIL_BULLETS: LocalizedString[] = [
  {
    en: "Summarize this day's topic in one sentence before expanding your notes.",
    np: "नोट विस्तार गर्नुअघि एक वाक्यमा सारांश।",
    jp: "ノートを広げる前に、今日のテーマを一文で言えるようにする。",
  },
];

export function resolveJsDayDetail(day: RoadmapDay): RoadmapDayDetail {
  if (day.detail) return day.detail;
  return { bullets: [...JS_DEFAULT_DETAIL_BULLETS] };
}

export function seedJsCompletedDayNumbers(): Set<number> {
  const done = new Set<number>();
  for (let d = 1; d < JS_CURRENT_DAY; d += 1) done.add(d);
  return done;
}
