import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDay, RoadmapDayDetail, RoadmapWeek } from "@/lib/challenge-data";
import { REACT_NATIVE_DAY_1_DETAIL } from "@/lib/react-native-learning/react-native-day-1-detail";
import { REACT_NATIVE_DAY_2_DETAIL } from "@/lib/react-native-learning/react-native-day-2-detail";
import { REACT_NATIVE_DAY_3_DETAIL } from "@/lib/react-native-learning/react-native-day-3-detail";
import { REACT_NATIVE_DAY_4_DETAIL } from "@/lib/react-native-learning/react-native-day-4-detail";
import { REACT_NATIVE_DAY_5_DETAIL } from "@/lib/react-native-learning/react-native-day-5-detail";
import { REACT_NATIVE_DAY_6_DETAIL } from "@/lib/react-native-learning/react-native-day-6-detail";
import { REACT_NATIVE_DAY_7_DETAIL } from "@/lib/react-native-learning/react-native-day-7-detail";
import { REACT_NATIVE_DAY_8_DETAIL } from "@/lib/react-native-learning/react-native-day-8-detail";
import { REACT_NATIVE_DAY_9_DETAIL } from "@/lib/react-native-learning/react-native-day-9-detail";
import { REACT_NATIVE_DAY_10_DETAIL } from "@/lib/react-native-learning/react-native-day-10-detail";
import { REACT_NATIVE_DAY_11_DETAIL } from "@/lib/react-native-learning/react-native-day-11-detail";
import { REACT_NATIVE_DAY_12_DETAIL } from "@/lib/react-native-learning/react-native-day-12-detail";
import { REACT_NATIVE_DAY_13_DETAIL } from "@/lib/react-native-learning/react-native-day-13-detail";
import { REACT_NATIVE_DAY_14_DETAIL } from "@/lib/react-native-learning/react-native-day-14-detail";
import { REACT_NATIVE_DAY_15_DETAIL } from "@/lib/react-native-learning/react-native-day-15-detail";
import { REACT_NATIVE_DAY_16_DETAIL } from "@/lib/react-native-learning/react-native-day-16-detail";
import { REACT_NATIVE_DAY_17_DETAIL } from "@/lib/react-native-learning/react-native-day-17-detail";
import { REACT_NATIVE_DAY_18_DETAIL } from "@/lib/react-native-learning/react-native-day-18-detail";
import { REACT_NATIVE_DAY_19_DETAIL } from "@/lib/react-native-learning/react-native-day-19-detail";
import { REACT_NATIVE_DAY_20_DETAIL } from "@/lib/react-native-learning/react-native-day-20-detail";
import {
  reactNativeDayTitle,
  reactNativeTags,
  reactNativeWeekTitle,
} from "@/lib/react-native-learning/react-native-roadmap-i18n";

export const REACT_NATIVE_CURRENT_DAY = 1;

export const REACT_NATIVE_TOTAL_DAYS = 20;

const REACT_NATIVE_DAY_DETAILS: Record<number, RoadmapDayDetail> = {
  1: REACT_NATIVE_DAY_1_DETAIL,
  2: REACT_NATIVE_DAY_2_DETAIL,
  3: REACT_NATIVE_DAY_3_DETAIL,
  4: REACT_NATIVE_DAY_4_DETAIL,
  5: REACT_NATIVE_DAY_5_DETAIL,
  6: REACT_NATIVE_DAY_6_DETAIL,
  7: REACT_NATIVE_DAY_7_DETAIL,
  8: REACT_NATIVE_DAY_8_DETAIL,
  9: REACT_NATIVE_DAY_9_DETAIL,
  10: REACT_NATIVE_DAY_10_DETAIL,
  11: REACT_NATIVE_DAY_11_DETAIL,
  12: REACT_NATIVE_DAY_12_DETAIL,
  13: REACT_NATIVE_DAY_13_DETAIL,
  14: REACT_NATIVE_DAY_14_DETAIL,
  15: REACT_NATIVE_DAY_15_DETAIL,
  16: REACT_NATIVE_DAY_16_DETAIL,
  17: REACT_NATIVE_DAY_17_DETAIL,
  18: REACT_NATIVE_DAY_18_DETAIL,
  19: REACT_NATIVE_DAY_19_DETAIL,
  20: REACT_NATIVE_DAY_20_DETAIL,
};

const DOT: Record<string, string> = {
  "rn-w1": "bg-sky-500",
  "rn-w2": "bg-cyan-500",
  "rn-w3": "bg-teal-500",
  "rn-w4": "bg-emerald-500",
  "rn-w5": "bg-lime-500",
  "rn-w6": "bg-amber-500",
  "rn-w7": "bg-orange-500",
  "rn-w8": "bg-violet-500",
  "rn-w9": "bg-fuchsia-500",
  "rn-w10": "bg-[var(--accent)]",
};

