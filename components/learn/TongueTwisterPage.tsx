"use client";

import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { TONGUE_TWISTERS } from "@/lib/english-learning/tongue-twister-data";

export function TongueTwisterPage() {
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
            English pronunciation · fun practice
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Tongue Twister
          </h1>
          <p className="mt-2 max-w-lg text-[var(--muted)]">
            Classic English tongue twisters to sharpen pronunciation and speaking speed.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
              <span className="font-mono text-xl font-bold text-[var(--accent)]">{TONGUE_TWISTERS.length}</span>
              <span className="text-sm text-[var(--muted)]">twisters</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--elevated)]">
          <div className="divide-y divide-[var(--border)]">
            {TONGUE_TWISTERS.map((tw, idx) => (
              <div key={tw.id} className="px-5 py-4">
                <div className="flex items-baseline gap-3">
                  <span className="w-6 shrink-0 font-mono text-xs text-[var(--faint)]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-[var(--text)]">{tw.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
