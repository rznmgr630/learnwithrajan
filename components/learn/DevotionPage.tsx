"use client";

import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { VideoCard } from "@/components/learn/VideoCard";
import { DEVOTION_VIDEOS } from "@/lib/personal-development/devotion-data";

export function DevotionPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/personal-development" labelKey="learn.backPersonalDevelopment" />
        </div>
      </div>

      <div className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--glow)] blur-3xl"
        />
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--elevated)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Personal Development
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">Devotion</h1>
          <p className="mt-2 max-w-lg text-[var(--muted)]">A space for prayer, reflection, and spiritual practice.</p>
          <div className="mt-6 flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
            <span className="font-mono text-xl font-bold text-[var(--accent)]">{DEVOTION_VIDEOS.length}</span>
            <span className="text-sm text-[var(--muted)]">video</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEVOTION_VIDEOS.map((v, i) => (
            <VideoCard key={v.id} v={v} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
