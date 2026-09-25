import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDay, RoadmapDayDetail, RoadmapWeek } from "@/lib/challenge-data";
import {
  reactNativeDayTitle,
  reactNativeTags,
} from "@/lib/react-native-learning/react-native-roadmap-i18n";

export const REACT_NATIVE_CURRENT_DAY = 1;

export const REACT_NATIVE_TOTAL_DAYS = 49;

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
  };
}

export const REACT_NATIVE_ROADMAP_WEEKS: RoadmapWeek[] = [
  {
    id: "rn-w0",
    title: { en: "Phase 0 · Preparation", np: "Phase 0 · तयारी", jp: "Phase 0 · 準備" },
    dotClass: "bg-[color-mix(in_oklab,var(--accent)_45%,#94a3b8)]",
    days: [reactNativeDayRow(0, ["prerequisites", "toolchain"])],
  },
  {
    id: "rn-w1",
    title: { en: "PHASE 1 · RN FOUNDATIONS (Days 1–6)", np: "PHASE 1 · RN आधार (दिन १–६)", jp: "PHASE 1 · RN 基礎 (1〜6日目)" },
    dotClass: DOT["rn-w1"],
    days: [
      reactNativeDayRow(1, ["fundamentals", "expo"]),
      reactNativeDayRow(2, ["fundamentals", "native"]),
      reactNativeDayRow(3, ["core-ui", "jsx"]),
      reactNativeDayRow(4, ["styling", "core-ui"]),
      reactNativeDayRow(5, ["navigation", "screens"]),
      reactNativeDayRow(6, ["lists", "performance"]),
    ],
  },
  {
    id: "rn-phase2",
    title: { en: "PHASE 2 · MOBILE PLATFORM (Days 7–14)", np: "PHASE 2 · MOBILE PLATFORM (दिन ७–१४)", jp: "PHASE 2 · MOBILE PLATFORM (7〜14日目)" },
    dotClass: DOT["rn-w2"],
    days: [
      reactNativeDayRow(7, ["gestures", "animation"]),
      reactNativeDayRow(8, ["device", "permissions"]),
      reactNativeDayRow(9, ["lifecycle", "platform"]),
      reactNativeDayRow(10, ["storage", "caching"]),
      reactNativeDayRow(11, ["networking", "caching"]),
      reactNativeDayRow(12, ["notifications", "platform"]),
      reactNativeDayRow(13, ["media", "files"]),
      reactNativeDayRow(14, ["webview", "security"]),
    ],
  },
  {
    id: "rn-phase3",
    title: { en: "PHASE 3 · APPLICATION ARCHITECTURE (Days 15–21)", np: "PHASE 3 · APPLICATION ARCHITECTURE (दिन १५–२१)", jp: "PHASE 3 · APPLICATION ARCHITECTURE (15〜21日目)" },
    dotClass: DOT["rn-w3"],
    days: [
      reactNativeDayRow(15, ["state", "architecture"]),
      reactNativeDayRow(16, ["forms", "validation"]),
      reactNativeDayRow(17, ["react", "hooks"]),
      reactNativeDayRow(18, ["typescript", "architecture"]),
      reactNativeDayRow(19, ["server-state", "caching"]),
      reactNativeDayRow(20, ["offline", "sync"]),
      reactNativeDayRow(21, ["auth", "security"]),
    ],
  },
  {
    id: "rn-phase4",
    title: { en: "PHASE 4 · NATIVE ENGINEERING (Days 22–28)", np: "PHASE 4 · NATIVE ENGINEERING (दिन २२–२८)", jp: "PHASE 4 · NATIVE ENGINEERING (22〜28日目)" },
    dotClass: DOT["rn-w4"],
    days: [
      reactNativeDayRow(22, ["native-modules", "turbo-modules"]),
      reactNativeDayRow(23, ["fabric", "native"]),
      reactNativeDayRow(24, ["ios", "native"]),
      reactNativeDayRow(25, ["android", "native"]),
      reactNativeDayRow(26, ["build", "configuration"]),
      reactNativeDayRow(27, ["platform", "permissions"]),
      reactNativeDayRow(28, ["native-modules", "publishing"]),
    ],
  },
  {
    id: "rn-phase5",
    title: { en: "PHASE 5 · QUALITY (Days 29–35)", np: "PHASE 5 · QUALITY (दिन २९–३५)", jp: "PHASE 5 · QUALITY (29〜35日目)" },
    dotClass: DOT["rn-w5"],
    days: [
      reactNativeDayRow(29, ["testing", "quality"]),
      reactNativeDayRow(30, ["debugging", "devtools"]),
      reactNativeDayRow(31, ["performance", "devtools"]),
      reactNativeDayRow(32, ["accessibility", "quality"]),
      reactNativeDayRow(33, ["observability", "quality"]),
      reactNativeDayRow(34, ["security", "native"]),
      reactNativeDayRow(35, ["auth", "supply-chain"]),
    ],
  },
  {
    id: "rn-phase6",
    title: { en: "PHASE 6 · PRODUCTION (Days 36–40)", np: "PHASE 6 · PRODUCTION (दिन ३६–४०)", jp: "PHASE 6 · PRODUCTION (36〜40日目)" },
    dotClass: DOT["rn-w6"],
    days: [
      reactNativeDayRow(36, ["ci-cd", "eas"]),
      reactNativeDayRow(37, ["ota", "versioning"]),
      reactNativeDayRow(38, ["app-store", "submission"]),
      reactNativeDayRow(39, ["play-store", "submission"]),
      reactNativeDayRow(40, ["release", "observability"]),
    ],
  },
  {
    id: "rn-phase7",
    title: { en: "PHASE 7 · ADVANCED ARCHITECTURE (Days 41–45)", np: "PHASE 7 · ADVANCED ARCHITECTURE (दिन ४१–४५)", jp: "PHASE 7 · ADVANCED ARCHITECTURE (41〜45日目)" },
    dotClass: DOT["rn-w7"],
    days: [
      reactNativeDayRow(41, ["animation", "skia"]),
      reactNativeDayRow(42, ["monorepo", "code-sharing"]),
      reactNativeDayRow(43, ["architecture", "testing"]),
      reactNativeDayRow(44, ["capstone", "native-modules"]),
      reactNativeDayRow(45, ["ecosystem", "upgrades"]),
    ],
  },
  {
    id: "rn-electives",
    title: { en: "ELECTIVES", np: "ELECTIVES", jp: "選択科目" },
    dotClass: DOT["rn-w8"],
    days: [
      {
        ...reactNativeDayRow(46, ["expo-router", "navigation"]),
        label: { en: "Elective A", np: "Elective A", jp: "選択科目 A" },
      },
      {
        ...reactNativeDayRow(47, ["skia", "custom-rendering"]),
        label: { en: "Elective B", np: "Elective B", jp: "選択科目 B" },
      },
      {
        ...reactNativeDayRow(48, ["beyond-phones", "platform"]),
        label: { en: "Elective C", np: "Elective C", jp: "選択科目 C" },
      },
      {
        ...reactNativeDayRow(49, ["universal-web", "architecture"]),
        label: { en: "Elective D", np: "Elective D", jp: "選択科目 D" },
      },
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
