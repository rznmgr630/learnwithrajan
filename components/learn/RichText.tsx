import { Fragment, type ReactNode } from "react";

type Segment =
  | { kind: "text"; value: string }
  | { kind: "code"; value: string }
  | { kind: "bold"; children: Segment[] }
  | { kind: "italic"; children: Segment[] };

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

/**
 * Split <b>bold</b> and <i>italic</i> HTML tags inside plain text runs.
 * Unclosed tags stay literal. Content inside a span is itself run through
 * backtick parsing, so `<b>\`code\` and text</b>` still renders its inline
 * code — parsing backticks globally first would cut the tags into separate
 * fragments whenever a code span sits inside them, leaving the tags literal.
 */
function parseInlineHtml(input: string): Segment[] {
  const tags = [
    { open: "<b>", close: "</b>", kind: "bold" as const },
    { open: "<i>", close: "</i>", kind: "italic" as const },
  ];

  const out: Segment[] = [];
  let i = 0;
  while (i < input.length) {
    let found: { at: number; tag: (typeof tags)[number] } | null = null;
    for (const tag of tags) {
      const at = input.indexOf(tag.open, i);
      if (at !== -1 && (found === null || at < found.at)) found = { at, tag };
    }

    if (found === null) { out.push({ kind: "text", value: input.slice(i) }); break; }
    if (found.at > i) out.push({ kind: "text", value: input.slice(i, found.at) });

    const contentStart = found.at + found.tag.open.length;
    const close = input.indexOf(found.tag.close, contentStart);
    if (close === -1) { out.push({ kind: "text", value: input.slice(found.at) }); break; }

    out.push({ kind: found.tag.kind, children: parseInlineBackticks(input.slice(contentStart, close)) });
    i = close + found.tag.close.length;
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
    out.push({ kind: "bold", children: [{ kind: "text", value: input.slice(open + 2, close) }] });
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
    } else if (seg.kind === "bold" || seg.kind === "italic") {
      merged.push(seg);
    } else {
      merged.push({ kind: "code", value: seg.value });
    }
  }
  return merged;
}

/** <b> and <i> HTML first (with backticks parsed inside), then backticks, then ** markdown bold on each remaining text segment. */
function parseInlineFormatting(input: string): Segment[] {
  const afterHtml = parseInlineHtml(input);
  const out: Segment[] = [];
  for (const seg of afterHtml) {
    if (seg.kind === "bold" || seg.kind === "italic") {
      out.push(seg);
    } else {
      const afterTicks = parseInlineBackticks(seg.value);
      for (const s of afterTicks) {
        if (s.kind === "code") out.push(s);
        else if (s.kind === "text") out.push(...parseBoldInText(s.value));
      }
    }
  }
  return out;
}

/** Inline code: neutral surfaces; accent is reserved for links and CTAs elsewhere. */
const codeClass =
  "mx-0.5 inline max-w-[min(100%,24rem)] break-words rounded-md border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 align-baseline font-mono text-[0.88em] font-normal leading-snug text-zinc-900 shadow-[inset_0_1px_0_rgba(0,0,0,0.04)] dark:border-neutral-600/80 dark:bg-neutral-900 dark:text-zinc-100 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

const boldClass = "font-semibold text-[var(--text)]";

const italicClass = "italic";

type RichTextProps = {
  text: string;
  /** Extra classes on the wrapper (e.g. prose colour). */
  className?: string;
};

/**
 * Renders plain text with inline `code`, **bold** / <b>bold</b> and <i>italic</i>.
 */
function renderSegment(part: Segment, key: number) {
  if (part.kind === "code") {
    return (
      <code key={key} className={codeClass}>
        {part.value}
      </code>
    );
  }
  if (part.kind === "bold") {
    return (
      <strong key={key} className={boldClass}>
        {part.children.map((child, i) => renderSegment(child, i))}
      </strong>
    );
  }
  if (part.kind === "italic") {
    return (
      <em key={key} className={italicClass}>
        {part.children.map((child, i) => renderSegment(child, i))}
      </em>
    );
  }
  return <Fragment key={key}>{part.value}</Fragment>;
}

