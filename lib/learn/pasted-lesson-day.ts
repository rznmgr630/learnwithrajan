import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

type PastedSection = { title: string; explanation: string };

function splitSections(content: string): PastedSection[] {
  const matches = [...content.matchAll(/^#{1,4}\s+(.+)$/gm)];
  if (!matches.length) return [{ title: "Lesson", explanation: content.trim() }];

  return matches.map((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? content.length) : content.length;
    return { title: match[1].trim(), explanation: content.slice(start, end).trim() };
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
