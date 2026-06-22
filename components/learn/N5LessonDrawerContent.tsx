"use client";

import { useState } from "react";
import { JapaneseDetailBlockRenderer } from "@/components/learn/JapaneseDetailBlockRenderer";
import type {
  ConversationLine,
  FuriganaString,
  GrammarPoint,
  LessonMcq,
  N5LessonPageData,
  VocabRow,
} from "@/lib/japanese-learning/n5/n5-lesson-pages";
import type { KanjiStrokeEntry } from "@/lib/japanese-learning/n5/n5-kanji-pool";

// ─── Furigana ────────────────────────────────────────────────────────────────

function FuriganaText({ text }: { text: FuriganaString }) {
  const parts = text.split(/(\{[^|{}]+\|[^|{}]+\})/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\{([^|]+)\|([^}]+)\}$/);
        if (m) {
          return (
            <ruby key={i}>
              {m[1]}
              <rt className="text-[10px] leading-none text-[var(--muted)]">{m[2]}</rt>
            </ruby>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ─── Accordion ───────────────────────────────────────────────────────────────

function Accordion({
  number,
  title,
  defaultOpen = false,
  children,
}: {
  number: number;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_42%,transparent)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)]"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-[var(--accent-fg)]">
          {number}
        </span>
        <span className="flex-1 text-sm font-semibold text-[var(--text)]">{title}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-[var(--muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 10.94 2.53 5.47l.94-.94L8 9.06l4.53-4.53.94.94z" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-[var(--border)] px-4 py-4">{children}</div>
      )}
    </div>
  );
}

// ─── Conversation ─────────────────────────────────────────────────────────────

