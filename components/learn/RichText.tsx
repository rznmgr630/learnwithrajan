import { Fragment } from "react";

type Segment =
  | { kind: "text"; value: string }
  | { kind: "code"; value: string }
  | { kind: "bold"; value: string };

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

/** Split **bold** inside plain text runs (after code extraction). Unclosed ** stays literal. */
function parseBoldInText(input: string): Segment[] {
  const out: Segment[] = [];
  let i = 0;
  while (i < input.length) {
    const open = input.indexOf("**", i);
    if (open === -1) {
      out.push({ kind: "text", value: input.slice(i) });
      break;
    }
    if (open > i) {
      out.push({ kind: "text", value: input.slice(i, open) });
    }
    const close = input.indexOf("**", open + 2);
    if (close === -1) {
      out.push({ kind: "text", value: input.slice(open) });
      break;
    }
    out.push({ kind: "bold", value: input.slice(open + 2, close) });
    i = close + 2;
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
    } else if (seg.kind === "bold") {
      merged.push(seg);
    } else {
      merged.push({ kind: "code", value: seg.value });
    }
  }
  return merged;
}

/** Backticks first (code cannot contain bold markers), then ** on each text segment. */
function parseInlineFormatting(input: string): Segment[] {
  const afterTicks = parseInlineBackticks(input);
  const out: Segment[] = [];
  for (const seg of afterTicks) {
    if (seg.kind === "code") {
      out.push(seg);
    } else {
      out.push(...parseBoldInText(seg.value));
    }
  }
  return out;
}

/** Inline code: neutral surfaces; accent is reserved for links and CTAs elsewhere. */
const codeClass =
  "mx-0.5 inline max-w-[min(100%,24rem)] break-words rounded-md border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 align-baseline font-mono text-[0.88em] font-normal leading-snug text-zinc-900 shadow-[inset_0_1px_0_rgba(0,0,0,0.04)] dark:border-neutral-600/80 dark:bg-neutral-900 dark:text-zinc-100 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

const boldClass = "font-semibold text-[var(--text)]";

type RichTextProps = {
  text: string;
  /** Extra classes on the wrapper (e.g. prose colour). */
  className?: string;
};

/**
 * Renders plain text with inline `code` and **bold** (paired asterisks).
 */
export function RichText({ text, className }: RichTextProps) {
  const parts = parseInlineFormatting(text);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.kind === "code" ? (
          <code key={i} className={codeClass}>
            {part.value}
          </code>
        ) : part.kind === "bold" ? (
          <strong key={i} className={boldClass}>
            {part.value}
          </strong>
        ) : (
          <Fragment key={i}>{part.value}</Fragment>
        ),
      )}
    </span>
  );
}
