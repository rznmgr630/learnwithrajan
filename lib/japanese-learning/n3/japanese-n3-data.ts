import { buildJapaneseN3DayDetail } from "@/lib/japanese-learning/n3/build-japanese-n3-detail";
import { JP_N3_LESSON_SPECS } from "@/lib/japanese-learning/n3/n3-lessons";
import { N3_FULL_LEVEL_MOCK_EXAM } from "@/lib/japanese-learning/n3/n3-full-mock-exam";
import { N3_WEEKLY_JLPT_TESTS } from "@/lib/japanese-learning/n3/n3-weekly-tests";
import type {
  JapaneseRoadmapDay,
  JapaneseRoadmapDayDetail,
  JapaneseRoadmapWeek,
  JapaneseWeeklyTest,
  LocalizedString,
} from "@/lib/japanese-learning/types";

export const JP_N3_TOTAL_DAYS = 28;

/** Stable ids for weekly JLPT-style tests (one per week) plus the course-wide full mock. */
export const N3_WEEKLY_TEST_IDS = [...N3_WEEKLY_JLPT_TESTS.map((t) => t.id), N3_FULL_LEVEL_MOCK_EXAM.id];

export const JP_N3_WEEKLY_TEST_TOTAL = N3_WEEKLY_TEST_IDS.length;

/** Overall JLPT N3 mock (Days 1–28) — same panel UX as weekly tests. */
export const JAPANESE_N3_FULL_LEVEL_MOCK = N3_FULL_LEVEL_MOCK_EXAM;

/** Official "current" day for Japanese N3 track. */
export const JP_N3_CURRENT_DAY = 1;

/** Short titles shown on cards — N3 grammar topics map to Days 1–25; Days 26–28 are sprint days. */
export const JP_N3_DAY_TITLES: string[] = [
  "Day 1 · N3 Grammar — 〜てある (resulting state)",
  "Day 2 · N3 Grammar — Relative clauses & noun modification",
  "Day 3 · N3 Grammar — のに (unexpected result / complaint)",
  "Day 4 · N3 Grammar — ために (purpose & cause)",
  "Day 5 · N3 Grammar — ように (so that / in order to)",
  "Day 6 · N3 Grammar — Conditionals と・ば・たら・なら",
  "Day 7 · N3 Grammar — はずだ・べきだ (expectation / obligation)",
  "Day 8 · N3 Grammar — そうだ・らしい・ようだ (appearance / hearsay)",
  "Day 9 · N3 Grammar — と思う・と言う・と聞く (quoting / reporting)",
  "Day 10 · N3 Grammar — ながら (while / simultaneous actions)",
  "Day 11 · N3 Grammar — あいだに・うちに (while / before too late)",
  "Day 12 · N3 Grammar — ばかり・だけ・しか (limiting expressions)",
  "Day 13 · N3 Grammar — ことがある・ことにする・ことになる",
  "Day 14 · N3 Grammar — Potential form advanced できる contexts",
  "Day 15 · N3 Grammar — Honorific お〜になる・ご〜になる (尊敬語)",
  "Day 16 · N3 Grammar — Humble お〜する・ご〜する (謙譲語)",
  "Day 17 · N3 Grammar — てもらう・てあげる・てくれる (giving & receiving)",
  "Day 18 · N3 Grammar — ところ (just about / in the middle / just finished)",
  "Day 19 · N3 Grammar — ば〜ほど・ほど・くらい (extent & degree)",
  "Day 20 · N3 Grammar — ものだ・ものの (natural / although)",
  "Day 21 · N3 Grammar — として・にとって (as / perspective of)",
  "Day 22 · N3 Grammar — によって・によっては (depending on / due to)",
  "Day 23 · N3 Grammar — ために・せいで・おかげで (cause & effect)",
  "Day 24 · N3 Grammar — Complex sentences: combining patterns",
  "Day 25 · N3 Grammar — Reading strategies & discourse markers",
  "Day 26 · Sprint — N3 listening sprint & conjecture markers",
  "Day 27 · Sprint — N3 vocabulary sprint",
  "Day 28 · Sprint — Full mock mindset & exam strategy",
];

