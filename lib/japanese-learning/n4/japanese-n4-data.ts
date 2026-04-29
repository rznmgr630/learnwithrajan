import { buildJapaneseN4DayDetail } from "@/lib/japanese-learning/n4/build-japanese-n4-detail";
import { JP_N4_LESSON_SPECS } from "@/lib/japanese-learning/n4/n4-lessons";
import { N4_FULL_LEVEL_MOCK_EXAM } from "@/lib/japanese-learning/n4/n4-full-mock-exam";
import { N4_WEEKLY_JLPT_TESTS } from "@/lib/japanese-learning/n4/n4-weekly-tests";
import type {
  JapaneseRoadmapDay,
  JapaneseRoadmapDayDetail,
  JapaneseRoadmapWeek,
  JapaneseWeeklyTest,
  LocalizedString,
} from "@/lib/japanese-learning/types";

export const JP_N4_TOTAL_DAYS = 28;

/** Stable ids for weekly JLPT-style tests (one per week) plus the course-wide full mock. */
export const N4_WEEKLY_TEST_IDS = [...N4_WEEKLY_JLPT_TESTS.map((t) => t.id), N4_FULL_LEVEL_MOCK_EXAM.id];

export const JP_N4_WEEKLY_TEST_TOTAL = N4_WEEKLY_TEST_IDS.length;

/** Overall JLPT N4 mock (Days 1–28) — same panel UX as weekly tests. */
export const JAPANESE_N4_FULL_LEVEL_MOCK = N4_FULL_LEVEL_MOCK_EXAM;

/** Official "current" day for Japanese N4 track. */
export const JP_N4_CURRENT_DAY = 1;

/** Short titles shown on cards — Minna II lessons 26–50 map to Days 1–25; Days 26–28 are sprint days. */
export const JP_N4_DAY_TITLES: string[] = [
  "Day 1 · Minna II L26 — てしまいました / のに",
  "Day 2 · Minna II L27 — ておきます / ていく・てくる",
  "Day 3 · Minna II L28 — てくれませんか / もらえませんか",
  "Day 4 · Minna II L29 — ていただけませんか / ほしい",
  "Day 5 · Minna II L30 — すぎる / やすい / にくい",
  "Day 6 · Minna II L31 — ようになります / ことができます",
  "Day 7 · Minna II L32 — んです / んですか",
  "Day 8 · Minna II L33 — と思っています / たことがある",
  "Day 9 · Minna II L34 — てみます / ことにします / ことになりました",
  "Day 10 · Minna II L35 — でしょう / かもしれません",
  "Day 11 · Minna II L36 — なければなりません / はずです",
  "Day 12 · Minna II L37 — なくてはいけません / ようにしてください",
  "Day 13 · Minna II L38 — そうです（hearsay）/ らしい",
  "Day 14 · Minna II L39 — ようです / みたいです",
  "Day 15 · Minna II L40 — ていく / てくる（directional）",
  "Day 16 · Minna II L41 — ば conditional / ばいい / ばよかった",
  "Day 17 · Minna II L42 — たら conditional",
  "Day 18 · Minna II L43 — ても / たとえ〜ても / どんなに〜ても",
  "Day 19 · Minna II L44 — ように purpose & request",
  "Day 20 · Minna II L45 — ために purpose / ので vs から",
  "Day 21 · Minna II L46 — passive 〜られる / 〜れる",
  "Day 22 · Minna II L47 — causative 〜させる / させてください",
  "Day 23 · Minna II L48 — causative-passive 〜させられる",
  "Day 24 · Minna II L49 — はずです / というのは / ほど",
  "Day 25 · Minna II L50 — full integration review",
  "Day 26 · Sprint — passive / causative / causative-passive drills",
  "Day 27 · Sprint — listening strategy (conjecture markers)",
  "Day 28 · Sprint — final mock mindset",
];

