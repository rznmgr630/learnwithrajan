/**
 * Removes trailing parenthetical pacing hints from lesson titles, e.g.
 * `(~41m)`, `(~0m 24s)`, `（約58分）`, `(~१ घण्टा)`.
 * Does not remove non-timing parens such as `(Days 1–7)` when they lack pacing markers.
 */
export function stripLessonTimingFromTitle(text: string): string {
  let s = text;
  const parenAtEnd = /\s*([（(])([^）)]{0,160})([）)])\s*$/;

  for (let i = 0; i < 8; i++) {
    const m = s.match(parenAtEnd);
    if (!m || m.index === undefined) break;
    const inner = m[2];

    const asciiTilde = inner.includes("~");
    const approx = inner.includes("約");
    const durationWord =
      /\b(m|min|mins|minute|minutes|h|hr|hour|hours|s|sec|seconds)\b/i.test(inner) ||
      /[分秒時間]/.test(inner) ||
      /घण्टा|मिनेट|सेकेन्ड/.test(inner);
    const digit = /[0-9०-९]/.test(inner);
    const looksLikeTiming =
      asciiTilde ||
      approx ||
      (durationWord && digit && inner.length <= 48);

    if (!looksLikeTiming) break;

    s = s.slice(0, m.index).trimEnd();
  }

  return s;
}
