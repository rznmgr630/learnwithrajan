import type { LocalizedString } from "@/lib/i18n/types";

export interface JsLessonQuizQuestion {
  question: LocalizedString;
  options: LocalizedString[];
  correctIndex: number;
  explanation: LocalizedString;
}

export interface JsLesson {
  id: string;
  title: LocalizedString;
  durationMinutes: number;
  explanation: LocalizedString;
  diagram: string;
  codeExample: { title: LocalizedString; code: string };
  keyTakeaways: LocalizedString[];
  commonMistakes: LocalizedString[];
  quiz: JsLessonQuizQuestion[];
}

export interface JsLessonDay {
  day: number;
  title: LocalizedString;
  totalMinutes: number;
  difficulty: LocalizedString;
  lessons: JsLesson[];
  finalQuiz: JsLessonQuizQuestion[];
}
