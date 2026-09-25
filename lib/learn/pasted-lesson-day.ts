import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

type PastedSection = { title: string; explanation: string };

const DETAIL_HEADINGS = new Set([
  "explanation",
  "visual diagram",
  "code example",
  "key takeaways",
  "common mistakes",
  "mini quiz",
  "requirements",
]);

function isLessonHeading(heading: string, level: number): boolean {
  const normalized = heading.trim().toLowerCase();
  if (DETAIL_HEADINGS.has(normalized) || /^mistake\s+\d+/.test(normalized)) return false;
  if (/^day\s+\d+\b/.test(normalized)) return false;

  return /^(?:section\s+)?\d+[.)\s—-]/.test(heading.trim()) || level <= 2;
}

function splitSections(content: string): PastedSection[] {
  const matches = [...content.matchAll(/^(#{1,4})\s+(.+)$/gm)];
  if (!matches.length) return [{ title: "Lesson", explanation: content.trim() }];

  const lessonMatches = matches.filter((match) => isLessonHeading(match[2], match[1].length));
  if (!lessonMatches.length) return [{ title: "Lesson", explanation: content.trim() }];

  return lessonMatches.map((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < lessonMatches.length ? (lessonMatches[index + 1].index ?? content.length) : content.length;
    return { title: match[2].trim(), explanation: content.slice(start, end).trim() };
  }).filter((section) => section.explanation.length > 0);
}

export function pastedLessonDay(day: number, title: string, content: string) {
  const sections = splitSections(content);

  return normalizePastedLessonDay({
    day,
    title,
    totalMinutes: Math.max(60, sections.length * 8),
    difficulty: "Beginner to Advanced",
    lessons: sections.map((section, index) => ({
      id: `nextjs-day-${day}-section-${index + 1}`,
      title: section.title,
      durationMinutes: 8,
      explanation: section.explanation,
      diagram: "",
      codeExample: { title: "Code example", code: "" },
      keyTakeaways: [],
      commonMistakes: [],
      quiz: [],
    })),
    finalQuiz: [],
  });
}
