"use client";

import { useState } from "react";
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

function VideoCard({ v, index }: { v: Video; index: number }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${v.id}?autoplay=1`}
            title={v.label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="group/btn relative h-full w-full"
            aria-label={`Play ${v.label}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
              alt={v.label}
              className="h-full w-full object-cover transition duration-300 group-hover/btn:brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] shadow-xl transition duration-200 group-hover/btn:scale-110">
                <svg className="h-6 w-6 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>

      <div className="flex items-start justify-between gap-2 px-4 py-3">
        <p className="text-xs font-medium leading-snug text-[var(--text)] line-clamp-2">
          <span className="mr-1.5 font-mono text-[var(--faint)]">{String(index + 1).padStart(2, "0")}</span>
          {v.label}
        </p>
        <a
          href={`https://www.youtube.com/watch?v=${v.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-medium text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          YT ↗
        </a>
      </div>
    </div>
  );
}

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
            <VideoCard key={v.id} v={v} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
