"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import type { Locale } from "@/lib/i18n/types";
import { DUOLINGO_DAYS, DUOLINGO_NOTES } from "@/lib/japanese-learning/duolingo-vocab-data";

const TOTAL_WORDS = DUOLINGO_DAYS.reduce((sum, d) => sum + d.words.length, 0);

const WORD_NOTES = DUOLINGO_DAYS.flatMap((d) =>
  d.words
    .filter((w) => w.note)
    .map((w) => ({
      word: w.word,
      romaji: w.romaji,
      reading: w.reading,
      note: w.note as string,
      examples: w.examples,
    })),
);

function exampleMeaning(en: string, np: string, locale: Locale): string {
  if (locale === "np" && np) return np;
  return en;
}

function NoteExamples({ examples }: { examples?: { ja: string; en: string; np: string }[] }) {
  if (!examples?.length) return null;

  return (
    <div className="mt-3 space-y-2 border-l-2 border-[color-mix(in_oklab,var(--accent)_30%,var(--border))] pl-3">
      {examples.map((example, index) => (
        <div key={index} className="text-xs">
          <p className="text-sm text-[var(--text)]">{example.ja}</p>
          <p className="mt-0.5 text-[var(--muted)]">EN: {example.en}</p>
          <p className="mt-0.5 text-[var(--faint)]">NP: {example.np}</p>
        </div>
      ))}
    </div>
  );
}

type NoteGroupId = "grammar" | "dates" | "food" | "culture" | "daily";
type NoteSectionId = "words" | NoteGroupId;

const NOTE_GROUPS: { id: NoteGroupId; label: string; description: string; icon: string }[] = [
  { id: "grammar", label: "Grammar & Usage", description: "Particles, adjective patterns, and useful expressions.", icon: "文" },
  { id: "dates", label: "Dates & Numbers", description: "Counting, calendars, and time expressions.", icon: "日" },
  { id: "food", label: "Food & Dining", description: "Meals, restaurants, and Japanese food culture.", icon: "食" },
  { id: "culture", label: "Culture & Traditions", description: "Festivals, customs, and life in Japan.", icon: "祭" },
  { id: "daily", label: "Daily Life", description: "Travel, home, work, and everyday topics.", icon: "生" },
];

function noteGroup(title: string): NoteGroupId {
  if (/Counting|Number|Hundreds|Day Before|Times|Moon and Sun|Sunrise|Date/.test(title)) return "dates";
  if (/Meal|Tea|Restaurant|Cuisine|Cafeteria|Set Meals|Curry|Bread|Breakfast|Miso|Oden|Nabe|Soba|Soufflé|Kōshū/.test(title)) return "food";
  if (/Particle|Adjective|Making|Softening|Present and|Using|Specific|Returning|Asking|Coming with|いちばん|ぜんぜん|きらい|でしょう|すごい|にがて|おだやか|Snow with|Giving|Receiving|Katakana|ちかく|Near a Place|Naming/.test(title)) return "grammar";
  if (/Japanese|Hana|Kawaii|Hatsumōde|Ake Ome|Onsen|Kotatsu|Bonsai|Sapporo|Autumn|Summer|Rainy|Moon Viewing|Anime|Cinema|Karaoke|Oshogatsu|Coming-of-Age/.test(title)) return "culture";
  return "daily";
}

function StandaloneNoteCard({ note }: { note: (typeof DUOLINGO_NOTES)[number] }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] hover:shadow-lg hover:shadow-black/5">
      <div className="flex items-baseline gap-2">
        <span className="text-base font-semibold text-[var(--text)]">{note.title}</span>
        {note.japanese && (
          <span className="ml-auto rounded-md bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
            {note.japanese}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{note.note}</p>
      <NoteExamples examples={note.examples} />
    </div>
  );
}

function WordNoteCard({ note }: { note: (typeof WORD_NOTES)[number] }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] hover:shadow-lg hover:shadow-black/5">
      <div className="flex items-baseline gap-2">
        <span className="text-base font-semibold text-[var(--text)]">{note.word}</span>
        {note.reading && <span className="text-sm text-[var(--muted)]">（{note.reading}）</span>}
        <span className="text-xs text-[var(--faint)] font-mono">· {note.romaji}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{note.note}</p>
      <NoteExamples examples={note.examples} />
    </div>
  );
}

