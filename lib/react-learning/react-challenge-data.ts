import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDay, RoadmapDayDetail, RoadmapWeek } from "@/lib/challenge-data";
import { REACT_DAY_1_DETAIL } from "@/lib/react-learning/react-day-1-detail";
import { REACT_DAY_2_DETAIL } from "@/lib/react-learning/react-day-2-detail";
import { REACT_DAY_3_DETAIL } from "@/lib/react-learning/react-day-3-detail";
import { REACT_DAY_4_DETAIL } from "@/lib/react-learning/react-day-4-detail";
import { REACT_DAY_5_DETAIL } from "@/lib/react-learning/react-day-5-detail";
import { REACT_DAY_6_DETAIL } from "@/lib/react-learning/react-day-6-detail";
import { REACT_DAY_7_DETAIL } from "@/lib/react-learning/react-day-7-detail";
import { REACT_DAY_8_DETAIL } from "@/lib/react-learning/react-day-8-detail";
import { REACT_DAY_9_DETAIL } from "@/lib/react-learning/react-day-9-detail";
import { REACT_DAY_10_DETAIL } from "@/lib/react-learning/react-day-10-detail";
import { REACT_DAY_11_DETAIL } from "@/lib/react-learning/react-day-11-detail";
import { REACT_DAY_12_DETAIL } from "@/lib/react-learning/react-day-12-detail";
import { REACT_DAY_13_DETAIL } from "@/lib/react-learning/react-day-13-detail";
import { REACT_DAY_14_DETAIL } from "@/lib/react-learning/react-day-14-detail";
import { REACT_DAY_15_DETAIL } from "@/lib/react-learning/react-day-15-detail";
import { REACT_DAY_16_DETAIL } from "@/lib/react-learning/react-day-16-detail";
import { REACT_DAY_17_DETAIL } from "@/lib/react-learning/react-day-17-detail";
import { REACT_DAY_18_DETAIL } from "@/lib/react-learning/react-day-18-detail";
import { REACT_DAY_19_DETAIL } from "@/lib/react-learning/react-day-19-detail";
import { REACT_DAY_20_DETAIL } from "@/lib/react-learning/react-day-20-detail";
import { REACT_DAY_21_DETAIL } from "@/lib/react-learning/react-day-21-detail";
import { REACT_DAY_22_DETAIL } from "@/lib/react-learning/react-day-22-detail";
import { REACT_DAY_23_DETAIL } from "@/lib/react-learning/react-day-23-detail";
import { REACT_DAY_24_DETAIL } from "@/lib/react-learning/react-day-24-detail";
import { REACT_DAY_25_DETAIL } from "@/lib/react-learning/react-day-25-detail";
import { REACT_DAY_26_DETAIL } from "@/lib/react-learning/react-day-26-detail";
import { REACT_DAY_27_DETAIL } from "@/lib/react-learning/react-day-27-detail";
import { reactDayTitle, reactTags, reactWeekTitle } from "@/lib/react-learning/react-roadmap-i18n";

export const REACT_CURRENT_DAY = 1;

export const REACT_TOTAL_DAYS = 27;

const REACT_DAY_DETAILS: Record<number, RoadmapDayDetail> = {
  1: REACT_DAY_1_DETAIL,
  2: REACT_DAY_2_DETAIL,
  3: REACT_DAY_3_DETAIL,
  4: REACT_DAY_4_DETAIL,
  5: REACT_DAY_5_DETAIL,
  6: REACT_DAY_6_DETAIL,
  7: REACT_DAY_7_DETAIL,
  8: REACT_DAY_8_DETAIL,
  9: REACT_DAY_9_DETAIL,
  10: REACT_DAY_10_DETAIL,
  11: REACT_DAY_11_DETAIL,
  12: REACT_DAY_12_DETAIL,
  13: REACT_DAY_13_DETAIL,
  14: REACT_DAY_14_DETAIL,
  15: REACT_DAY_15_DETAIL,
  16: REACT_DAY_16_DETAIL,
  17: REACT_DAY_17_DETAIL,
  18: REACT_DAY_18_DETAIL,
  19: REACT_DAY_19_DETAIL,
  20: REACT_DAY_20_DETAIL,
  21: REACT_DAY_21_DETAIL,
  22: REACT_DAY_22_DETAIL,
  23: REACT_DAY_23_DETAIL,
  24: REACT_DAY_24_DETAIL,
  25: REACT_DAY_25_DETAIL,
  26: REACT_DAY_26_DETAIL,
  27: REACT_DAY_27_DETAIL,
};

