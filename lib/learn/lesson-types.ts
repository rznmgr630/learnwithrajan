import type { LocalizedString } from "@/lib/i18n/types";
import type { SelfCheckItem } from "@/lib/learn/self-check-types";

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
  /** Optional recall prompts shown between the lessons and the final quiz. */
  selfCheck?: SelfCheckItem[];
  finalQuiz: LessonQuizQuestion[];
}
