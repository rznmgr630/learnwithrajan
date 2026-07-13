"use client";

import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { VideoCard } from "@/components/learn/VideoCard";
import { FOCUS_GOALS_VIDEOS } from "@/lib/personal-development/focus-goals-data";

export function FocusGoalsPage() {
  return (
    <div>
      {/* Back nav */}
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/personal-development" labelKey="learn.backPersonalDevelopment" />
        </div>
      </div>

      {/* Hero */}
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
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            How do you stay so focused on your goals?
          </h1>
          <p className="mt-2 max-w-lg text-[var(--muted)]">
            A curated collection of videos on focus, discipline, and staying locked in on what matters.
          </p>
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 w-fit">
            <span className="font-mono text-xl font-bold text-[var(--accent)]">{FOCUS_GOALS_VIDEOS.length}</span>
            <span className="text-sm text-[var(--muted)]">videos</span>
          </div>
        </div>
      </div>

      {/* Video grid */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FOCUS_GOALS_VIDEOS.map((v, i) => (
            <VideoCard key={v.id} v={v} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
