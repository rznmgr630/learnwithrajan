import type { JapaneseDetailBlock } from "@/lib/japanese-learning/types";
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
      <pre className="p-3 font-mono text-[11px] leading-relaxed text-rose-100/90">{code}</pre>
    </div>
  );
}

export function JapaneseDetailBlockRenderer({ blocks }: { blocks: JapaneseDetailBlock[] }) {
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
          case "dialogue":
            return (
              <div
                key={key}
                className="mt-3 space-y-3 rounded-lg border border-rose-900/40 bg-rose-950/20 p-4"
              >
                {block.lines.map((line, li) => (
                  <div key={li} className="text-sm">
                    {line.speaker ? (
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-300/90">
                        {line.speaker}
                      </p>
                    ) : null}
                    <p className="mt-1 text-base leading-relaxed text-neutral-100">{line.ja}</p>
                    {line.reading ? (
                      <p className="mt-1 font-mono text-xs text-neutral-500">{line.reading}</p>
                    ) : null}
                    <p className="mt-1 text-sm text-neutral-400">{line.en}</p>
                  </div>
                ))}
              </div>
            );
          case "mcq":
            return (
              <div
                key={key}
                className="mt-3 rounded-lg border border-neutral-800 bg-neutral-900/40 p-4"
              >
                <p className="text-sm font-medium text-neutral-200">
                  <RichText text={block.question} />
                </p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-neutral-300">
                  {block.choices.map((c, ci) => (
                    <li key={ci} className="pl-1">
                      <RichText text={c} />
                    </li>
                  ))}
                </ol>
                <p className="mt-3 text-sm text-emerald-400/95">
                  Correct: ({block.correctIndex + 1}) {block.choices[block.correctIndex]}
                </p>
                {block.explanation ? (
                  <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                    <RichText text={block.explanation} />
                  </p>
                ) : null}
              </div>
            );
          case "listening":
            return (
              <div
                key={key}
                className="mt-3 rounded-lg border border-sky-900/40 bg-sky-950/15 p-4"
              >
                {block.title ? (
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-300">
                    {block.title}
                  </p>
                ) : null}
                <p className="mt-2 text-sm text-neutral-300">{block.scenario}</p>
                <p className="mt-3 text-sm font-medium text-neutral-200">Task</p>
                <p className="mt-1 text-sm text-neutral-400">{block.instruction}</p>
                {block.youtubeVideos && block.youtubeVideos.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-300/95">
                      YouTube (chapter-aligned)
                    </p>
                    <ul className="mt-2 space-y-2">
                      {block.youtubeVideos.map((v, vi) => (
                        <li key={vi}>
                          <a
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-sky-400 underline-offset-2 hover:text-sky-300 hover:underline"
                          >
                            {v.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Key phrases
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-neutral-300">
                  {block.keyPhrases.map((p, pi) => (
                    <li key={pi} className="pl-1 font-mono text-xs text-sky-100/90">
                      {p}
                    </li>
                  ))}
                </ul>
                {block.studyTip ? (
                  <p className="mt-3 border-t border-sky-900/30 pt-3 text-xs text-neutral-500">
                    Tip: {block.studyTip}
                  </p>
                ) : null}
              </div>
            );
          case "kanjiStrokeStudy":
            return (
              <div key={key} className="mt-3 space-y-4">
                {block.caption ? (
                  <p className="text-[11px] text-neutral-500">
                    <RichText text={block.caption} />
                  </p>
                ) : null}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {block.items.map((k, ki) => (
                    <div
                      key={ki}
                      className="flex gap-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-3"
                    >
                      <div className="flex min-h-[120px] w-[120px] shrink-0 flex-col items-center justify-center rounded-md border border-neutral-700 bg-neutral-900/80">
                        {k.strokeSvgUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element -- remote KanjiVG SVG
                          <img
                            src={k.strokeSvgUrl}
                            alt={`Stroke order for ${k.kanji}`}
                            className="max-h-[104px] max-w-[104px] object-contain"
                          />
                        ) : (
                          <span className="text-4xl text-neutral-100">{k.kanji}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-2xl font-semibold text-neutral-50">{k.kanji}</p>
                        <p className="mt-1 font-mono text-xs text-sky-200/90">{k.readings}</p>
                        <p className="mt-1 text-xs text-neutral-400">{k.meaning}</p>
                        <p className="mt-2 text-[11px] text-neutral-500">Strokes: {k.strokes}</p>
                        {k.strokeSvgUrl ? (
                          <a
                            href={k.strokeSvgUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-[11px] text-sky-400 hover:text-sky-300 hover:underline"
                          >
                            Open stroke SVG
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
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
