"use client";

import { LearnBackNav } from "@/components/learn/LearnBackNav";

type Video = {
  id: string;
  label: string;
};

const VIDEOS: Video[] = [
  { id: "dASoYamteBI", label: "Overthinking? Try This Dopamine Reset | Healing Indian Ragas | Shunya Waves" },
  { id: "jfKfPfyJRdk", label: "Lofi Hip Hop Radio — Beats to Relax / Study To" },
  { id: "5qap5aO4i9A", label: "Lofi Hip Hop Radio — Beats to Relax / Study To (Lofi Girl)" },
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
            <a
              key={v.id}
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-[var(--elevated)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                  alt={`Video ${i + 1}`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:brightness-90"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] shadow-lg">
                    <svg className="h-5 w-5 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card footer */}
              <div className="flex items-start justify-between gap-2 px-4 py-3">
                <p className="text-xs font-medium leading-snug text-[var(--text)] line-clamp-2">
                  <span className="mr-1.5 font-mono text-[var(--faint)]">{String(i + 1).padStart(2, "0")}</span>
                  {v.label}
                </p>
                <span className="shrink-0 text-xs font-medium text-[var(--accent)] opacity-0 transition group-hover:opacity-100">
                  Watch →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
