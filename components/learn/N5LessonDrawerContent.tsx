"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { JapaneseDetailBlockRenderer } from "@/components/learn/JapaneseDetailBlockRenderer";
import { VocabRevealTable } from "@/components/learn/VocabRevealTable";
import { McqExerciseBlock } from "@/components/learn/McqExerciseBlock";
import { FuriganaText } from "@/components/learn/FuriganaText";
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

function VocabularySection({ rows }: { rows: VocabRow[] }) {
  const { locale } = useLocale();

  const resolvedRows = rows.map((row) => ({
    sn: row.sn,
    word: row.word,
    romaji: row.romaji,
    kanji: row.kanji,
    meaning: l(row.meaning, locale),
    example: row.example,
  }));

  const labels = {
    showAll: locale === "np" ? "सबै देखाउनुस्" : "Show All",
    hideAll: locale === "np" ? "सबै लुकाउनुस्" : "Hide All",
    shuffle: locale === "np" ? "फेरबदल" : "Shuffle",
  };

  return <VocabRevealTable rows={resolvedRows} labels={labels} />;
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
    question: l(mcq.question, locale),
    choices: mcq.choices.map((choice) => l(choice, locale)),
    correctIndex: mcq.correctIndex,
    explanation: l(mcq.explanation, locale),
  }));

  return <McqExerciseBlock mcqs={resolvedMcqs} locale={locale} />;
}

// ─── Main export ──────────────────────────────────────────────────────────────

const SECTION_LABELS = {
  conversation: { en: "Conversation", np: "संवाद", jp: "会話" },
  grammar:      { en: "Grammar",      np: "व्याकरण", jp: "文法" },
  particles:    { en: "Particles",    np: "Particles (पार्टिकल)", jp: "助詞" },
  vocabulary:   { en: "Vocabulary",   np: "शब्दभण्डार", jp: "語彙" },
  kanji:        (n: number) => ({ en: `Kanji — ${n} characters`, np: `Kanji — ${n} अक्षर`, jp: `漢字 — ${n}文字` }),
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

      {kanjiItems.length > 0 && (
        <Accordion number={5} title={l(SECTION_LABELS.kanji(kanjiItems.length), locale)}>
          <KanjiSection kanjiItems={kanjiItems} />
        </Accordion>
      )}

      {/* Exercise */}
      <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_42%,transparent)] p-4">
        <ExerciseSection mcqs={lesson.mcqs} />
      </div>
    </div>
  );
}
