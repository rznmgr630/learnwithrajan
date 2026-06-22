"use client";

import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { VideoCard } from "@/components/learn/VideoCard";

type Video = {
  id: string;
  label: string;
};

const VIDEOS: Video[] = [
  { id: "Z4F7SAknzhw", label: "Restart, Reset And Refocus Again." },
  { id: "ZzeXMOawZBo", label: "Neuroscience Confirms: This Biblical Habit Rewires Your Brain" },
  { id: "SU3DRpmW5qM", label: "Do This Every Time You Get Paid (Paycheck Routine)" },
  { id: "t260757b_vU", label: "Stop Rambling: The 3-2-1 Speaking Trick That Makes You Sound Like A CEO" },
  { id: "W6WUR9L_MOo", label: "This Will Make You So Scared of Scrolling You'll Never Do It Again" },
  { id: "VjyDi69NbVc", label: "This ONE Psychological Trigger Gets Clients to Chase You" },
  { id: "678t3Dxl14M", label: "how to ACTUALLY be yourself (when you've forgotten who that is)" },
  { id: "U2w7SQ7NEUQ", label: "How to Sell Anything (Full Sales Course)" },
  { id: "GiWdNoebaak", label: "The 4 Types of Social Intelligence — Which One Are You?" },
  { id: "nzPj65UGEGo", label: "Why you should stop giving a f*ck and finally start living for you" },
];

export function FocusGoalsPage() {
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
            How do you stay so focused on your goals?
          </h1>
          <p className="mt-2 max-w-lg text-[var(--muted)]">
            A curated collection of videos on focus, discipline, and staying locked in on what matters.
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
