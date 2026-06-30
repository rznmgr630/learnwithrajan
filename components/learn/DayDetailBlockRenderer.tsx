import type { Locale } from "@/lib/i18n/types";
import type { RoadmapDetailBlockResolved } from "@/lib/challenge-data";
import { DayDetailDiagram } from "@/components/learn/DayDetailDiagrams";
import { GitDiagram, isGitRoadmapDiagram } from "@/components/learn/GitDiagrams";
import { ReactDiagram, isReactRoadmapDiagram } from "@/components/learn/ReactDiagrams";
import { DevopsDiagram, isDevopsRoadmapDiagram } from "@/components/learn/DevopsDiagrams";
import { ReactNativeDiagram, isReactNativeRoadmapDiagram } from "@/components/learn/ReactNativeDiagrams";
import { NextjsDiagram, isNextjsRoadmapDiagram } from "@/components/learn/NextjsDiagrams";
import { LaravelDiagram, isLaravelRoadmapDiagram } from "@/components/learn/LaravelDiagrams";
import { RichText, RichParagraph } from "@/components/learn/RichText";
import { stripLessonTimingFromTitle } from "@/lib/learn/strip-lesson-timing";

export type RoadmapDiagramTrack =
  | "backend"
  | "git"
  | "react"
  | "laravel"
  | "nextjs"
  | "nodejs"
  | "js"
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
              <div key={key}>
                <RichParagraph text={block.text} />
              </div>
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
            if (diagramTrack === "laravel" && isLaravelRoadmapDiagram(block.id)) {
              return <LaravelDiagram key={key} id={block.id} />;
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
          case "youtube":
            return (
              <div key={key} className="mt-3 overflow-hidden rounded-xl border border-[var(--border)]">
                {block.title && (
                  <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] px-3 py-2">
                    <svg className="h-4 w-4 shrink-0 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.75 15.5V8.5l6.25 3.5-6.25 3.5z" />
                    </svg>
                    <span className="text-xs font-medium text-[var(--text)]">{block.title}</span>
                  </div>
                )}
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${block.videoId}`}
                    title={block.title ?? "Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
