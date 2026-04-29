import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDay, RoadmapDayDetail, RoadmapWeek } from "@/lib/challenge-data";
import {
  GIT_DAY_1_DETAIL,
  GIT_DAY_2_DETAIL,
  GIT_DAY_3_DETAIL,
  GIT_DAY_4_DETAIL,
  GIT_DAY_5_DETAIL,
  GIT_DAY_6_DETAIL,
  GIT_DAY_7_DETAIL,
} from "@/lib/git-learning/git-day-details";
import { gitDayTitle, gitTags, gitWeekTitle } from "@/lib/git-learning/git-roadmap-i18n";

/** Official “current” day (1-based) for seeding local progress. */
export const GIT_CURRENT_DAY = 1;

export const GIT_TOTAL_DAYS = 7;

const GIT_DAY_DETAILS: Record<number, RoadmapDayDetail> = {
  1: GIT_DAY_1_DETAIL,
  2: GIT_DAY_2_DETAIL,
  3: GIT_DAY_3_DETAIL,
  4: GIT_DAY_4_DETAIL,
  5: GIT_DAY_5_DETAIL,
  6: GIT_DAY_6_DETAIL,
  7: GIT_DAY_7_DETAIL,
};

function gitDayRow(day: number, tagSlugs: [string, string]): RoadmapDay {
  return {
    day,
    title: gitDayTitle(day),
    tags: gitTags(tagSlugs),
    detail: GIT_DAY_DETAILS[day],
  };
}

export const GIT_ROADMAP_WEEKS: RoadmapWeek[] = [
  {
    id: "git-basics",
    title: gitWeekTitle("git-basics"),
    dotClass: "bg-[var(--accent)]",
    days: [gitDayRow(1, ["fundamentals", "workflow"]), gitDayRow(2, ["history", "workflow"])],
  },
  {
    id: "git-advanced",
    title: gitWeekTitle("git-advanced"),
    dotClass: "bg-[var(--accent)]",
    days: [
      gitDayRow(3, ["branching", "fundamentals"]),
      gitDayRow(4, ["remote", "collaboration"]),
      gitDayRow(5, ["advanced", "branching"]),
      gitDayRow(6, ["advanced", "worktree"]),
      gitDayRow(7, ["collaboration", "advanced"]),
    ],
  },
];

export function getAllGitRoadmapDays(): RoadmapDay[] {
  return GIT_ROADMAP_WEEKS.flatMap((w) => w.days).sort((a, b) => a.day - b.day);
}

export function getGitRoadmapDayContext(dayNumber: number): { weekTitle: LocalizedString; day: RoadmapDay } | null {
  for (const week of GIT_ROADMAP_WEEKS) {
    const day = week.days.find((d) => d.day === dayNumber);
    if (day) return { weekTitle: week.title, day };
  }
  return null;
}

function titleTriple(title: LocalizedString): { en: string; np: string; jp: string } {
  if (typeof title === "string") return { en: title, np: title, jp: title };
  return title;
}

const GIT_DEFAULT_DETAIL_BULLETS: LocalizedString[] = [
  {
    en: "Summarize the day’s goal in one sentence.",
    np: "दिनको लक्ष्य एक वाक्यमा सार्नुहोस्।",
    jp: "今日の目標を一文でまとめる。",
  },
  {
    en: "Run the commands in a scratch repo and paste notes in your journal.",
    np: "आदेशहरू खेलौना रेपोमा चलाउनुहोस्।",
    jp: "手元の練習リポでコマンドを試し、メモを残す。",
  },
];

export function resolveGitDayDetail(day: RoadmapDay): RoadmapDayDetail {
  if (day.detail) return day.detail;
  const tp = titleTriple(day.title);
  return {
    overview: {
      en: `Focus for today: ${tp.en}.`,
      np: `आजको फोकस: ${tp.np}।`,
      jp: `今日の焦点：${tp.jp}。`,
    },
    bullets: [...GIT_DEFAULT_DETAIL_BULLETS],
  };
}

export function seedGitCompletedDayNumbers(): Set<number> {
  const done = new Set<number>();
  for (let d = 1; d < GIT_CURRENT_DAY; d += 1) done.add(d);
  return done;
}
