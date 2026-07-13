"use client";

import { useState } from "react";
import { VideoModal } from "@/components/learn/VideoModal";
import type { PersonalDevVideo } from "@/lib/personal-development/types";

export function DriveVideoCard({ v, index }: { v: PersonalDevVideo; index: number }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <button
          onClick={() => setPlaying(true)}
          className="group/btn relative h-full w-full cursor-pointer"
          aria-label={`Play ${v.label}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://drive.google.com/thumbnail?id=${v.id}&sz=w500`}
            alt={v.label}
            className="h-full w-full object-cover transition duration-300 group-hover/btn:brightness-75"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover/btn:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] shadow-xl transition duration-200 group-hover/btn:scale-110">
              <svg className="h-6 w-6 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {playing && (
        <VideoModal
          src={`https://drive.google.com/file/d/${v.id}/preview`}
          title={v.label}
          onClose={() => setPlaying(false)}
        />
      )}

      <div className="flex items-start justify-between gap-2 px-4 py-3">
        <p className="text-xs font-medium leading-snug text-[var(--text)] line-clamp-2">
          <span className="mr-1.5 font-mono text-[var(--faint)]">{String(index + 1).padStart(2, "0")}</span>
          {v.label}
        </p>
        <a
          href={`https://drive.google.com/file/d/${v.id}/view`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-medium text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          Drive ↗
        </a>
      </div>
    </div>
  );
}
