import { buildN5DialogueLines } from "@/lib/japanese-learning/n5/n5-dialogue-expand";
import {
  n5VocabularySectionCaption,
  n5VocabularySectionTitle,
  n5VocabularyTableHeaders,
  n5VocabularyTableRows,
} from "@/lib/japanese-learning/n5/n5-lesson-vocabulary";
import { twentyKanjiForDay } from "@/lib/japanese-learning/n5/n5-kanji-pool";
import {
  youtubeClipsForMinnaLesson,
  youtubeClipsForSprintDay,
} from "@/lib/japanese-learning/n5/n5-youtube-links";
import type {
  JapaneseDetailBlock,
  JapaneseDialogueLine,
  JapaneseRoadmapDayDetail,
  JapaneseRoadmapDayDetailSection,
  LocalizedString,
} from "@/lib/japanese-learning/types";

/**
 * Lesson blueprint — kanji list removed (handled by `twentyKanjiForDay`).
 *
 * All content fields accept `LocalizedString` so per-field Nepali / Japanese
 * translations can be added progressively without breaking existing plain-string data.
 * A plain `string` is a valid `LocalizedString` — it renders as-is in every locale.
 */
export type N5LessonSpec = {
  minnaLesson: number | null;
  bookRef: string;
  dialogue: JapaneseDialogueLine[]; // merged with lesson-tail practice to ≥21 lines in the builder
  particles: { particle: string; note: LocalizedString }[];
  grammarBullets: LocalizedString[];
  grammarTable?: { caption?: LocalizedString; headers: LocalizedString[]; rows: LocalizedString[][] };
  mcqs: {
    question: LocalizedString;
    choices: LocalizedString[];
    correctIndex: number;
    explanation?: LocalizedString;
  }[];
  listening: {
    scenario: LocalizedString;
    instruction: LocalizedString;
    keyPhrases: LocalizedString[];
    studyTip?: LocalizedString;
    /** When provided, renders an interactive TTS player + Q&A block instead of the static listening card. */
    qna?: {
      situation: LocalizedString;
      script: string;
      transcript?: string;
      questions: {
        question: LocalizedString;
        choices: LocalizedString[];
        correctIndex: number;
        explanation?: LocalizedString;
      }[];
    };
  };
};

const SECTION = {
  conversation: {
    en: "Conversation",
    np: "संवाद",
    jp: "会話",
  },
  particles: {
    en: "Particles & usage",
    np: "जुड्ने शब्द र प्रयोग",
    jp: "助詞と使い分け",
  },
  grammar: {
    en: "Grammar",
    np: "व्याकरण",
    jp: "文法",
  },
  kanji: {
    en: "Kanji — stroke order (20 characters)",
    np: "कांजी — रेखाहरू (२० वर्ण)",
    jp: "漢字 · 筆順（20字）",
  },
  mcq: {
    en: "Multiple choice",
    np: "बहुविकल्प",
    jp: "選択問題",
  },
  listening: {
    en: "Listening — shadow these YouTube picks",
    np: "सुन्ने — यी YouTube छनोटहरू छायाँ गर्नुहोस्",
    jp: "聴解 · 次のYouTubeでシャドーイング",
  },
} satisfies Record<string, LocalizedString>;

