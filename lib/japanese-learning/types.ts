/** One turn in a scripted lesson conversation (bilingual + optional speaker label). */
export type JapaneseDialogueLine = {
  speaker?: string;
  ja: string;
  reading?: string;
  en: string;
};

/** Blocks used only in Japanese lesson panels (no backend SVG diagrams). */
export type JapaneseDetailBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; variant?: "bullet" | "number" }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "code"; title?: string; code: string }
  | {
      type: "dialogue";
      lines: JapaneseDialogueLine[];
    }
  | {
      type: "mcq";
      question: string;
      choices: string[];
      correctIndex: number;
      explanation?: string;
    }
  | {
      type: "listening";
      title?: string;
      scenario: string;
      instruction: string;
      keyPhrases: string[];
      studyTip?: string;
      /** Curated YouTube watch or search URLs for chapter-aligned listening. */
      youtubeVideos?: { url: string; title: string }[];
    }
  | {
      type: "kanjiStrokeStudy";
      caption?: string;
      items: {
        kanji: string;
        readings: string;
        meaning: string;
        strokes: number;
        strokeSvgUrl: string;
      }[];
    };

export interface JapaneseRoadmapDayDetailSection {
  title: string;
  items?: string[];
  blocks?: JapaneseDetailBlock[];
}

export interface JapaneseRoadmapDayDetail {
  overview: string | string[];
  sections?: JapaneseRoadmapDayDetailSection[];
  bullets?: string[];
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
      correctIndex: number;
      explanation?: string;
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
  subtitle?: string;
  intro?: string;
  sections: JapaneseWeeklyTestSection[];
}

/** End-of-week revision modeled after JLPT N5 paper structure (vocab · grammar · reading · listening). */
export interface JapaneseWeeklyTest {
  id: string;
  weekLabel: string;
  title: string;
  subtitle: string;
  coversDayRange: [number, number];
  intro: string;
  /** Single paper (weeks 1–4). Omit or leave empty when `subTests` is set. */
  sections: JapaneseWeeklyTestSection[];
  closingNote?: string;
  /** Week 5 sprint: multiple full tests (e.g. five × 20 questions). */
  subTests?: JapaneseWeeklySubTest[];
}

export interface JapaneseRoadmapWeek {
  id: string;
  title: string;
  dotClass: string;
  days: JapaneseRoadmapDay[];
  weeklyTest?: JapaneseWeeklyTest;
}
