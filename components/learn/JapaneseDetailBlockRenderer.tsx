"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { JapaneseDetailBlock, LocalizedString, VocabRow, MCQItem } from "@/lib/japanese-learning/types";
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
            return (
              <div key={key} className="space-y-3">
                <p className="text-[11px] text-[var(--faint)]">
                  Hiragana shown above kanji. Particles (は・が・を…) are left visible.
                </p>
                {block.lines.map((line, li) => {
                  const isB = line.speaker === "B";
                  return (
                    <div key={li} className={`flex gap-2.5 ${isB ? "flex-row-reverse" : ""}`}>
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] text-[10px] font-bold text-[var(--accent)]">
                        {line.speaker ?? "?"}
                      </div>
                      <div
                        className={`max-w-[85%] rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_78%,transparent)] px-3.5 py-2.5 ${
                          isB ? "rounded-tr-sm" : "rounded-tl-sm"
                        }`}
                      >
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

  const [answers, setAnswers] = useState<(number | null)[]>(() => shuffledMcqs.map(() => null));
  const [revealed, setRevealed] = useState(false);
  const { locale } = useLocale();

  const allAnswered = answers.every((a) => a !== null);
  const score = answers.filter((a, i) => a === shuffledMcqs[i].correctIndex).length;
  const total = shuffledMcqs.length;

  function pick(qi: number, ci: number) {
    if (revealed) return;
    setAnswers((prev) => { const next = [...prev]; next[qi] = ci; return next; });
  }

  const scoreMsg =
    score === total
      ? locale === "np" ? "पूर्ण अंक!" : "Perfect score!"
      : score >= 7
        ? locale === "np" ? "उत्कृष्ट काम!" : "Great work!"
        : score >= 5
          ? locale === "np" ? "पढाई जारी राख्नुस्!" : "Keep studying!"
          : locale === "np" ? "पाठ पुनरावलोकन गर्नुस् र फेरि प्रयास गर्नुस्।" : "Review the lesson and try again.";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text)]">
          {locale === "np" ? `व्यायाम — ${total} प्रश्नहरू` : `Exercise — ${total} Questions`}
        </h3>
        {revealed && (
          <span className="rounded-full bg-[color-mix(in_oklab,var(--accent)_20%,transparent)] px-2.5 py-0.5 text-xs font-bold text-[var(--accent)]">
            {score} / {total}
          </span>
        )}
      </div>

      {shuffledMcqs.map((mcq, qi) => {
        const picked = answers[qi];
        return (
          <div key={qi} className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] p-3.5">
            <p className="text-sm font-medium text-[var(--text)]">
              <span className="mr-1.5 text-[var(--muted)]">Q{qi + 1}.</span>
              {pickLocalized(mcq.question, locale)}
            </p>
            <div className="mt-2.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {mcq.choices.map((choice, ci) => {
                let cls = "w-full rounded-lg border px-3 py-2 text-left text-xs transition ";
                if (revealed) {
                  if (ci === mcq.correctIndex)
                    cls += "border-green-500 bg-[color-mix(in_oklab,#22c55e_12%,transparent)] text-green-400";
                  else if (ci === picked)
                    cls += "border-red-500 bg-[color-mix(in_oklab,#ef4444_12%,transparent)] text-red-400";
                  else cls += "border-[var(--border)] text-[var(--muted)] opacity-40";
                } else if (picked === ci) {
                  cls += "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--text)]";
                } else {
                  cls += "border-[var(--border)] text-[var(--muted)] hover:border-[color-mix(in_oklab,var(--accent)_50%,var(--border))] hover:text-[var(--text)]";
                }
                return (
                  <button key={ci} type="button" disabled={revealed} className={cls} onClick={() => pick(qi, ci)}>
                    {String.fromCharCode(65 + ci)}. {pickLocalized(choice, locale)}
                  </button>
                );
              })}
            </div>
            {revealed && picked !== mcq.correctIndex && mcq.explanation && (
              <p className="mt-2.5 text-xs leading-relaxed text-[var(--muted)]">
                <span className="font-semibold text-[var(--accent)]">
                  {locale === "np" ? "व्याख्या: " : "Explanation: "}
                </span>
                {pickLocalized(mcq.explanation, locale)}
              </p>
            )}
          </div>
        );
      })}

      {allAnswered && !revealed && (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="w-full rounded-xl bg-[var(--accent)] py-2.5 text-sm font-semibold text-[var(--accent-fg)] transition hover:brightness-110"
        >
          {locale === "np" ? "उत्तर जाँच गर्नुस्" : "Check Answers"}
        </button>
      )}

      {revealed && (
        <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] p-4 text-center">
          <p className="font-bold text-[var(--text)]">{scoreMsg}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {locale === "np" ? `अंक: ${score} / ${total}` : `Score: ${score} out of ${total}`}
          </p>
          <button
            type="button"
            onClick={() => { setAnswers(shuffledMcqs.map(() => null)); setRevealed(false); }}
            className="mt-3 rounded-lg border border-[var(--border)] px-4 py-1.5 text-xs text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            {locale === "np" ? "फेरि प्रयास गर्नुस्" : "Try again"}
          </button>
        </div>
      )}
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" clipRule="evenodd" />
      <path d="M10.748 13.93l2.523 2.523a10.003 10.003 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
    </svg>
  );
}

