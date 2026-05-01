import { kanjiVgStrokeSvgUrl } from "@/lib/japanese-learning/kanji-stroke-url";

export type KanjiItem = {
  kanji: string;
  readings: string;
  meaning: string;
  strokes: number;
  strokeSvgUrl: string;
};

/** JLPT N3-grade kanji — intermediate level (stroke counts 8–16). */
const ROWS: { k: string; r: string; m: string; s: number }[] = [
  { k: "意", r: "イ", m: "meaning / mind / will", s: 13 },
  { k: "味", r: "あじ・ミ", m: "taste / flavor / meaning", s: 8 },
  { k: "感", r: "カン", m: "feeling / sense / emotion", s: 13 },
  { k: "情", r: "なさ・ジョウ", m: "feeling / emotion / sympathy", s: 11 },
  { k: "経", r: "へ・ケイ", m: "pass / experience / manage", s: 11 },
  { k: "済", r: "す・サイ", m: "settle / finish / save", s: 11 },
  { k: "政", r: "まつりごと・セイ", m: "politics / government", s: 9 },
  { k: "治", r: "おさ・チ", m: "govern / cure / manage", s: 8 },
  { k: "社", r: "やしろ・シャ", m: "company / society / shrine", s: 7 },
  { k: "会", r: "あ・カイ", m: "meet / assembly / society", s: 6 },
  { k: "文", r: "ふみ・ブン", m: "writing / sentence / culture", s: 4 },
  { k: "化", r: "か・バケ", m: "change / transform / culture", s: 4 },
  { k: "環", r: "カン", m: "ring / circle / environment", s: 17 },
  { k: "境", r: "さかい・キョウ", m: "boundary / environment / border", s: 14 },
  { k: "技", r: "わざ・ギ", m: "skill / art / technique", s: 7 },
  { k: "術", r: "ジュツ", m: "art / technique / method", s: 11 },
  { k: "医", r: "イ", m: "medicine / doctor / healing", s: 7 },
  { k: "学", r: "まな・ガク", m: "study / learn / science", s: 8 },
  { k: "科", r: "カ", m: "department / subject / branch", s: 9 },
  { k: "自", r: "みずか・ジ", m: "self / oneself / natural", s: 6 },
  { k: "然", r: "ネン・ゼン", m: "nature / natural / of course", s: 12 },
  { k: "人", r: "ひと・ジン", m: "person / human / people", s: 2 },
  { k: "間", r: "あいだ・カン", m: "interval / between / human", s: 12 },
  { k: "問", r: "とい・モン", m: "question / problem / ask", s: 11 },
  { k: "題", r: "ダイ", m: "topic / subject / title", s: 18 },
  { k: "解", r: "と・カイ", m: "dissolve / answer / solve", s: 13 },
  { k: "決", r: "き・ケツ", m: "decide / settle / determine", s: 7 },
  { k: "情", r: "なさ・ジョウ", m: "emotion / sympathy / feelings", s: 11 },
  { k: "報", r: "むく・ホウ", m: "report / news / reward", s: 12 },
  { k: "教", r: "おし・キョウ", m: "teach / instruct / religion", s: 11 },
  { k: "育", r: "そだ・イク", m: "raise / nurture / educate", s: 8 },
  { k: "歴", r: "レキ", m: "history / calendar / experience", s: 14 },
  { k: "史", r: "シ", m: "history / chronicle", s: 5 },
  { k: "伝", r: "つた・デン", m: "transmit / tradition / legend", s: 6 },
  { k: "統", r: "すべ・トウ", m: "unite / govern / tradition", s: 12 },
  { k: "芸", r: "ゲイ", m: "art / craft / performance", s: 7 },
  { k: "術", r: "ジュツ", m: "technique / art / method", s: 11 },
  { k: "音", r: "おと・オン", m: "sound / noise / music", s: 9 },
  { k: "楽", r: "たの・ガク", m: "music / enjoy / ease", s: 13 },
  { k: "言", r: "い・ゲン", m: "say / speak / language", s: 7 },
  { k: "語", r: "かた・ゴ", m: "language / word / talk", s: 14 },
  { k: "文", r: "ふみ・ブン", m: "sentence / writing / literary", s: 4 },
  { k: "学", r: "まな・ガク", m: "learning / scholarship", s: 8 },
  { k: "思", r: "おも・シ", m: "think / idea / thought", s: 9 },
  { k: "想", r: "ソウ", m: "concept / thought / idea", s: 13 },
  { k: "哲", r: "テツ", m: "philosophy / wisdom / sage", s: 14 },
  { k: "心", r: "こころ・シン", m: "heart / mind / spirit", s: 4 },
  { k: "理", r: "リ", m: "logic / reason / principle", s: 11 },
  { k: "生", r: "い・セイ", m: "life / live / birth", s: 5 },
  { k: "活", r: "カツ", m: "lively / life / activity", s: 9 },
  { k: "行", r: "い・コウ", m: "go / conduct / action", s: 6 },
  { k: "動", r: "うご・ドウ", m: "move / motion / action", s: 11 },
  { k: "態", r: "タイ", m: "attitude / condition / state", s: 14 },
  { k: "度", r: "たび・ド", m: "degree / time / measure", s: 9 },
  { k: "具", r: "グ", m: "tool / ingredient / complete", s: 8 },
  { k: "体", r: "からだ・タイ", m: "body / substance / style", s: 7 },
  { k: "的", r: "テキ", m: "target / adjectival suffix", s: 8 },
  { k: "性", r: "セイ", m: "nature / sex / gender", s: 8 },
  { k: "的", r: "テキ", m: "of / -ish / manner", s: 8 },
  { k: "現", r: "あらわ・ゲン", m: "present / appear / current", s: 11 },
  { k: "代", r: "か・ダイ", m: "era / substitute / generation", s: 5 },
  { k: "際", r: "きわ・サイ", m: "occasion / edge / border", s: 14 },
  { k: "国", r: "くに・コク", m: "country / nation", s: 8 },
  { k: "際", r: "きわ・サイ", m: "international / occasion", s: 14 },
  { k: "様", r: "さま・ヨウ", m: "manner / state / Mr./Ms.", s: 14 },
  { k: "式", r: "シキ", m: "ceremony / formula / style", s: 6 },
  { k: "形", r: "かたち・ケイ", m: "shape / form / type", s: 7 },
  { k: "法", r: "ホウ", m: "law / method / dharma", s: 8 },
  { k: "則", r: "ノリ・ソク", m: "rule / regulation / norm", s: 9 },
  { k: "関", r: "かか・カン", m: "connection / related / barrier", s: 14 },
  { k: "係", r: "かか・ケイ", m: "person in charge / relation", s: 9 },
  { k: "争", r: "あらそ・ソウ", m: "dispute / compete / war", s: 6 },
  { k: "戦", r: "たたか・セン", m: "war / battle / fight", s: 13 },
  { k: "平", r: "たい・ヘイ", m: "peace / flat / calm", s: 5 },
  { k: "和", r: "やわ・ワ", m: "harmony / Japan / peace", s: 8 },
  { k: "主", r: "おも・シュ", m: "master / main / principal", s: 5 },
  { k: "義", r: "ギ", m: "righteousness / meaning / justice", s: 13 },
  { k: "権", r: "ケン", m: "authority / rights / power", s: 15 },
  { k: "利", r: "リ", m: "profit / gain / clever", s: 7 },
  { k: "益", r: "エキ", m: "benefit / gain / profit", s: 10 },
  { k: "損", r: "そん・ソン", m: "loss / damage / injury", s: 13 },
  { k: "得", r: "え・トク", m: "gain / acquire / profit", s: 11 },
  { k: "効", r: "き・コウ", m: "effect / efficiency / valid", s: 8 },
  { k: "果", r: "は・カ", m: "result / fruit / accomplish", s: 8 },
  { k: "因", r: "イン", m: "cause / reason / factor", s: 6 },
  { k: "果", r: "は・カ", m: "result / outcome / effect", s: 8 },
  { k: "努", r: "つと・ド", m: "toil / strive / effort", s: 7 },
  { k: "力", r: "ちから・リョク", m: "power / force / strength", s: 2 },
  { k: "能", r: "ノウ", m: "ability / talent / Noh", s: 10 },
  { k: "才", r: "サイ", m: "talent / genius / years old", s: 3 },
  { k: "質", r: "シツ・チ", m: "quality / nature / matter", s: 15 },
  { k: "量", r: "リョウ", m: "quantity / amount / measure", s: 12 },
  { k: "比", r: "くら・ヒ", m: "compare / ratio / proportion", s: 4 },
  { k: "較", r: "コウ", m: "compare / evaluate", s: 13 },
  { k: "差", r: "さ・サ", m: "difference / distinction", s: 10 },
  { k: "別", r: "ベツ", m: "separate / distinct / special", s: 7 },
  { k: "同", r: "おな・ドウ", m: "same / identical / agree", s: 6 },
  { k: "類", r: "たぐ・ルイ", m: "kind / category / similar", s: 18 },
  { k: "種", r: "たね・シュ", m: "species / kind / seed", s: 14 },
  { k: "特", r: "トク", m: "special / particular", s: 10 },
  { k: "殊", r: "こと・シュ", m: "special / exceptional", s: 10 },
  { k: "共", r: "とも・キョウ", m: "together / share / common", s: 6 },
  { k: "通", r: "とお・ツウ", m: "pass / commute / common", s: 10 },
  { k: "全", r: "すべ・ゼン", m: "whole / entire / complete", s: 6 },
  { k: "部", r: "ブ", m: "part / section / department", s: 11 },
  { k: "半", r: "はん", m: "half / middle", s: 5 },
  { k: "分", r: "わ・ブン", m: "divide / minute / understand", s: 4 },
  { k: "数", r: "かず・スウ", m: "number / count / several", s: 13 },
  { k: "回", r: "まわ・カイ", m: "revolve / times / round", s: 6 },
  { k: "度", r: "たび・ド", m: "time / degree / occasion", s: 9 },
  { k: "場", r: "ば・ジョウ", m: "place / site / situation", s: 12 },
  { k: "所", r: "ところ・ショ", m: "place / somewhere / thing", s: 8 },
  { k: "位", r: "くらい・イ", m: "rank / place / position", s: 7 },
  { k: "置", r: "お・チ", m: "put / place / set", s: 13 },
];

const UNIQUE = (() => {
  const seen = new Map<string, (typeof ROWS)[0]>();
  for (const row of ROWS) {
    if (!seen.has(row.k)) seen.set(row.k, row);
  }
  return [...seen.values()];
})();

/** Twenty distinct N3 kanji per calendar day — stroke SVG + stroke count for copy practice. */
export function twentyN3KanjiForDay(day: number): KanjiItem[] {
  const n = UNIQUE.length;
  const stride = 37;
  const start = ((day - 1) * stride) % n;
  const out: KanjiItem[] = [];
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
