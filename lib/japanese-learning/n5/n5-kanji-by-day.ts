import { lookupKanjiEntries } from "@/lib/japanese-learning/n5/n5-kanji-pool";
import type { KanjiStrokeEntry } from "@/lib/japanese-learning/n5/n5-kanji-pool";

/**
 * Strict no-repeat kanji assignment across lesson days.
 *
 * Days 1–13  — all pool kanji distributed exactly once, grouped from simpler to more complex themes.
 * Days 14–25 — empty (grammar-focus lessons; kanji section is hidden by the component).
 * Days 26–30 — curated review sets for sprint/mock-exam prep (intentional re-exposure).
 *
 * Characters must exist in n5-kanji-pool.ts ROWS — unknowns are silently skipped.
 */
export const N5_KANJI_BY_DAY: Record<number, string[]> = {

  // ── Day 1 — numbers ─────────────────────────────────────────────────────────
  1: [
    "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
  ],

  // ── Day 2 — numbers, money, and time ───────────────────────────────────────
  2: [
    "百", "千", "万", "円", "日", "月", "年", "時", "分", "半",
  ],

  // ── Day 3 — people and family ──────────────────────────────────────────────
  3: [
    "人", "女", "男", "子", "私", "名", "父", "母", "兄", "姉",
  ],

  // ── Day 4 — family, school, and company ────────────────────────────────────
  4: [
    "弟", "妹", "友", "手", "生", "学", "校", "会", "社", "員",
  ],

  // ── Day 5 — everyday actions and words ─────────────────────────────────────
  5: [
    "今", "毎", "食", "飲", "見", "聞", "読", "書", "話", "言",
  ],

  // ── Day 6 — meals and daily routine ────────────────────────────────────────
  6: [
    "午", "昼", "飯", "週", "末", "休", "買", "魚", "少", "多",
  ],

  // ── Day 7 — position and direction ─────────────────────────────────────────
  7: [
    "上", "中", "下", "左", "右", "前", "後", "外", "入", "出",
  ],

  // ── Day 8 — travel and places ──────────────────────────────────────────────
  8: [
    "行", "来", "立", "駅", "車", "電", "店", "口", "室", "堂",
  ],

  // ── Day 9 — places and the world ───────────────────────────────────────────
  9: [
    "場", "国", "本", "家", "犬", "田", "山", "川", "石", "寺",
  ],

  // ── Day 10 — nature, weather, and weekdays ─────────────────────────────────
  10: [
    "天", "気", "雨", "空", "花", "木", "火", "水", "金", "土",
  ],

  // ── Day 11 — directions and descriptions ───────────────────────────────────
  11: [
    "南", "北", "東", "西", "小", "大", "高", "安", "長", "新",
  ],

  // ── Day 12 — body, language, and connections ───────────────────────────────
  12: [
    "古", "白", "耳", "目", "足", "力", "語", "何", "道", "間",
  ],

  // ── Day 13 — later beginner kanji ─────────────────────────────────────────
  13: [
    "夜", "先", "秒", "歳", "京", "都", "自", "族", "刀",
  ],

  // ── Days 14–25 — grammar-focus lessons (no new kanji) ─────────────────────
  // All pool kanji have been introduced by Day 13.
  // The kanji accordion is hidden by the component when this array is empty.
  14: [], 15: [], 16: [], 17: [], 18: [], 19: [],
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
