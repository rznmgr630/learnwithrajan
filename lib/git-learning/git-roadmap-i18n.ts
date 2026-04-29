import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapTag } from "@/lib/challenge-data";

export const GIT_TAG: Record<string, LocalizedString> = {
  fundamentals: {
    en: "fundamentals",
    np: "आधारभूत",
    jp: "基礎",
  },
  workflow: {
    en: "workflow",
    np: "कार्यप्रवाह",
    jp: "ワークフロー",
  },
  history: {
    en: "history",
    np: "इतिहास",
    jp: "履歴",
  },
  branching: {
    en: "branching",
    np: "ब्रान्चिङ",
    jp: "ブランチ",
  },
  remote: {
    en: "remote",
    np: "रिमोट",
    jp: "リモート",
  },
  collaboration: {
    en: "collaboration",
    np: "सहकार्य",
    jp: "共同作業",
  },
  advanced: {
    en: "advanced",
    np: "उन्नत",
    jp: "応用",
  },
  safety: {
    en: "safety",
    np: "सुरक्षा",
    jp: "安全性",
  },
  worktree: {
    en: "worktree",
    np: "वर्कट्री",
    jp: "worktree",
  },
};

export function gitTags(slugs: [string, string]): RoadmapTag[] {
  return [
    { slug: slugs[0], label: GIT_TAG[slugs[0]] ?? { en: slugs[0], np: slugs[0], jp: slugs[0] } },
    { slug: slugs[1], label: GIT_TAG[slugs[1]] ?? { en: slugs[1], np: slugs[1], jp: slugs[1] } },
  ];
}

const GIT_DAY_TITLE: Record<number, LocalizedString> = {
  1: {
    en: "Repository basics & the three states",
    np: "रेपो आधारभूत र तीन अवस्थाहरू",
    jp: "リポジトリの基礎と3つの状態",
  },
  2: {
    en: "Inspect history: log, diff, amend",
    np: "इतिहास हेर्नुहोस्: log, diff, amend",
    jp: "履歴の確認: log / diff / amend",
  },
  3: {
    en: "Branches & merges",
    np: "ब्रान्च र मर्ज",
    jp: "ブランチとマージ",
  },
  4: {
    en: "Remotes: fetch, pull, push",
    np: "रिमोट: fetch, pull, push",
    jp: "リモート: fetch / pull / push",
  },
  5: {
    en: "Rebase vs merge — linear history",
    np: "Rebase बनाम merge — रेखीय इतिहास",
    jp: "リベースとマージ — 直線的な履歴",
  },
  6: {
    en: "Stash, cherry-pick, reset & worktrees",
    np: "Stash, cherry-pick, reset र worktree",
    jp: "stash / cherry-pick / reset と worktree",
  },
  7: {
    en: "Team flow: PRs, hooks & bisect intro",
    np: "टोली प्रवाह: PR, hooks र bisect परिचय",
    jp: "チーム運用: PR・フック・bisect 入門",
  },
};

export function gitDayTitle(day: number): LocalizedString {
  return GIT_DAY_TITLE[day] ?? { en: `Day ${day}`, np: `दिन ${day}`, jp: `Day ${day}` };
}

const GIT_WEEK_TITLE: Record<string, LocalizedString> = {
  "git-basics": {
    en: "Basics (days 1–2)",
    np: "आधारभूत (दिन १–२)",
    jp: "基礎（1〜2日目）",
  },
  "git-advanced": {
    en: "Advanced (days 3–7)",
    np: "उन्नत (दिन ३–७)",
    jp: "応用（3〜7日目）",
  },
};

export function gitWeekTitle(weekId: string): LocalizedString {
  return GIT_WEEK_TITLE[weekId] ?? { en: weekId, np: weekId, jp: weekId };
}
