"use client";

import type { JapaneseDetailBlock, LocalizedString } from "@/lib/japanese-learning/types";
import { resolveDialogueGloss } from "@/lib/japanese-learning/dialogue-gloss-i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { RichText } from "@/components/learn/RichText";
import { pickLocalized } from "@/lib/i18n/pick";

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

export function JapaneseDetailBlockRenderer({ blocks }: { blocks: JapaneseDetailBlock[] }) {
  const { locale, t } = useLocale();
  const ls = (s: LocalizedString) => pickLocalized(s, locale);

  return (
    <div className="mt-3 space-y-4">
      {blocks.map((block, i) => {
        const key = `${block.type}-${i}`;
        switch (block.type) {
          case "paragraph":
            return (
              <p key={key} className="text-sm leading-relaxed text-[var(--muted)]">
                <RichText text={ls(block.text)} />
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
                    <RichText text={ls(line)} />
                  </li>
                ))}
              </List>
            );
          }
          case "table":
            return (
              <DetailTable
                key={key}
                caption={block.caption !== undefined ? ls(block.caption) : undefined}
                headers={block.headers.map(ls)}
                rows={block.rows.map((row) => row.map(ls))}
              />
            );
          case "code":
            return <DetailCode key={key} title={block.title} code={block.code} />;
          case "dialogue":
            return (
              <div
                key={key}
                className="mt-3 space-y-3 rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] p-4"
              >
                {block.lines.map((line, li) => (
                  <div key={li} className="text-sm">
                    {line.speaker ? (
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                        {line.speaker}
                      </p>
                    ) : null}
                    <p className="mt-1 text-base leading-relaxed text-[var(--text)]">{line.ja}</p>
                    {line.reading ? (
                      <p className="mt-1 font-mono text-xs text-[var(--muted)]">{line.reading}</p>
                    ) : null}
                    <p className="mt-1 text-sm text-[var(--muted)]">{resolveDialogueGloss(line.en, locale)}</p>
                  </div>
                ))}
              </div>
            );
          case "mcq": {
            const mcq = block;
            const correctChoice = ls(mcq.choices[mcq.correctIndex]);
            return (
              <div
                key={key}
                className="mt-3 rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_42%,transparent)] p-4"
              >
                <p className="text-sm font-medium text-[var(--text)]">
                  <RichText text={ls(mcq.question)} />
                </p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[var(--muted)]">
                  {mcq.choices.map((c, ci) => (
                    <li key={ci} className="pl-1">
                      <RichText text={ls(c)} />
                    </li>
                  ))}
                </ol>
                <p className="mt-3 text-sm font-medium text-[var(--accent)]">
                  {t("jpDetail.mcqCorrectLabel")} ({mcq.correctIndex + 1}) {correctChoice}
                </p>
                {mcq.explanation ? (
                  <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                    <RichText text={ls(mcq.explanation)} />
                  </p>
                ) : null}
              </div>
            );
          }
          case "listening":
            return (
              <div key={key} className="mt-3 rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] p-4">
                {block.title ? (
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                    {ls(block.title)}
                  </p>
                ) : null}
                <p className="mt-2 text-sm text-[var(--muted)]">{ls(block.scenario)}</p>
                <p className="mt-3 text-sm font-medium text-[var(--text)]">{t("weeklyPanel.task")}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{ls(block.instruction)}</p>
                {block.youtubeVideos && block.youtubeVideos.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                      {t("jpDetail.listeningYoutubeHeading")}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {block.youtubeVideos.map((v, vi) => (
                        <li key={vi}>
                          <a
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-[var(--accent)] underline-offset-2 hover:brightness-110 hover:underline"
                          >
                            {v.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  {t("jpDetail.listeningKeyPhrases")}
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                  {block.keyPhrases.map((p, pi) => (
                    <li key={pi} className="pl-1 font-mono text-xs text-[var(--text)]">
                      {ls(p)}
                    </li>
                  ))}
                </ul>
                {block.studyTip ? (
                  <p className="mt-3 border-t border-[var(--border)] pt-3 text-xs text-[var(--muted)]">
                    {t("jpDetail.listeningTipPrefix")} {ls(block.studyTip)}
                  </p>
                ) : null}
              </div>
            );
          case "kanjiStrokeStudy":
            return (
              <div key={key} className="mt-3 space-y-4">
                {block.caption ? (
                  <p className="text-[11px] text-[var(--muted)]">
                    <RichText text={ls(block.caption)} />
                  </p>
                ) : null}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {block.items.map((k, ki) => (
                    <div
                      key={ki}
                      className="flex gap-3 rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_65%,transparent)] p-3"
                    >
                      <div className="flex min-h-[120px] w-[120px] shrink-0 flex-col items-center justify-center rounded-md border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_82%,transparent)]">
                        {k.strokeSvgUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element -- remote KanjiVG SVG
                          <img
                            src={k.strokeSvgUrl}
                            alt={`Stroke order for ${k.kanji}`}
                            className="max-h-[104px] max-w-[104px] object-contain"
                          />
                        ) : (
                          <span className="text-4xl text-[var(--text)]">{k.kanji}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-2xl font-semibold text-[var(--text)]">{k.kanji}</p>
                        <p className="mt-1 font-mono text-xs text-[var(--muted)]">{k.readings}</p>
                        <p className="mt-1 text-xs text-[var(--muted)]">{ls(k.meaning)}</p>
                        <p className="mt-2 text-[11px] text-[var(--muted)]">
                          {t("jpDetail.kanjiStrokesLabel")}: {k.strokes}
                        </p>
                        {k.strokeSvgUrl ? (
                          <a
                            href={k.strokeSvgUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-[11px] font-medium text-[var(--accent)] hover:brightness-110 hover:underline"
                          >
                            {t("jpDetail.kanjiOpenSvg")}
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