function jpN3Overview(day: number): LocalizedString[] {
  const spec = JP_N3_LESSON_SPECS[day - 1];
  const focus: LocalizedString =
    spec.minnaLesson !== null
      ? {
          en: `Anchor today on the N3 Grammar Guide Lesson ${spec.minnaLesson}: repeat the dialogue until you can shadow without reading.`,
          np: `आज N3 ग्रामर गाइड पाठ ${spec.minnaLesson} मा केन्द्रित हुनुहोस्: संवाद बिना पढेर छायाँ गर्न सक्नुहुन्छ भने दोहोर्याउनुहोस्।`,
          jp: `今日はN3文法ガイド第${spec.minnaLesson}課に軸を置き、教科書の会話を声に出して繰り返し、読まずにシャドーイングできるまで練習してください。`,
        }
      : {
          en: `Integration sprint — rotate weak N3 grammar patterns before sitting a timed JLPT N3-style practice set.`,
          np: `एकीकरण स्प्रिन्ट — समयबद्ध JLPT N3 शैलीको अभ्यास सेट बस्नु अघि कमजोर N3 व्याकरण ढाँचाहरू घुमाउनुहोस्।`,
          jp: `統合スプリント——タイム制のJLPT N3形式の演習に取り組む前に、弱いN3文法パターンをローテーションで復習してください。`,
        };
  const second: LocalizedString = {
    en: `Split study into three passes — input (listen/read), pattern drills (grammar tables & usage contrasts), and output (say or hand-write two fresh sentences using today's grammar).`,
    np: `अध्ययन तीन चरणमा बाँड्नुहोस् — इनपुट (सुनाइ/पढाइ), ढाँचा अभ्यास (व्याकरण तालिका र प्रयोग तुलना), र आउटपुट (आजको व्याकरण प्रयोग गरेर दुई नौला वाक्य बोल्न वा लेख्न)।`,
    jp: `学習を3ラウンドに分けましょう——インプット（聞く・読む）、パターン練習（文法表・使い分け）、アウトプット（今日の文法を使った新しい文を2つ声か手書きで）。`,
  };
  return [focus, second];
}

function tagsForN3Day(day: number): { label: string; slug: string }[] {
  const base = [
    { label: "JLPT N3", slug: "jlpt-n3" },
    { label: "N3 Grammar Guide", slug: "n3-grammar" },
  ];
  if (day >= 26) {
    return [...base, { label: "Exam sprint", slug: "sprint" }];
  }
  if (day % 4 === 0) return [...base, { label: "Listening", slug: "listening" }];
  if (day % 4 === 1) return [...base, { label: "Grammar", slug: "grammar" }];
  if (day % 4 === 2) return [...base, { label: "Particles", slug: "particles" }];
  return [...base, { label: "Kanji", slug: "kanji" }];
}

function buildN3Day(day: number): JapaneseRoadmapDay {
  const title = JP_N3_DAY_TITLES[day - 1];
  const spec = JP_N3_LESSON_SPECS[day - 1];
  return {
    day,
    title,
    tags: tagsForN3Day(day),
    detail: buildJapaneseN3DayDetail(day, jpN3Overview(day), spec),
  };
}

function weeklyTestForN3WeekId(weekId: string): JapaneseWeeklyTest | undefined {
  return N3_WEEKLY_JLPT_TESTS.find((t) => t.id === weekId);
}

