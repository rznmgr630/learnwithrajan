"use client";

import { useState } from "react";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { SURVIVAL_PHRASE_CATEGORIES } from "@/lib/japanese-learning/survival-phrases-data";

const TOTAL_PHRASES = SURVIVAL_PHRASE_CATEGORIES.reduce((sum, c) => sum + c.phrases.length, 0);

export function SurvivalPhrasesPage() {
  const [openCategories, setOpenCategories] = useState<Set<number>>(new Set([1]));

  function toggle(id: number) {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
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

      <div className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--glow)] blur-3xl"
        />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--elevated)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Japanese phrasebook
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Survival Phrases
          </h1>
          <p className="mt-2 max-w-lg text-[var(--muted)]">
            Common everyday Japanese phrases with English and Nepali meanings and romaji readings.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
              <span className="font-mono text-xl font-bold text-[var(--accent)]">{TOTAL_PHRASES}</span>
              <span className="text-sm text-[var(--muted)]">phrases</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-3">
          {SURVIVAL_PHRASE_CATEGORIES.map((c) => {
            const isOpen = openCategories.has(c.id);
            return (
              <div
                key={c.id}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen
                    ? "border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] bg-[var(--elevated)]"
                    : "border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)]"
                }`}
              >
                <button
                  onClick={() => toggle(c.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)]"
                >
                  <span className="text-sm font-medium text-[var(--text)]">{c.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-xs tabular-nums text-[var(--muted)]">
                      {c.phrases.length} phrases
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
                    {c.phrases.map((p, idx) => (
                      <div key={idx} className="px-5 py-4">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="w-6 shrink-0 font-mono text-xs text-[var(--faint)]">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="text-base font-semibold text-[var(--text)]">{p.phrase}</span>
                          <span className="text-xs text-[var(--faint)] font-mono">· {p.romaji}</span>
                        </div>

                        <div className="mt-2 ml-8 flex flex-col gap-1">
                          <span className="text-sm text-[var(--text)]">{p.meaning_en}</span>
                          <span className="text-xs text-[var(--muted)]">{p.meaning_np}</span>
                        </div>
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