function ConversationSection({ lines }: { lines: ConversationLine[] }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] text-[var(--faint)]">
        Hiragana shown above kanji. Particles (は・が・を…) are left visible.
      </p>
      {lines.map((line, i) => {
        const isB = line.speaker === "B";
        return (
          <div key={i} className={`flex gap-2.5 ${isB ? "flex-row-reverse" : ""}`}>
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] text-[10px] font-bold text-[var(--accent)]">
              {line.speaker}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_78%,transparent)] px-3.5 py-2.5 ${
                isB ? "rounded-tr-sm" : "rounded-tl-sm"
              }`}
            >
              <p className="text-[15px] leading-loose text-[var(--text)]">
                <FuriganaText text={line.japanese} />
              </p>
              <p className="mt-0.5 text-[11px] italic text-[var(--muted)]">{line.reading}</p>
              <p className="mt-0.5 text-xs text-[var(--muted)]">{line.english}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Grammar ──────────────────────────────────────────────────────────────────

function GrammarSection({
  grammar,
  youtubeUrl,
  youtubeTitle,
}: {
  grammar: GrammarPoint[];
  youtubeUrl: string;
  youtubeTitle: string;
}) {
  return (
    <div className="space-y-5">
      {/* YouTube link */}
      <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] px-3.5 py-3">
        <svg
          className="h-7 w-7 shrink-0 text-red-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.06 0 12 0 12s0 3.94.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.48 20.5 12 20.5 12 20.5s7.52 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.94 24 12 24 12s0-3.94-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
        </svg>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[var(--text)]">Grammar Video</p>
          <p className="truncate text-[11px] text-[var(--muted)]">{youtubeTitle}</p>
        </div>
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600"
        >
          Watch
        </a>
      </div>

      {grammar.map((gp) => (
        <div key={gp.number} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_22%,transparent)] text-[10px] font-bold text-[var(--accent)]">
              {gp.number}
            </span>
            <h3 className="text-sm font-semibold text-[var(--text)]">{gp.name}</h3>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]">Meaning</p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{gp.meaning}</p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]">Where we use</p>
            <ul className="mt-2 space-y-1.5">
              {gp.whereWeUse.map((line, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]">
              Examples — 3 different scenarios
            </p>
            <div className="space-y-2.5">
              {gp.examples.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_45%,transparent)] p-3.5"
                >
                  <p className="mb-1.5 text-[11px] font-medium text-[var(--faint)]">{ex.scenario}</p>
                  <p className="text-base leading-loose text-[var(--text)]">
                    <FuriganaText text={ex.japanese} />
                  </p>
                  <p className="text-[11px] italic text-[var(--muted)]">{ex.reading}</p>
                  <p className="text-xs text-[var(--muted)]">{ex.english}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Vocabulary ───────────────────────────────────────────────────────────────

function VocabularySection({ rows }: { rows: VocabRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_92%,transparent)]">
            {["#", "Word", "Kanji", "Meaning", "Example", "Hint / Literal"].map((h) => (
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
          {rows.map((row) => (
            <tr
              key={row.sn}
              className="border-b border-[var(--border)]/70 last:border-0 odd:bg-[color-mix(in_oklab,var(--elevated)_18%,transparent)]"
            >
              <td className="px-3 py-2.5 text-xs text-[var(--faint)]">{row.sn}</td>
              <td className="px-3 py-2.5 text-base text-[var(--text)]">{row.word}</td>
              <td className="px-3 py-2.5 text-base text-[var(--text)]">{row.kanji ?? "—"}</td>
              <td className="px-3 py-2.5 text-xs text-[var(--muted)]">{row.meaning}</td>
              <td className="px-3 py-2.5 text-sm leading-loose text-[var(--text)]">
                <FuriganaText text={row.example} />
              </td>
              <td className="px-3 py-2.5 text-[11px] text-[var(--faint)]">{row.literal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Kanji ────────────────────────────────────────────────────────────────────

function KanjiSection({ kanjiItems }: { kanjiItems: KanjiStrokeEntry[] }) {
  return (
    <JapaneseDetailBlockRenderer
      blocks={[
        {
          type: "kanjiStrokeStudy",
          caption: "Trace stroke order then copy each character on grid paper.",
          items: kanjiItems,
        },
      ]}
    />
  );
}

// ─── Exercise ────────────────────────────────────────────────────────────────

function ExerciseSection({ mcqs }: { mcqs: LessonMcq[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => mcqs.map(() => null));
  const [revealed, setRevealed] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const score = answers.filter((a, i) => a === mcqs[i].correctIndex).length;

  function pick(qi: number, ci: number) {
    if (revealed) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = ci;
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text)]">Exercise — 10 Questions</h3>
        {revealed && (
          <span className="rounded-full bg-[color-mix(in_oklab,var(--accent)_20%,transparent)] px-2.5 py-0.5 text-xs font-bold text-[var(--accent)]">
            {score} / 10
          </span>
        )}
      </div>

      {mcqs.map((mcq, qi) => {
        const picked = answers[qi];
        return (
          <div
            key={qi}
            className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] p-3.5"
          >
            <p className="text-sm font-medium text-[var(--text)]">
              <span className="mr-1.5 text-[var(--muted)]">Q{qi + 1}.</span>
              {mcq.question}
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
                  <button
                    key={ci}
                    type="button"
                    disabled={revealed}
                    className={cls}
                    onClick={() => pick(qi, ci)}
                  >
                    {String.fromCharCode(65 + ci)}. {choice}
                  </button>
                );
              })}
            </div>
            {revealed && picked !== mcq.correctIndex && (
              <p className="mt-2.5 text-xs leading-relaxed text-[var(--muted)]">
                <span className="font-semibold text-[var(--accent)]">Explanation: </span>
                {mcq.explanation}
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
          Check Answers
        </button>
      )}

      {revealed && (
        <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] p-4 text-center">
          <p className="font-bold text-[var(--text)]">
            {score === 10
              ? "Perfect score!"
              : score >= 7
                ? "Great work!"
                : score >= 5
                  ? "Keep studying!"
                  : "Review the lesson and try again."}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">Score: {score} out of 10</p>
          <button
            type="button"
            onClick={() => {
              setAnswers(mcqs.map(() => null));
              setRevealed(false);
            }}
            className="mt-3 rounded-lg border border-[var(--border)] px-4 py-1.5 text-xs text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function N5LessonDrawerContent({
  lesson,
  kanjiItems,
}: {
  lesson: N5LessonPageData;
  kanjiItems: KanjiStrokeEntry[];
}) {
  return (
    <div className="space-y-3">
      {/* Intro */}
      <div className="space-y-1.5 rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)] px-4 py-3.5">
        {lesson.intro.map((sentence, i) => (
          <p key={i} className="text-sm leading-relaxed text-[var(--muted)]">
            {sentence}
          </p>
        ))}
      </div>

      {/* 4 Accordions */}
      <Accordion number={1} title="Conversation" defaultOpen>
        <ConversationSection lines={lesson.conversation} />
      </Accordion>

      <Accordion number={2} title="Grammar">
        <GrammarSection
          grammar={lesson.grammar}
          youtubeUrl={lesson.youtubeUrl}
          youtubeTitle={lesson.youtubeTitle}
        />
      </Accordion>

      <Accordion number={3} title="Vocabulary">
        <VocabularySection rows={lesson.vocabulary} />
      </Accordion>

      <Accordion number={4} title="Kanji — 20 characters">
        <KanjiSection kanjiItems={kanjiItems} />
      </Accordion>

      {/* Exercise */}
      <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_42%,transparent)] p-4">
        <ExerciseSection mcqs={lesson.mcqs} />
      </div>
    </div>
  );
}
