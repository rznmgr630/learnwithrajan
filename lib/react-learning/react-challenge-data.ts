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
import { reactDayTitle, reactTags, reactWeekTitle } from "@/lib/react-learning/react-roadmap-i18n";

/** Official “current” day (1-based) for seeding local progress. */
export const REACT_CURRENT_DAY = 1;

export const REACT_TOTAL_DAYS = 8;

const REACT_DAY_DETAILS: Record<number, RoadmapDayDetail> = {
  1: REACT_DAY_1_DETAIL,
  2: REACT_DAY_2_DETAIL,
  3: REACT_DAY_3_DETAIL,
  4: REACT_DAY_4_DETAIL,
  5: REACT_DAY_5_DETAIL,
  6: REACT_DAY_6_DETAIL,
  7: REACT_DAY_7_DETAIL,
  8: REACT_DAY_8_DETAIL,
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
    id: "react-getting-started",
    title: reactWeekTitle("react-getting-started"),
    dotClass: "bg-[var(--accent)]",
    days: [reactDayRow(1, ["basics", "setup"]), reactDayRow(2, ["tooling", "structure"])],
  },
  {
    id: "react-building-components",
    title: reactWeekTitle("react-building-components"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_72%,#a78bfa)]",
    days: [reactDayRow(3, ["components", "lists"])],
  },
  {
    id: "react-managing-state",
    title: reactWeekTitle("react-managing-state"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_65%,#34d399)]",
    days: [reactDayRow(4, ["props", "state"])],
  },
  {
    id: "react-styling-components",
    title: reactWeekTitle("react-styling-components"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_58%,#fb923c)]",
    days: [reactDayRow(5, ["styling", "css"])],
  },
  {
    id: "react-managing-component-state",
    title: reactWeekTitle("react-managing-component-state"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_55%,#38bdf8)]",
    days: [reactDayRow(6, ["hooks", "immutability"])],
  },
  {
    id: "react-building-forms",
    title: reactWeekTitle("react-building-forms"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_50%,#f472b6)]",
    days: [reactDayRow(7, ["forms", "validation"])],
  },
  {
    id: "react-connecting-backend",
    title: reactWeekTitle("react-connecting-backend"),
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_48%,#a3e635)]",
    days: [reactDayRow(8, ["effects", "api"])],
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
    en: "Summarize the day’s goal in one sentence.",
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
