import type { LocalizedString } from "@/lib/i18n/types";

export interface LessonQuizQuestion {
  question: LocalizedString;
  options: LocalizedString[];
  correctIndex: number;
  explanation: LocalizedString;
}

export interface Lesson {
  id: string;
  title: LocalizedString;
  durationMinutes: number;
  explanation: LocalizedString;
  diagram: string;
  codeExample: { title: LocalizedString; code: string };
  keyTakeaways: LocalizedString[];
  commonMistakes: LocalizedString[];
  quiz: LessonQuizQuestion[];
  /** YouTube ids shown under the tabs, for lessons with companion videos. */
  youtubeIds?: string[];
}

export interface LessonDay {
  day: number;
  title: LocalizedString;
  totalMinutes: number;
  difficulty: LocalizedString;
  lessons: Lesson[];
  finalQuiz: LessonQuizQuestion[];
  /** Optional build slice shown at the bottom, after the final quiz. */
  project?: LessonProject;
}

/** One day's slice of the app that grows across a whole track. */
export interface LessonProject {
  /** App name, shown as a pill (e.g. "InvoiceHub"). */
  name: LocalizedString;
  /** One line on what this day adds to it. */
  goal: LocalizedString;
  /** Why this slice comes now, and what it does not cover yet. */
  brief: LocalizedString;
  steps: LocalizedString[];
  /** Checks that tell you the slice is finished. */
  acceptance: LocalizedString[];
  stretch?: LocalizedString[];
}
