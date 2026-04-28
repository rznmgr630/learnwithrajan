import type { Locale, LocalizedString } from "@/lib/i18n/types";

export type { LocalizedString };

/** One turn in a scripted lesson conversation (bilingual + optional speaker label). */
export type JapaneseDialogueLine = {
  speaker?: string;
  ja: string;
  reading?: string;
  /** English gloss — localized when triple is provided; Japanese line stays in `ja`. */
  en: LocalizedString;
};

/** Blocks used only in Japanese lesson panels (no backend SVG diagrams). */
export type JapaneseDetailBlock =
  | { type: "paragraph"; text: LocalizedString }
  | { type: "list"; items: LocalizedString[]; variant?: "bullet" | "number" }
  | { type: "table"; caption?: LocalizedString; headers: LocalizedString[]; rows: LocalizedString[][] }
  | { type: "code"; title?: string; code: string }
  | {
      type: "dialogue";
      lines: JapaneseDialogueLine[];
    }
  | {
      type: "mcq";
      question: LocalizedString;
      choices: LocalizedString[];
      correctIndex: number;
      explanation?: LocalizedString;
    }
  | {
      type: "listening";
      title?: LocalizedString;
      scenario: LocalizedString;
      instruction: LocalizedString;
      keyPhrases: LocalizedString[];
      studyTip?: LocalizedString;
      /** Curated YouTube watch or search URLs for chapter-aligned listening. */
      youtubeVideos?: { url: string; title: string }[];
    }
  | {
      type: "kanjiStrokeStudy";
      caption?: LocalizedString;
      items: {
        kanji: string;
        readings: string;
        meaning: LocalizedString;
        strokes: number;
        strokeSvgUrl: string;
      }[];
    };

export interface JapaneseRoadmapDayDetailSection {
  title: LocalizedString;
  items?: LocalizedString[];
  blocks?: JapaneseDetailBlock[];
}

export interface JapaneseRoadmapDayDetail {
  overview: LocalizedString | LocalizedString[];
  sections?: JapaneseRoadmapDayDetailSection[];
  bullets?: LocalizedString[];
}

export interface JapaneseRoadmapTag {
  label: string;
  slug: string;
}

export interface JapaneseRoadmapDay {
  day: number;
  title: string;
  tags: JapaneseRoadmapTag[];
  detail?: JapaneseRoadmapDayDetail;
}

/** One question in a weekly JLPT-style recap — answers hidden until the user reveals them. */
export type JapaneseWeeklyTestItem =
  | {
      kind: "mcq";
      id: string;
      prompt: string;
      choices: string[];
      /** Same length as `choices`; usually English. Optional per-locale labels — Japanese prompts stay unchanged. */
      choicesLocale?: Partial<Record<Locale, string[]>>;
      correctIndex: number;
      explanation?: string | LocalizedString;
    }
  | {
      kind: "short";
      id: string;
      prompt: string;
      modelAnswer: string;
    }
  | {
      kind: "listeningIntro";
      id: string;
      scenario: string;
      instruction: string;
      youtubeVideos: { url: string; title: string }[];
      /** Inline short listening clip (YouTube video id, 11 chars). */
      embedVideoId?: string;
    };

export interface JapaneseWeeklyTestSection {
  /** JLPT-style section label, e.g. 語彙（もじ・ことば） */
  title: string;
  blurb?: string;
  items: JapaneseWeeklyTestItem[];
}

/** One paper inside a week (e.g. Week 5 has five full JLPT-style mocks). */
export interface JapaneseWeeklySubTest {
  id: string;
  label: string;
  subtitle?: LocalizedString;
  /** Often Japanese-only paper instructions — plain string is OK. */
  intro?: string;
  sections: JapaneseWeeklyTestSection[];
}

/** End-of-week revision modeled after JLPT N5 paper structure (vocab · grammar · reading · listening). */
export interface JapaneseWeeklyTest {
  id: string;
  weekLabel: LocalizedString;
  title: LocalizedString;
  subtitle: LocalizedString;
  coversDayRange: [number, number];
  /** UI copy around the test (English / NP / JP); Japanese lesson sentences stay in items. */
  intro: LocalizedString;
  /** Single paper (weeks 1–4). Omit or leave empty when `subTests` is set. */
  sections: JapaneseWeeklyTestSection[];
  closingNote?: LocalizedString;
  /** Week 5 sprint: multiple full tests (e.g. five × 20 questions). */
  subTests?: JapaneseWeeklySubTest[];
}

export interface JapaneseRoadmapWeek {
  id: string;
  title: LocalizedString;
  dotClass: string;
  days: JapaneseRoadmapDay[];
  weeklyTest?: JapaneseWeeklyTest;
}
