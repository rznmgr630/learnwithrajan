import type { Locale } from "@/lib/i18n/types";
import type { RoadmapDetailBlockResolved } from "@/lib/challenge-data";
import { DayDetailDiagram } from "@/components/learn/DayDetailDiagrams";
import { GitDiagram, isGitRoadmapDiagram } from "@/components/learn/GitDiagrams";
import { ReactDiagram, isReactRoadmapDiagram } from "@/components/learn/ReactDiagrams";
import { DevopsDiagram, isDevopsRoadmapDiagram } from "@/components/learn/DevopsDiagrams";
import { ReactNativeDiagram, isReactNativeRoadmapDiagram } from "@/components/learn/ReactNativeDiagrams";
import { NextjsDiagram, isNextjsRoadmapDiagram } from "@/components/learn/NextjsDiagrams";
import { RichText } from "@/components/learn/RichText";
import { stripLessonTimingFromTitle } from "@/lib/learn/strip-lesson-timing";

export type RoadmapDiagramTrack =
  | "backend"
  | "git"
  | "react"
  | "laravel"
  | "nextjs"
  | "nodejs"
  | "devops"
  | "react-native";

function DetailTable({
  caption,
  headers,
  rows,
}: {
  caption?: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_52%,transparent)]">
      <table className="w-full min-w-[18rem] border-collapse text-left text-xs text-[var(--muted)]">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_92%,transparent)]">
            {headers.map((h, hi) => (
              <th key={hi} className="whitespace-nowrap px-3 py-2 font-semibold text-[var(--text)]">
                <RichText text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-[var(--border)]/70 last:border-0 odd:bg-[color-mix(in_oklab,var(--elevated)_22%,transparent)]"
            >
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 align-top leading-relaxed">
                  <RichText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption ? (
        <p className="border-t border-[var(--border)]/80 px-3 py-2 text-[11px] text-[var(--muted)]">
          <RichText text={caption} />
        </p>
      ) : null}
    </div>
  );
}

function DetailCode({ title, code }: { title?: string; code: string }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-neutral-700 bg-neutral-950">
      {title ? (
        <div className="border-b border-neutral-700 px-3 py-1.5 text-[11px] font-medium text-zinc-400">
          <RichText text={title} />
        </div>
      ) : null}
      <pre className="p-3 font-mono text-[11px] leading-relaxed text-zinc-100">{code}</pre>
    </div>
  );
}

export function DayDetailBlockRenderer({
  blocks,
  locale,
  diagramTrack = "backend",
}: {
  blocks: RoadmapDetailBlockResolved[];
  locale: Locale;
  diagramTrack?: RoadmapDiagramTrack;
}) {
  return (
    <div className="mt-3 space-y-4">
      {blocks.map((block, i) => {
        const key = `${block.type}-${i}`;
        switch (block.type) {
          case "paragraph":
            return (
              <p key={key} className="text-sm leading-relaxed text-[var(--muted)]">
                <RichText text={block.text} />
              </p>
            );
          case "list": {
            const ordered = block.variant === "number";
            const List = ordered ? "ol" : "ul";
            const listClass = ordered
              ? "mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)] marker:font-mono marker:text-[var(--faint)]"
              : "mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)] marker:text-[var(--faint)]";
            return (
              <List key={key} className={listClass}>
                {block.items.map((line, li) => (
                  <li key={li} className="pl-1">
                    <RichText text={line} />
                  </li>
                ))}
              </List>
            );
          }
          case "table":
            return (
              <DetailTable
                key={key}
                caption={block.caption}
                headers={block.headers}
                rows={block.rows}
              />
            );
          case "code":
            return (
              <DetailCode
                key={key}
                title={block.title !== undefined ? stripLessonTimingFromTitle(block.title) : undefined}
                code={block.code}
              />
            );
          case "diagram":
            if (diagramTrack === "git" && isGitRoadmapDiagram(block.id)) {
              return <GitDiagram key={key} id={block.id} locale={locale} />;
            }
            if (diagramTrack === "react" && isReactRoadmapDiagram(block.id)) {
              return <ReactDiagram key={key} id={block.id} />;
            }
            if (diagramTrack === "react") {
              return null;
            }
            if (diagramTrack === "nextjs" && isNextjsRoadmapDiagram(block.id)) {
              return <NextjsDiagram key={key} id={block.id} />;
            }
            if (diagramTrack === "laravel" || diagramTrack === "nextjs" || diagramTrack === "nodejs") {
              return <DayDetailDiagram key={key} id={block.id} />;
            }
            if (diagramTrack === "devops" && isDevopsRoadmapDiagram(block.id)) {
              return <DevopsDiagram key={key} id={block.id} />;
            }
            if (diagramTrack === "react-native" && isReactNativeRoadmapDiagram(block.id)) {
              return <ReactNativeDiagram key={key} id={block.id} locale={locale} />;
            }
            return <DayDetailDiagram key={key} id={block.id} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
