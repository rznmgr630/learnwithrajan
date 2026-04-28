import { ensureDialogueAtLeastTwentyLines } from "@/lib/japanese-learning/n5-dialogue-expand";
import { twentyKanjiForDay } from "@/lib/japanese-learning/n5-kanji-pool";
import {
  youtubeClipsForMinnaLesson,
  youtubeClipsForSprintDay,
} from "@/lib/japanese-learning/n5-youtube-links";
import type {
  JapaneseDetailBlock,
  JapaneseDialogueLine,
  JapaneseRoadmapDayDetail,
  JapaneseRoadmapDayDetailSection,
} from "@/lib/japanese-learning/types";

/** Lesson blueprint — kanji list removed (handled by `twentyKanjiForDay`). */
export type N5LessonSpec = {
  minnaLesson: number | null;
  bookRef: string;
  dialogue: JapaneseDialogueLine[]; // padded to more than 20 lines (≥21) in the builder
  particles: { particle: string; note: string }[];
  grammarBullets: string[];
  grammarTable?: { caption?: string; headers: string[]; rows: string[][] };
  mcqs: {
    question: string;
    choices: string[];
    correctIndex: number;
    explanation?: string;
  }[];
  listening: {
    scenario: string;
    instruction: string;
    keyPhrases: string[];
    studyTip?: string;
  };
};

export function buildJapaneseDayDetail(
  day: number,
  title: string,
  overview: string[],
  spec: N5LessonSpec,
): JapaneseRoadmapDayDetail {
  const ref =
    spec.minnaLesson !== null
      ? `${spec.bookRef} · Lesson ${spec.minnaLesson}`
      : spec.bookRef;

  const dialogueLines = ensureDialogueAtLeastTwentyLines(spec.dialogue);

  const youtubeVideos =
    spec.minnaLesson !== null
      ? youtubeClipsForMinnaLesson(spec.minnaLesson)
      : youtubeClipsForSprintDay(day);

  const kanjiItems = twentyKanjiForDay(day);

  const sections: JapaneseRoadmapDayDetailSection[] = [
    {
      title: "Conversation",
      blocks: [{ type: "dialogue", lines: dialogueLines }],
    },
    {
      title: "Particles & usage",
      blocks: [
        {
          type: "table",
          caption: `Particle notes · ${ref}`,
          headers: ["Particle / pattern", "Focus today"],
          rows: spec.particles.map((p) => [`${p.particle}`, p.note]),
        },
      ],
    },
    {
      title: "Grammar",
      blocks: grammarBlocks(spec),
    },
    {
      title: "Kanji — stroke order (20 characters)",
      blocks: [
        {
          type: "paragraph",
          text: `Practice writing each character on grid paper while tracing stroke order in the diagrams (stroke numbers are embedded in each KanjiVG SVG). Total strokes shown below — match textbook handwriting.`,
        },
        {
          type: "kanjiStrokeStudy",
          caption: `Twenty kanji for Day ${day} · tap “Open stroke SVG” if an image fails to load`,
          items: kanjiItems,
        },
      ],
    },
    {
      title: "Multiple choice",
      blocks: spec.mcqs.map(
        (m): JapaneseDetailBlock => ({
          type: "mcq",
          question: m.question,
          choices: m.choices,
          correctIndex: m.correctIndex,
          explanation: m.explanation,
        }),
      ),
    },
    {
      title: "Listening — shadow these YouTube picks",
      blocks: [
        {
          type: "listening",
          title: `Audio-first · ${ref}`,
          scenario: spec.listening.scenario,
          instruction: spec.listening.instruction,
          keyPhrases: spec.listening.keyPhrases,
          studyTip: spec.listening.studyTip,
          youtubeVideos,
        },
      ],
    },
  ];

  const bullets = [
    `Read the conversation aloud twice (${ref}) — more than twenty exchange lines.`,
    `Copy every kanji stroke SVG row onto paper once.`,
    `Play each listening link with captions off first; replay with textbook transcript.`,
  ];

  return {
    overview,
    sections,
    bullets,
  };
}

function grammarBlocks(spec: N5LessonSpec): JapaneseDetailBlock[] {
  const blocks: JapaneseDetailBlock[] = [
    {
      type: "list",
      variant: "bullet",
      items: spec.grammarBullets,
    },
  ];
  if (spec.grammarTable && spec.grammarTable.rows.length > 0) {
    blocks.push({
      type: "table",
      caption: spec.grammarTable.caption,
      headers: spec.grammarTable.headers,
      rows: spec.grammarTable.rows,
    });
  }
  return blocks;
}
