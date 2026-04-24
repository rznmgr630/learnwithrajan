/**
 * Turn FAQ answer text into paragraph chunks for layout.
 * - Prefer explicit breaks: blank line (`\n\n` or more) between paragraphs.
 * - If there are no blank lines but there are single newlines, each line is its own paragraph.
 * - Otherwise the whole string is one paragraph.
 */
export function splitFaqAnswerIntoParagraphs(text: string): string[] {
  const t = text.trim();
  if (!t) return [];
  if (/\n{2,}/.test(t)) {
    return t
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  if (t.includes("\n")) {
    return t
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [t];
}
