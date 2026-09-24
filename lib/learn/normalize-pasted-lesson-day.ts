import type { LessonDay } from "@/lib/learn/lesson-types";
import type { LocalizedString } from "@/lib/i18n/types";

type RawQuiz = { question: string; answer?: string; options?: string[]; correctIndex?: number; explanation?: string };
type RawLesson = {
  id: string;
  title: string;
  durationMinutes: number;
  explanation: string;
  diagram: string;
  codeExample: string | { title: string; code: string; details?: string };
  keyTakeaways: string[];
  commonMistakes: string[];
  quiz: RawQuiz[];
};
type RawDay = Omit<LessonDay, "title" | "overview" | "difficulty" | "lessons" | "finalQuiz" | "project"> & {
  title: string;
  overview?: string;
  difficulty: string;
  lessons: RawLesson[];
  finalQuiz: RawQuiz[];
  project?: { name: string; goal: string; brief: string; steps: string[]; acceptance: string[]; stretch?: string[] };
};

const local = (en: string): LocalizedString => ({ en, np: en, jp: en });

function decodeHtmlEntities(value: string): string {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#x20;", " ")
    .replaceAll("&amp;", "&");
}

function unwrapPreformatted(value: string): string {
  return decodeHtmlEntities(value)
    .replace(/^<pre(?:\s[^>]*)?>\s*/i, "")
    .replace(/^<code(?:\s[^>]*)?>\s*/i, "")
    .replace(/\s*<\/pre>\s*$/i, "")
    .replace(/\s*<\/code>\s*$/i, "")
    .replace(/\[(https?:\/\/[^\]]+)\]\(\1\)/g, "$1")
    .trim();
}

export function normalizePastedLessonDay(raw: RawDay): LessonDay {
  return {
    ...raw,
    title: local(raw.title),
    overview: raw.overview ? local(raw.overview) : undefined,
    difficulty: local(raw.difficulty),
    lessons: raw.lessons.map((lesson) => ({
      ...lesson,
      title: local(lesson.title),
      explanation: local(lesson.explanation),
      diagram: unwrapPreformatted(lesson.diagram),
      codeExample: typeof lesson.codeExample === "string"
        ? { title: local("Code example"), code: unwrapPreformatted(lesson.codeExample) }
        : {
            title: local(lesson.codeExample.title),
            code: unwrapPreformatted(lesson.codeExample.code),
            details: lesson.codeExample.details ? local(lesson.codeExample.details) : undefined,
          },
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
