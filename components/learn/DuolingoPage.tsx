"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import type { Locale } from "@/lib/i18n/types";
import { DUOLINGO_DAYS, DUOLINGO_NOTES } from "@/lib/japanese-learning/duolingo-vocab-data";

const TOTAL_WORDS = DUOLINGO_DAYS.reduce((sum, d) => sum + d.words.length, 0);
const DUOLINGO_TAB_KEY = "duolingo:active-tab";
const DUOLINGO_ACTIVE_DAY_KEY = "duolingo:active-day";

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
  const [activeDay, setActiveDay] = useState(1);
  const [activeNoteSection, setActiveNoteSection] = useState<NoteSectionId>("words");

  const groupedNotes = NOTE_GROUPS.map((group) => ({
    ...group,
    notes: DUOLINGO_NOTES.filter((note) => noteGroup(note.title) === group.id),
  }));
  const activeDayData = DUOLINGO_DAYS.find((day) => day.day === activeDay) ?? DUOLINGO_DAYS[0];

  useEffect(() => {
    const savedTab = window.sessionStorage.getItem(DUOLINGO_TAB_KEY);
    if (savedTab === "words" || savedTab === "notes") setTab(savedTab);

    const savedDay = Number(window.sessionStorage.getItem(DUOLINGO_ACTIVE_DAY_KEY));
    if (DUOLINGO_DAYS.some((day) => day.day === savedDay)) setActiveDay(savedDay);
  }, []);

  function selectTab(nextTab: "words" | "notes") {
    setTab(nextTab);
    window.sessionStorage.setItem(DUOLINGO_TAB_KEY, nextTab);
  }

  function selectVocabularyDay(day: number) {
    setActiveDay(day);
    window.sessionStorage.setItem(DUOLINGO_ACTIVE_DAY_KEY, String(day));
    const content = document.getElementById("vocabulary-content");
    if (!content) return;
    if (window.matchMedia("(min-width: 1024px)").matches) content.scrollTo({ top: 0, behavior: "smooth" });
    else content.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function selectNoteSection(section: NoteSectionId) {
    setActiveNoteSection(section);
    const content = document.getElementById("note-content");
    if (!content) return;
    if (window.matchMedia("(min-width: 1024px)").matches) content.scrollTo({ top: 0, behavior: "smooth" });
    else content.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-w-0">
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
            onClick={() => selectTab("words")}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
              tab === "words" ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            Vocabulary
          </button>
          <button
            onClick={() => selectTab("notes")}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
              tab === "notes" ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            Notes
          </button>
        </div>
      </div>

      {/* Vocabulary list */}
      {tab === "words" && (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="grid min-w-0 gap-5 lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-start">
          <aside className="min-w-0 lg:sticky lg:top-16 lg:z-10 lg:self-start">
            <p className="text-sm font-semibold text-[var(--muted)]">Browse vocabulary</p>
            <div className="mt-3 flex w-full min-w-0 max-w-full gap-2 overflow-x-auto pb-1 lg:max-h-[min(28rem,calc(100vh-18rem))] lg:flex-col lg:overflow-y-auto lg:pr-1">
              {DUOLINGO_DAYS.map((day) => {
                const isActive = activeDay === day.day;
                return (
                  <button
                    key={day.day}
                    onClick={() => selectVocabularyDay(day.day)}
                    className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-medium transition ${isActive ? "border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--accent)] shadow-sm" : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[color-mix(in_oklab,var(--accent)_25%,var(--border))] hover:text-[var(--text)]"}`}
                  >
                    <span className="whitespace-nowrap lg:whitespace-normal">{day.category}</span>
                    <span className="ml-auto text-[10px] tabular-nums opacity-70">{day.words.length}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div id="vocabulary-content" className="min-w-0 scroll-mt-8 lg:pr-2 lg:scroll-mt-10">
            <div className="animate-[fade-in_200ms_ease-out]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Day {activeDayData.day}</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--text)]">{activeDayData.category}</h2>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs tabular-nums text-[var(--muted)]">
                  {activeDayData.words.length} words
                </span>
              </div>

              <div className="mt-4 divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                {activeDayData.words.map((word, index) => (
                  <div key={index} className="px-5 py-4">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="w-6 shrink-0 font-mono text-xs text-[var(--faint)]">{String(index + 1).padStart(2, "0")}</span>
                      <span className="text-base font-semibold text-[var(--text)]">{word.word}</span>
                      {word.reading && <span className="text-sm text-[var(--muted)]">（{word.reading}）</span>}
                      <span className="text-xs font-mono text-[var(--faint)]">· {word.romaji}</span>
                    </div>

                    <div className="mt-2 ml-9 flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">{word.meaning_en}</span>
                      {word.meaning_np && <span className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--muted)]">{word.meaning_np}</span>}
                    </div>

                    {word.examples.length > 0 && (
                      <div className="mt-2.5 ml-9 border-l-2 border-[color-mix(in_oklab,var(--accent)_30%,var(--border))] pl-3">
                        {word.examples.map((example, exampleIndex) => (
                          <p key={exampleIndex} className={`text-sm text-[var(--muted)] ${exampleIndex > 0 ? "mt-1" : ""}`}>
                            {example.ja} <span className="text-[var(--faint)]">({exampleMeaning(example.en, example.np, locale)})</span>
                          </p>
                        ))}
                      </div>
                    )}

                    {word.note && <p className="mt-1.5 ml-9 text-xs italic text-[var(--faint)]">{word.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
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

          <div className="grid min-w-0 gap-5 lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-start">
            <aside className="min-w-0 lg:sticky lg:top-20">
              <p className="text-sm font-semibold text-[var(--muted)]">Browse notes</p>
              <div className="mt-3 flex w-full min-w-0 max-w-full gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
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

            <div id="note-content" className="min-w-0 scroll-mt-8 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:scroll-smooth lg:pr-2 lg:scroll-mt-10">
              {activeNoteSection === "words" && (
                <div className="animate-[fade-in_200ms_ease-out]">
                  <h2 className="text-lg font-semibold text-[var(--text)]">Vocabulary Notes</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">Grammar and usage notes attached to specific vocabulary.</p>
                  <div className="mt-4 space-y-3">{WORD_NOTES.map((note) => <WordNoteCard key={note.word} note={note} />)}</div>
                </div>
              )}

              {activeNoteSection !== "words" && (() => {
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
