"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import type { Locale } from "@/lib/i18n/types";
import { DUOLINGO_DAYS } from "@/lib/japanese-learning/duolingo-vocab-data";

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
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/language" labelKey="learn.backLanguage" />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="max-w-xl">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Duolingo Meaning
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            Daily vocabulary with meaning and examples. Example translations follow your selected UI language.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {DUOLINGO_DAYS.map((d) => {
            const isOpen = openDays.has(d.day);
            return (
              <div
                key={d.day}
                className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)]"
              >
                <button
                  onClick={() => toggle(d.day)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-[var(--elevated)]"
                >
                  <span className="font-semibold text-[var(--text)]">Day {d.day}</span>
                  <span className="text-xs text-[var(--muted)]">{d.words.length} words</span>
                  <svg
                    className={`ml-3 h-4 w-4 shrink-0 text-[var(--muted)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="flex flex-col gap-5 border-t border-[var(--border)] px-5 py-5">
                    {d.words.map((w, idx) => (
                      <div key={idx}>
                        <p className="font-semibold text-[var(--text)]">
                          {idx + 1}. {w.word}
                        </p>
                        <p className="mt-0.5 text-sm text-[var(--muted)]">
                          Meaning: {w.meaning_en}
                          {w.meaning_np ? `, ${w.meaning_np}` : ""}
                        </p>
                        {w.examples.length > 0 && (
                          <div className="mt-1">
                            {w.examples.map((ex, ei) => (
                              <p key={ei} className="text-sm text-[var(--muted)]">
                                {ei === 0 && (
                                  <span className="font-medium text-[var(--text)]">Example: </span>
                                )}
                                {ei > 0 && (
                                  <span aria-hidden className="invisible">Example: </span>
                                )}
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
