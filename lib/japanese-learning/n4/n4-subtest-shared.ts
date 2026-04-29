/**
 * Shared helpers for JLPT N4-style weekly papers (five tests × 20 MCQs each).
 */

import type {
  JapaneseWeeklySubTest,
  JapaneseWeeklyTestItem,
  LocalizedString,
} from "@/lib/japanese-learning/types";
import { youtubeClipsForMinnaIILesson, youtubeClipsForN4SprintDay } from "@/lib/japanese-learning/n4/n4-youtube-links";

export const N4_YT_SAMPLE_CLIP_ID = "dPjxIuJZiZc";

export function m4(
  id: string,
  prompt: string,
  choices: string[],
  correctIndex: number,
  explanation?: string,
): Extract<JapaneseWeeklyTestItem, { kind: "mcq" }> {
  return { kind: "mcq", id, prompt, choices, correctIndex, explanation };
}

export function clipsN4(...lessons: number[]): { url: string; title: string }[] {
  const out: { url: string; title: string }[] = [];
  for (const n of lessons) {
    for (const c of youtubeClipsForMinnaIILesson(n)) {
      if (!out.some((x) => x.url === c.url)) out.push(c);
    }
  }
  return out.slice(0, 4);
}

export function n4ListeningIntro(
  id: string,
  scenario: string,
  instruction: string,
  lessonNums: number[],
  sprintDay?: number,
): JapaneseWeeklyTestItem {
  const base = [...clipsN4(...lessonNums)];
  if (sprintDay !== undefined) {
    for (const c of youtubeClipsForN4SprintDay(sprintDay)) {
      if (!base.some((x) => x.url === c.url)) base.push(c);
    }
  }
  return {
    kind: "listeningIntro",
    id,
    scenario,
    instruction,
    youtubeVideos: base.slice(0, 5),
    embedVideoId: N4_YT_SAMPLE_CLIP_ID,
  };
}

export type McqPoolRow = [string, string[], number, string | undefined];

/**
 * Builds five JLPT N4-style papers (Test 1–5) from parallel pools.
 * Test 1 is easiest; Test 5 is hardest.
 */
export function buildN4FivePaperWeek(options: {
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
      m4(`${tid}-v-${j + 1}`, prompt, choices, correctIndex, explanation),
    );
    const grammarItems = grammarBlocks[i].map(([prompt, choices, correctIndex, explanation], j) =>
      m4(`${tid}-g-${j + 1}`, prompt, choices, correctIndex, explanation),
    );
    const readingItems = readingBlocks[i].map(([prompt, choices, correctIndex, explanation], j) =>
      m4(`${tid}-r-${j + 1}`, prompt, choices, correctIndex, explanation),
    );
    const listeningMcqs = listeningMcqBlocks[i].map(([prompt, choices, correctIndex, explanation], j) =>
      m4(`${tid}-l-${j + 1}`, prompt, choices, correctIndex, explanation),
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
