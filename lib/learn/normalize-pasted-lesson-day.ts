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
type RawDay = Omit<LessonDay, "title" | "overview" | "difficulty" | "lessons" | "finalQuiz" | "footer" | "project"> & {
  title: string;
  overview?: string;
  difficulty: string;
  lessons: RawLesson[];
  finalQuiz: RawQuiz[];
  footer?: string;
  project?: { name: string; goal: string; brief: string; steps: string[]; acceptance: string[]; stretch?: string[]; footer?: string };
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

function isExampleCue(value: string): boolean {
  return /(?::|for example|conceptually|like this|look like|looks like|might look like|can represent|can give you|you can use|you can have|you might see|suppose we have|contains|contain|instead of|then|here|such as)$/i.test(value.trim());
}

function isStrongCodeParagraph(value: string): boolean {
  const text = value.trim();
  if (!text || /^(__FENCED_BLOCK_\d+__|#{1,4}\s|---$|>\s|[-*•]\s)/.test(text)) return false;
  if (/[┌┐└┘├┤┬┴┼│─↓↑←→▼▲]/.test(text)) return true;
  if (text.includes("\n")) {
    const lines = text.split("\n").filter(Boolean);
    return lines.length > 1 && lines.some((line) => isStrongCodeParagraph(line));
  }
  return /^(?:import\s|export\s|const\s|let\s|var\s|return\s|if\s*\(|for\s*\(|function\s|class\s|@media\s|<\/?[A-Z]|[./][\w[\]()-]+|\w+\([^)]*\);?$|\w+(?:\.\w+)+|[.#]\w+\s*\{|[\w-]+:\s*(?:[{["'\d]|true|false)|\/?[\w-]+\.(?:tsx?|jsx?)$)/.test(text);
}

function isShortExampleLine(value: string): boolean {
  const text = value.trim();
  if (!text || text.length > 60 || /[.!?]$/.test(text) || /^(__FENCED_BLOCK_\d+__|#{1,4}\s|---$|>\s|[-*•]\s)/.test(text)) return false;
  return text.split(/\s+/).length <= 7;
}

function codeLanguage(value: string): "tsx" | "text" {
  return /(?:<\/?[A-Z]|\b(?:import|export|const|let|function|return|StyleSheet|FlatList|router\.)\b)/.test(value) ? "tsx" : "text";
}

function formatCodeLikeExamples(value: string): string {
  const fencedBlocks: string[] = [];
  const protectedText = value.replace(/```[\s\S]*?```/g, (block) => {
    const placeholder = `__FENCED_BLOCK_${fencedBlocks.length}__`;
    fencedBlocks.push(block);
    return placeholder;
  });
  const paragraphs = protectedText.split(/\n\s*\n/);
  const output: string[] = [];

  for (let index = 0; index < paragraphs.length; index++) {
    const paragraph = paragraphs[index].trim();
    if (!paragraph) continue;
    if (/^__FENCED_BLOCK_\d+__$/.test(paragraph)) {
      output.push(paragraph);
      continue;
    }

    if (isStrongCodeParagraph(paragraph)) {
      output.push(`\`\`\`${codeLanguage(paragraph)}\n${paragraph}\n\`\`\``);
      continue;
    }

    output.push(paragraph);
    if (!isExampleCue(paragraph)) continue;

    const examples: string[] = [];
    while (index + 1 < paragraphs.length) {
      const candidate = paragraphs[index + 1].trim();
      if (isExampleCue(candidate)) break;
      if (!isStrongCodeParagraph(candidate) && !isShortExampleLine(candidate)) break;
      examples.push(candidate);
      index++;
    }
    if (examples.length) {
      const example = examples.join("\n");
      output.push(`\`\`\`${codeLanguage(example)}\n${example}\n\`\`\``);
    }
  }

  return output.join("\n\n").replace(/__FENCED_BLOCK_(\d+)__/g, (_, index) => fencedBlocks[Number(index)]);
}

function localizeQuiz(item: RawQuiz) {
  const options = item.options ?? [item.answer ?? ""];
  const correctIndex = item.correctIndex ?? Math.max(0, options.indexOf(item.answer ?? ""));
  return {
    question: local(item.question),
    options: options.map(local),
    correctIndex,
    explanation: local(item.explanation ?? item.answer ?? ""),
  };
}

function localizeFinalQuiz(item: RawQuiz, index: number) {
  const localized = localizeQuiz(item);
  if (localized.options.length < 2) return localized;
  const positions = [2, 0, 3, 1, 1, 3, 0, 2, 3, 1];
  const targetIndex = positions[index % positions.length] % localized.options.length;
  const options = [...localized.options];
  const [correct] = options.splice(localized.correctIndex, 1);
  options.splice(targetIndex, 0, correct);
  return { ...localized, options, correctIndex: targetIndex };
}

export function normalizePastedLessonDay(raw: RawDay): LessonDay {
  const formatExamples = raw.day >= 2 && raw.day <= 35 ? formatCodeLikeExamples : (value: string) => value;
  return {
    ...raw,
    title: local(raw.title),
    overview: raw.overview ? local(raw.overview) : undefined,
    difficulty: local(raw.difficulty),
    footer: raw.footer ? local(formatExamples(raw.footer)) : undefined,
    lessons: raw.lessons.map((lesson) => ({
      ...lesson,
      title: local(lesson.title),
      explanation: local(formatExamples(lesson.explanation)),
      diagram: unwrapPreformatted(lesson.diagram),
      codeExample: typeof lesson.codeExample === "string"
        ? { title: local("Code example"), code: unwrapPreformatted(lesson.codeExample) }
        : {
            title: local(lesson.codeExample.title),
            code: unwrapPreformatted(lesson.codeExample.code),
            details: lesson.codeExample.details ? local(formatExamples(lesson.codeExample.details)) : undefined,
          },
      keyTakeaways: lesson.keyTakeaways.map((item) => local(formatExamples(item))),
      commonMistakes: lesson.commonMistakes.map((item) => local(formatExamples(item))),
      quiz: lesson.quiz.map(localizeQuiz),
    })),
    finalQuiz: raw.finalQuiz.map(localizeFinalQuiz),
    project: raw.project && {
      name: local(raw.project.name), goal: local(raw.project.goal), brief: local(formatExamples(raw.project.brief)),
      steps: raw.project.steps.map((item) => local(formatExamples(item))), acceptance: raw.project.acceptance.map(local), stretch: raw.project.stretch?.map((item) => local(formatExamples(item))),
      footer: raw.project.footer ? local(formatExamples(raw.project.footer)) : undefined,
    },
  };
}
