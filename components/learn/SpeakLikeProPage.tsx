"use client";

import { useState } from "react";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { SPEAK_LIKE_A_PRO, UPGRADE_YOUR_ENGLISH, FULL_FORMS } from "@/lib/english-learning/speak-like-pro-data";
import type { SpeakSwap, FullFormEntry } from "@/lib/english-learning/speak-like-pro-data";

function SwapList({ items, fromLabel, toLabel }: { items: SpeakSwap[]; fromLabel: string; toLabel: string }) {
  return (
    <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
      {items.map((s, idx) => (
        <div key={s.id} className="px-5 py-4">
          <div className="flex items-baseline gap-3">
            <span className="w-6 shrink-0 font-mono text-xs text-[var(--faint)]">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--muted)]">
                {fromLabel}: <span className="text-[var(--text)] line-through decoration-[var(--faint)]">{s.basic}</span>
              </span>
              <span className="text-[var(--faint)]">→</span>
              <span className="text-sm font-medium text-[var(--accent)]">
                {toLabel}: {s.upgraded}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FullFormList({ items }: { items: FullFormEntry[] }) {
  return (
    <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
      {items.map((f, idx) => (
        <div key={f.id} className="px-5 py-4">
          <div className="flex items-baseline gap-3">
            <span className="w-6 shrink-0 font-mono text-xs text-[var(--faint)]">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-[var(--text)]">{f.word}</span>
              <span className="text-[var(--faint)]">→</span>
              <span className="text-sm font-medium text-[var(--accent)]">{f.fullForm}</span>
            </div>
          </div>
        </div>
      ))}
      <p className="px-5 py-4 text-xs text-[var(--muted)]">
        These are popular "backronyms" (fun/motivational expansions), not official etymologies.
      </p>
    </div>
  );
}

type SectionId = "swap" | "upgrade" | "fullforms";

const SECTIONS: { id: SectionId; title: string; count: number; render: () => React.ReactNode }[] = [
  { id: "swap", title: "Speak Like A Pro", count: SPEAK_LIKE_A_PRO.length, render: () => <SwapList items={SPEAK_LIKE_A_PRO} fromLabel="Don't say" toLabel="Say" /> },
  {
    id: "upgrade",
    title: "Upgrade Your English (Basic → Advanced)",
    count: UPGRADE_YOUR_ENGLISH.length,
    render: () => <SwapList items={UPGRADE_YOUR_ENGLISH} fromLabel="Basic" toLabel="Advanced" />,
  },
  { id: "fullforms", title: "Full Forms You Should Know", count: FULL_FORMS.length, render: () => <FullFormList items={FULL_FORMS} /> },
];

export function SpeakLikeProPage() {
  const [openSections, setOpenSections] = useState<Set<SectionId>>(new Set(["swap"]));

  function toggle(id: SectionId) {
    setOpenSections((prev) => {
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
            English fluency · sound natural
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Speak Like A Pro
          </h1>
          <p className="mt-2 max-w-lg text-[var(--muted)]">
            Swap plain phrases and basic words for ones that sound natural and advanced.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-3">
          {SECTIONS.map((section) => {
            const isOpen = openSections.has(section.id);
            return (
              <div
                key={section.id}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen
                    ? "border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] bg-[var(--elevated)]"
                    : "border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)]"
                }`}
              >
                <button
                  onClick={() => toggle(section.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)]"
                >
                  <span className="text-sm font-medium text-[var(--text)]">{section.title}</span>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-xs tabular-nums text-[var(--muted)]">
                      {section.count} items
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

                {isOpen && section.render()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
