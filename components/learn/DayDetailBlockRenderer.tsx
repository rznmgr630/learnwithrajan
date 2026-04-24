import type { RoadmapDetailBlock } from "@/lib/challenge-data";
import { DayDetailDiagram } from "@/components/learn/DayDetailDiagrams";
import { RichText } from "@/components/learn/RichText";

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
    <div className="mt-3 overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950/50">
      <table className="w-full min-w-[18rem] border-collapse text-left text-xs text-neutral-300">
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-900/90">
            {headers.map((h, hi) => (
              <th key={hi} className="whitespace-nowrap px-3 py-2 font-semibold text-neutral-200">
                <RichText text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-neutral-800/70 last:border-0 odd:bg-neutral-900/25"
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
        <p className="border-t border-neutral-800/80 px-3 py-2 text-[11px] text-neutral-500">
          <RichText text={caption} />
        </p>
      ) : null}
    </div>
  );
}

function DetailCode({ title, code }: { title?: string; code: string }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950">
      {title ? (
        <div className="border-b border-neutral-800 px-3 py-1.5 text-[11px] font-medium text-neutral-500">
          <RichText text={title} />
        </div>
      ) : null}
      <pre className="p-3 font-mono text-[11px] leading-relaxed text-sky-100/90">{code}</pre>
    </div>
  );
}

export function DayDetailBlockRenderer({ blocks }: { blocks: RoadmapDetailBlock[] }) {
  return (
    <div className="mt-3 space-y-4">
      {blocks.map((block, i) => {
        const key = `${block.type}-${i}`;
        switch (block.type) {
          case "paragraph":
            return (
              <p key={key} className="text-sm leading-relaxed text-neutral-300">
                <RichText text={block.text} />
              </p>
            );
          case "list": {
            const ordered = block.variant === "number";
            const List = ordered ? "ol" : "ul";
            const listClass = ordered
              ? "mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-neutral-300 marker:font-mono marker:text-neutral-500"
              : "mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-300 marker:text-neutral-500";
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
            return <DetailCode key={key} title={block.title} code={block.code} />;
          case "diagram":
            return <DayDetailDiagram key={key} id={block.id} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
