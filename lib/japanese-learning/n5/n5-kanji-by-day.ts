import { lookupKanjiEntries } from "@/lib/japanese-learning/n5/n5-kanji-pool";
import type { KanjiStrokeEntry } from "@/lib/japanese-learning/n5/n5-kanji-pool";

/**
 * Strict no-repeat kanji assignment across lesson days.
 *
 * Days 1–19 introduce ten unique characters each. Day 20 introduces the remaining two
 * characters from the extended study set. Later grammar and sprint lessons remain empty.
 *
 * Characters must exist in n5-kanji-pool.ts ROWS — unknowns are silently skipped.
 */
export const N5_KANJI_BY_DAY: Record<number, string[]> = {

  // ── Days 1–15 — chapter-aligned foundations ────────────────────────────────
  1: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
  2: ["百", "千", "万", "円", "日", "月", "年", "時", "分", "半"],
  3: ["人", "女", "男", "子", "私", "名", "父", "母", "兄", "姉"],
  4: ["弟", "妹", "友", "手", "生", "学", "校", "会", "社", "員"],
  5: ["今", "毎", "食", "飲", "見", "聞", "読", "書", "話", "言"],
  6: ["午", "昼", "飯", "週", "末", "休", "買", "魚", "少", "多"],
  7: ["上", "中", "下", "左", "右", "前", "後", "外", "入", "出"],
  8: ["行", "来", "立", "駅", "車", "電", "店", "口", "室", "堂"],
  9: ["場", "国", "本", "家", "犬", "田", "山", "川", "石", "寺"],
  10: ["天", "気", "雨", "空", "花", "木", "火", "水", "金", "土"],
  11: ["南", "北", "東", "西", "小", "大", "高", "安", "長", "新"],
  12: ["古", "白", "耳", "目", "足", "力", "語", "何", "道", "間"],
  13: ["夜", "先", "秒", "歳", "京", "都", "自", "族", "刀", "明"],
  14: ["春", "夏", "秋", "冬", "曜", "赤", "林", "海", "港", "門"],
  15: ["体", "頭", "首", "元", "牛", "馬", "鳥", "猫", "肉", "鶏"],

  // ── Days 16–20 — extended kanji study ─────────────────────────────────────
  16: ["者", "事", "思", "的", "方", "地", "合", "代", "部", "物"],
  17: ["彼", "動", "知", "理", "内", "同", "心", "発", "実", "作"],
  18: ["当", "世", "度", "戦", "性", "対", "意", "用", "主", "通"],
  19: ["関", "文", "屋", "感", "郎", "業", "定", "政", "持", "取"],
  20: ["所", "現"],

  // ── Days 21–30 — grammar, review, and mock-exam lessons ───────────────────
  21: [], 22: [], 23: [], 24: [], 25: [],
  26: [], 27: [], 28: [], 29: [], 30: [],
};

/** Return the KanjiStrokeEntry list for a given day, ready for the KanjiSection component. */
export function kanjiForDay(day: number): KanjiStrokeEntry[] {
  return lookupKanjiEntries(N5_KANJI_BY_DAY[day] ?? []);
}
