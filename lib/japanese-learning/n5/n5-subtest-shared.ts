/**
 * Shared helpers for JLPT-style weekly papers (five tests × 20 MCQs each).
 */

import type {
  JapaneseWeeklySubTest,
  JapaneseWeeklyTestItem,
  LocalizedString,
} from "@/lib/japanese-learning/types";
import { youtubeClipsForMinnaLesson, youtubeClipsForSprintDay } from "@/lib/japanese-learning/n5/n5-youtube-links";

export const YT_SAMPLE_CLIP_ID = "dPjxIuJZiZc";

export function m(
  id: string,
  prompt: string,
  choices: string[],
  correctIndex: number,
  explanation?: string,
): Extract<JapaneseWeeklyTestItem, { kind: "mcq" }> {
  return { kind: "mcq", id, prompt, choices, correctIndex, explanation };
}

/** Deduped Minna lesson clip URLs for listening prep (max `limit`). */
export function clips(...lessons: number[]): { url: string; title: string }[] {
  const out: { url: string; title: string }[] = [];
  for (const n of lessons) {
    for (const c of youtubeClipsForMinnaLesson(n)) {
      if (!out.some((x) => x.url === c.url)) out.push(c);
    }
  }
  return out.slice(0, 4);
}

export function listeningIntroEmbedded(
  id: string,
  scenario: string,
  instruction: string,
  lessonNums: number[],
  sprintDay?: number,
): JapaneseWeeklyTestItem {
  const base = [...clips(...lessonNums)];
  if (sprintDay !== undefined) {
    for (const c of youtubeClipsForSprintDay(sprintDay)) {
      if (!base.some((x) => x.url === c.url)) base.push(c);
    }
  }
  return {
    kind: "listeningIntro",
    id,
    scenario,
    instruction,
    youtubeVideos: base.slice(0, 5),
    embedVideoId: YT_SAMPLE_CLIP_ID,
  };
}

/** One row: prompt, choices, correctIndex, explanation */
export type McqPoolRow = [string, string[], number, string | undefined];

/**
 * Builds five JLPT-style papers (Test 1–5) from parallel pools — each pool index is one exam variant.
 */
export function buildJlptFivePaperWeek(options: {
  weekPrefix: string;
  vocabBlocks: McqPoolRow[][];
  grammarBlocks: McqPoolRow[][];
  readingBlocks: McqPoolRow[][];
  listeningMcqBlocks: McqPoolRow[][];
  listeningIntroForTest: (testNum: number, tidPrefix: string) => JapaneseWeeklyTestItem;
  paperSubtitle: LocalizedString;
  paperIntro: string;
}): JapaneseWeeklySubTest[] {
  const {
    weekPrefix,
    vocabBlocks,
    grammarBlocks,
    readingBlocks,
    listeningMcqBlocks,
    listeningIntroForTest,
    paperSubtitle,
    paperIntro,
  } = options;

  return [1, 2, 3, 4, 5].map((testNum) => {
    const tid = `${weekPrefix}-t${testNum}`;
    const i = testNum - 1;

    const vocabItems = vocabBlocks[i].map(([prompt, choices, correctIndex, explanation], j) =>
      m(`${tid}-v-${j + 1}`, prompt, choices, correctIndex, explanation),
    );
    const grammarItems = grammarBlocks[i].map(([prompt, choices, correctIndex, explanation], j) =>
      m(`${tid}-g-${j + 1}`, prompt, choices, correctIndex, explanation),
    );
    const readingItems = readingBlocks[i].map(([prompt, choices, correctIndex, explanation], j) =>
      m(`${tid}-r-${j + 1}`, prompt, choices, correctIndex, explanation),
    );
    const listeningMcqs = listeningMcqBlocks[i].map(([prompt, choices, correctIndex, explanation], j) =>
      m(`${tid}-l-${j + 1}`, prompt, choices, correctIndex, explanation),
    );

    return {
      id: tid,
      label: `Test ${testNum}`,
      subtitle: paperSubtitle,
      intro: paperIntro,
      sections: [
        { title: "言語知識（文字・語彙・漢字）", blurb: "5問", items: vocabItems },
        { title: "言語知識（文法）", blurb: "6問", items: grammarItems },
        { title: "読解", blurb: "5問", items: readingItems },
        {
          title: "聴解",
          blurb: "リスニング · 4問（＋準備・クリップ）",
          items: [listeningIntroForTest(testNum, tid), ...listeningMcqs],
        },
      ],
    };
  });
}
