import { Fragment } from "react";

type Segment = { kind: "text"; value: string } | { kind: "code"; value: string };

/** Split on paired ` backticks — GitHub-style inline code. Unclosed ` stays literal. */
function parseInlineBackticks(input: string): Segment[] {
  const out: Segment[] = [];
  let i = 0;
  while (i < input.length) {
    const open = input.indexOf("`", i);
    if (open === -1) {
      out.push({ kind: "text", value: input.slice(i) });
      break;
    }
    if (open > i) {
      out.push({ kind: "text", value: input.slice(i, open) });
    }
    const close = input.indexOf("`", open + 1);
    if (close === -1) {
      out.push({ kind: "text", value: input.slice(open) });
      break;
    }
    out.push({ kind: "code", value: input.slice(open + 1, close) });
    i = close + 1;
  }
  return mergeTextRuns(out);
}

function mergeTextRuns(segments: Segment[]): Segment[] {
  const merged: Segment[] = [];
  for (const seg of segments) {
    if (seg.kind === "text" && seg.value === "") continue;
    const prev = merged[merged.length - 1];
    if (prev?.kind === "text" && seg.kind === "text") {
      prev.value += seg.value;
    } else if (seg.kind === "text") {
      merged.push({ kind: "text", value: seg.value });
    } else {
      merged.push({ kind: "code", value: seg.value });
    }
  }
  return merged;
}

const codeClass =
  "mx-0.5 inline max-w-[min(100%,24rem)] break-words rounded-md border border-neutral-600/80 bg-neutral-800/95 px-1.5 py-0.5 align-baseline font-mono text-[0.88em] font-normal leading-snug text-sky-100/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

type RichTextProps = {
  text: string;
  /** Extra classes on the wrapper (e.g. prose colour). */
  className?: string;
};

/**
 * Renders plain text with inline `code` segments styled like GitHub’s dark inline code.
 */
export function RichText({ text, className }: RichTextProps) {
  const parts = parseInlineBackticks(text);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.kind === "code" ? (
          <code key={i} className={codeClass}>
            {part.value}
          </code>
        ) : (
          <Fragment key={i}>{part.value}</Fragment>
        ),
      )}
    </span>
  );
}
