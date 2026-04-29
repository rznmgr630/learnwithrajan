import { ensureDialogueAtLeastTwentyLines } from "@/lib/japanese-learning/n5/n5-dialogue-expand";
import { twentyN4KanjiForDay } from "@/lib/japanese-learning/n4/n4-kanji-pool";
import {
  youtubeClipsForMinnaIILesson,
  youtubeClipsForN4SprintDay,
} from "@/lib/japanese-learning/n4/n4-youtube-links";
import type {
  JapaneseDetailBlock,
  JapaneseRoadmapDayDetail,
  JapaneseRoadmapDayDetailSection,
  LocalizedString,
} from "@/lib/japanese-learning/types";
import type { N5LessonSpec } from "@/lib/japanese-learning/n5/build-japanese-detail";

const SECTION = {
  conversation: { en: "Conversation", np: "संवाद", jp: "会話" },
  particles: { en: "Particles & usage", np: "जुड्ने शब्द र प्रयोग", jp: "助詞と使い分け" },
  grammar: { en: "Grammar", np: "व्याकरण", jp: "文法" },
  kanji: { en: "Kanji — stroke order (20 characters)", np: "कांजी — रेखाहरू (२० वर्ण)", jp: "漢字 · 筆順（20字）" },
  mcq: { en: "Multiple choice", np: "बहुविकल्प", jp: "選択問題" },
  listening: { en: "Listening — shadow these YouTube picks", np: "सुन्ने — यी YouTube छनोटहरू छायाँ गर्नुहोस्", jp: "聴解 · 次のYouTubeでシャドーイング" },
} satisfies Record<string, LocalizedString>;

export function buildJapaneseN4DayDetail(
  day: number,
  overview: LocalizedString[],
  spec: N5LessonSpec,
): JapaneseRoadmapDayDetail {
  const ref =
    spec.minnaLesson !== null
      ? `${spec.bookRef} · Lesson ${spec.minnaLesson}`
      : spec.bookRef;

  const dialogueLines = ensureDialogueAtLeastTwentyLines(spec.dialogue);

  const youtubeVideos =
    spec.minnaLesson !== null
      ? youtubeClipsForMinnaIILesson(spec.minnaLesson)
      : youtubeClipsForN4SprintDay(day);

  const kanjiItems = twentyN4KanjiForDay(day);

  const particleCaption: LocalizedString = {
    en: `Particle notes · ${ref}`,
    np: `जुड्ने शब्द टिप्पणी · ${ref}`,
    jp: `助詞のメモ · ${ref}`,
  };
  const particleHeaders: LocalizedString[] = [
    { en: "Particle / pattern", np: "जुड्ने शब्द / ढाँचा", jp: "助詞・パターン" },
    { en: "Focus today", np: "आजको फोकस", jp: "今日のポイント" },
  ];

  const kanjiIntro: LocalizedString = {
    en: `Practice writing each character on grid paper while tracing stroke order. N4 kanji have higher stroke counts — take your time.`,
    np: `रेखाहरू पछ्याउँदै ग्रिड कागजमा प्रत्येक वर्ण लेख्न अभ्यास गर्नुहोस्। N4 कांजीमा बढी रेखाहरू छन् — समय लिएर गर्नुहोस्।`,
    jp: `方眼紙に筆順をなぞりながら各字を書いて練習してください。N4の漢字は画数が多めです——ゆっくり丁寧に。`,
  };
  const kanjiCaption: LocalizedString = {
    en: `Twenty N4 kanji for Day ${day} · tap "Open stroke SVG" if an image fails to load`,
    np: `दिन ${day} का बीस N4 कांजी · छवि लोड नभएमा Open stroke SVG ट्याप गर्नुहोस्`,
    jp: `Day ${day} のN4漢字20字 · 画像が出ないときは「Open stroke SVG」を開いてください`,
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
      title: SECTION.grammar,
      blocks: grammarBlocks(spec),
    },
    {
      title: SECTION.kanji,
      blocks: [
        { type: "paragraph", text: kanjiIntro },
        { type: "kanjiStrokeStudy", caption: kanjiCaption, items: kanjiItems },
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
      blocks: [
        {
          type: "listening",
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

  return {
    overview,
    sections,
    bullets: [
      {
        en: `Read the conversation aloud twice (${ref}) — more than twenty exchange lines.`,
        np: `संवाद दुई पटक जोरले पढ्नुहोस् (${ref}) — बीसभन्दा बढी लाइनहरू।`,
        jp: `${ref}の会話を二度声に出す——20往復以上。`,
      },
      {
        en: `Copy every N4 kanji stroke SVG row onto paper once.`,
        np: `प्रत्येक N4 कांजी रेखा SVG पङ्क्ति कागजमा एक पटक नक्कल गर्नुहोस्।`,
        jp: `N4漢字の筆順SVGの行をすべて紙に一度ずつ写す。`,
      },
      {
        en: `Play each listening link with captions off first; replay with textbook transcript.`,
        np: `प्रत्येक सुन्ने लिंक पहिले क्याप्सन बन्द गरेर बजाउनुहोस्।`,
        jp: `各聴解リンクは字幕オフで再生してから、スクリプト付きで再生し直す。`,
      },
    ],
  };
}

function grammarBlocks(spec: N5LessonSpec): JapaneseDetailBlock[] {
  const blocks: JapaneseDetailBlock[] = [
    { type: "list", variant: "bullet", items: spec.grammarBullets },
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