export function DuolingoPage() {
  const { locale } = useLocale();
  const [tab, setTab] = useState<"words" | "notes">("words");
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([1]));
  const [activeNoteSection, setActiveNoteSection] = useState<NoteSectionId | null>(null);

  const groupedNotes = NOTE_GROUPS.map((group) => ({
    ...group,
    notes: DUOLINGO_NOTES.filter((note) => noteGroup(note.title) === group.id),
  }));

  function toggle(day: number) {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  function selectNoteSection(section: NoteSectionId) {
    setActiveNoteSection(section);
  }

  return (
    <div>
      {/* Back nav */}
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/language" labelKey="learn.backLanguage" />
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--glow)] blur-3xl"
        />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--elevated)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Duolingo vocabulary log
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Duolingo Meaning
          </h1>
          <p className="mt-2 max-w-lg text-[var(--muted)]">
            Daily vocabulary with English and Nepali meanings. Example translations follow your selected UI language.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
              <span className="font-mono text-xl font-bold text-[var(--accent)]">{DUOLINGO_DAYS.length}</span>
              <span className="text-sm text-[var(--muted)]">days</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
              <span className="font-mono text-xl font-bold text-[var(--accent)]">{TOTAL_WORDS}</span>
              <span className="text-sm text-[var(--muted)]">entries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
        <div className="inline-flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
          <button
            onClick={() => setTab("words")}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
              tab === "words" ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            Vocabulary
          </button>
          <button
            onClick={() => setTab("notes")}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
              tab === "notes" ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            Notes
          </button>
        </div>
      </div>

      {/* Accordion list */}
      {tab === "words" && (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-3">
          {DUOLINGO_DAYS.map((d) => {
            const isOpen = openDays.has(d.day);
            return (
              <div
                key={d.day}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen
                    ? "border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] bg-[var(--elevated)]"
                    : "border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)]"
                }`}
              >
                <button
                  onClick={() => toggle(d.day)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] px-2.5 py-1 text-xs font-bold text-[var(--accent)]">
                      Day {d.day}
                    </span>
                    <span className="text-sm font-medium text-[var(--text)]">{d.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-xs tabular-nums text-[var(--muted)]">
                      {d.words.length} words
                    </span>
                    <svg
                      className={`h-4 w-4 shrink-0 text-[var(--muted)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
                    {d.words.map((w, idx) => (
                      <div key={idx} className="px-5 py-4">
                        <div className="flex items-baseline gap-3">
                          <span className="w-6 shrink-0 font-mono text-xs text-[var(--faint)]">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="text-base font-semibold text-[var(--text)]">{w.word}</span>
                          {w.reading && (
                            <span className="text-sm text-[var(--muted)]">（{w.reading}）</span>
                          )}
                          <span className="text-xs text-[var(--faint)] font-mono">· {w.romaji}</span>
                        </div>

                        <div className="mt-2 ml-9 flex flex-wrap gap-1.5">
                          <span className="rounded-md bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
                            {w.meaning_en}
                          </span>
                          {w.meaning_np && (
                            <span className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--muted)]">
                              {w.meaning_np}
                            </span>
                          )}
                        </div>

                        {w.examples.length > 0 && (
                          <div className="mt-2.5 ml-9 border-l-2 border-[color-mix(in_oklab,var(--accent)_30%,var(--border))] pl-3">
                            {w.examples.map((ex, ei) => (
                              <p key={ei} className={`text-sm text-[var(--muted)] ${ei > 0 ? "mt-1" : ""}`}>
                                {ex.ja}{" "}
                                <span className="text-[var(--faint)]">
                                  ({exampleMeaning(ex.en, ex.np, locale)})
                                </span>
                              </p>
                            ))}
                          </div>
                        )}

                        {w.note && (
                          <p className="mt-1.5 ml-9 text-xs italic text-[var(--faint)]">{w.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Notes list */}
      {tab === "notes" && (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8">
          <div className="relative overflow-hidden rounded-2xl border border-[color-mix(in_oklab,var(--accent)_25%,var(--border))] bg-[color-mix(in_oklab,var(--accent)_7%,var(--surface))] p-5">
            <div aria-hidden className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[var(--glow)] blur-2xl" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Study notes</p>
            <div className="relative mt-2 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">Find the explanation you need</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Grammar, dates, culture, and everyday Japanese in focused sections.</p>
              </div>
              <span className="rounded-full border border-[color-mix(in_oklab,var(--accent)_25%,var(--border))] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                {DUOLINGO_NOTES.length} notes
              </span>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-start">
            <aside className="lg:sticky lg:top-5">
              <p className="text-sm font-semibold text-[var(--muted)]">Browse notes</p>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                <button
                  onClick={() => selectNoteSection("words")}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-medium transition ${activeNoteSection === "words" ? "border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--accent)] shadow-sm" : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[color-mix(in_oklab,var(--accent)_25%,var(--border))] hover:text-[var(--text)]"}`}
                >
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[10px] font-bold">語</span>
                  <span className="whitespace-nowrap lg:whitespace-normal">Vocabulary Notes</span>
                  <span className="ml-auto text-[10px] tabular-nums opacity-70">{WORD_NOTES.length}</span>
                </button>
                {groupedNotes.map((group) => {
                  const isActive = activeNoteSection === group.id;
                  return (
                    <button
                      key={group.id}
                      onClick={() => selectNoteSection(group.id)}
                      className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-medium transition ${isActive ? "border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--accent)] shadow-sm" : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[color-mix(in_oklab,var(--accent)_25%,var(--border))] hover:text-[var(--text)]"}`}
                    >
                      <span className="grid h-5 w-5 place-items-center rounded-md bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[10px] font-bold">{group.icon}</span>
                      <span className="whitespace-nowrap lg:whitespace-normal">{group.label}</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            <div>
              {activeNoteSection === null && (
                <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_65%,transparent)] p-8 text-center">
                  <div>
                    <span className="grid mx-auto h-11 w-11 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-lg text-[var(--accent)]">←</span>
                    <h2 className="mt-4 text-base font-semibold text-[var(--text)]">Choose a note section</h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">Select a category from the side menu to begin.</p>
                  </div>
                </div>
              )}

              {activeNoteSection === "words" && (
                <div className="animate-[fade-in_200ms_ease-out]">
                  <h2 className="text-lg font-semibold text-[var(--text)]">Vocabulary Notes</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">Grammar and usage notes attached to specific vocabulary.</p>
                  <div className="mt-4 space-y-3">{WORD_NOTES.map((note) => <WordNoteCard key={note.word} note={note} />)}</div>
                </div>
              )}

              {activeNoteSection !== null && activeNoteSection !== "words" && (() => {
                const group = groupedNotes.find((item) => item.id === activeNoteSection);
                if (!group) return null;
                return (
                  <div className="animate-[fade-in_200ms_ease-out]">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-sm font-bold text-[var(--accent)]">{group.icon}</span>
                      <div>
                        <h2 className="text-lg font-semibold text-[var(--text)]">{group.label}</h2>
                        <p className="text-sm text-[var(--muted)]">{group.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">{group.notes.map((note) => <StandaloneNoteCard key={note.title} note={note} />)}</div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
