"use client";

import Link from "next/link";

export function EnglishMeaningCard() {
  return (
    <Link
      href="/learn/english-meaning"
      className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:bg-[var(--elevated)]"
    >
      <div>
        <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
          English Meaning
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted)]">
          12 intermediate words daily — meanings in EN &amp; NP with examples
        </p>
      </div>
      <span className="mt-auto pt-4 text-xs font-medium text-[var(--accent)] transition group-hover:brightness-110">
        Browse →
      </span>
    </Link>
  );
}