function reactDayRow(day: number, tagSlugs: [string, string]): RoadmapDay {
  return {
    day,
    title: reactDayTitle(day),
    tags: reactTags(tagSlugs),
    detail: REACT_DAY_DETAILS[day],
  };
}

export const REACT_ROADMAP_WEEKS: RoadmapWeek[] = [
  {
    id: "react-w1",
    title: reactWeekTitle("react-w1"),
    dotClass: "bg-[var(--accent)]",
    days: [
      reactDayRow(1, ["basics", "setup"]),
      reactDayRow(2, ["tooling", "structure"]),
      reactDayRow(3, ["components", "lists"]),
    ],
  },
  {
    id: "react-w2",
    title: reactWeekTitle("react-w2"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_72%,#a78bfa)]",
    days: [
      reactDayRow(4, ["props", "state"]),
      reactDayRow(5, ["styling", "css"]),
      reactDayRow(6, ["hooks", "immutability"]),
    ],
  },
  {
    id: "react-w3",
    title: reactWeekTitle("react-w3"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_65%,#34d399)]",
    days: [
      reactDayRow(7, ["forms", "validation"]),
      reactDayRow(8, ["effects", "api"]),
    ],
  },
  {
    id: "react-w4",
    title: reactWeekTitle("react-w4"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_58%,#fb923c)]",
    days: [
      reactDayRow(9, ["hooks", "context"]),
      reactDayRow(10, ["performance", "optimization"]),
    ],
  },
  {
    id: "react-w5",
    title: reactWeekTitle("react-w5"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_52%,#f472b6)]",
    days: [
      reactDayRow(11, ["patterns", "hooks"]),
      reactDayRow(12, ["patterns", "components"]),
      reactDayRow(13, ["internals", "performance"]),
      reactDayRow(14, ["error", "suspense"]),
    ],
  },
  {
    id: "react-w6",
    title: reactWeekTitle("react-w6"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_46%,#60a5fa)]",
    days: [
      reactDayRow(15, ["typescript", "types"]),
      reactDayRow(16, ["testing", "quality"]),
      reactDayRow(17, ["debugging", "devtools"]),
    ],
  },
  {
    id: "react-w7",
    title: reactWeekTitle("react-w7"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_40%,#818cf8)]",
    days: [
      reactDayRow(18, ["routing", "navigation"]),
      reactDayRow(19, ["zustand", "query"]),
    ],
  },
  {
    id: "react-w8",
    title: reactWeekTitle("react-w8"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_36%,#f87171)]",
    days: [
      reactDayRow(20, ["auth", "routing"]),
      reactDayRow(21, ["query", "mutations"]),
      reactDayRow(22, ["animation", "framer"]),
    ],
  },
  {
    id: "react-w9",
    title: reactWeekTitle("react-w9"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_32%,#4ade80)]",
    days: [
      reactDayRow(23, ["a11y", "aria"]),
      reactDayRow(24, ["build", "performance"]),
    ],
  },
  {
    id: "react-w10",
    title: reactWeekTitle("react-w10"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_28%,#facc15)]",
    days: [
      reactDayRow(25, ["projects", "portfolio"]),
      reactDayRow(26, ["interview", "career"]),
      reactDayRow(27, ["architecture", "patterns"]),
    ],
  },
];

export function getAllReactRoadmapDays(): RoadmapDay[] {
  return REACT_ROADMAP_WEEKS.flatMap((w) => w.days).sort((a, b) => a.day - b.day);
}

export function getReactRoadmapDayContext(dayNumber: number): { weekTitle: LocalizedString; day: RoadmapDay } | null {
  for (const week of REACT_ROADMAP_WEEKS) {
    const day = week.days.find((d) => d.day === dayNumber);
    if (day) return { weekTitle: week.title, day };
  }
  return null;
}

const REACT_DEFAULT_DETAIL_BULLETS: LocalizedString[] = [
  {
    en: "Summarize the day's goal in one sentence.",
    np: "दिनको लक्ष्य एक वाक्यमा सार्नुहोस्।",
    jp: "今日の目標を一文でまとめる。",
  },
];

export function resolveReactDayDetail(day: RoadmapDay): RoadmapDayDetail {
  if (day.detail) return day.detail;
  return {
    bullets: [...REACT_DEFAULT_DETAIL_BULLETS],
  };
}

export function seedReactCompletedDayNumbers(): Set<number> {
  const done = new Set<number>();
  for (let d = 1; d < REACT_CURRENT_DAY; d += 1) done.add(d);
  return done;
}