export function RichText({ text, className }: RichTextProps) {
  const parts = parseInlineFormatting(text);
  return <span className={className}>{parts.map((part, i) => renderSegment(part, i))}</span>;
}

function renderInlineLine(text: string) {
  const parts = parseInlineFormatting(text);
  return parts.map((part, i) => renderSegment(part, i));
}

const headingClass: Record<number, string> = {
  1: "mt-4 text-base font-bold text-[var(--text)]",
  2: "mt-4 text-[15px] font-bold text-[var(--text)]",
  3: "mt-3 text-sm font-semibold text-[var(--text)]",
};

/**
 * Renders multi-line text with markdown-style headings, ``` fenced blocks,
 * > quotes, bullet points, ↳ sub-items, and inline formatting.
 * Matches the System Design module's rendering style.
 */
export function RichParagraph({ text, className }: RichTextProps) {
  if (!text.includes("\n")) {
    return <span className={className}>{renderInlineLine(text)}</span>;
  }
  const lines = text.split("\n");
  const nodes: ReactNode[] = [];

  for (let j = 0; j < lines.length; j++) {
    const line = lines[j];

    if (line.trimStart().startsWith("```")) {
      const body: string[] = [];
      j++;
      while (j < lines.length && !lines[j].trimStart().startsWith("```")) {
        body.push(lines[j]);
        j++;
      }
      nodes.push(
        <div key={j} className="overflow-x-auto rounded-lg border border-neutral-700 bg-neutral-950 p-3">
          <pre className="font-mono text-[11px] leading-relaxed text-zinc-100">{body.join("\n")}</pre>
        </div>,
      );
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      nodes.push(<hr key={j} className="my-3 border-t border-[var(--border)]" />);
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      nodes.push(
        <p key={j} className={headingClass[headingMatch[1].length]}>
          {renderInlineLine(headingMatch[2])}
        </p>,
      );
      continue;
    }

    if (/^>\s?/.test(line)) {
      nodes.push(
        <p
          key={j}
          className="border-l-2 border-[var(--accent)]/40 pl-3 text-sm italic leading-relaxed text-[var(--muted)]"
        >
          {renderInlineLine(line.replace(/^>\s?/, ""))}
        </p>,
      );
      continue;
    }

    if (/^\s*↳/.test(line)) {
      const content = line.replace(/^\s*↳\s*/, "");
      nodes.push(
        <div key={j} className="flex items-start gap-2 pl-5">
          <span className="mt-0.5 shrink-0 text-xs text-[var(--accent)]/50">↳</span>
          <span className="text-sm leading-relaxed text-[var(--muted)]">{renderInlineLine(content)}</span>
        </div>,
      );
      continue;
    }

    const bulletMatch = line.match(/^[•*-]\s(.+)$/);
    if (bulletMatch) {
      nodes.push(
        <div key={j} className="flex items-start gap-2.5">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]/50" />
          <span className="text-sm leading-relaxed text-[var(--text)]">{renderInlineLine(bulletMatch[1])}</span>
        </div>,
      );
      continue;
    }

    const numMatch = line.match(/^(\d+)\.\s(.+)$/);
    if (numMatch) {
      nodes.push(
        <div key={j} className="flex items-start gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 font-mono text-[10px] font-bold text-[var(--accent)]">
            {numMatch[1]}
          </span>
          <span className="text-sm leading-relaxed text-[var(--text)]">{renderInlineLine(numMatch[2])}</span>
        </div>,
      );
      continue;
    }

    if (!line.trim()) continue;

    nodes.push(
      <p key={j} className="text-sm leading-relaxed text-[var(--muted)]">
        {renderInlineLine(line)}
      </p>,
    );
  }

  return <div className={`space-y-1.5 ${className ?? ""}`}>{nodes}</div>;
}
