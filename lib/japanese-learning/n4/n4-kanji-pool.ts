import { kanjiVgStrokeSvgUrl } from "@/lib/japanese-learning/kanji-stroke-url";

export type KanjiStrokeEntry = {
  kanji: string;
  readings: string;
  meaning: string;
  strokes: number;
  strokeSvgUrl: string;
};

/** JLPT N4-grade kanji (distinct from the N5 pool used in Minna I). */
const ROWS: { k: string; r: string; m: string; s: number }[] = [
  { k: "意", r: "イ", m: "meaning / mind", s: 13 },
  { k: "医", r: "イ", m: "medical / doctor", s: 7 },
  { k: "育", r: "そだ・イク", m: "raise / nurture", s: 8 },
  { k: "映", r: "うつ・エイ", m: "project / reflect", s: 9 },
  { k: "英", r: "エイ", m: "brilliant / English", s: 8 },
  { k: "化", r: "バケ・カ", m: "change / transform", s: 4 },
  { k: "開", r: "あく・カイ", m: "open", s: 12 },
  { k: "感", r: "カン", m: "feeling / sense", s: 13 },
  { k: "漢", r: "カン", m: "Chinese / kanji", s: 13 },
  { k: "起", r: "おき・キ", m: "rise / occur", s: 10 },
  { k: "急", r: "いそ・キュウ", m: "urgent / hurry", s: 9 },
  { k: "去", r: "さ・キョ", m: "leave / past", s: 5 },
  { k: "計", r: "ケイ", m: "count / plan", s: 9 },
  { k: "研", r: "ケン", m: "research / sharpen", s: 9 },
  { k: "建", r: "た・ケン", m: "build / construct", s: 9 },
  { k: "光", r: "ひか・コウ", m: "light / ray", s: 6 },
  { k: "考", r: "かんが・コウ", m: "think / consider", s: 6 },
  { k: "合", r: "あ・ゴウ", m: "fit / combine", s: 6 },
  { k: "産", r: "う・サン", m: "produce / birth", s: 11 },
  { k: "試", r: "た・シ", m: "try / test", s: 13 },
  { k: "自", r: "ジ・みず", m: "self / oneself", s: 6 },
  { k: "実", r: "み・ジツ", m: "reality / fruit", s: 8 },
  { k: "写", r: "うつ・シャ", m: "copy / photograph", s: 5 },
  { k: "借", r: "か・シャク", m: "borrow", s: 10 },
  { k: "受", r: "う・ジュ", m: "receive / accept", s: 8 },
  { k: "秋", r: "あき・シュウ", m: "autumn / fall", s: 9 },
  { k: "春", r: "はる・シュン", m: "spring season", s: 9 },
  { k: "消", r: "き・ショウ", m: "extinguish / erase", s: 10 },
  { k: "少", r: "すこ・ショウ", m: "few / little", s: 4 },
  { k: "情", r: "なさ・ジョウ", m: "feeling / emotion", s: 11 },
  { k: "進", r: "すす・シン", m: "advance / progress", s: 11 },
  { k: "世", r: "よ・セ", m: "world / era", s: 5 },
  { k: "整", r: "とと・セイ", m: "arrange / adjust", s: 16 },
  { k: "選", r: "えら・セン", m: "select / choose", s: 15 },
  { k: "送", r: "おく・ソウ", m: "send / dispatch", s: 9 },
  { k: "待", r: "ま・タイ", m: "wait / await", s: 9 },
  { k: "代", r: "か・ダイ", m: "substitute / era", s: 5 },
  { k: "体", r: "からだ・タイ", m: "body / health", s: 7 },
  { k: "台", r: "ダイ", m: "stand / counter for machines", s: 5 },
  { k: "転", r: "ころ・テン", m: "roll / change / fall", s: 11 },
  { k: "特", r: "トク", m: "special / particular", s: 10 },
  { k: "肉", r: "にく", m: "meat / flesh", s: 6 },
  { k: "年", r: "とし・ネン", m: "year", s: 6 },
  { k: "配", r: "くば・ハイ", m: "distribute / worry", s: 10 },
  { k: "発", r: "ハツ", m: "depart / emit / start", s: 9 },
  { k: "反", r: "ハン", m: "anti / opposite / revolt", s: 4 },
  { k: "飯", r: "めし・ハン", m: "cooked rice / meal", s: 12 },
  { k: "悲", r: "かな・ヒ", m: "sad / grief", s: 12 },
  { k: "病", r: "や・ビョウ", m: "sick / illness", s: 10 },
  { k: "平", r: "たい・ヘイ", m: "flat / peace / calm", s: 5 },
  { k: "別", r: "ベツ", m: "separate / different", s: 7 },
  { k: "帰", r: "かえ・キ", m: "return / go home", s: 10 },
  { k: "勉", r: "ベン", m: "diligence / study hard", s: 10 },
  { k: "便", r: "べん・たよ", m: "convenient / mail", s: 9 },
  { k: "毎", r: "まい", m: "every / each", s: 6 },
  { k: "問", r: "もん", m: "question / problem", s: 11 },
  { k: "夜", r: "よ・ヤ", m: "night / evening", s: 8 },
  { k: "有", r: "あ・ユウ", m: "exist / have / possess", s: 6 },
  { k: "理", r: "リ", m: "logic / reason / principle", s: 11 },
  { k: "旅", r: "りょ", m: "travel / journey", s: 10 },
  { k: "両", r: "りょう", m: "both / two", s: 6 },
  { k: "持", r: "も・ジ", m: "hold / carry / have", s: 9 },
  { k: "使", r: "つか・シ", m: "use / employ", s: 8 },
  { k: "思", r: "おも・シ", m: "think / feel", s: 9 },
  { k: "仕", r: "シ", m: "work / serve / do", s: 5 },
  { k: "次", r: "つぎ・ジ", m: "next / following", s: 6 },
  { k: "知", r: "し・チ", m: "know / wisdom", s: 8 },
  { k: "地", r: "ち・ジ", m: "ground / earth / place", s: 6 },
  { k: "着", r: "き・チャク", m: "wear / arrive", s: 12 },
  { k: "注", r: "ちゅう", m: "pour / note / caution", s: 8 },
  { k: "昼", r: "ひる・チュウ", m: "noon / daytime", s: 9 },
  { k: "朝", r: "あさ・チョウ", m: "morning", s: 12 },
  { k: "通", r: "とお・ツウ", m: "pass through / commute", s: 10 },
  { k: "低", r: "ひく・テイ", m: "low / short height", s: 7 },
  { k: "的", r: "テキ", m: "-ish / target / adj. suffix", s: 8 },
  { k: "点", r: "てん・テン", m: "point / score / dot", s: 9 },
  { k: "冬", r: "ふゆ・トウ", m: "winter", s: 5 },
  { k: "道", r: "みち・ドウ", m: "road / way / path", s: 12 },
  { k: "動", r: "うご・ドウ", m: "move / motion", s: 11 },
  { k: "乗", r: "の・ジョウ", m: "ride / board", s: 9 },
  { k: "買", r: "か・バイ", m: "buy / purchase", s: 12 },
  { k: "服", r: "ふく", m: "clothing / garment", s: 8 },
  { k: "文", r: "もん・ブン", m: "sentence / writing / culture", s: 4 },
  { k: "返", r: "かえ・ヘン", m: "return / reply", s: 7 },
  { k: "忘", r: "わす・ボウ", m: "forget", s: 7 },
  { k: "窓", r: "まど", m: "window", s: 11 },
  { k: "門", r: "もん・モン", m: "gate / entrance", s: 8 },
  { k: "業", r: "ぎょう・ギョウ", m: "business / work / industry", s: 13 },
  { k: "続", r: "つづ・ゾク", m: "continue / last", s: 13 },
  { k: "海", r: "うみ・カイ", m: "sea / ocean", s: 9 },
  { k: "外", r: "そと・ガイ", m: "outside / foreign", s: 5 },
  { k: "楽", r: "たの・ラク", m: "enjoy / music / ease", s: 13 },
  { k: "歌", r: "うた・カ", m: "song / sing", s: 14 },
  { k: "記", r: "キ", m: "record / note / write", s: 10 },
  { k: "近", r: "ちか・キン", m: "near / close", s: 7 },
  { k: "空", r: "そら・クウ", m: "sky / empty / air", s: 8 },
  { k: "始", r: "はじ・シ", m: "begin / start", s: 8 },
  { k: "終", r: "お・シュウ", m: "end / finish", s: 11 },
  { k: "貸", r: "か・タイ", m: "lend / rent out", s: 12 },
  { k: "教", r: "おし・キョウ", m: "teach / instruct", s: 11 },
  { k: "強", r: "つよ・キョウ", m: "strong / intense / force", s: 11 },
  { k: "橋", r: "はし・キョウ", m: "bridge", s: 16 },
  { k: "形", r: "かたち・ケイ", m: "shape / form", s: 7 },
  { k: "黒", r: "くろ・コク", m: "black", s: 11 },
  { k: "作", r: "つく・サク", m: "make / create", s: 7 },
  { k: "字", r: "ジ", m: "character / letter", s: 6 },
  { k: "事", r: "こと・ジ", m: "thing / matter / fact", s: 8 },
  { k: "色", r: "いろ・シキ", m: "color", s: 6 },
  { k: "声", r: "こえ・セイ", m: "voice / sound", s: 7 },
  { k: "切", r: "き・セツ", m: "cut / important", s: 4 },
  { k: "早", r: "はや・ソウ", m: "early / fast", s: 6 },
  { k: "多", r: "おお・タ", m: "many / much", s: 6 },
  { k: "太", r: "ふと・タイ", m: "fat / thick", s: 4 },
  { k: "正", r: "ただ・セイ", m: "correct / honest", s: 5 },
  { k: "同", r: "おな・ドウ", m: "same / agree", s: 6 },
  { k: "半", r: "はん", m: "half", s: 5 },
];

const UNIQUE = (() => {
  const seen = new Map<string, (typeof ROWS)[0]>();
  for (const row of ROWS) {
    if (!seen.has(row.k)) seen.set(row.k, row);
  }
  return [...seen.values()];
})();

/** Twenty distinct N4 kanji per calendar day — stroke SVG + stroke count for copy practice. */
export function twentyN4KanjiForDay(day: number): KanjiStrokeEntry[] {
  const n = UNIQUE.length;
  const stride = 41;
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
