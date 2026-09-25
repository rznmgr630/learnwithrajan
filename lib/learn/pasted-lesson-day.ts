import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

type PastedSection = { title: string; explanation: string };
type PastedParts = Record<string, string>;

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

function namedParts(content: string): PastedParts {
  const matches = [...content.matchAll(/^#{2,6}\s+(Explanation|Visual Diagram|Code Example|Key Takeaways?|Common Mistakes|Mini Quiz)\s*$/gim)];
  const parts: PastedParts = { intro: content.slice(0, matches[0]?.index ?? content.length).trim() };

  matches.forEach((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? content.length) : content.length;
    const name = match[1].toLowerCase() === "key takeaway" ? "key takeaways" : match[1].toLowerCase();
    parts[name] = content.slice(start, end).trim();
  });

  return parts;
}

function fencedCode(value: string): { code: string; details?: string } {
  const block = value.match(/```[^\n]*\n([\s\S]*?)```/);
  if (!block) return { code: "", details: value || undefined };

  const details = `${value.slice(0, block.index).trim()}\n\n${value.slice((block.index ?? 0) + block[0].length).trim()}`.trim();
  return { code: block[1].trim(), details: details || undefined };
}

function contentItems(value: string): string[] {
  if (!value) return [];
  const bulletItems = value
    .split("\n")
    .filter((line) => /^\s*[-*•]\s+/.test(line))
    .map((line) => line.replace(/^\s*[-*•]\s+/, "").trim());
  return bulletItems.length ? bulletItems : [value];
}

export function pastedLessonDay(day: number, title: string, content: string) {
  const sections = splitSections(content);

  return normalizePastedLessonDay({
    day,
    title,
    totalMinutes: Math.max(60, sections.length * 8),
    difficulty: "Beginner to Advanced",
    lessons: sections.map((section, index) => {
      const parts = namedParts(section.explanation);
      const codeExample = fencedCode(parts["code example"] ?? "");
      return {
        id: `nextjs-day-${day}-section-${index + 1}`,
        title: section.title,
        durationMinutes: 8,
        explanation: [parts.intro, parts.explanation].filter(Boolean).join("\n\n"),
        diagram: fencedCode(parts["visual diagram"] ?? "").code,
        codeExample: { title: "Code example", ...codeExample },
        keyTakeaways: contentItems(parts["key takeaways"] ?? ""),
        commonMistakes: contentItems(parts["common mistakes"] ?? ""),
        quiz: [],
        rawMiniQuiz: parts["mini quiz"],
      };
    }),
    finalQuiz: [],
  });
}
