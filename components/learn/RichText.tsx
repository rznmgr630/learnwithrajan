import { Fragment, type ReactNode } from "react";

type Segment =
  | { kind: "text"; value: string }
  | { kind: "code"; value: string }
  | { kind: "bold"; children: Segment[] }
  | { kind: "italic"; children: Segment[] }
  | { kind: "emphasis"; children: Segment[] };

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
 * Unclosed tags stay literal. Content inside a span is parsed again from the
 * top, so tags nest and inline code survives — parsing backticks globally
 * first would cut the tags into separate fragments whenever a code span sits
 * inside them, leaving the tags literal.
 */
function parseInlineHtml(input: string): Segment[] {
  const tags = [
    { open: "<b>", close: "</b>", kind: "bold" as const },
    { open: "<i>", close: "</i>", kind: "italic" as const },
    { open: "<code>", close: "</code>", kind: "code" as const },
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

    const content = input.slice(contentStart, close);
    if (found.tag.kind === "code") {
      out.push({ kind: "code", value: content.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&") });
    } else {
      out.push({ kind: found.tag.kind, children: parseInlineFormatting(content) });
    }
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

function parseQuotedText(input: string): Segment[] {
  const out: Segment[] = [];
  const pattern = /(["'])([^"'\n]+)\1/g;
  let cursor = 0;
  for (const match of input.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) out.push({ kind: "text", value: input.slice(cursor, index) });
    out.push({ kind: "text", value: match[1] });
    out.push({ kind: "emphasis", children: [{ kind: "text", value: match[2] }] });
    out.push({ kind: "text", value: match[1] });
    cursor = index + match[0].length;
  }
  if (cursor < input.length) out.push({ kind: "text", value: input.slice(cursor) });
  return out.length ? out : [{ kind: "text", value: input }];
}

function parseCodeLikeText(input: string): Segment[] {
  const pattern = /https?:\/\/[A-Za-z0-9.-]+(?:\/[A-Za-z0-9@()[\].~_?&=+%-]*)?|\/[A-Za-z0-9@()[\]._-]+(?:\/[A-Za-z0-9@()[\]._-]+)*(?:\?[A-Za-z0-9&=._%-]+)?|\B@[A-Za-z][\w-]*\b|\b(?:app|src|pages|components|lib|public|messages)(?:\/[A-Za-z0-9@()[\]._-]+)+|\b[A-Za-z0-9@()[\]_-]+\.(?:tsx|ts|jsx|js|json|css|mdx?)\b|\b[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\s*(?:===|!==|==|!=|>=|<=|>|<)\s*(?:\"[^\"\n]*\"|'[^'\n]*'|`[^`\n]*`|true|false|null|undefined|\d+)|\b[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\(\)/g;
  const out: Segment[] = [];
  let cursor = 0;
  for (const match of input.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) out.push({ kind: "text", value: input.slice(cursor, index) });
    out.push({ kind: "code", value: match[0] });
    cursor = index + match[0].length;
  }
  if (cursor < input.length) out.push({ kind: "text", value: input.slice(cursor) });
  return out.length ? out : [{ kind: "text", value: input }];
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
    } else if (seg.kind === "bold" || seg.kind === "italic" || seg.kind === "emphasis") {
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
    if (seg.kind === "bold" || seg.kind === "italic" || seg.kind === "emphasis") {
      out.push(seg);
    } else {
      const afterTicks = parseInlineBackticks(seg.value);
      for (const s of afterTicks) {
        if (s.kind === "code") out.push(s);
        else if (s.kind === "text") {
          for (const token of parseCodeLikeText(s.value)) {
            if (token.kind === "code") out.push(token);
            else if (token.kind === "text") {
              for (const bold of parseBoldInText(token.value)) {
                if (bold.kind === "bold") {
                  out.push({ kind: "bold", children: parseQuotedText(bold.children.map((child) => child.kind === "text" ? child.value : "").join("")) });
                } else if (bold.kind === "text") {
                  out.push(...parseQuotedText(bold.value));
                }
              }
            }
          }
        }
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

function decodeCodeEntities(value: string): string {
  return value.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-700 bg-neutral-950 p-3">
      <pre className="font-mono text-[11px] leading-relaxed text-zinc-100">{code}</pre>
    </div>
  );
}

function tableCells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableDivider(line: string): boolean {
  const cells = tableCells(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function isFolderTreeLine(line: string): boolean {
  return /[├└│]/.test(line) || /^\s*(?:app|src|pages|components|lib|public|messages)\//.test(line);
}

function startsProseAfterCode(line: string): boolean {
  return /^(?:The|This|That|In|For|A|An|You|It|Remember|Use|Avoid|When|With)\s/.test(line.trim());
}

function startsCodeExample(line: string): boolean {
  return /^(?:\/\/|import\s|export\s|const\s|let\s|type\s|interface\s|async\s|function\s|["']use\s|<|[A-Za-z_$][\w$]*\s*[=(])/.test(line.trim());
}

function isObjectSnippetStart(line: string): boolean {
  return /^\s*(?:[A-Za-z_$][\w$-]*|["'][^"']+["'])\s*:\s*[{[]\s*$/.test(line);
}

function bracketDelta(line: string): number {
  return (line.match(/[\[{]/g)?.length ?? 0) - (line.match(/[\]}]/g)?.length ?? 0);
}

function isRouteLine(line: string): boolean {
  return /^\s*\/[^\s]+\s*$/.test(line);
}

function isRoutingQuestionLine(line: string): boolean {
  return /^The (?:normal route|parallel slot|intercepting route) answers:/i.test(line.trim());
}

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
  if (part.kind === "emphasis") {
    return (
      <strong key={key} className={`${boldClass} ${italicClass}`}>
        {part.children.map((child, i) => renderSegment(child, i))}
      </strong>
    );
  }
  return <Fragment key={key}>{part.value}</Fragment>;
}

export function RichText({ text, className }: RichTextProps) {
  const standaloneHeading = text.trim().match(/^#{1,6}\s+(.+)$/);
  const parts = parseInlineFormatting(standaloneHeading?.[1] ?? text);
  if (standaloneHeading) {
    return <strong className={`${boldClass} ${className ?? ""}`}>{parts.map((part, i) => renderSegment(part, i))}</strong>;
  }
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
  4: "mt-3 text-sm font-semibold text-[var(--text)]",
  5: "mt-2 text-sm font-medium text-[var(--text)]",
  6: "mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]",
};

/**
 * Renders multi-line text with markdown-style headings, ``` fenced blocks,
 * > quotes, bullet points, ↳ sub-items, and inline formatting.
 * Matches the System Design module's rendering style.
 */
export function RichParagraph({ text, className }: RichTextProps) {
  if (!text.includes("\n")) {
    const standaloneCode = text.match(/^\s*<code>([\s\S]*)<\/code>\s*$/);
    if (standaloneCode) return <CodeBlock code={decodeCodeEntities(standaloneCode[1])} />;
    const standaloneHeading = text.trim().match(/^(#{1,6})\s+(.+)$/);
    if (standaloneHeading) {
      return (
        <p className={headingClass[standaloneHeading[1].length]}>
          {renderInlineLine(standaloneHeading[2])}
        </p>
      );
    }
    return <span className={className}>{renderInlineLine(text)}</span>;
  }
  const lines = text.split("\n");
  const nodes: ReactNode[] = [];

  for (let j = 0; j < lines.length; j++) {
    const line = lines[j];

    const firstContent = lines.slice(j + 1).find((candidate) => candidate.trim());
    if (/^(?:code )?example:\s*$/i.test(line.trim()) && firstContent && startsCodeExample(firstContent)) {
      const code: string[] = [];
      j++;
      while (j < lines.length) {
        if (!lines[j].trim() && startsProseAfterCode(lines[j + 1] ?? "")) break;
        code.push(lines[j]);
        j++;
      }
      while (!code.at(-1)?.trim()) code.pop();
      j--;
      if (code.length) {
        nodes.push(<CodeBlock key={`example-${j}`} code={code.join("\n")} />);
        continue;
      }
    }

    if (isObjectSnippetStart(line)) {
      const code: string[] = [line];
      let depth = bracketDelta(line);
      while (depth > 0 && j + 1 < lines.length) {
        j++;
        code.push(lines[j]);
        depth += bracketDelta(lines[j]);
      }
      nodes.push(<CodeBlock key={`object-${j}`} code={code.join("\n")} />);
      continue;
    }

    if (isRouteLine(line)) {
      const routes: string[] = [line.trim()];
      let next = j + 1;
      while (next < lines.length) {
        if (!lines[next].trim()) {
          next++;
          continue;
        }
        if (!isRouteLine(lines[next])) break;
        routes.push(lines[next].trim());
        next++;
      }
      j = next - 1;
      if (routes.length > 1) {
        nodes.push(<CodeBlock key={`routes-${j}`} code={routes.join("\n")} />);
      } else {
        nodes.push(
          <p key={`route-${j}`} className="text-sm leading-relaxed text-[var(--muted)]">
            <code className={codeClass}>{routes[0]}</code>
          </p>,
        );
      }
      continue;
    }

    if (isRoutingQuestionLine(line)) {
      const questions: string[] = [line.trim()];
      let next = j + 1;
      while (next < lines.length) {
        if (!lines[next].trim()) {
          next++;
          continue;
        }
        if (!isRoutingQuestionLine(lines[next])) break;
        questions.push(lines[next].trim());
        next++;
      }
      j = next - 1;
      nodes.push(<CodeBlock key={`routing-questions-${j}`} code={questions.join("\n")} />);
      continue;
    }

    if (isFolderTreeLine(line) && (/[├└│]/.test(line) || isFolderTreeLine(lines[j + 1] ?? ""))) {
      const tree: string[] = [];
      while (j < lines.length && isFolderTreeLine(lines[j])) {
        tree.push(lines[j]);
        j++;
      }
      j--;
      nodes.push(<CodeBlock key={`tree-${j}`} code={tree.join("\n")} />);
      continue;
    }

    if (line.trim().startsWith("|") && j + 1 < lines.length && isTableDivider(lines[j + 1])) {
      const headers = tableCells(line);
      const rows: string[][] = [];
      j += 2;
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        rows.push(tableCells(lines[j]));
        j++;
      }
      j--;
      nodes.push(
        <div key={`table-${j}`} className="my-3 overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full min-w-md border-collapse text-left text-sm">
            <thead className="bg-[var(--elevated)]">
              <tr>
                {headers.map((header, index) => (
                  <th key={index} scope="col" className="border-b border-[var(--border)] px-4 py-2.5 font-semibold text-[var(--text)]">
                    {renderInlineLine(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="bg-[var(--surface)] align-top">
                  {headers.map((_, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-2.5 text-[var(--muted)]">
                      {renderInlineLine(row[cellIndex] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const standaloneCode = line.match(/^\s*<code>([\s\S]*)<\/code>\s*$/);
    if (standaloneCode) {
      nodes.push(<CodeBlock key={j} code={decodeCodeEntities(standaloneCode[1])} />);
      continue;
    }

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

    const headingMatch = line.trimStart().match(/^(#{1,6})\s+(.+)$/);
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
