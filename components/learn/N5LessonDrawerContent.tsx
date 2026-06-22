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
  ParticleEntry,
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
  youtubeVideoIdPart2,
  youtubeTitle,
}: {
  grammar: GrammarPoint[];
  youtubeVideoId: { en: string; np?: string; jp?: string };
  youtubeVideoIdPart2?: { np?: string; en?: string };
  youtubeTitle: string;
}) {
  const { locale } = useLocale();
  const [part, setPart] = useState<1 | 2>(1);

  const part1Id =
    (locale === "np" ? youtubeVideoId.np : locale === "jp" ? youtubeVideoId.jp : undefined) ??
    youtubeVideoId.en;

  const part2Id =
    youtubeVideoIdPart2
      ? (locale === "np" ? youtubeVideoIdPart2.np : youtubeVideoIdPart2.en) ?? null
      : null;

  const hasPart2 = part2Id !== null && part2Id !== undefined;
  const activeId = hasPart2 && part === 2 ? part2Id! : part1Id;

  const part1Label = locale === "np" ? "भाग १" : "Part 1";
  const part2Label = locale === "np" ? "भाग २" : "Part 2";

  return (
    <div className="space-y-5">
      {/* Embedded YouTube player */}
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
            title={`${youtubeTitle}${hasPart2 ? ` — ${part === 1 ? part1Label : part2Label}` : ""}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="border-t border-[var(--border)] px-3 py-2">
          <p className="text-[11px] text-[var(--muted)]">
            {youtubeTitle}{hasPart2 ? ` — ${part === 1 ? part1Label : part2Label}` : ""}
          </p>
        </div>
      </div>

      {grammar.map((gp) => (
        <GrammarPointItem key={gp.number} gp={gp} defaultOpen={gp.number === 1} />
      ))}
    </div>
  );
}

// ─── Particles ───────────────────────────────────────────────────────────────

function ParticleItem({
  entry,
  defaultOpen = false,
}: {
  entry: ParticleEntry;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { locale } = useLocale();
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_oklab,var(--accent)_15%,transparent)] text-xl font-bold text-[var(--accent)]">
          {entry.particle}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text)]">{l(entry.name, locale)}</p>
          <p className="text-[11px] font-mono text-[var(--muted)]">{entry.romaji}</p>
        </div>
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
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{l(entry.meaning, locale)}</p>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
              {locale === "np" ? "उदाहरण" : "Examples"}
            </p>
            <div className="space-y-2">
              {entry.examples.map((ex, i) => (
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

function ParticlesSection({ particles }: { particles: ParticleEntry[] }) {
  return (
    <div className="space-y-3">
      {particles.map((entry, i) => (
        <ParticleItem key={entry.particle} entry={entry} defaultOpen={i === 0} />
      ))}
    </div>
  );
}

// ─── Vocabulary ───────────────────────────────────────────────────────────────

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

function VocabularySection({ rows }: { rows: VocabRow[] }) {
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
                        <span>{l(row.meaning, locale)}</span>
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
  const { locale } = useLocale();

  const allAnswered = answers.every((a) => a !== null);
  const score = answers.filter((a, i) => a === mcqs[i].correctIndex).length;
  const total = mcqs.length;

  function pick(qi: number, ci: number) {
    if (revealed) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = ci;
      return next;
    });
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

      {mcqs.map((mcq, qi) => {
        const picked = answers[qi];
        return (
          <div
            key={qi}
            className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] p-3.5"
          >
            <p className="text-sm font-medium text-[var(--text)]">
              <span className="mr-1.5 text-[var(--muted)]">Q{qi + 1}.</span>
              {l(mcq.question, locale)}
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
                    {String.fromCharCode(65 + ci)}. {l(choice, locale)}
                  </button>
                );
              })}
            </div>
            {revealed && picked !== mcq.correctIndex && (
              <p className="mt-2.5 text-xs leading-relaxed text-[var(--muted)]">
                <span className="font-semibold text-[var(--accent)]">
                  {locale === "np" ? "व्याख्या: " : "Explanation: "}
                </span>
                {l(mcq.explanation, locale)}
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
            onClick={() => {
              setAnswers(mcqs.map(() => null));
              setRevealed(false);
            }}
            className="mt-3 rounded-lg border border-[var(--border)] px-4 py-1.5 text-xs text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            {locale === "np" ? "फेरि प्रयास गर्नुस्" : "Try again"}
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
  particles:    { en: "Particles",    np: "Particles (पार्टिकल)", jp: "助詞" },
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
          youtubeVideoIdPart2={lesson.youtubeVideoIdPart2}
          youtubeTitle={lesson.youtubeTitle}
        />
      </Accordion>

      {lesson.particles.length > 0 && (
        <Accordion number={3} title={l(SECTION_LABELS.particles, locale)}>
          <ParticlesSection particles={lesson.particles} />
        </Accordion>
      )}

      <Accordion number={4} title={l(SECTION_LABELS.vocabulary, locale)}>
        <VocabularySection rows={lesson.vocabulary} />
      </Accordion>

      <Accordion number={5} title={l(SECTION_LABELS.kanji, locale)}>
        <KanjiSection kanjiItems={kanjiItems} />
      </Accordion>

      {/* Exercise */}
      <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_42%,transparent)] p-4">
        <ExerciseSection mcqs={lesson.mcqs} />
      </div>
    </div>
  );
}
