import { lookupKanjiEntries } from "@/lib/japanese-learning/n5/n5-kanji-pool";
import type { KanjiStrokeEntry } from "@/lib/japanese-learning/n5/n5-kanji-pool";

/**
 * Strict no-repeat kanji assignment across lesson days.
 *
 * Days 1–11  — all 98 pool kanji distributed exactly once, grouped by theme.
 * Days 12–25 — empty (grammar-focus lessons; kanji section is hidden by the component).
 * Days 26–30 — curated review sets for sprint/mock-exam prep (intentional re-exposure).
 *
 * Characters must exist in n5-kanji-pool.ts ROWS — unknowns are silently skipped.
 */
export const N5_KANJI_BY_DAY: Record<number, string[]> = {

  // ── Lesson 1 — は/です, self-introduction, jobs ─────────────────────────────
  // Numbers 1–10  |  People / roles / question word
  1: [
    "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",  // numbers 1–10
    "私", "先", "生", "学", "人", "名", "会", "社", "員", "何",  // people / jobs / question
  ],

  // ── Lesson 2 — これ/それ/あれ, things, prices ──────────────────────────────
  // Directions (compass + vertical)  |  Things & value adjectives
  2: [
    "上", "下", "左", "右", "前", "後", "北", "南", "東", "西",  // directions
    "本", "百", "千", "万", "大", "小", "高", "安", "長", "白",  // things / adjectives
  ],

  // ── Lesson 3 — ここ/そこ/あそこ, places, floors ────────────────────────────
  // Rooms / buildings  |  Position (inside/middle)  |  Communication  |  Country / food
  3: [
    "室", "堂", "場", "校",  // rooms / buildings (教室 食堂 売り場 学校)
    "中",                    // inside / middle (floor context)
    "話",                    // speak / telephone (電話)
    "国",                    // country (お国)
    "食",                    // eat / food (食堂)
  ],

  // ── Lesson 4 — ます/ました, daily actions ───────────────────────────────────
  // Literacy  |  Senses  |  Drink  |  Movement  |  Time-now
  4: [
    "読", "書",              // literacy
    "見", "聞",              // senses
    "飲",                    // drink
    "来", "行", "出", "入",  // movement
    "今",                    // time — now
  ],

  // ── Lesson 5 — movement へ/で/と, transport ────────────────────────────────
  // Transport: station, car, electric (電車), shop
  5: [
    "駅", "車", "電", "店",  // station / car / electric (train) / shop
  ],

  // ── Lesson 6 — transitive verbs, food, weekday context ────────────────────
  // Five-element / weekday kanji (月曜〜土曜)
  6: [
    "水", "火", "木", "金", "土",  // water, fire, wood, gold, earth (weekdays)
  ],

  // ── Lesson 7 — あげる/もらう, giving/receiving, family ────────────────────
  // Parents  |  Older siblings  |  Younger siblings  |  Other people  |  Hand (手紙)
  7: [
    "父", "母",              // parents
    "兄", "姉",              // older siblings
    "弟", "妹",              // younger siblings
    "友", "子", "女",        // other people
    "手",                    // hand (手紙 = letter)
  ],

  // ── Lesson 8 — い/な adjectives ───────────────────────────────────────────
  // New / old  |  Man  |  Stone  |  Time & calendar  |  Places
  8: [
    "新", "古",              // age — new / old
    "男",                    // man (contrast with 女 from Day 7)
    "石",                    // stone
    "月", "年", "秒", "歳",  // time & calendar (month/moon, year, second, age-counter)
    "寺", "刀",              // places / objects (temple, katana)
  ],

  // ── Lesson 9 — すき/じょうず/わかる, preferences & hobbies ────────────────
  // Language  |  Geography / nature  |  Body / strength
  9: [
    "語",              // language (日本語 英語)
    "山", "川", "花",  // geography / nature
    "耳", "足", "力",  // body parts / strength
  ],

  // ── Lesson 10 — います/あります, existence & location ─────────────────────
  // Weather / sky  |  Animal  |  Land
  10: [
    "天", "気", "雨",  // weather / sky
    "犬",              // dog (animal)
    "田",              // rice field / land
  ],

  // ── Lesson 11 — counters & time ───────────────────────────────────────────
  // Time words: day/sun, hour, minute, half, noon
  11: [
    "日", "時", "分", "半", "午",  // time counters
  ],

  // ── Lessons 12–25 — grammar-focus lessons (no new kanji) ──────────────────
  // All 98 pool kanji have been introduced by Day 11.
  // The kanji accordion is hidden by the component when this array is empty.
  12: [], 13: [], 14: [], 15: [], 16: [], 17: [], 18: [], 19: [],
  20: [], 21: [], 22: [], 23: [], 24: [], 25: [],

  // ── Sprint Day 26 — numbers & counting review ──────────────────────────────
  26: [
    "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",  // 1–10
    "百", "千", "万", "日", "時", "分", "半", "午",              // large numbers + time
  ],

  // ── Sprint Day 27 — people, roles & places review ─────────────────────────
  27: [
    "私", "先", "生", "学", "人", "名", "何",  // people / study
    "会", "社", "員",                          // organizations
    "室", "堂", "場", "校", "国",              // places / buildings
  ],

  // ── Sprint Day 28 — verbs & communication review ──────────────────────────
  28: [
    "読", "書", "見", "聞", "話", "語",  // literacy / communication
    "食", "飲",                          // food & drink
    "来", "行", "出", "入",              // movement
    "駅", "車", "電",                    // transport
  ],

  // ── Sprint Day 29 — directions & adjectives review ────────────────────────
  29: [
    "上", "下", "左", "右", "前", "後", "北", "南", "東", "西",  // directions
    "大", "小", "高", "安", "長", "白", "新", "古",              // adjectives
  ],

  // ── Sprint Day 30 — family, nature & body review (mock exam) ──────────────
  30: [
    "父", "母", "兄", "姉", "弟", "妹", "友", "子", "女", "手",  // family / people
    "水", "火", "木", "金", "土", "天", "気", "雨",              // elements / weather
    "山", "川", "花", "石", "田", "犬",                          // nature / animals
    "耳", "足", "力",                                            // body
  ],
};

/** Return the KanjiStrokeEntry list for a given day, ready for the KanjiSection component. */
export function kanjiForDay(day: number): KanjiStrokeEntry[] {
  return lookupKanjiEntries(N5_KANJI_BY_DAY[day] ?? []);
}