export const JAPANESE_N3_WEEKS: JapaneseRoadmapWeek[] = [
  {
    id: "jn3-w1",
    title: {
      en: "Week 1 · Topics 1–7 · resulting state through obligation",
      np: "हप्ता १ · विषय १–७ · परिणाम अवस्थादेखि दायित्वसम्म",
      jp: "第1週 · トピック1–7 · 結果状態から義務まで",
    },
    dotClass: "bg-[var(--accent)]",
    days: [1, 2, 3, 4, 5, 6, 7].map(buildN3Day),
    weeklyTest: weeklyTestForN3WeekId("jn3-w1"),
  },
  {
    id: "jn3-w2",
    title: {
      en: "Week 2 · Topics 8–14 · hearsay through potential",
      np: "हप्ता २ · विषय ८–१४ · भनिन्छदेखि सम्भाव्यतासम्म",
      jp: "第2週 · トピック8–14 · 伝聞から可能まで",
    },
    dotClass: "bg-[var(--accent)]",
    days: [8, 9, 10, 11, 12, 13, 14].map(buildN3Day),
    weeklyTest: weeklyTestForN3WeekId("jn3-w2"),
  },
  {
    id: "jn3-w3",
    title: {
      en: "Week 3 · Topics 15–21 · honorifics through perspective",
      np: "हप्ता ३ · विषय १५–२१ · सम्मानसूचकदेखि दृष्टिकोणसम्म",
      jp: "第3週 · トピック15–21 · 敬語から視点まで",
    },
    dotClass: "bg-[var(--accent)]",
    days: [15, 16, 17, 18, 19, 20, 21].map(buildN3Day),
    weeklyTest: weeklyTestForN3WeekId("jn3-w3"),
  },
  {
    id: "jn3-w4",
    title: {
      en: "Week 4 · Topics 22–28 + sprint · cause-effect through full review",
      np: "हप्ता ४ · विषय २२–२८ + स्प्रिन्ट · कारण-प्रभावदेखि पूर्ण समीक्षासम्म",
      jp: "第4週 · トピック22–28＋スプリント · 因果関係から総復習まで",
    },
    dotClass: "bg-[var(--accent)]",
    days: [22, 23, 24, 25, 26, 27, 28].map(buildN3Day),
    weeklyTest: weeklyTestForN3WeekId("jn3-w4"),
  },
];

export function getAllJapaneseN3Days(): JapaneseRoadmapDay[] {
  return JAPANESE_N3_WEEKS.flatMap((w) => w.days).sort((a, b) => a.day - b.day);
}

export function getJapaneseN3DayContext(
  dayNumber: number,
): { weekTitle: LocalizedString; day: JapaneseRoadmapDay } | null {
  for (const week of JAPANESE_N3_WEEKS) {
    const day = week.days.find((d) => d.day === dayNumber);
    if (day) return { weekTitle: week.title, day };
  }
  return null;
}

export function resolveJapaneseN3Detail(day: JapaneseRoadmapDay): JapaneseRoadmapDayDetail {
  if (day.detail) return day.detail;
  return {
    overview: [
      {
        en: `Study focus: ${day.title}.`,
        np: `अध्ययन फोकस: ${day.title}.`,
        jp: `学習の焦点：${day.title}`,
      },
      {
        en: "Summarize today's N3 grammar in one English sentence.",
        np: "आजको N3 व्याकरण एक अङ्ग्रेजी वाक्यमा सारांश गर्नुहोस्।",
        jp: "今日のN3文法を英語の一文で要約してください。",
      },
    ],
    bullets: [
      {
        en: "Shadow audio twice.",
        np: "अडियो दुई पटक छायाँ गर्नुहोस्।",
        jp: "音声を二度シャドーイングする。",
      },
      {
        en: "Write four N3 kanji from memory.",
        np: "यादबाट चार N3 कांजी लेख्नुहोस्।",
        jp: "N3漢字を四つ思い出し書きする。",
      },
    ],
  };
}

export function seedJapaneseN3CompletedDayNumbers(): Set<number> {
  const done = new Set<number>();
  for (let d = 1; d < JP_N3_CURRENT_DAY; d += 1) done.add(d);
  return done;
}

export function resolveJapaneseN3WeeklyTestForRoadmap(openWeekOrMockId: string): JapaneseWeeklyTest | undefined {
  if (openWeekOrMockId === N3_FULL_LEVEL_MOCK_EXAM.id) return N3_FULL_LEVEL_MOCK_EXAM;
  return JAPANESE_N3_WEEKS.find((w) => w.id === openWeekOrMockId)?.weeklyTest;
}
