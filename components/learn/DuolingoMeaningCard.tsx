"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/types";
import { DUOLINGO_DAYS } from "@/lib/japanese-learning/duolingo-vocab-data";

function exampleMeaning(en: string, np: string, locale: Locale): string {
  if (locale === "np" && np) return np;
  return en;
}

export function DuolingoMeaningCard() {
  const { locale } = useLocale();
  const [openDays, setOpenDays] = useState<Set<number>>(new Set());

  function toggle(day: number) {
    setOpenDays((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--text)]">Duolingo Meaning</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Daily vocabulary with examples</p>
      </div>

      <div className="flex flex-col gap-1.5 overflow-y-auto" style={{ maxHeight: "520px" }}>
        {DUOLINGO_DAYS.map((d) => {
          const isOpen = openDays.has(d.day);
          return (
            <div key={d.day} className="overflow-hidden rounded-xl border border-[var(--border)]">
              <button
                onClick={() => toggle(d.day)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-[var(--text)] transition hover:bg-[var(--elevated)]"
              >
                <span>Day {d.day}</span>
                <svg
                  className={`h-3.5 w-3.5 text-[var(--muted)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="flex flex-col gap-3.5 border-t border-[var(--border)] px-4 py-3">
                  {d.words.map((w, idx) => (
                    <div key={idx}>
                      <p className="text-sm font-semibold text-[var(--text)]">
                        {idx + 1}. {w.word}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--muted)]">
                        Meaning: {w.meaning_en}
                        {w.meaning_np ? `, ${w.meaning_np}` : ""}
                      </p>
                      {w.examples.length > 0 && (
                        <div className="mt-1">
                          {w.examples.map((ex, ei) => (
                            <p key={ei} className="text-xs text-[var(--muted)]">
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
  );
}
