"use client";

import Link from "next/link";
import { LearnBackNav } from "@/components/learn/LearnBackNav";

const subCardClass =
  "group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:bg-[var(--elevated)]";

export function PersonalDevelopmentTracks() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn" labelKey="learn.back" />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold tracking-tight text-[var(--text)]">Personal Development</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Mindset · Focus · Goals · Growth</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/learn/focus-goals" className={subCardClass}>
              <div>
                <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
                  Staying Focused on Goals
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted)]">
                  10 videos — how to stay locked in on what matters
                </p>
              </div>
              <span className="mt-auto pt-4 text-xs font-medium text-[var(--accent)] transition group-hover:brightness-110">
                Watch →
              </span>
            </Link>

            <Link href="/learn/discipline" className={subCardClass}>
              <div>
                <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
                  Unbreakable Discipline
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted)]">
                  7 videos — Goggins, Jocko, Stoicism, and deep work
                </p>
              </div>
              <span className="mt-auto pt-4 text-xs font-medium text-[var(--accent)] transition group-hover:brightness-110">
                Watch →
              </span>
            </Link>

            <Link href="/learn/focus-music" className={subCardClass}>
              <div>
                <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
                  Focus &amp; Learn Music
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted)]">
                  10 videos — lofi, deep focus, ambient and Indian ragas for flow state
                </p>
              </div>
              <span className="mt-auto pt-4 text-xs font-medium text-[var(--accent)] transition group-hover:brightness-110">
                Listen →
              </span>
            </Link>

            <Link href="/learn/exercise" className={subCardClass}>
              <div>
                <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
                  Exercise
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted)]">
                  5 videos — quick bodyweight routines to stay strong and consistent
                </p>
              </div>
              <span className="mt-auto pt-4 text-xs font-medium text-[var(--accent)] transition group-hover:brightness-110">
                Watch →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
