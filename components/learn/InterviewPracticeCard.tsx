"use client";

import Link from "next/link";

export function InterviewPracticeCard() {
  return (
    <Link
      href="/learn/japanese-interview"
      className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:bg-[var(--elevated)]"
    >
      <div>
        <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
          Interview Practice
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted)]">
          Self-introduction Q&amp;A — Japanese with Nepali meaning, shuffle &amp; reveal
        </p>
      </div>
      <span className="mt-auto pt-4 text-xs font-medium text-[var(--accent)] transition group-hover:brightness-110">
        Browse →
      </span>
    </Link>
  );
}
