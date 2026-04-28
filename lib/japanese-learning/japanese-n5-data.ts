import { buildJapaneseDayDetail } from "@/lib/japanese-learning/build-japanese-detail";
import { JP_N5_LESSON_SPECS } from "@/lib/japanese-learning/n5-lessons";
import { N5_FULL_LEVEL_MOCK_EXAM } from "@/lib/japanese-learning/n5-full-mock-exam";
import { N5_WEEKLY_JLPT_TESTS } from "@/lib/japanese-learning/n5-weekly-tests";
import type {
  JapaneseRoadmapDay,
  JapaneseRoadmapDayDetail,
  JapaneseRoadmapWeek,
  JapaneseWeeklyTest,
} from "@/lib/japanese-learning/types";

export const JP_TOTAL_DAYS = 30;

/** Stable ids for weekly JLPT-style tests (one per week) plus the course-wide full mock. */
export const N5_WEEKLY_TEST_IDS = [...N5_WEEKLY_JLPT_TESTS.map((t) => t.id), N5_FULL_LEVEL_MOCK_EXAM.id];

export const JP_WEEKLY_TEST_TOTAL = N5_WEEKLY_TEST_IDS.length;

/** Overall JLPT N5 mock (Days 1–30) — same panel UX as weekly tests. */
export const JAPANESE_N5_FULL_LEVEL_MOCK = N5_FULL_LEVEL_MOCK_EXAM;

/** Official “current” day for Japanese track — days before this seed as done in localStorage. */
export const JP_CURRENT_DAY = 1;

/** Short titles shown on cards — Minna lessons 1–25 map to Days 1–25; 26–30 are JLPT N5 sprint days. */
export const JP_N5_DAY_TITLES: string[] = [
  "Day 1 · Minna L1 — は／です／じこしょうかい",
  "Day 2 · Minna L2 — これ／それ／あれ & price",
  "Day 3 · Minna L3 — existenceある & place に",
  "Day 4 · Minna L4 — ます／ました & object を",
  "Day 5 · Minna L5 — movement へ／で／と",
  "Day 6 · Minna L6 — transitive verbs & で／を",
  "Day 7 · Minna L7 — あげる／もらう",
  "Day 8 · Minna L8 — い／な adjectives",
  "Day 9 · Minna L9 — すき／じょうず／わかる／から",
  "Day 10 · Minna L10 — います／あります locations",
  "Day 11 · Minna L11 — counters & quantities",
  "Day 12 · Minna L12 — comparison & past adj.",
  "Day 13 · Minna L13 — ほしい／たい／purpose にいく",
  "Day 14 · Minna L14 — てください／ている",
  "Day 15 · Minna L15 — permission & prohibition",
  "Day 16 · Minna L16 — てから & reasons",
  "Day 17 · Minna L17 — negative requests & obligation relief",
  "Day 18 · Minna L18 — dictionary form & ことができる",
  "Day 19 · Minna L19 — experience たことがある & なる",
  "Day 20 · Minna L20 — casual/plain basics",
  "Day 21 · Minna L21 — とおもう／という",
  "Day 22 · Minna L22 — relative clauses",
  "Day 23 · Minna L23 — とき condition clauses",
  "Day 24 · Minna L24 — てあげる／くれる／もらう advanced",
  "Day 25 · Minna L25 — たら／ても conditionals",
  "Day 26 · Sprint — grammar lattice review",
  "Day 27 · Sprint — listening tactics",
  "Day 28 · Sprint — kanji & vocab speed",
  "Day 29 · Sprint — reading & particles",
  "Day 30 · Sprint — mock exam mindset",
];

function jpOverview(day: number): string[] {
  const spec = JP_N5_LESSON_SPECS[day - 1];
  const focus =
    spec.minnaLesson !== null
      ? `Anchor today on Minna no Nihongo I Lesson ${spec.minnaLesson}: repeat the textbook dialogue until you can shadow without reading.`
      : `Integration sprint — rotate weak skills from Lessons 1–25 before sitting a timed JLPT N5-style practice set.`;
  return [
    focus,
    `Split study into three passes — input (listen/read), pattern drills (particles & grammar tables), and output (say or hand-write two fresh sentences).`,
  ];
}

