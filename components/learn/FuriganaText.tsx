import type { FuriganaString } from "@/lib/japanese-learning/furigana";

/** Renders {kanji|reading} notation as <ruby> with the reading shown above via <rt>. */
export function FuriganaText({ text }: { text: FuriganaString }) {
  const parts = text.split(/(\{[^|{}]+\|[^|{}]+\})/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\{([^|]+)\|([^}]+)\}$/);
        if (m) {
          return (
            <ruby key={i}>
              {m[1]}
              <rt className="text-[10px] leading-none text-[var(--muted)]">{m[2]}</rt>
            </ruby>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
