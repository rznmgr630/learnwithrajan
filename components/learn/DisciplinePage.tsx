"use client";

import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { VideoCard } from "@/components/learn/VideoCard";

type Video = {
  id: string;
  label: string;
};

const VIDEOS: Video[] = [
  { id: "G57QInhSnJk", label: "Steven Bartlett's Rule for Extreme Consistency" },
  { id: "K8ZgwZf1E3E", label: "How To Force Your Brain To Crave Doing Hard Things" },
  { id: "YucXxma_-ko", label: "How To Stop Wasting Your Life" },
  { id: "TLKxdTmk-zc", label: "The Most Eye Opening 10 Minutes Of Your Life | David Goggins" },
  { id: "9OF06n1jNkM", label: "Why Discipline Must Come From Within - Jocko Willink" },
  { id: "njDLNt-1ugM", label: "Marcus Aurelius - How To Build Self-Discipline (Stoicism)" },
  { id: "f7V76Ky-_v8", label: "Avoiding Distractions & Doing Deep Work | Dr. Cal Newport & Dr. Andrew Huberman" },
];

export function DisciplinePage() {
  return (
    <div>
      {/* Back nav */}
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/personal-development" labelKey="learn.back" />
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
            How to Build Unbreakable Discipline
          </h1>
          <p className="mt-2 max-w-lg text-[var(--muted)]">
            Lessons from Goggins, Jocko, Stoicism, and neuroscience on forging real discipline from within.
          </p>
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 w-fit">
            <span className="font-mono text-xl font-bold text-[var(--accent)]">{VIDEOS.length}</span>
            <span className="text-sm text-[var(--muted)]">videos</span>
          </div>
        </div>
      </div>

      {/* Video grid */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((v, i) => (
            <VideoCard key={v.id} v={v} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
