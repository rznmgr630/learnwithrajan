"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import type { Locale } from "@/lib/i18n/types";
import { DUOLINGO_DAYS } from "@/lib/japanese-learning/duolingo-vocab-data";

const TOTAL_WORDS = DUOLINGO_DAYS.reduce((sum, d) => sum + d.words.length, 0);

function exampleMeaning(en: string, np: string, locale: Locale): string {
  if (locale === "np" && np) return np;
  return en;
}

export function DuolingoPage() {
  const { locale } = useLocale();
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([1]));

  function toggle(day: number) {
    setOpenDays((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
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
              <span className="text-sm text-[var(--muted)]">words</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion list */}
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