function jpN4Overview(day: number): LocalizedString[] {
  const spec = JP_N4_LESSON_SPECS[day - 1];
  const focus: LocalizedString =
    spec.minnaLesson !== null
      ? {
          en: `Anchor today on Minna no Nihongo II Lesson ${spec.minnaLesson}: repeat the textbook dialogue until you can shadow without reading.`,
          np: `आज मिन्ना नो निहोन्गो II को पाठ ${spec.minnaLesson} मा केन्द्रित हुनुहोस्: पाठ्यपुस्तकको संवाद बिना पढेर छायाँ गर्न सक्नुहुन्छ भने दोहोर्याउनुहोस्।`,
          jp: `今日は『みんなの日本語 中級I』第${spec.minnaLesson}課に軸を置き、教科書の会話を声に出して繰り返し、読まずにシャドーイングできるまで練習してください。`,
        }
      : {
          en: `Integration sprint — rotate weak N4 grammar patterns before sitting a timed JLPT N4-style practice set.`,
          np: `एकीकरण स्प्रिन्ट — समयबद्ध JLPT N4 शैलीको अभ्यास सेट बस्नु अघि कमजोर N4 व्याकरण ढाँचाहरू घुमाउनुहोस्।`,
          jp: `統合スプリント——タイム制のJLPT N4形式の演習に取り組む前に、弱いN4文法パターンをローテーションで復習してください。`,
        };
  const second: LocalizedString = {
    en: `Split study into three passes — input (listen/read), pattern drills (verb conjugations & grammar tables), and output (say or hand-write two fresh sentences using today's grammar).`,
    np: `अध्ययन तीन चरणमा बाँड्नुहोस् — इनपुट (सुनाइ/पढाइ), ढाँचा अभ्यास (क्रिया संयोग र व्याकरण तालिका), र आउटपुट (आजको व्याकरण प्रयोग गरेर दुई नौला वाक्य बोल्न वा लेख्न)।`,
    jp: `学習を3ラウンドに分けましょう——インプット（聞く・読む）、パターン練習（動詞活用・文法表）、アウトプット（今日の文法を使った新しい文を2つ声か手書きで）。`,
  };
  return [focus, second];
}

function tagsForN4Day(day: number): { label: string; slug: string }[] {
  const base = [
    { label: "JLPT N4", slug: "jlpt-n4" },
    { label: "Minna no Nihongo II", slug: "minna-ii" },
  ];
  if (day >= 26) {
    return [...base, { label: "Exam sprint", slug: "sprint" }];
  }
  if (day % 4 === 0) return [...base, { label: "Listening", slug: "listening" }];
  if (day % 4 === 1) return [...base, { label: "Grammar", slug: "grammar" }];
  if (day % 4 === 2) return [...base, { label: "Particles", slug: "particles" }];
  return [...base, { label: "Kanji", slug: "kanji" }];
}

function buildN4Day(day: number): JapaneseRoadmapDay {
  const title = JP_N4_DAY_TITLES[day - 1];
  const spec = JP_N4_LESSON_SPECS[day - 1];
  return {
    day,
    title,
    tags: tagsForN4Day(day),
    detail: buildJapaneseN4DayDetail(day, jpN4Overview(day), spec),
  };
}

function weeklyTestForN4WeekId(weekId: string): JapaneseWeeklyTest | undefined {
  return N4_WEEKLY_JLPT_TESTS.find((t) => t.id === weekId);
}

