import type { LessonDay } from "@/lib/learn/lesson-types";
import type { LocalizedString } from "@/lib/i18n/types";

type RawQuiz = { question: string; answer?: string; options?: string[]; correctIndex?: number; explanation?: string };
type RawLesson = {
  id: string;
  title: string;
  durationMinutes: number;
  explanation: string;
  diagram: string;
  codeExample: string | { title: string; code: string };
  keyTakeaways: string[];
  commonMistakes: string[];
  quiz: RawQuiz[];
};
type RawDay = Omit<LessonDay, "title" | "difficulty" | "lessons" | "finalQuiz" | "project"> & {
  title: string;
  difficulty: string;
  lessons: RawLesson[];
  finalQuiz: RawQuiz[];
  project?: { name: string; goal: string; brief: string; steps: string[]; acceptance: string[]; stretch?: string[] };
};

const local = (en: string): LocalizedString => ({ en, np: en, jp: en });

export function normalizePastedLessonDay(raw: RawDay): LessonDay {
  return {
    ...raw,
    title: local(raw.title),
    difficulty: local(raw.difficulty),
    lessons: raw.lessons.map((lesson) => ({
      ...lesson,
      title: local(lesson.title),
      explanation: local(lesson.explanation),
      codeExample: typeof lesson.codeExample === "string"
        ? { title: local("Code example"), code: lesson.codeExample }
        : { title: local(lesson.codeExample.title), code: lesson.codeExample.code },
      keyTakeaways: lesson.keyTakeaways.map(local),
      commonMistakes: lesson.commonMistakes.map(local),
      quiz: lesson.quiz.map((item) => ({ question: local(item.question), options: (item.options ?? [item.answer ?? ""]).map(local), correctIndex: item.correctIndex ?? 0, explanation: local(item.explanation ?? item.answer ?? "") })),
    })),
    finalQuiz: raw.finalQuiz.map((item) => ({ question: local(item.question), options: (item.options ?? [item.answer ?? ""]).map(local), correctIndex: item.correctIndex ?? 0, explanation: local(item.explanation ?? item.answer ?? "") })),
    project: raw.project && {
      name: local(raw.project.name), goal: local(raw.project.goal), brief: local(raw.project.brief),
      steps: raw.project.steps.map(local), acceptance: raw.project.acceptance.map(local), stretch: raw.project.stretch?.map(local),
    },
  };
}
