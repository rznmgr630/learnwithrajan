"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { JapaneseDetailBlock, LocalizedString, VocabRow, MCQItem } from "@/lib/japanese-learning/types";
import { resolveDialogueGloss } from "@/lib/japanese-learning/dialogue-gloss-i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { RichText } from "@/components/learn/RichText";
import { pickLocalized } from "@/lib/i18n/pick";
import { VocabRevealTable } from "@/components/learn/VocabRevealTable";
import { McqExerciseBlock } from "@/components/learn/McqExerciseBlock";

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
      <table className="w-full min-w-[min(100%,42rem)] border-collapse text-left text-xs text-[var(--muted)]">
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

type QnaBlock = Extract<JapaneseDetailBlock, { type: "listeningQna" }>;

function ListeningQnaBlock({ block }: { block: QnaBlock }) {
  const { locale, t } = useLocale();
  const ls = (s: LocalizedString) => pickLocalized(s, locale);

  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(0.9);
  const [answers, setAnswers] = useState<(number | null)[]>(() => block.questions.map(() => null));
  const [showTranscript, setShowTranscript] = useState(false);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(block.script);
    utt.lang = "ja-JP";
    utt.rate = rate;
    utt.onend = () => setPlaying(false);
    utt.onerror = () => setPlaying(false);
    uttRef.current = utt;
    setPlaying(true);
    window.speechSynthesis.speak(utt);
  }

  function stop() {
    window.speechSynthesis?.cancel();
    setPlaying(false);
  }

  const allAnswered = answers.every((a) => a !== null);
  const score = answers.filter((a, i) => a === block.questions[i].correctIndex).length;

  return (
    <div className="mt-3 rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] p-4 space-y-4">
      {/* Situation */}
      <p className="text-sm text-[var(--muted)]">{ls(block.situation)}</p>

      {/* TTS player */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={playing ? stop : speak}
          className="flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110 active:brightness-95 transition-all"
        >
          {playing ? (
            <>
              <span className="inline-block h-3 w-3 rounded-sm bg-white/90" />
              Stop
            </>
          ) : (
            <>
              <span className="inline-block border-l-[10px] border-y-[6px] border-y-transparent border-l-white/90" />
              Play
            </>
          )}
        </button>

        {/* Speed selector */}
        <div className="flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-1 py-0.5">
          {([0.7, 0.9, 1.0] as const).map((r) => (
            <button
              key={r}
              onClick={() => { setRate(r); if (playing) { stop(); } }}
              className={`rounded px-2 py-0.5 text-[11px] font-mono transition-colors ${
                rate === r
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              {r}×
            </button>
          ))}
        </div>

        {playing && (
          <span className="text-[11px] text-[var(--muted)] animate-pulse">
            ▶ listening…
          </span>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {block.questions.map((q, qi) => {
          const selected = answers[qi];
          const isCorrect = selected === q.correctIndex;
          return (
            <div key={qi} className="rounded-md border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_65%,transparent)] p-3">
              <p className="text-sm font-medium text-[var(--text)]">
                <span className="mr-1.5 font-mono text-[11px] text-[var(--muted)]">Q{qi + 1}.</span>
                <RichText text={ls(q.question)} />
              </p>
              <ol className="mt-2 space-y-1.5">
                {q.choices.map((c, ci) => {
                  let chipStyle = "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)]";
                  if (selected !== null) {
                    if (ci === q.correctIndex) chipStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold";
                    else if (ci === selected) chipStyle = "border-red-500 bg-red-500/10 text-red-400 line-through";
                    else chipStyle = "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] opacity-50";
                  }
                  return (
                    <li key={ci}>
                      <button
                        disabled={selected !== null}
                        onClick={() => setAnswers((prev) => prev.map((v, i) => i === qi ? ci : v))}
                        className={`w-full rounded border px-3 py-1.5 text-left text-sm transition-colors disabled:cursor-default ${chipStyle}`}
                      >
                        <span className="mr-2 font-mono text-[11px] opacity-60">{ci + 1}.</span>
                        {ls(c)}
                      </button>
                    </li>
                  );
                })}
              </ol>
              {selected !== null && (
                <div className={`mt-2 flex items-start gap-1.5 rounded px-2 py-1.5 text-xs ${isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                  <span>{isCorrect ? "✓ Correct!" : "✗ Incorrect"}</span>
                  {q.explanation && (
                    <span className="ml-1 text-[var(--muted)]">— <RichText text={ls(q.explanation)} /></span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Score + transcript reveal */}
      {allAnswered && (
        <div className="rounded-md border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] px-3 py-2 text-sm">
          <span className="font-semibold text-[var(--text)]">Score: {score}/{block.questions.length}</span>
          {block.transcript && (
            <button
              onClick={() => setShowTranscript((v) => !v)}
              className="ml-4 text-xs text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {showTranscript ? "Hide transcript" : "Show transcript"}
            </button>
          )}
        </div>
      )}

      {showTranscript && block.transcript && (
        <pre className="whitespace-pre-wrap rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 font-mono text-xs leading-relaxed text-[var(--muted)]">
          {block.transcript}
        </pre>
      )}

      {/* YouTube supplementary */}
      {block.youtubeVideos && block.youtubeVideos.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            {t("jpDetail.listeningYoutubeHeading")}
          </p>
          <ul className="mt-2 space-y-1.5">
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
      )}
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
            return <DialogueBlock key={key} lines={block.lines} />;

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
          case "listeningQna":
            return <ListeningQnaBlock key={key} block={block} />;
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
          case "vocabTable":
            return <VocabularyTableBlock key={key} rows={block.rows} />;
          case "youtubeEmbed":
            return <YouTubeEmbedBlock key={key} block={block} />;
          case "exerciseBlock":
            return <ExerciseBlock key={key} mcqs={block.mcqs} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

type YoutubeEmbedBlockType = Extract<JapaneseDetailBlock, { type: "youtubeEmbed" }>;

function YouTubeEmbedBlock({ block }: { block: YoutubeEmbedBlockType }) {
  const { locale } = useLocale();
  const [part, setPart] = useState<1 | 2>(1);

  const part1Id = (locale === "np" ? block.videoIdNp : undefined) ?? block.videoIdEn;
  const part2Id = block.videoIdEnPart2 ?? null;
  const hasPart2 = part2Id !== null;
  const activeId = hasPart2 && part === 2 ? part2Id! : part1Id;

  const part1Label = locale === "np" ? "भाग १" : "Part 1";
  const part2Label = locale === "np" ? "भाग २" : "Part 2";

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)]">
      {hasPart2 && (
        <div className="flex gap-1 border-b border-[var(--border)] p-2">
          {([1, 2] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPart(p)}
              className={[
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                part === p
                  ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                  : "text-[var(--muted)] hover:bg-[var(--elevated)] hover:text-[var(--text)]",
              ].join(" ")}
            >
              {p === 1 ? part1Label : part2Label}
            </button>
          ))}
        </div>
      )}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          key={activeId}
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${activeId}`}
          title={`${block.title}${hasPart2 ? ` — ${part === 1 ? part1Label : part2Label}` : ""}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="border-t border-[var(--border)] px-3 py-2">
        <p className="text-[11px] text-[var(--muted)]">
          {block.title}{hasPart2 ? ` — ${part === 1 ? part1Label : part2Label}` : ""}
        </p>
      </div>
    </div>
  );
}

type DialogueLine = Extract<JapaneseDetailBlock, { type: "dialogue" }>["lines"][number];

function DialogueBlock({ lines }: { lines: DialogueLine[] }) {
  const { locale } = useLocale();

  const speakerOrder: string[] = [];
  for (const line of lines) {
    const s = line.speaker ?? "";
    if (!speakerOrder.includes(s)) speakerOrder.push(s);
    if (speakerOrder.length === 2) break;
  }

  return (
    <div className="space-y-3">
      <style>{`
        @keyframes chatBubbleIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <p className="text-[11px] text-[var(--faint)]">
        Hiragana shown above kanji. Particles (は・が・を…) are left visible.
      </p>
      {lines.map((line, li) => {
        const isRight = speakerOrder.indexOf(line.speaker ?? "") === 1;
        const initial = (line.speaker ?? "?").charAt(0);
        return (
          <div
            key={li}
            className={`flex gap-2.5 ${isRight ? "flex-row-reverse" : ""}`}
            style={{ opacity: 0, animation: "chatBubbleIn 0.35s ease forwards", animationDelay: `${li * 0.3}s` }}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] text-[10px] font-bold text-[var(--accent)]">
              {initial}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_78%,transparent)] px-3.5 py-2.5 ${
                isRight ? "rounded-tr-sm" : "rounded-tl-sm"
              }`}
            >
              {line.speaker ? (
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">{line.speaker}</p>
              ) : null}
              <p className="text-[15px] leading-loose text-[var(--text)]">{line.ja}</p>
              {line.reading ? (
                <p className="mt-0.5 text-[11px] italic text-[var(--muted)]">{line.reading}</p>
              ) : null}
              <p className="mt-0.5 text-xs text-[var(--muted)]">{resolveDialogueGloss(line.en, locale)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ExerciseBlock({ mcqs }: { mcqs: MCQItem[] }) {
  const shuffledMcqs = useMemo(() => {
    return mcqs.map((mcq) => {
      const indices = mcq.choices.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return {
        ...mcq,
        choices: indices.map((i) => mcq.choices[i]),
        correctIndex: indices.indexOf(mcq.correctIndex),
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { locale } = useLocale();

  const resolvedMcqs = shuffledMcqs.map((mcq) => ({
    question: pickLocalized(mcq.question, locale),
    choices: mcq.choices.map((choice) => pickLocalized(choice, locale)),
    correctIndex: mcq.correctIndex,
    explanation: mcq.explanation ? pickLocalized(mcq.explanation, locale) : undefined,
  }));

  return <McqExerciseBlock mcqs={resolvedMcqs} locale={locale} />;
}

function VocabularyTableBlock({ rows }: { rows: VocabRow[] }) {
  const { locale } = useLocale();

  const resolvedRows = rows.map((row) => ({
    sn: row.sn,
    word: row.word,
    romaji: row.romaji,
    kanji: row.kanji,
    meaning: pickLocalized(row.meaning, locale),
    example: row.example,
  }));

  const labels = {
    showAll: locale === "np" ? "सबै देखाउनुस्" : "Show All",
    hideAll: locale === "np" ? "सबै लुकाउनुस्" : "Hide All",
    shuffle: locale === "np" ? "फेरबदल" : "Shuffle",
  };

  return <VocabRevealTable rows={resolvedRows} labels={labels} />;
}
