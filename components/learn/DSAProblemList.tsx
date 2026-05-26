"use client";

import Link from "next/link";
import type { DsaProblem } from "@/lib/dsa/dsa-problems";
import { DIFFICULTY_COLOR, DIFFICULTY_LABEL } from "@/lib/dsa/dsa-problems";
import { LearnBackNav } from "@/components/learn/LearnBackNav";

const DIFF_BORDER: Record<string, string> = {
  basic: "border-l-emerald-500",
  medium: "border-l-amber-500",
  advanced: "border-l-rose-500",
};

export function DSAProblemList({
  problems,
  difficulty,
  backHref,
}: {
  problems: DsaProblem[];
  difficulty: string;
  backHref: string;
}) {
  return (
    <div className="min-h-screen">
      {/* Sticky top nav */}
      <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3 sm:px-6">
          <LearnBackNav href={backHref} />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-20 pt-10 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  difficulty === "Basic"
                    ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                    : difficulty === "Medium"
                      ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30"
                      : "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30"
                }`}
              >
                {difficulty}
              </span>
              <span className="rounded-full bg-[var(--elevated)] px-2.5 py-1 font-mono text-xs tabular-nums text-[var(--muted)]">
                {problems.length} problems
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
              {difficulty} Problems
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {difficulty === "Basic"
                ? "Foundational patterns — arrays, strings, hash maps, and simple recursion."
                : difficulty === "Medium"
                  ? "Intermediate problems requiring trees, stacks, sliding windows, or BFS/DFS."
                  : "Advanced algorithmic challenges — DP, graphs, backtracking, and beyond."}
            </p>
          </div>
        </div>

        {/* Problem list */}
        <div className="flex flex-col gap-2">
          {problems.map((problem) => (
            <Link
              key={problem.slug}
              href={`/learn/dsa/${problem.difficulty}/${problem.slug}`}
              className={`group relative flex items-center gap-4 overflow-hidden rounded-xl border border-[var(--border)] border-l-2 bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] px-5 py-4 transition-all hover:border-[var(--accent)]/40 hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] hover:shadow-[0_0_24px_-6px_color-mix(in_oklab,var(--accent)_25%,transparent)] ${DIFF_BORDER[problem.difficulty]}`}
            >
              {/* Number */}
              <span className="w-8 shrink-0 font-mono text-sm font-semibold tabular-nums text-[var(--faint)]">
                {String(problem.id).padStart(2, "0")}
              </span>

              {/* Title */}
              <span className="flex-1 font-medium text-[var(--text)] transition group-hover:text-[var(--accent)]">
                {problem.title}
              </span>

              {/* Tags */}
              <div className="hidden flex-wrap gap-1.5 sm:flex">
                {problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-2.5 py-0.5 text-xs text-[var(--muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Difficulty */}
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${DIFFICULTY_COLOR[problem.difficulty]}`}>
                {DIFFICULTY_LABEL[problem.difficulty]}
              </span>

              {/* Arrow */}
              <svg
                className="h-4 w-4 shrink-0 text-[var(--faint)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
