import type { JapaneseWeeklyTest } from "@/lib/japanese-learning/types";
import { buildWeek1SubTests } from "@/lib/japanese-learning/n5-week1-subtests";
import { buildWeek2SubTests } from "@/lib/japanese-learning/n5-week2-subtests";
import { buildWeek3SubTests } from "@/lib/japanese-learning/n5-week3-subtests";
import { buildWeek4SubTests } from "@/lib/japanese-learning/n5-week4-subtests";
import { buildWeek5SubTests } from "@/lib/japanese-learning/n5-week5-subtests";

export const N5_WEEKLY_JLPT_TESTS: JapaneseWeeklyTest[] = [
  {
    id: "jn5-w1",
    weekLabel: "Week 1",
    title: "Unit tests · Recap (Days 1–7)",
    subtitle: "Five JLPT N5-style papers · 20 questions each · Minna Lessons 1–7",
    coversDayRange: [1, 7],
    intro:
      "Week 1 includes five separate mock exams (Test 1–5). Each paper has 20 scored multiple-choice items covering vocabulary & kanji, grammar, reading, and listening (with a short embedded clip plus links). The five tests use different question sets — complete one at a time and submit to see your score and explanations.",
    closingNote:
      "Aim for roughly 70% on first try when you self-grade. If you miss several items in one section, re-open those Minna lessons and shadow the audio again before Week 2.",
    sections: [],
    subTests: buildWeek1SubTests(),
  },
  {
    id: "jn5-w2",
    weekLabel: "Week 2",
    title: "Unit tests · Recap (Days 8–14)",
    subtitle: "Five JLPT N5-style papers · 20 questions each · Minna Lessons 8–14",
    coversDayRange: [8, 14],
    intro:
      "Week 2 includes five separate mock exams (Test 1–5), each with distinct questions. Topics include i/na adjectives, comparisons, ～てください, and ～ている. Same submission flow as Week 1.",
    closingNote:
      "Weak on adjective conjugation? Drill present ↔ past ↔ negative on paper before Week 3.",
    sections: [],
    subTests: buildWeek2SubTests(),
  },
  {
    id: "jn5-w3",
    weekLabel: "Week 3",
    title: "Unit tests · Recap (Days 15–21)",
    subtitle: "Five JLPT N5-style papers · 20 questions each · Minna Lessons 15–21",
    coversDayRange: [15, 21],
    intro:
      "Week 3 includes five separate mock exams (Test 1–5). Focus areas: permission / prohibition, なくてもいい／なければならない, てから, past experience (～たことがある), and とおもう — each test uses a different pool of items.",
    closingNote:
      "If と-condition or とおもう trips you up, rewrite five sentences from your notes into negative and past forms.",
    sections: [],
    subTests: buildWeek3SubTests(),
  },
  {
    id: "jn5-w4",
    weekLabel: "Week 4",
    title: "Unit tests · Recap (Days 22–28)",
    subtitle: "Five JLPT N5-style papers · 20 questions each · Minna Lessons 22–25 + sprint",
    coversDayRange: [22, 28],
    intro:
      "Week 4 includes five separate mock exams (Test 1–5). Content blends とき／ばあい, たら／もし, てあげる／くれる／もらう, relative clauses before nouns, and sprint-style listening — five distinct papers.",
    closingNote:
      "Missed とき or たら sets? Write five minimal pairs (same noun, different clause type) from your notes.",
    sections: [],
    subTests: buildWeek4SubTests(),
  },
  {
    id: "jn5-w5",
    weekLabel: "Week 5",
    title: "Unit tests · Final sprint (Days 29–30)",
    subtitle: "Five JLPT N5-style papers · 20 questions each",
    coversDayRange: [29, 30],
    intro:
      "Week 5 includes five separate mock exams (Test 1–5). Each has 20 scored multiple-choice items covering vocabulary & kanji, grammar, reading, and listening (with a short embedded clip plus links). Complete one test at a time — submit to see your score and explanations.",
    closingNote:
      "Before a real JLPT, sit one timed external mock from a publisher; these five papers are for breadth and self-check only.",
    sections: [],
    subTests: buildWeek5SubTests(),
  },
];