export function buildJapaneseDayDetail(
  day: number,
  overview: LocalizedString[],
  spec: N5LessonSpec,
): JapaneseRoadmapDayDetail {
  const ref =
    spec.minnaLesson !== null
      ? `${spec.bookRef} · Lesson ${spec.minnaLesson}`
      : spec.bookRef;

  const dialogueLines = buildN5DialogueLines(spec.dialogue, spec.minnaLesson, day);

  const youtubeVideos =
    spec.minnaLesson !== null
      ? youtubeClipsForMinnaLesson(spec.minnaLesson)
      : youtubeClipsForSprintDay(day);

  const kanjiItems = twentyKanjiForDay(day);

  const particleCaption: LocalizedString = {
    en: `Particle notes · ${ref}`,
    np: `जुड्ने शब्द टिप्पणी · ${ref}`,
    jp: `助詞のメモ · ${ref}`,
  };

  const particleHeaders: LocalizedString[] = [
    {
      en: "Particle / pattern",
      np: "जुड्ने शब्द / ढाँचा",
      jp: "助詞・パターン",
    },
    {
      en: "Focus today",
      np: "आजको फोकस",
      jp: "今日のポイント",
    },
  ];

  const kanjiIntro: LocalizedString = {
    en: `Practice writing each character on grid paper while tracing stroke order in the diagrams (stroke numbers are embedded in each KanjiVG SVG). Total strokes shown below — match textbook handwriting.`,
    np: `ट्रेसिंग डायाग्राममा रेखाहरू पछ्याउँदै ग्रिड कागजमा प्रत्येक वर्ण लेख्न अभ्यास गर्नुहोस् (KanjiVG SVG मा रेखा संख्या छ)। तल जम्मा रेखाहरू देखाइएको छ — पाठ्यपुस्तकको हस्तलेखन मिलाउनुहोस्।`,
    jp: `各字を方眼紙に書きながら、図の筆順をなぞって練習してください（KanjiVGのSVGに画番号が埋め込まれています）。下の総画数は教科書の手本書きと合わせて確認してください。`,
  };

  const kanjiCaption: LocalizedString = {
    en: `Twenty kanji for Day ${day} · tap “Open stroke SVG” if an image fails to load`,
    np: `दिन ${day} का बीस कांजी · छवि लोड नभएमा Open stroke SVG ट्याप गर्नुहोस्`,
    jp: `Day ${day} の漢字20字 · 画像が表示されないときは「Open stroke SVG」を開いてください`,
  };

  const listeningTitle: LocalizedString = {
    en: `Audio-first · ${ref}`,
    np: `अडियो पहिले · ${ref}`,
    jp: `音声優先 · ${ref}`,
  };

  const sections: JapaneseRoadmapDayDetailSection[] = [
    {
      title: SECTION.conversation,
      blocks: [{ type: "dialogue", lines: dialogueLines }],
    },
    {
      title: SECTION.particles,
      blocks: [
        {
          type: "table",
          caption: particleCaption,
          headers: particleHeaders,
          rows: spec.particles.map((p): LocalizedString[] => [`${p.particle}`, p.note]),
        },
      ],
    },
    {
      title: n5VocabularySectionTitle(),
      blocks: [
        {
          type: "table",
          caption: n5VocabularySectionCaption(ref),
          headers: n5VocabularyTableHeaders(),
          rows: n5VocabularyTableRows(spec.minnaLesson, day),
        },
      ],
    },
    {
      title: SECTION.grammar,
      blocks: grammarBlocks(spec),
    },
    {
      title: SECTION.kanji,
      blocks: [
        {
          type: "paragraph",
          text: kanjiIntro,
        },
        {
          type: "kanjiStrokeStudy",
          caption: kanjiCaption,
          items: kanjiItems,
        },
      ],
    },
    {
      title: SECTION.mcq,
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
      title: SECTION.listening,
      blocks: spec.listening.qna
        ? [
            {
              type: "listeningQna" as const,
              title: listeningTitle,
              situation: spec.listening.qna.situation,
              script: spec.listening.qna.script,
              transcript: spec.listening.qna.transcript,
              questions: spec.listening.qna.questions,
              youtubeVideos,
            },
          ]
        : [
            {
              type: "listening" as const,
              title: listeningTitle,
              scenario: spec.listening.scenario,
              instruction: spec.listening.instruction,
              keyPhrases: spec.listening.keyPhrases,
              studyTip: spec.listening.studyTip,
              youtubeVideos,
            },
          ],
    },
  ];

  const bullets: LocalizedString[] = [
    {
      en: `Read the conversation aloud twice (${ref}) — more than twenty exchange lines.`,
      np: `संवाद दुई पटक जोरले पढ्नुहोस् (${ref}) — बीसभन्दा बढी लाइनहरू।`,
      jp: `会話を${ref}に沿って二度声に出して読む——20往復以上のやりとりです。`,
    },
    {
      en: `Copy every kanji stroke SVG row onto paper once.`,
      np: `प्रत्येक कांजी रेखा SVG पङ्क्ति कागजमा एक पटक नक्कल गर्नुहोस्।`,
      jp: `漢字の筆順SVGの行をすべて紙に一度ずつ写してください。`,
    },
    {
      en: `Play each listening link with captions off first; replay with textbook transcript.`,
      np: `प्रत्येक सुन्ने लिंक पहिले क्याप्सन बन्द गरेर बजाउनुहोस्; पाठ्यपुस्तकको ट्रान्स्क्रिप्टसँग दोहोर्याउनुहोस्।`,
      jp: `各聴解リンクは最初は字幕オフで再生し、教科書のスクリプトで再生し直してください。`,
    },
    {
      en: `Memorize the vocabulary table aloud: cover the meaning column and recall from kana/kanji (${ref}).`,
      np: `शब्दावली तालिका जोरले याद गर्नुहोस्: अर्थ लुकाएर काना/कांजीबाट सम्झनुहोस् (${ref})।`,
      jp: `語彙表を声に出して暗記しましょう。意味の列を隠してかな・漢字から言い直します（${ref}）。`,
    },
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