export const JAPANESE_N4_WEEKS: JapaneseRoadmapWeek[] = [
  {
    id: "jn4-w1",
    title: {
      en: "Week 1 · Lessons 26–32 · completion through explanation",
      np: "हप्ता १ · पाठ २६–३२ · समापनदेखि व्याख्यासम्म",
      jp: "第1週 · 第26–32課 · 完了から説明まで",
    },
    dotClass: "bg-[var(--accent)]",
    days: [1, 2, 3, 4, 5, 6, 7].map(buildN4Day),
    weeklyTest: weeklyTestForN4WeekId("jn4-w1"),
  },
  {
    id: "jn4-w2",
    title: {
      en: "Week 2 · Lessons 33–39 · intentions through inference",
      np: "हप्ता २ · पाठ ३३–३९ · इरादादेखि अनुमानसम्म",
      jp: "第2週 · 第33–39課 · 意向から推量まで",
    },
    dotClass: "bg-[var(--accent)]",
    days: [8, 9, 10, 11, 12, 13, 14].map(buildN4Day),
    weeklyTest: weeklyTestForN4WeekId("jn4-w2"),
  },
  {
    id: "jn4-w3",
    title: {
      en: "Week 3 · Lessons 40–46 · conditionals through passive",
      np: "हप्ता ३ · पाठ ४०–४६ · सर्तदेखि passive सम्म",
      jp: "第3週 · 第40–46課 · 条件からpassiveまで",
    },
    dotClass: "bg-[var(--accent)]",
    days: [15, 16, 17, 18, 19, 20, 21].map(buildN4Day),
    weeklyTest: weeklyTestForN4WeekId("jn4-w3"),
  },
  {
    id: "jn4-w4",
    title: {
      en: "Week 4 · Lessons 47–50 + sprint · causative through review",
      np: "हप्ता ४ · पाठ ४७–५० + स्प्रिन्ट · causative देखि समीक्षासम्म",
      jp: "第4週 · 第47–50課＋スプリント · 使役から総復習まで",
    },
    dotClass: "bg-[var(--accent)]",
    days: [22, 23, 24, 25, 26, 27, 28].map(buildN4Day),
    weeklyTest: weeklyTestForN4WeekId("jn4-w4"),
  },
];

export function getAllJapaneseN4Days(): JapaneseRoadmapDay[] {
  return JAPANESE_N4_WEEKS.flatMap((w) => w.days).sort((a, b) => a.day - b.day);
}

export function getJapaneseN4DayContext(
  dayNumber: number,
): { weekTitle: LocalizedString; day: JapaneseRoadmapDay } | null {
  for (const week of JAPANESE_N4_WEEKS) {
    const day = week.days.find((d) => d.day === dayNumber);
    if (day) return { weekTitle: week.title, day };
  }
  return null;
}

export function resolveJapaneseN4Detail(day: JapaneseRoadmapDay): JapaneseRoadmapDayDetail {
  if (day.detail) return day.detail;
  return {
    overview: [
      {
        en: `Study focus: ${day.title}.`,
        np: `अध्ययन फोकस: ${day.title}.`,
        jp: `学習の焦点：${day.title}`,
      },
      {
        en: "Summarize today's N4 grammar in one English sentence.",
        np: "आजको N4 व्याकरण एक अङ्ग्रेजी वाक्यमा सारांश गर्नुहोस्।",
        jp: "今日のN4文法を英語の一文で要約してください。",
      },
    ],
    bullets: [
      {
        en: "Shadow audio twice.",
        np: "अडियो दुई पटक छायाँ गर्नुहोस्।",
        jp: "音声を二度シャドーイングする。",
      },
      {
        en: "Write four N4 kanji from memory.",
        np: "यादबाट चार N4 कांजी लेख्नुहोस्।",
        jp: "N4漢字を四つ思い出し書きする。",
      },
    ],
  };
}

export function seedJapaneseN4CompletedDayNumbers(): Set<number> {
  const done = new Set<number>();
  for (let d = 1; d < JP_N4_CURRENT_DAY; d += 1) done.add(d);
  return done;
}

export function resolveJapaneseN4WeeklyTestForRoadmap(openWeekOrMockId: string): JapaneseWeeklyTest | undefined {
  if (openWeekOrMockId === N4_FULL_LEVEL_MOCK_EXAM.id) return N4_FULL_LEVEL_MOCK_EXAM;
  return JAPANESE_N4_WEEKS.find((w) => w.id === openWeekOrMockId)?.weeklyTest;
}