function VocabularyTableBlock({ rows }: { rows: VocabRow[] }) {
  const { locale } = useLocale();
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [order, setOrder] = useState<VocabRow[]>(rows);

  const allShown = revealed.size === order.length;

  function toggleAll() {
    if (allShown) setRevealed(new Set());
    else setRevealed(new Set(order.map((r) => r.sn)));
  }

  function toggleOne(sn: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(sn)) next.delete(sn);
      else next.add(sn);
      return next;
    });
  }

  function shuffle() {
    setOrder((prev) => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
    setRevealed(new Set());
  }

  const showAllLabel = locale === "np" ? "सबै देखाउनुस्" : "Show All";
  const hideAllLabel = locale === "np" ? "सबै लुकाउनुस्" : "Hide All";
  const shuffleLabel = locale === "np" ? "फेरबदल" : "Shuffle";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={shuffle}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
        >
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
          </svg>
          {shuffleLabel}
        </button>
        <button
          type="button"
          onClick={toggleAll}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
        >
          <EyeIcon open={!allShown} />
          {allShown ? hideAllLabel : showAllLabel}
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_92%,transparent)]">
              {["#", "Word", "Romaji", "Kanji", "Meaning", "Example"].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-3 py-2 text-left text-[11px] font-semibold text-[var(--text)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.map((row) => {
              const shown = revealed.has(row.sn);
              return (
                <tr
                  key={row.sn}
                  className="border-b border-[var(--border)]/70 last:border-0 odd:bg-[color-mix(in_oklab,var(--elevated)_18%,transparent)]"
                >
                  <td className="px-3 py-2.5 text-xs text-[var(--faint)]">{row.sn}</td>
                  <td className="px-3 py-2.5 text-base text-[var(--text)]">{row.word}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-[var(--muted)]">{row.romaji}</td>
                  <td className="px-3 py-2.5 text-base text-[var(--text)]">{row.kanji ?? "—"}</td>
                  <td className="px-3 py-2.5 text-xs text-[var(--muted)]">
                    <button
                      type="button"
                      onClick={() => toggleOne(row.sn)}
                      className="flex items-center gap-1.5 transition hover:text-[var(--text)]"
                      aria-label={shown ? "Hide meaning" : "Show meaning"}
                    >
                      {shown ? (
                        <span>{pickLocalized(row.meaning, locale)}</span>
                      ) : (
                        <span className="tracking-widest text-[var(--faint)]">···</span>
                      )}
                      <EyeIcon open={shown} />
                    </button>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-[var(--text)]">{row.example}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
