"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { JapaneseDetailBlockRenderer } from "@/components/learn/JapaneseDetailBlockRenderer";
import type {
  ConversationLine,
  FuriganaString,
  GrammarPoint,
  L10n,
  LessonMcq,
  N5LessonPageData,
  VocabRow,
} from "@/lib/japanese-learning/n5/n5-lesson-pages";
import type { KanjiStrokeEntry } from "@/lib/japanese-learning/n5/n5-kanji-pool";
import type { Locale } from "@/lib/i18n/types";

function l(v: L10n, locale: Locale): string {
  if (typeof v === "string") return v;
  return (v as Record<string, string | undefined>)[locale] ?? v.en;
}

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
  const { locale } = useLocale();
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
              <p className="mt-0.5 text-xs text-[var(--muted)]">{l(line.english, locale)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Grammar ──────────────────────────────────────────────────────────────────

function GrammarPointItem({
  gp,
  defaultOpen = false,
}: {
  gp: GrammarPoint;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { locale } = useLocale();
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)]"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_22%,transparent)] text-[10px] font-bold text-[var(--accent)]">
          {gp.number}
        </span>
        <span className="flex-1 text-sm font-semibold text-[var(--text)]">{l(gp.name, locale)}</span>
        <svg
          className={`h-3.5 w-3.5 shrink-0 text-[var(--muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 10.94 2.53 5.47l.94-.94L8 9.06l4.53-4.53.94.94z" />
        </svg>
      </button>

      {open && (
        <div className="space-y-3 border-t border-[var(--border)] px-3.5 py-3.5">
          <div className="rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
              {locale === "np" ? "अर्थ" : "Meaning"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{l(gp.meaning, locale)}</p>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
              {locale === "np" ? "कहाँ प्रयोग गर्ने" : "Where we use"}
            </p>
            <ul className="mt-2 space-y-1.5">
              {gp.whereWeUse.map((line, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{l(line, locale)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
              {locale === "np" ? "उदाहरण — ३ फरक परिस्थिति" : "Examples — 3 different scenarios"}
            </p>
            <div className="space-y-2">
              {gp.examples.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_45%,transparent)] p-3"
                >
                  <p className="mb-1 text-[10px] font-medium text-[var(--faint)]">{l(ex.scenario, locale)}</p>
                  <p className="text-base leading-loose text-[var(--text)]">
                    <FuriganaText text={ex.japanese} />
                  </p>
                  <p className="text-[11px] italic text-[var(--muted)]">{ex.reading}</p>
                  <p className="text-xs text-[var(--muted)]">{l(ex.english, locale)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GrammarSection({
  grammar,
  youtubeVideoId,
  youtubeTitle,
}: {
  grammar: GrammarPoint[];
  youtubeVideoId: { en: string; np?: string; jp?: string };
  youtubeTitle: string;
}) {
  const { locale } = useLocale();
  const videoId =
    (locale === "np" ? youtubeVideoId.np : locale === "jp" ? youtubeVideoId.jp : undefined) ??
    youtubeVideoId.en;

  return (
    <div className="space-y-5">
      {/* Embedded YouTube player */}
      <div className="overflow-hidden rounded-xl border border-[var(--border)]">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={youtubeTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="border-t border-[var(--border)] px-3 py-2">
          <p className="text-[11px] text-[var(--muted)]">{youtubeTitle}</p>
        </div>
      </div>

      {grammar.map((gp) => (
        <GrammarPointItem key={gp.number} gp={gp} defaultOpen={gp.number === 1} />
      ))}
    </div>
  );
}

// ─── Vocabulary ───────────────────────────────────────────────────────────────

function VocabularySection({ rows }: { rows: VocabRow[] }) {
  const { locale } = useLocale();
  return (
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
          {rows.map((row) => (
            <tr
              key={row.sn}
              className="border-b border-[var(--border)]/70 last:border-0 odd:bg-[color-mix(in_oklab,var(--elevated)_18%,transparent)]"
            >
              <td className="px-3 py-2.5 text-xs text-[var(--faint)]">{row.sn}</td>
              <td className="px-3 py-2.5 text-base text-[var(--text)]">{row.word}</td>
              <td className="px-3 py-2.5 font-mono text-xs text-[var(--muted)]">{row.romaji}</td>
              <td className="px-3 py-2.5 text-base text-[var(--text)]">{row.kanji ?? "—"}</td>
              <td className="px-3 py-2.5 text-xs text-[var(--muted)]">{l(row.meaning, locale)}</td>
              <td className="px-3 py-2.5 text-sm text-[var(--text)]">{row.example}</td>
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

const SECTION_LABELS = {
  conversation: { en: "Conversation", np: "संवाद", jp: "会話" },
  grammar:      { en: "Grammar",      np: "व्याकरण", jp: "文法" },
  vocabulary:   { en: "Vocabulary",   np: "शब्दभण्डार", jp: "語彙" },
  kanji:        { en: "Kanji — 20 characters", np: "Kanji — २० अक्षर", jp: "漢字 — 20文字" },
} as const;

export function N5LessonDrawerContent({
  lesson,
  kanjiItems,
}: {
  lesson: N5LessonPageData;
  kanjiItems: KanjiStrokeEntry[];
}) {
  const { locale } = useLocale();
  return (
    <div className="space-y-3">
      {/* Intro */}
      <div className="space-y-1.5 rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)] px-4 py-3.5">
        {lesson.intro.map((sentence, i) => (
          <p key={i} className="text-sm leading-relaxed text-[var(--muted)]">
            {l(sentence, locale)}
          </p>
        ))}
      </div>

      {/* 4 Accordions */}
      <Accordion number={1} title={l(SECTION_LABELS.conversation, locale)} defaultOpen>
        <ConversationSection lines={lesson.conversation} />
      </Accordion>

      <Accordion number={2} title={l(SECTION_LABELS.grammar, locale)}>
        <GrammarSection
          grammar={lesson.grammar}
          youtubeVideoId={lesson.youtubeVideoId}
          youtubeTitle={lesson.youtubeTitle}
        />
      </Accordion>

      <Accordion number={3} title={l(SECTION_LABELS.vocabulary, locale)}>
        <VocabularySection rows={lesson.vocabulary} />
      </Accordion>

      <Accordion number={4} title={l(SECTION_LABELS.kanji, locale)}>
        <KanjiSection kanjiItems={kanjiItems} />
      </Accordion>

      {/* Exercise */}
      <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_42%,transparent)] p-4">
        <ExerciseSection mcqs={lesson.mcqs} />
      </div>
    </div>
  );
}