function tagsForDay(day: number): { label: string; slug: string }[] {
  const base = [
    { label: "JLPT N5", slug: "jlpt-n5" },
    { label: "Minna no Nihongo I", slug: "minna" },
  ];
  if (day >= 26) {
    return [...base, { label: "Exam sprint", slug: "sprint" }];
  }
  if (day % 4 === 0) return [...base, { label: "Listening", slug: "listening" }];
  if (day % 4 === 1) return [...base, { label: "Grammar", slug: "grammar" }];
  if (day % 4 === 2) return [...base, { label: "Particles", slug: "particles" }];
  return [...base, { label: "Kanji", slug: "kanji" }];
}

function buildDay(day: number): JapaneseRoadmapDay {
  const title = JP_N5_DAY_TITLES[day - 1];
  const spec = JP_N5_LESSON_SPECS[day - 1];
  return {
    day,
    title,
    tags: tagsForDay(day),
    detail: buildJapaneseDayDetail(day, title, jpOverview(day), spec),
  };
}

function weeklyTestForWeekId(weekId: string): JapaneseWeeklyTest | undefined {
  return N5_WEEKLY_JLPT_TESTS.find((t) => t.id === weekId);
}

export const JAPANESE_N5_WEEKS: JapaneseRoadmapWeek[] = [
  {
    id: "jn5-w1",
    title: "Week 1 · Lessons 1–7 · greetings through giving/receiving",
    dotClass: "bg-rose-500",
    days: [1, 2, 3, 4, 5, 6, 7].map(buildDay),
    weeklyTest: weeklyTestForWeekId("jn5-w1"),
  },
  {
    id: "jn5-w2",
    title: "Week 2 · Lessons 8–14 · adjectives through て-form",
    dotClass: "bg-pink-500",
    days: [8, 9, 10, 11, 12, 13, 14].map(buildDay),
    weeklyTest: weeklyTestForWeekId("jn5-w2"),
  },
  {
    id: "jn5-w3",
    title: "Week 3 · Lessons 15–21 · rules through とおもう",
    dotClass: "bg-fuchsia-500",
    days: [15, 16, 17, 18, 19, 20, 21].map(buildDay),
    weeklyTest: weeklyTestForWeekId("jn5-w3"),
  },
  {
    id: "jn5-w4",
    title: "Week 4 · Lessons 22–25 · relatives through conditionals",
    dotClass: "bg-purple-500",
    days: [22, 23, 24, 25, 26, 27, 28].map(buildDay),
    weeklyTest: weeklyTestForWeekId("jn5-w4"),
  },
  {
    id: "jn5-w5",
    title: "Week 5 · JLPT N5 sprint & mock mindset",
    dotClass: "bg-indigo-500",
    days: [29, 30].map(buildDay),
    weeklyTest: weeklyTestForWeekId("jn5-w5"),
  },
];

export function getAllJapaneseN5Days(): JapaneseRoadmapDay[] {
  return JAPANESE_N5_WEEKS.flatMap((w) => w.days).sort((a, b) => a.day - b.day);
}

export function getJapaneseN5DayContext(
  dayNumber: number,
): { weekTitle: string; day: JapaneseRoadmapDay } | null {
  for (const week of JAPANESE_N5_WEEKS) {
    const day = week.days.find((d) => d.day === dayNumber);
    if (day) return { weekTitle: week.title, day };
  }
  return null;
}

export function resolveJapaneseN5Detail(day: JapaneseRoadmapDay): JapaneseRoadmapDayDetail {
  if (day.detail) return day.detail;
  return {
    overview: `Study focus: ${day.title}.`,
    bullets: ["Summarize today’s grammar in one English sentence.", "Shadow audio twice.", "Write four kanji from memory."],
  };
}

export function seedJapaneseN5CompletedDayNumbers(): Set<number> {
  const done = new Set<number>();
  for (let d = 1; d < JP_CURRENT_DAY; d += 1) done.add(d);
  return done;
}

export function resolveJapaneseWeeklyTestForRoadmap(openWeekOrMockId: string): JapaneseWeeklyTest | undefined {
  if (openWeekOrMockId === N5_FULL_LEVEL_MOCK_EXAM.id) return N5_FULL_LEVEL_MOCK_EXAM;
  return JAPANESE_N5_WEEKS.find((w) => w.id === openWeekOrMockId)?.weeklyTest;
}
