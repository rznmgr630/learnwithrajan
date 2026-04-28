/** KanjiVG SVG — stroke-order diagram (follow stroke numbers in the SVG). */
export function kanjiVgStrokeSvgUrl(char: string): string | null {
  const trimmed = char.trim();
  if ([...trimmed].length !== 1) return null;
  const cp = trimmed.codePointAt(0);
  if (cp === undefined) return null;
  const hex = cp.toString(16).padStart(5, "0");
  return `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`;
}
