import { kanjiVgStrokeSvgUrl } from "@/lib/japanese-learning/kanji-stroke-url";

export type KanjiStrokeEntry = {
  kanji: string;
  readings: string;
  meaning: string;
  strokes: number;
  strokeSvgUrl: string;
};

/** Single-character JLPT N5–grade entries (stroke counts typical textbook values). */
const ROWS: { k: string; r: string; m: string; s: number }[] = [
  { k: "日", r: "ひ・ニチ", m: "day / sun", s: 4 },
  { k: "一", r: "いち", m: "one", s: 1 },
  { k: "二", r: "に", m: "two", s: 2 },
  { k: "三", r: "さん", m: "three", s: 3 },
  { k: "四", r: "し・よん", m: "four", s: 5 },
  { k: "五", r: "ご", m: "five", s: 4 },
  { k: "六", r: "ろく", m: "six", s: 4 },
  { k: "七", r: "しち・なな", m: "seven", s: 2 },
  { k: "八", r: "はち", m: "eight", s: 2 },
  { k: "九", r: "きゅう・く", m: "nine", s: 2 },
  { k: "十", r: "じゅう", m: "ten", s: 2 },
  { k: "百", r: "ひゃく", m: "hundred", s: 6 },
  { k: "千", r: "せん", m: "thousand", s: 3 },
  { k: "万", r: "まん", m: "ten thousand", s: 3 },
  { k: "人", r: "ひと・じん", m: "person", s: 2 },
  { k: "名", r: "な・メイ", m: "name", s: 6 },
  { k: "女", r: "おんな", m: "woman", s: 3 },
  { k: "男", r: "おとこ", m: "man", s: 7 },
  { k: "子", r: "こ", m: "child", s: 3 },
  { k: "学", r: "がく", m: "study", s: 8 },
  { k: "生", r: "いきる・セイ", m: "life / student", s: 5 },
  { k: "先", r: "さき・セン", m: "ahead / teacher pref.", s: 6 },
  { k: "私", r: "わたし", m: "I", s: 7 },
  { k: "何", r: "なん・なに", m: "what", s: 7 },
  { k: "今", r: "いま・コン", m: "now", s: 4 },
  { k: "時", r: "とき・ジ", m: "time", s: 10 },
  { k: "分", r: "ふん・ぶん", m: "minute / part", s: 4 },
  { k: "半", r: "はん", m: "half", s: 5 },
  { k: "午", r: "ご", m: "noon", s: 4 },
  { k: "前", r: "まえ・ゼン", m: "before / front", s: 9 },
  { k: "後", r: "うしろ・あと", m: "after / behind", s: 9 },
  { k: "白", r: "しろ", m: "white", s: 5 },
  { k: "本", r: "ほん", m: "book / main", s: 5 },
  { k: "中", r: "なか", m: "inside / middle", s: 4 },
  { k: "上", r: "うえ・ジョウ", m: "above / up", s: 3 },
  { k: "下", r: "した・カ", m: "below / down", s: 3 },
  { k: "左", r: "ひだり", m: "left", s: 5 },
  { k: "右", r: "みぎ", m: "right", s: 5 },
  { k: "北", r: "きた", m: "north", s: 5 },
  { k: "南", r: "みなみ", m: "south", s: 9 },
  { k: "東", r: "ひがし", m: "east", s: 8 },
  { k: "西", r: "にし", m: "west", s: 6 },
  { k: "出", r: "でる", m: "exit", s: 5 },
  { k: "入", r: "いる・ニュウ", m: "enter", s: 2 },
  { k: "行", r: "いく・ギョウ", m: "go / conduct", s: 6 },
  { k: "来", r: "くる・ライ", m: "come", s: 7 },
  { k: "食", r: "たべる・ショク", m: "eat / meal", s: 9 },
  { k: "飲", r: "のむ", m: "drink", s: 12 },
  { k: "見", r: "みる・ケン", m: "see", s: 7 },
  { k: "聞", r: "きく", m: "hear / ask", s: 14 },
  { k: "読", r: "よむ", m: "read", s: 14 },
  { k: "書", r: "かく", m: "write", s: 10 },
  { k: "話", r: "はなす", m: "speak / topic", s: 13 },
  { k: "語", r: "ご", m: "language", s: 14 },
  { k: "車", r: "くるま", m: "car / wheel", s: 7 },
  { k: "電", r: "でん", m: "electricity", s: 13 },
  { k: "店", r: "みせ・テン", m: "shop", s: 8 },
  { k: "駅", r: "えき", m: "station", s: 14 },
  { k: "社", r: "しゃ", m: "company / shrine", s: 7 },
  { k: "国", r: "くに", m: "country", s: 8 },
  { k: "長", r: "ながい・チョウ", m: "long / chief", s: 8 },
  { k: "小", r: "ちいさい", m: "small", s: 3 },
  { k: "大", r: "おおきい・ダイ", m: "big", s: 3 },
  { k: "高", r: "たかい", m: "high / expensive", s: 10 },
  { k: "安", r: "やすい", m: "cheap / calm", s: 6 },
  { k: "新", r: "あたらしい", m: "new", s: 13 },
  { k: "古", r: "ふるい", m: "old", s: 5 },
  { k: "友", r: "とも", m: "friend", s: 4 },
  { k: "父", r: "ちち", m: "father", s: 4 },
  { k: "母", r: "はは", m: "mother", s: 5 },
  { k: "兄", r: "あに", m: "older brother", s: 5 },
  { k: "姉", r: "あね", m: "older sister", s: 8 },
  { k: "弟", r: "おとうと", m: "younger brother", s: 7 },
  { k: "妹", r: "いもうと", m: "younger sister", s: 8 },
  { k: "雨", r: "あめ", m: "rain", s: 8 },
  { k: "天", r: "てん・あめ", m: "sky / heaven", s: 4 },
  { k: "気", r: "き", m: "spirit / air", s: 6 },
  { k: "火", r: "ひ・カ", m: "fire", s: 4 },
  { k: "水", r: "みず", m: "water", s: 4 },
  { k: "木", r: "き", m: "tree / wood", s: 4 },
  { k: "金", r: "かね・キン", m: "gold / money", s: 8 },
  { k: "土", r: "つち・ド", m: "earth / soil", s: 3 },
  { k: "山", r: "やま", m: "mountain", s: 3 },
  { k: "川", r: "かわ", m: "river", s: 3 },
  { k: "田", r: "た", m: "rice field", s: 5 },
  { k: "石", r: "いし", m: "stone", s: 5 },
  { k: "花", r: "はな", m: "flower", s: 7 },
  { k: "校", r: "こう", m: "school (suffix)", s: 10 },
  { k: "室", r: "しつ", m: "room", s: 9 },
  { k: "堂", r: "どう", m: "hall", s: 11 },
  { k: "場", r: "ば・ジョウ", m: "place / field", s: 12 },
  { k: "員", r: "いん", m: "member", s: 10 },
  { k: "会", r: "かい・あう", m: "meet / society", s: 6 },
  { k: "耳", r: "みみ", m: "ear", s: 6 },
  { k: "手", r: "て・シュ", m: "hand", s: 4 },
  { k: "足", r: "あし・ソク", m: "foot / suffice", s: 7 },
  { k: "力", r: "ちから・リキ", m: "power / strength", s: 2 },
  { k: "犬", r: "いぬ・ケン", m: "dog", s: 4 },
];

/** Deduplicate by character (table above may repeat for teaching overlap). */
const UNIQUE = (() => {
  const m = new Map<string, (typeof ROWS)[0]>();
  for (const row of ROWS) {
    if (!m.has(row.k)) m.set(row.k, row);
  }
  return [...m.values()];
})();

/** Twenty distinct kanji per calendar day — stroke SVG + stroke count for copy practice. */
export function twentyKanjiForDay(day: number): KanjiStrokeEntry[] {
  const n = UNIQUE.length;
  const stride = 37;
  const start = ((day - 1) * stride) % n;
  const out: KanjiStrokeEntry[] = [];
  for (let i = 0; i < 20; i++) {
    const row = UNIQUE[(start + i) % n];
    const strokeSvgUrl = kanjiVgStrokeSvgUrl(row.k) ?? "";
    out.push({
      kanji: row.k,
      readings: row.r,
      meaning: row.m,
      strokes: row.s,
      strokeSvgUrl,
    });
  }
  return out;
}
