"use client";

import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { VideoCard } from "@/components/learn/VideoCard";

type Video = {
  id: string;
  label: string;
};

const VIDEOS: Video[] = [
  { id: "dASoYamteBI", label: "Overthinking? Try This Dopamine Reset | Healing Indian Ragas | Shunya Waves" },
  { id: "fhL67fnDXcU", label: "Coding Music — Synthwave Beats to Program To" },
  { id: "M5QY2_8704o", label: "Chillstep Music for Programming / Cyber / Coding" },
  { id: "7NOSDKb0HlU", label: "Lofi Hip Hop Radio — Beats to Study / Relax To" },
  { id: "JxhBJSJRyqg", label: "4 Hours of Deep Focus Music for Studying" },
  { id: "gtmzPUmq7XU", label: "4 Hours of Ambient Study Music to Concentrate" },
  { id: "wGc9A5azn7Q", label: "Deep Focus Music for Studying and Concentration" },
  { id: "oPVte6aMprI", label: "Deep Focus — Music for Studying, Concentration and Work" },
  { id: "74cOUSKXMz0", label: "3-Hour Study With Me — Focus Music, Pomodoro 50/10" },
  { id: "VJhd3hvsMTo", label: "50/10 Pomodoro Timer — Relaxing Lofi, Deep Focus" },
];

export function FocusMusicPage() {
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
            Focus &amp; Learn Music
          </h1>
          <p className="mt-2 max-w-lg text-[var(--muted)]">
            Curated music and soundscapes to get into deep focus, reduce overthinking, and study with flow.
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
