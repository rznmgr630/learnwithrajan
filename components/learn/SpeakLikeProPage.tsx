"use client";

import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { SPEAK_LIKE_A_PRO, UPGRADE_YOUR_ENGLISH, FULL_FORMS } from "@/lib/english-learning/speak-like-pro-data";
import type { SpeakSwap, FullFormEntry } from "@/lib/english-learning/speak-like-pro-data";

function SwapList({ items, fromLabel, toLabel }: { items: SpeakSwap[]; fromLabel: string; toLabel: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--elevated)]">
      <div className="divide-y divide-[var(--border)]">
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
    </div>
  );
}

function FullFormList({ items }: { items: FullFormEntry[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--elevated)]">
      <div className="divide-y divide-[var(--border)]">
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
      </div>
    </div>
  );
}

export function SpeakLikeProPage() {
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
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
              <span className="font-mono text-xl font-bold text-[var(--accent)]">{SPEAK_LIKE_A_PRO.length}</span>
              <span className="text-sm text-[var(--muted)]">phrases</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
              <span className="font-mono text-xl font-bold text-[var(--accent)]">{UPGRADE_YOUR_ENGLISH.length}</span>
              <span className="text-sm text-[var(--muted)]">word upgrades</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
              <span className="font-mono text-xl font-bold text-[var(--accent)]">{FULL_FORMS.length}</span>
              <span className="text-sm text-[var(--muted)]">full forms</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="mb-3 text-lg font-semibold tracking-tight text-[var(--text)]">Speak Like A Pro</h2>
            <SwapList items={SPEAK_LIKE_A_PRO} fromLabel="Don't say" toLabel="Say" />
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold tracking-tight text-[var(--text)]">
              Upgrade Your English (Basic → Advanced)
            </h2>
            <SwapList items={UPGRADE_YOUR_ENGLISH} fromLabel="Basic" toLabel="Advanced" />
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold tracking-tight text-[var(--text)]">Full Forms You Should Know</h2>
            <FullFormList items={FULL_FORMS} />
            <p className="mt-2 text-xs text-[var(--muted)]">
              These are popular "backronyms" (fun/motivational expansions), not official etymologies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
