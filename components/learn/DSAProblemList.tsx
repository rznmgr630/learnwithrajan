"use client";

import Link from "next/link";
import type { DsaProblem } from "@/lib/dsa/dsa-problems";
import { DIFFICULTY_COLOR, DIFFICULTY_LABEL } from "@/lib/dsa/dsa-problems";
import { LearnBackNav } from "@/components/learn/LearnBackNav";

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
    <div>
      {/* Top bar */}
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href={backHref} />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
            {difficulty} Problems
          </h1>
          <span className="rounded-full bg-[var(--elevated)] px-2.5 py-1 font-mono text-xs tabular-nums text-[var(--muted)]">
            {problems.length}
          </span>
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {difficulty === "Basic"
            ? "Foundational patterns — arrays, strings, hash maps, and simple recursion."
            : difficulty === "Medium"
              ? "Intermediate problems requiring trees, stacks, sliding windows, or BFS/DFS."
              : "Advanced algorithmic challenges — DP, graphs, backtracking, and beyond."}
        </p>

        {/* Problem table */}
        <div className="mt-8 overflow-hidden rounded-xl border border-[var(--border)]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)]">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--muted)]">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--muted)]">Title</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--muted)] sm:table-cell">
                  Tags
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
                  Difficulty
                </th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, i) => (
                <tr
                  key={problem.slug}
                  className={`group border-b border-[var(--border)] last:border-0 transition hover:bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] ${
                    i % 2 === 0 ? "" : "bg-[color-mix(in_oklab,var(--elevated)_20%,transparent)]"
                  }`}
                >
                  <td className="px-4 py-3.5 font-mono text-xs text-[var(--muted)]">{problem.id}</td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/learn/dsa/${problem.difficulty}/${problem.slug}`}
                      className="font-medium text-[var(--text)] transition group-hover:text-[var(--accent)]"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3.5 sm:table-cell">
                    <div className="flex flex-wrap gap-1.5">
                      {problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${DIFFICULTY_COLOR[problem.difficulty]}`}>
                      {DIFFICULTY_LABEL[problem.difficulty]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