function reactNativeDayRow(day: number, tagSlugs: [string, string]): RoadmapDay {
  return {
    day,
    title: reactNativeDayTitle(day),
    tags: reactNativeTags(tagSlugs),
    detail: REACT_NATIVE_DAY_DETAILS[day],
  };
}

export const REACT_NATIVE_ROADMAP_WEEKS: RoadmapWeek[] = [
  {
    id: "rn-w1",
    title: reactNativeWeekTitle("rn-w1"),
    dotClass: DOT["rn-w1"],
    days: [
      reactNativeDayRow(1, ["fundamentals", "expo"]),
      reactNativeDayRow(2, ["expo", "metro"]),
    ],
  },
  {
    id: "rn-w2",
    title: reactNativeWeekTitle("rn-w2"),
    dotClass: DOT["rn-w2"],
    days: [
      reactNativeDayRow(3, ["metro", "toolchain"]),
      reactNativeDayRow(4, ["toolchain", "platform"]),
    ],
  },
  {
    id: "rn-w3",
    title: reactNativeWeekTitle("rn-w3"),
    dotClass: DOT["rn-w3"],
    days: [
      reactNativeDayRow(5, ["toolchain", "jsx"]),
      reactNativeDayRow(6, ["core-ui", "jsx"]),
    ],
  },
  {
    id: "rn-w4",
    title: reactNativeWeekTitle("rn-w4"),
    dotClass: DOT["rn-w4"],
    days: [
      reactNativeDayRow(7, ["core-ui", "platform"]),
      reactNativeDayRow(8, ["flexbox", "styling"]),
    ],
  },
  {
    id: "rn-w5",
    title: reactNativeWeekTitle("rn-w5"),
    dotClass: DOT["rn-w5"],
    days: [
      reactNativeDayRow(9, ["screens", "styling"]),
      reactNativeDayRow(10, ["styling", "lists"]),
    ],
  },
  {
    id: "rn-w6",
    title: reactNativeWeekTitle("rn-w6"),
    dotClass: DOT["rn-w6"],
    days: [
      reactNativeDayRow(11, ["lists", "performance"]),
      reactNativeDayRow(12, ["inputs", "forms"]),
    ],
  },
  {
    id: "rn-w7",
    title: reactNativeWeekTitle("rn-w7"),
    dotClass: DOT["rn-w7"],
    days: [
      reactNativeDayRow(13, ["forms", "inputs"]),
      reactNativeDayRow(14, ["navigation", "toolchain"]),
    ],
  },
  {
    id: "rn-w8",
    title: reactNativeWeekTitle("rn-w8"),
    dotClass: DOT["rn-w8"],
    days: [
      reactNativeDayRow(15, ["native", "shipping"]),
      reactNativeDayRow(16, ["permissions", "native"]),
    ],
  },
  {
    id: "rn-w9",
    title: reactNativeWeekTitle("rn-w9"),
    dotClass: DOT["rn-w9"],
    days: [
      reactNativeDayRow(17, ["navigation", "hooks"]),
      reactNativeDayRow(18, ["networking", "caching"]),
    ],
  },
  {
    id: "rn-w10",
    title: reactNativeWeekTitle("rn-w10"),
    dotClass: DOT["rn-w10"],
    days: [
      reactNativeDayRow(19, ["auth", "caching"]),
      reactNativeDayRow(20, ["notifications", "shipping"]),
    ],
  },
];

export function getAllReactNativeRoadmapDays(): RoadmapDay[] {
  return REACT_NATIVE_ROADMAP_WEEKS.flatMap((w) => w.days).sort((a, b) => a.day - b.day);
}

export function getReactNativeRoadmapDayContext(
  dayNumber: number,
): { weekTitle: LocalizedString; day: RoadmapDay } | null {
  for (const week of REACT_NATIVE_ROADMAP_WEEKS) {
    const day = week.days.find((d) => d.day === dayNumber);
    if (day) return { weekTitle: week.title, day };
  }
  return null;
}

const DEFAULT_BULLETS: LocalizedString[] = [
  {
    en: "Summarize the learning goal in one sentence before expanding notes.",
    np: "फैलाइएअघि एक वाक्य।",
    jp: "広げる前に今日の目標を一文で言えるようにする。",
  },
];

export function resolveReactNativeDayDetail(day: RoadmapDay): RoadmapDayDetail {
  if (day.detail) return day.detail;
  return { bullets: [...DEFAULT_BULLETS] };
}

export function seedReactNativeCompletedDayNumbers(): Set<number> {
  const done = new Set<number>();
  for (let d = 1; d < REACT_NATIVE_CURRENT_DAY; d += 1) done.add(d);
  return done;
}
